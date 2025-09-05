import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import { Server } from 'socket.io';
import { fromIni } from "@aws-sdk/credential-providers";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { NovaSonicBidirectionalStreamClient } from './client';
import { ImageCategories, EnglishTutorPrompt } from './consts';
import { Buffer } from 'node:buffer';

// AWS 설정
const AWS_PROFILE_NAME = process.env.AWS_PROFILE || 'bedrock-test';

// Express 앱 및 서버 생성
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend/public')));

// Nova Sonic 클라이언트 생성
const bedrockClient = new NovaSonicBidirectionalStreamClient({
  requestHandlerConfig: {
    maxConcurrentStreams: 10,
  },
  clientConfig: {
    region: process.env.AWS_REGION || "us-east-1",
    credentials: fromIni({ profile: AWS_PROFILE_NAME })
  }
});

// Nova Canvas 클라이언트 생성
const bedrockRuntimeClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: fromIni({ profile: AWS_PROFILE_NAME })
});

// 세션 정리 (5분 비활성 시 자동 종료)
setInterval(() => {
  console.log("Session cleanup check");
  const now = Date.now();

  bedrockClient.getActiveSessions().forEach(sessionId => {
    const lastActivity = bedrockClient.getLastActivityTime(sessionId);

    if (now - lastActivity > 5 * 60 * 1000) {
      console.log(`Closing inactive session ${sessionId} after 5 minutes of inactivity`);
      try {
        bedrockClient.forceCloseSession(sessionId);
      } catch (error) {
        console.error(`Error force closing inactive session ${sessionId}:`, error);
      }
    }
  });
}, 60000);

// API 라우트들
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 카테고리 목록 조회
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    data: ImageCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      imageCount: cat.images.length
    }))
  });
});

// 카테고리별 이미지 조회
app.get('/api/categories/:categoryId/images', (req, res) => {
  const { categoryId } = req.params;
  const category = ImageCategories.find(cat => cat.id === categoryId);
  
  if (!category) {
    return res.status(404).json({
      success: false,
      error: 'Category not found'
    });
  }

  res.json({
    success: true,
    data: {
      category: category.name,
      images: category.images
    }
  });
});

// 랜덤 이미지 선택
app.get('/api/images/random', (req, res) => {
  const allImages = ImageCategories.flatMap(cat => 
    cat.images.map(img => ({
      ...img,
      category: cat.name,
      categoryId: cat.id
    }))
  );
  
  const randomImage = allImages[Math.floor(Math.random() * allImages.length)];
  
  res.json({
    success: true,
    data: randomImage
  });
});

// Nova Pro 기반 정확한 평가
app.post('/api/evaluate', async (req, res) => {
  try {
    const { imageId, userMessages, conversationHistory } = req.body;
    
    if (!imageId || !userMessages) {
      return res.status(400).json({
        success: false,
        error: 'Image ID and user messages are required'
      });
    }

    const imageData = ImageCategories.flatMap(cat => cat.images)
      .find(img => img.imageId === imageId);
    
    if (!imageData || !imageData.evaluationCriteria) {
      return res.status(404).json({
        success: false,
        error: 'Image or evaluation criteria not found'
      });
    }

    const userText = userMessages.join(' ');
    const { detailedDescription } = imageData.evaluationCriteria;
    
    // Nova Pro 평가 프롬프트
    const evaluationPrompt = `You are an English learning evaluation expert. Analyze the user's description compared to the reference image description.

Reference Description:
${detailedDescription}

User's Description:
${userText}

Evaluate on these criteria (0-100 each):
1. ACCURACY: How factually correct is the description?
2. COMPLETENESS: How much of the image is covered?
3. VOCABULARY: Quality and variety of vocabulary used?
4. DETAIL: Level of specific details provided?

Provide response in this JSON format:
{
  "accuracy": 85,
  "completeness": 70,
  "vocabulary": 80,
  "detail": 75,
  "strengths": ["good color description", "mentioned atmosphere"],
  "improvements": ["describe people's actions", "mention spatial relationships"],
  "feedback": "Overall good description with room for more specific details."
}`;

    const command = new InvokeModelCommand({
      modelId: 'amazon.nova-pro-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: [{ text: evaluationPrompt }]
        }],
        inferenceConfig: {
          maxTokens: 1000,
          temperature: 0.3,
          topP: 0.9
        }
      })
    });

    const response = await bedrockRuntimeClient.send(command);
    const responseBody = JSON.parse(Buffer.from(response.body).toString('utf-8'));
    const aiResponse = responseBody.output.message.content[0].text;
    
    // JSON 파싱
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid AI response format');
    }
    
    const evaluation = JSON.parse(jsonMatch[0]);
    const totalScore = Math.round((evaluation.accuracy + evaluation.completeness + evaluation.vocabulary + evaluation.detail) / 4);
    
    res.json({
      success: true,
      data: {
        totalScore,
        breakdown: {
          accuracy: evaluation.accuracy,
          completeness: evaluation.completeness,
          vocabulary: evaluation.vocabulary,
          detail: evaluation.detail
        },
        feedback: {
          strengths: evaluation.strengths,
          improvements: evaluation.improvements,
          overall: evaluation.feedback
        },
        userMessageCount: userMessages.length
      }
    });
    
  } catch (error) {
    console.error('Error evaluating with Nova Pro:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to evaluate response',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Stable Diffusion 테스트 엔드포인트
app.get('/test-canvas', (req, res) => {
  const prompt = req.query.prompt || 'a beautiful sunset over the ocean';
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Stable Diffusion Test</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .container { max-width: 800px; margin: 0 auto; }
            input { width: 70%; padding: 10px; margin: 10px 0; }
            button { padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; }
            #result { margin-top: 20px; }
            img { max-width: 100%; border: 1px solid #ddd; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Stable Diffusion Test</h1>
            <input type="text" id="promptInput" placeholder="Enter image description" value="${prompt}">
            <button onclick="generateImage()">Generate Image</button>
            <div id="result"></div>
        </div>
        
        <script>
            async function generateImage() {
                const prompt = document.getElementById('promptInput').value;
                const result = document.getElementById('result');
                
                result.innerHTML = 'Generating image...';
                
                try {
                    const response = await fetch('/api/images/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt })
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        result.innerHTML = \`
                            <h3>Generated Image:</h3>
                            <p><strong>Prompt:</strong> \${data.data.prompt}</p>
                            <img src="\${data.data.imageUrl}" alt="Generated image">
                        \`;
                    } else {
                        result.innerHTML = \`<p style="color: red;">Error: \${data.error}</p>\`;
                    }
                } catch (error) {
                    result.innerHTML = \`<p style="color: red;">Error: \${error.message}</p>\`;
                }
            }
        </script>
    </body>
    </html>
  `);
});

// Stable Diffusion 이미지 생성 (Photorealistic)
app.post('/api/images/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt || prompt.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required'
      });
    }

    console.log('Generating photorealistic image with Stable Diffusion:', prompt);

    const inferenceParams = {
      text_prompts: [
        {
          text: prompt,
          weight: 1
        },
        {
          text: "cartoon, anime, drawing, painting, sketch, illustration, 3d render, blurry, low quality, distorted, ugly, bad anatomy, deformed, mutated, extra limbs, missing limbs, floating limbs, disconnected limbs, malformed hands, blur, out of focus, long neck, long body, mutated hands and fingers, out of frame, too many fingers, fused hand, bad proportions, unnatural body, unnatural skin",
          weight: -1
        }
      ],
      cfg_scale: 8,
      seed: Math.floor(Math.random() * 4294967295),
      steps: 40,
      width: 512,
      height: 512,
      samples: 1
    };

    const command = new InvokeModelCommand({
      body: JSON.stringify(inferenceParams),
      modelId: 'stability.stable-diffusion-xl-v1',
      accept: 'application/json',
      contentType: 'application/json'
    });

    const response = await bedrockRuntimeClient.send(command);
    
    if (!(response.body instanceof Uint8Array)) {
      throw new Error('Unexpected response format: Expected Uint8Array');
    }

    const responseBody = JSON.parse(Buffer.from(response.body).toString('utf-8'));
    
    if (responseBody.artifacts && responseBody.artifacts.length > 0) {
      const imageBase64 = responseBody.artifacts[0].base64;
      const imageUrl = `data:image/png;base64,${imageBase64}`;
      
      console.log('Stable Diffusion image generated successfully');
      
      res.json({
        success: true,
        data: {
          imageUrl: imageUrl,
          prompt: prompt
        }
      });
    } else {
      throw new Error('No image generated in response');
    }
    
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate image',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// 페이지 라우트들
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/login.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/login.html'));
});

app.get('/categories', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/categories.html'));
});

app.get('/study', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/study.html'));
});

app.get('/evaluation', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/evaluation.html'));
});

// Socket.IO 연결 처리
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  const sessionId = socket.id;

  try {
    // Nova Sonic 세션 생성
    const session = bedrockClient.createStreamSession(sessionId);
    bedrockClient.initiateSession(sessionId);

    // 이벤트 핸들러 설정
    session.onEvent('contentStart', (data) => {
      console.log('contentStart:', data);
      socket.emit('contentStart', data);
    });

    session.onEvent('textOutput', (data) => {
      console.log('Text output:', data);
      socket.emit('textOutput', data);
    });

    session.onEvent('audioOutput', (data) => {
      console.log('Audio output received, sending to client');
      socket.emit('audioOutput', data);
    });

    session.onEvent('error', (data) => {
      console.error('Error in session:', data);
      socket.emit('error', data);
    });

    session.onEvent('contentEnd', (data) => {
      console.log('Content end received: ', data);
      
      // barge-in 처리: INTERRUPTED 상태일 때 클라이언트에 알림
      if (data.type === 'TEXT' && data.stopReason === 'INTERRUPTED') {
        console.log('AI speech was interrupted by user (barge-in)');
      }
      
      socket.emit('contentEnd', data);
    });

    session.onEvent('streamComplete', () => {
      console.log('Stream completed for client:', socket.id);
      socket.emit('streamComplete');
    });

    // 오디오 입력 처리
    socket.on('audioInput', async (audioData) => {
      try {
        const audioBuffer = typeof audioData === 'string'
          ? Buffer.from(audioData, 'base64')
          : Buffer.from(audioData);

        await session.streamAudio(audioBuffer);
      } catch (error) {
        console.error('Error processing audio:', error);
        socket.emit('error', {
          message: 'Error processing audio',
          details: error instanceof Error ? error.message : String(error)
        });
      }
    });

    // 프롬프트 시작
    socket.on('promptStart', async () => {
      try {
        console.log('Prompt start received');
        await session.setupPromptStart();
      } catch (error) {
        console.error('Error processing prompt start:', error);
        socket.emit('error', {
          message: 'Error processing prompt start',
          details: error instanceof Error ? error.message : String(error)
        });
      }
    });

    // 시스템 프롬프트 설정
    socket.on('systemPrompt', async (data) => {
      try {
        console.log('System prompt received', data);
        await session.setupSystemPrompt(undefined, data);
      } catch (error) {
        console.error('Error processing system prompt:', error);
        socket.emit('error', {
          message: 'Error processing system prompt',
          details: error instanceof Error ? error.message : String(error)
        });
      }
    });

    // 오디오 시작
    socket.on('audioStart', async () => {
      try {
        console.log('Audio start received');
        await session.setupStartAudio();
      } catch (error) {
        console.error('Error processing audio start:', error);
        socket.emit('error', {
          message: 'Error processing audio start',
          details: error instanceof Error ? error.message : String(error)
        });
      }
    });

    // 오디오 중지
    socket.on('stopAudio', async () => {
      try {
        console.log('Stop audio requested');
        await session.endAudioContent();
        await session.endPrompt();
        await session.close();
      } catch (error) {
        console.error('Error processing stop audio:', error);
        socket.emit('error', {
          message: 'Error processing stop audio',
          details: error instanceof Error ? error.message : String(error)
        });
      }
    });

    // 이미지 컨텍스트 설정
    socket.on('setImageContext', async (imageData) => {
      try {
        console.log('Setting image context:', imageData);
        
        const contextualPrompt = EnglishTutorPrompt + 
          `\n\nImage Context: ${imageData.description}\n` +
          `Expected Vocabulary: ${imageData.expectedVocabulary.join(', ')}\n` +
          `Guiding Questions: ${imageData.guidingQuestions.join(', ')}\n\n` +
          `Start by encouraging the user to describe what they see in the image.`;

        socket.emit('contextSet', { success: true });
      } catch (error) {
        console.error('Error setting image context:', error);
        socket.emit('error', {
          message: 'Error setting image context',
          details: error instanceof Error ? error.message : String(error)
        });
      }
    });

    // 실시간 이미지 생성 (Stable Diffusion - Consistent Style)
    socket.on('generateImage', async (data) => {
      try {
        const { prompt, seed } = data;
        console.log('Socket image generation request (Stable Diffusion):', prompt);
        console.log('Using consistent seed:', seed);
        
        const inferenceParams = {
          text_prompts: [
            {
              text: prompt,
              weight: 1
            },
            {
              text: "cartoon, anime, drawing, painting, sketch, illustration, 3d render, blurry, low quality, distorted, ugly, bad anatomy, deformed, mutated, extra limbs, missing limbs, floating limbs, disconnected limbs, malformed hands, blur, out of focus, long neck, long body, mutated hands and fingers, out of frame, too many fingers, fused hand, bad proportions, unnatural body, unnatural skin, superman, batman",
              weight: -1
            }
          ],
          cfg_scale: 8,
          seed: seed || Math.floor(Math.random() * 4294967295), // 클라이언트에서 전달된 시드 사용
          steps: 40,
          width: 512,
          height: 512,
          samples: 1
        };

        const command = new InvokeModelCommand({
          body: JSON.stringify(inferenceParams),
          modelId: 'stability.stable-diffusion-xl-v1',
          accept: 'application/json',
          contentType: 'application/json'
        });

        const response = await bedrockRuntimeClient.send(command);
        
        if (!(response.body instanceof Uint8Array)) {
          throw new Error('Unexpected response format: Expected Uint8Array');
        }

        const responseBody = JSON.parse(Buffer.from(response.body).toString('utf-8'));
        
        if (responseBody.artifacts && responseBody.artifacts.length > 0) {
          const imageBase64 = responseBody.artifacts[0].base64;
          const imageUrl = `data:image/png;base64,${imageBase64}`;
          
          console.log('Stable Diffusion image generated successfully');
          
          socket.emit('imageGenerated', {
            success: true,
            imageUrl: imageUrl,
            prompt: prompt
          });
        } else {
          throw new Error('No image generated in response');
        }
        
      } catch (error) {
        console.error('Error generating image via socket:', error);
        socket.emit('imageGenerated', {
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    });

    // 연결 해제 처리
    socket.on('disconnect', async () => {
      console.log('Client disconnected:', socket.id);

      if (bedrockClient.isSessionActive(sessionId)) {
        try {
          console.log(`Cleaning up session: ${socket.id}`);
          
          const cleanupPromise = Promise.race([
            (async () => {
              await session.endAudioContent();
              await session.endPrompt();
              await session.close();
            })(),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Session cleanup timeout')), 3000)
            )
          ]);

          await cleanupPromise;
          console.log(`Successfully cleaned up session: ${socket.id}`);
        } catch (error) {
          console.error(`Error cleaning up session: ${socket.id}`, error);
          try {
            bedrockClient.forceCloseSession(sessionId);
          } catch (e) {
            console.error(`Failed force close for session: ${sessionId}`, e);
          }
        }
      }
    });

  } catch (error) {
    console.error('Error creating session:', error);
    socket.emit('error', {
      message: 'Failed to initialize session',
      details: error instanceof Error ? error.message : String(error)
    });
    socket.disconnect();
  }
});

// 서버 시작
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Nova English Learning Server listening on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} to access the application`);
  console.log(`Test Stable Diffusion at http://localhost:${PORT}/test-canvas`);
});

// 종료 처리
process.on('SIGINT', async () => {
  console.log('Shutting down server...');

  const forceExitTimer = setTimeout(() => {
    console.error('Forcing server shutdown after timeout');
    process.exit(1);
  }, 5000);

  try {
    await new Promise(resolve => io.close(resolve));
    console.log('Socket.IO server closed');

    const activeSessions = bedrockClient.getActiveSessions();
    console.log(`Closing ${activeSessions.length} active sessions...`);

    await Promise.all(activeSessions.map(async (sessionId) => {
      try {
        await bedrockClient.closeSession(sessionId);
        console.log(`Closed session ${sessionId} during shutdown`);
      } catch (error) {
        console.error(`Error closing session ${sessionId} during shutdown:`, error);
        bedrockClient.forceCloseSession(sessionId);
      }
    }));

    await new Promise(resolve => server.close(resolve));
    clearTimeout(forceExitTimer);
    console.log('Server shut down');
    process.exit(0);
  } catch (error) {
    console.error('Error during server shutdown:', error);
    process.exit(1);
  }
});