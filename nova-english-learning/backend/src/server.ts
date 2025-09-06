import express from "express";
import http from "http";
import path from "path";
import cors from "cors";
import { Server } from "socket.io";
import dotenv from "dotenv";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { NovaSonicBidirectionalStreamClient } from "./client";
import { ImageCategories, EnglishTutorPrompt, createEvidenceBasedPrompt } from "./consts";
import { Buffer } from "node:buffer";

// .env 파일 로드
dotenv.config();

// Express 앱 및 서버 생성
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../../frontend/public")));

// Nova Sonic 클라이언트 생성
const bedrockClient = new NovaSonicBidirectionalStreamClient({
  requestHandlerConfig: {
    maxConcurrentStreams: 10,
  },
  clientConfig: {
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  },
});

// Nova Canvas 클라이언트 생성
const bedrockRuntimeClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// 세션 정리 (5분 비활성 시 자동 종료)
setInterval(() => {
  console.log("Session cleanup check");
  const now = Date.now();

  bedrockClient.getActiveSessions().forEach((sessionId) => {
    const lastActivity = bedrockClient.getLastActivityTime(sessionId);

    if (now - lastActivity > 5 * 60 * 1000) {
      console.log(
        `Closing inactive session ${sessionId} after 5 minutes of inactivity`
      );
      try {
        bedrockClient.forceCloseSession(sessionId);
      } catch (error) {
        console.error(
          `Error force closing inactive session ${sessionId}:`,
          error
        );
      }
    }
  });
}, 60000);

// API 라우트들
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// 카테고리 목록 조회
app.get("/api/categories", (req, res) => {
  res.json({
    success: true,
    data: ImageCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      imageCount: cat.images.length,
    })),
  });
});

// 카테고리별 이미지 조회
app.get("/api/categories/:categoryId/images", (req, res) => {
  const { categoryId } = req.params;
  const category = ImageCategories.find((cat) => cat.id === categoryId);

  if (!category) {
    return res.status(404).json({
      success: false,
      error: "Category not found",
    });
  }

  res.json({
    success: true,
    data: {
      category: category.name,
      images: category.images,
    },
  });
});

// 랜덤 이미지 선택
app.get("/api/images/random", (req, res) => {
  const allImages = ImageCategories.flatMap((cat) =>
    cat.images.map((img) => ({
      ...img,
      category: cat.name,
      categoryId: cat.id,
    }))
  );

  const randomImage = allImages[Math.floor(Math.random() * allImages.length)];

  res.json({
    success: true,
    data: randomImage,
  });
});

// Nova Pro 기반 증거 기반 평가
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
    const responseCount = userMessages.length;
    
    // 증거 기반 평가 프롬프트 생성
    const evaluationPrompt = `You are an expert English learning evaluator. Analyze the user's description and provide evidence-based feedback in Korean for the content, but keep the category titles in English.

Evaluation Framework:
1. ✅ STRENGTHS - 사용자가 잘한 점 (사용자의 실제 답변에서 구체적인 근거 제시)
2. 📈 IMPROVEMENTS - 개선이 필요한 영역 (누락된 부분의 구체적인 예시)
3. 💡 ALTERNATIVES - 더 나은 표현 방법 (구체적인 대안 제시)

IMPORTANT: Every point must include specific evidence from the user's actual words or reference what they described/missed. All feedback content should be in Korean, but keep the JSON structure and category titles in English.

User Response Analysis:
- Number of responses: ${responseCount}
- Combined text: "${userText}"

Reference Image Description:
${imageData.evaluationCriteria.detailedDescription}

Key Elements to Look For:
${imageData.evaluationCriteria.keyElements.join(', ')}

Analyze what the user mentioned vs. what they missed, and provide specific evidence for each point.

Provide response in this JSON format:
{
  "accuracy": 85,
  "completeness": 70,
  "vocabulary": 80,
  "detail": 75,
  "strengths": [
    {
      "point": "색상을 정확하게 식별하고 표현했습니다",
      "evidence": "답변에서 'silver laptop'이라고 말씀하셨는데, 이는 시각적 세부사항에 대한 주의력을 보여줍니다"
    }
  ],
  "improvements": [
    ${responseCount <= 5 ? `{
      "point": "더 많은 답변이 필요합니다",
      "evidence": "현재 ${responseCount}개의 답변만 제공하셨는데, 이미지를 충분히 설명하기에 부족합니다. 이미지의 세부사항을 더 자세히 관찰하고 최소 8-10개의 답변으로 확장해보세요."
    },` : ''}
    {
      "point": "구체적인 세부사항을 추가해보세요",
      "evidence": "기본적인 요소는 언급하셨지만 색상, 재질, 위치 관계 등 더 구체적인 묘사가 필요합니다"
    }
  ],
  "alternatives": [
    {
      "original": "There are people",
      "better": "Customers are working on their laptops",
      "reason": "더 구체적이고 생생한 표현입니다"
    }
  ],
  "feedback": "사용자의 실제 답변을 바탕으로 한 전반적인 평가 (한국어로)"
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
          maxTokens: 1500,
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
    // 답변 개수가 5개 이하일 때 점수 조정
    let adjustedScores = {
      accuracy: evaluation.accuracy,
      completeness: evaluation.completeness,
      vocabulary: evaluation.vocabulary,
      detail: evaluation.detail
    };
    
    if (userMessages.length <= 5) {
      // 답변이 부족할 때 completeness와 detail 점수를 낮춤
      adjustedScores.completeness = Math.max(50, adjustedScores.completeness - 15);
      adjustedScores.detail = Math.max(50, adjustedScores.detail - 10);
    }
    
    const totalScore = Math.round((adjustedScores.accuracy + adjustedScores.completeness + adjustedScores.vocabulary + adjustedScores.detail) / 4);
    
    res.json({
      success: true,
      data: {
        totalScore,
        breakdown: {
          accuracy: adjustedScores.accuracy,
          completeness: adjustedScores.completeness,
          vocabulary: adjustedScores.vocabulary,
          detail: adjustedScores.detail
        },
        feedback: {
          strengths: evaluation.strengths || [],
          improvements: evaluation.improvements || [],
          alternatives: evaluation.alternatives || [],
          overall: evaluation.feedback
        },
        userMessageCount: userMessages.length,
        evidenceBased: true
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

// Nova Canvas 이미지 생성
app.post("/api/images/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Prompt is required",
      });
    }

    console.log("Generating image with prompt:", prompt);

    const command = new InvokeModelCommand({
      modelId: "amazon.nova-canvas-v1:0",
      body: JSON.stringify({
        taskType: "TEXT_IMAGE",
        textToImageParams: {
          text: prompt,
          negativeText: "blurry, low quality, distorted",
        },
        imageGenerationConfig: {
          numberOfImages: 1,
          height: 512,
          width: 512,
          cfgScale: 8.0,
          seed: Math.floor(Math.random() * 1000000),
        },
      }),
    });

    const response = await bedrockRuntimeClient.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    if (responseBody.images && responseBody.images.length > 0) {
      const imageBase64 = responseBody.images[0];
      const imageUrl = `data:image/png;base64,${imageBase64}`;
      res.json({
        success: true,
        data: {
          imageUrl: imageUrl,
          prompt: prompt,
        },
      });
    } else {
      throw new Error("No image generated");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate image",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// 페이지 라우트들
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/login.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/login.html"));
});

app.get("/categories", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/categories.html"));
});

app.get("/study", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/study.html"));
});

app.get("/evaluation", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/public/evaluation.html"));
});

// Socket.IO 연결 처리
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  const sessionId = socket.id;

  try {
    // 사용자 텍스트 추적을 위한 변수 (이벤트 핸들러보다 먼저 선언)
    let userTextBuffer = "";
    let isUserSpeaking = false;
    let isAISpeaking = false;
    let accumulatedUserText = ""; // 누적된 사용자 발화
    let sentMessages = new Set(); // 중복 메시지 방지용 Set

    // Nova Sonic 세션 생성
    const session = bedrockClient.createStreamSession(sessionId);
    bedrockClient.initiateSession(sessionId);

    // 이벤트 핸들러 설정
    session.onEvent("contentStart", (data) => {
      console.log("🎬 contentStart:", data);
      console.log(
        "🔍 Current state - isUserSpeaking:",
        isUserSpeaking,
        "isAISpeaking:",
        isAISpeaking
      );

      // AI가 말하기 시작할 때 - 사용자 발화 종료 처리 먼저
      if (data.type === "TEXT" && data.role === "ASSISTANT") {
        console.log(
          "🔍 Checking if user was speaking - isUserSpeaking:",
          isUserSpeaking,
          "bufferLength:",
          userTextBuffer.trim().length
        );

        // 사용자가 말하고 있었다면 먼저 이미지 생성 처리
        if (isUserSpeaking && userTextBuffer.trim().length > 3) {
          const currentUserText = userTextBuffer.trim();
          console.log("🎨 User finished speaking:", currentUserText);

          // 인사말과 의미없는 단어 제거
          const cleanedText = filterAndCleanText(currentUserText);

          if (cleanedText.trim().length === 0) {
            console.log(
              "❌ All text was filtered out (greetings/fillers only), skipping image generation"
            );
          } else if (cleanedText.trim().length >= 8) {
            // 의미있는 내용이 남아있으면 누적하고 이미지 생성
            accumulatedUserText += " " + cleanedText;
            accumulatedUserText = accumulatedUserText.trim();

            console.log("📝 Accumulated user text:", accumulatedUserText);
            const imagePrompt = createImagePrompt(accumulatedUserText);
            console.log("🖼️ Generated image prompt:", imagePrompt);

            generateImageFromUserText(socket, imagePrompt, cleanedText);
          } else {
            console.log(
              "❌ Cleaned text too short, skipping image generation. Length:",
              cleanedText.length
            );
          }

          userTextBuffer = "";
          console.log("🗑️ User text buffer cleared");
        } else {
          console.log(
            "❌ No image generation - isUserSpeaking:",
            isUserSpeaking,
            "bufferLength:",
            userTextBuffer.trim().length
          );
        }

        isAISpeaking = true;
        isUserSpeaking = false;
        console.log(
          "🤖 AI started speaking - isAISpeaking set to true, isUserSpeaking set to false"
        );
      }

      socket.emit("contentStart", data);
    });

    session.onEvent("textOutput", (data) => {
      console.log("💬 Text output:", data.content);
      console.log(
        "🔍 State check - isUserSpeaking:",
        isUserSpeaking,
        "isAISpeaking:",
        isAISpeaking,
        "role:",
        data.role
      );

      // 중복 메시지 방지
      const messageKey = `${data.role}:${data.content}`;
      if (sentMessages.has(messageKey)) {
        console.log("🚫 Duplicate message blocked:", messageKey);
        return;
      }
      sentMessages.add(messageKey);
      
      // Set 크기 제한 (메모리 절약)
      if (sentMessages.size > 50) {
        const firstKey = Array.from(sentMessages)[0];
        sentMessages.delete(firstKey);
      }

      // 역할 기반으로 사용자/AI 구분
      if (data.role === "USER" && data.content) {
        userTextBuffer += data.content + " ";
        console.log("👤 User text detected:", data.content);
        console.log("📝 Current userTextBuffer:", userTextBuffer.trim());
        console.log("📝 Current accumulated text:", accumulatedUserText);

        // 사용자가 말하고 있음을 표시
        if (!isUserSpeaking) {
          isUserSpeaking = true;
          console.log("🎤 Setting isUserSpeaking to true");
        }

        // 사용자 텍스트를 클라이언트에 전송
        socket.emit("userTextDetected", {
          text: data.content,
          fullBuffer: userTextBuffer.trim(),
        });
      } else if (data.role === "ASSISTANT") {
        console.log("🤖 AI text output, ignoring for image generation");
      } else {
        console.log(
          "❌ Text ignored - role:",
          data.role,
          "hasContent:",
          !!data.content
        );
      }

      socket.emit("textOutput", data);
    });

    session.onEvent("audioOutput", (data) => {
      console.log("Audio output received, sending to client");
      socket.emit("audioOutput", data);
    });

    session.onEvent("error", (data) => {
      console.error("Error in session:", data);
      socket.emit("error", data);
    });

    session.onEvent("contentEnd", (data) => {
      console.log("🏁 Content end received:", data);
      console.log(
        "🔍 State at contentEnd - isUserSpeaking:",
        isUserSpeaking,
        "isAISpeaking:",
        isAISpeaking
      );
      console.log("📝 Current userTextBuffer:", userTextBuffer.trim());

      if (data.type === "TEXT") {
        if (isAISpeaking && data.role === "ASSISTANT") {
          // AI 발화 종료
          isAISpeaking = false;
          console.log("🤖 AI finished speaking - isAISpeaking set to false");
        }

        // barge-in 처리
        if (data.stopReason === "INTERRUPTED") {
          console.log("⚡ Speech was interrupted (barge-in)");
          isAISpeaking = false;
        }
      }

      socket.emit("contentEnd", data);
    });

    session.onEvent("streamComplete", () => {
      console.log("Stream completed for client:", socket.id);
      socket.emit("streamComplete");
    });

    // 오디오 입력 처리
    socket.on("audioInput", async (audioData) => {
      try {
        const audioBuffer =
          typeof audioData === "string"
            ? Buffer.from(audioData, "base64")
            : Buffer.from(audioData);

        // 사용자가 말하기 시작
        if (!isUserSpeaking && !isAISpeaking) {
          isUserSpeaking = true;
          console.log("🎤 User started speaking - isUserSpeaking set to true");
        }

        await session.streamAudio(audioBuffer);
      } catch (error) {
        console.error("❌ Error processing audio:", error);
        socket.emit("error", {
          message: "Error processing audio",
          details: error instanceof Error ? error.message : String(error),
        });
      }
    });

    // 프롬프트 시작
    socket.on("promptStart", async () => {
      try {
        console.log("Prompt start received");
        await session.setupPromptStart();
      } catch (error) {
        console.error("Error processing prompt start:", error);
        socket.emit("error", {
          message: "Error processing prompt start",
          details: error instanceof Error ? error.message : String(error),
        });
      }
    });

    // 시스템 프롬프트 설정
    socket.on("systemPrompt", async (data) => {
      try {
        console.log("System prompt received", data);
        await session.setupSystemPrompt(undefined, data);
      } catch (error) {
        console.error("Error processing system prompt:", error);
        socket.emit("error", {
          message: "Error processing system prompt",
          details: error instanceof Error ? error.message : String(error),
        });
      }
    });

    // 오디오 시작
    socket.on("audioStart", async () => {
      try {
        console.log("Audio start received");
        await session.setupStartAudio();
      } catch (error) {
        console.error("Error processing audio start:", error);
        socket.emit("error", {
          message: "Error processing audio start",
          details: error instanceof Error ? error.message : String(error),
        });
      }
    });

    // 오디오 중지
    socket.on("stopAudio", async () => {
      try {
        console.log("Stop audio requested");
        await session.endAudioContent();
        await session.endPrompt();
        await session.close();
      } catch (error) {
        console.error("Error processing stop audio:", error);
        socket.emit("error", {
          message: "Error processing stop audio",
          details: error instanceof Error ? error.message : String(error),
        });
      }
    });

    // 이미지 컨텍스트 설정
    socket.on("setImageContext", async (imageData) => {
      try {
        console.log("Setting image context:", imageData);

        const contextualPrompt =
          EnglishTutorPrompt +
          `\n\nImage Context: ${imageData.description}\n` +
          `Guiding Questions: ${imageData.guidingQuestions ? imageData.guidingQuestions.join(", ") : "What do you see in this image?"}\n\n` +
          `Start by encouraging the user to describe what they see in the image.`;

        socket.emit("contextSet", { success: true });
      } catch (error) {
        console.error("Error setting image context:", error);
        socket.emit("error", {
          message: "Error setting image context",
          details: error instanceof Error ? error.message : String(error),
        });
      }
    });

    // 실시간 이미지 생성
    socket.on("generateImage", async (data) => {
      try {
        const { prompt } = data;
        console.log("Socket image generation request:", prompt);

        const imagePrompt = createImagePrompt(prompt);
        await generateImageFromUserText(socket, imagePrompt, prompt);

      } catch (error) {
        console.error("Error generating image via socket:", error);
        socket.emit("imageGenerated", {
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    });

    // 연결 해제 처리
    socket.on("disconnect", async () => {
      console.log("Client disconnected:", socket.id);

      // 세션 변수 초기화
      userTextBuffer = "";
      accumulatedUserText = "";
      isUserSpeaking = false;
      isAISpeaking = false;
      sentMessages.clear(); // Set 초기화

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
              setTimeout(
                () => reject(new Error("Session cleanup timeout")),
                3000
              )
            ),
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
    console.error("Error creating session:", error);
    socket.emit("error", {
      message: "Failed to initialize session",
      details: error instanceof Error ? error.message : String(error),
    });
    socket.disconnect();
  }
});

// 이미지 생성 헬퍼 함수들
function filterAndCleanText(text: string): string {
  // 인사말과 의미없는 단어들 제거
  const skipWords = [
    "hi",
    "hello",
    "hey",
    "good morning",
    "good afternoon",
    "good evening",
    "um",
    "uh",
    "er",
    "ah",
    "oh",
    "hmm",
    "hm",
    "erm",
    "ehm",
    "thank you",
    "thanks",
    "please",
    "excuse me",
    "sorry",
    "yes",
    "no",
    "yeah",
    "yep",
    "nope",
    "okay",
    "ok",
    "alright",
  ];

  let cleanedText = text;

  // 각 스킵 단어를 제거
  skipWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "gi");
    cleanedText = cleanedText.replace(regex, "").trim();
  });

  // 여러 공백을 하나로 정리
  cleanedText = cleanedText.replace(/\s+/g, " ").trim();
  // 문장부호 정리
  cleanedText = cleanedText.replace(/[,.!?]+/g, "").trim();

  console.log("🧙 Original text:", text);
  console.log("🧙 Cleaned text:", cleanedText);

  return cleanedText;
}

function createImagePrompt(userText: string): string {
  // 사용자 텍스트를 이미지 생성에 적합한 프롬프트로 변환
  const cleanText = userText.toLowerCase().trim();

  // 기본 스타일과 품질 향상 키워드 추가
  return `${cleanText}, realistic style, clear details, good lighting, high quality, photographic, detailed`;
}

async function generateImageFromUserText(
  socket: any,
  imagePrompt: string,
  originalText: string
) {
  try {
    console.log("🎨 Starting image generation...");
    console.log("🖼️ Enhanced prompt:", imagePrompt);
    console.log("📝 Original text:", originalText);

    const command = new InvokeModelCommand({
      modelId: "amazon.nova-canvas-v1:0",
      body: JSON.stringify({
        taskType: "TEXT_IMAGE",
        textToImageParams: {
          text: imagePrompt,
          negativeText: "blurry, low quality, distorted, text, words, letters",
        },
        imageGenerationConfig: {
          numberOfImages: 1,
          height: 512,
          width: 512,
          cfgScale: 8.0,
          seed: Math.floor(Math.random() * 1000000),
        },
      }),
    });

    console.log("📡 Sending request to Nova Canvas...");
    const response = await bedrockRuntimeClient.send(command);
    console.log("✅ Received response from Nova Canvas");

    const responseBody = JSON.parse(new TextDecoder().decode(response.body));

    if (responseBody.images && responseBody.images.length > 0) {
      const imageBase64 = responseBody.images[0];
      const imageUrl = `data:image/png;base64,${imageBase64}`;

      console.log("🎉 Image generated successfully! Sending to client...");
      socket.emit("imageGenerated", {
        success: true,
        imageUrl: imageUrl,
        prompt: imagePrompt,
        originalText: originalText,
        isAutoGenerated: true,
      });
    } else {
      console.log("❌ No images in response body");
      throw new Error("No image generated");
    }
  } catch (error) {
    console.error("❌ Error in generateImageFromUserText:", error);
    socket.emit("imageGenerated", {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      originalText: originalText,
    });
  }
}

// 서버 시작
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Nova English Learning Server listening on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} to access the application`);
});

// 종료 처리
process.on("SIGINT", async () => {
  console.log("Shutting down server...");

  const forceExitTimer = setTimeout(() => {
    console.error("Forcing server shutdown after timeout");
    process.exit(1);
  }, 5000);

  try {
    await new Promise((resolve) => io.close(resolve));
    console.log("Socket.IO server closed");

    const activeSessions = bedrockClient.getActiveSessions();
    console.log(`Closing ${activeSessions.length} active sessions...`);

    await Promise.all(
      activeSessions.map(async (sessionId) => {
        try {
          await bedrockClient.closeSession(sessionId);
          console.log(`Closed session ${sessionId} during shutdown`);
        } catch (error) {
          console.error(
            `Error closing session ${sessionId} during shutdown:`,
            error
          );
          bedrockClient.forceCloseSession(sessionId);
        }
      })
    );

    await new Promise((resolve) => server.close(resolve));
    clearTimeout(forceExitTimer);
    console.log("Server shut down");
    process.exit(0);
  } catch (error) {
    console.error("Error during server shutdown:", error);
    process.exit(1);
  }
});
