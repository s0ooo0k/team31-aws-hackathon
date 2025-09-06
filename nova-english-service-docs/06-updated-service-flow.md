# Nova 영어 학습 서비스 - 업데이트된 서비스 플로우

**업데이트 날짜**: 2025년 1월  
**버전**: 2.0  
**변경사항**: Nova Canvas 사전 생성 이미지 + Nova Sonic 유도 대화 방식

---

## 1. 업데이트된 서비스 구조

### 1.1 핵심 변경사항
```
기존: 사용자 설명 → AI 피드백
변경: 사전 생성 이미지 → Nova Sonic 유도 대화 → 구체적 서술 유도
```

### 1.2 서비스 플로우
```
1. 사용자 로그인
2. 카테고리 선택 (Daily Life, Travel, Business, Social, Academic)
3. Nova Canvas 사전 생성 이미지 5개 중 1개 제시
4. Nova Sonic 실시간 스트리밍 유도 대화 시작
5. 사용자가 이미지를 점진적으로 구체적 서술하도록 유도
6. 대화 종료 후 학습 진도 저장
```

---

## 2. Nova Canvas 사전 이미지 생성

### 2.1 카테고리별 이미지 세트 (각 5개)

#### 2.1.1 Daily Life 카테고리
```json
{
  "category": "daily_life",
  "images": [
    {
      "id": "daily_001",
      "title": "Family Morning Routine",
      "nova_canvas_prompt": "A busy family kitchen during morning rush hour. Parents preparing breakfast while children get ready for school. Multiple activities happening simultaneously - coffee brewing, toast popping up, backpacks being packed, lunch boxes prepared. Natural morning light, realistic family dynamics, organized chaos atmosphere.",
      "conversation_objectives": [
        "Describe multiple simultaneous actions",
        "Use present continuous tense",
        "Family relationship vocabulary",
        "Time management expressions"
      ],
      "guided_conversation_flow": [
        "What's the first thing you notice in this kitchen?",
        "Can you tell me what each family member is doing?",
        "What sounds do you think you would hear in this scene?",
        "How does this compare to your morning routine?"
      ]
    },
    {
      "id": "daily_002", 
      "title": "Weekend Grocery Shopping",
      "nova_canvas_prompt": "A diverse family shopping in a modern supermarket on weekend. Shopping cart filled with fresh produce, children helping select items, parents checking shopping list on phone. Busy aisles with other shoppers, promotional displays, seasonal products visible. Warm lighting, community atmosphere.",
      "conversation_objectives": [
        "Food and grocery vocabulary",
        "Family cooperation descriptions", 
        "Shopping process explanation",
        "Quantity and measurement terms"
      ]
    },
    {
      "id": "daily_003",
      "title": "Evening Cooking Together", 
      "nova_canvas_prompt": "Multi-generational family cooking dinner together in spacious kitchen. Grandmother teaching traditional recipe, parents preparing side dishes, teenager learning cooking techniques. Various ingredients, cooking utensils, steam and aromas visible. Warm golden hour lighting, bonding atmosphere.",
      "conversation_objectives": [
        "Cooking process vocabulary",
        "Generational interaction descriptions",
        "Sensory details (smell, sound, texture)",
        "Cultural tradition expressions"
      ]
    },
    {
      "id": "daily_004",
      "title": "Home Office Workspace",
      "nova_canvas_prompt": "Modern home office setup with person working remotely. Multiple monitors, video call in progress, coffee cup, plants, organized desk with documents. Natural light from window, professional yet comfortable atmosphere. Cat sleeping nearby, work-life balance elements visible.",
      "conversation_objectives": [
        "Remote work vocabulary",
        "Technology and equipment descriptions",
        "Work environment details",
        "Work-life balance concepts"
      ]
    },
    {
      "id": "daily_005",
      "title": "Family Game Night",
      "nova_canvas_prompt": "Living room scene with family playing board games on weekend evening. Multiple generations engaged in game, snacks and drinks on coffee table, cozy lighting, comfortable seating. Laughter and concentration expressions, game pieces and cards visible.",
      "conversation_objectives": [
        "Leisure activity vocabulary",
        "Emotion and expression descriptions",
        "Family bonding language",
        "Entertainment and fun expressions"
      ]
    }
  ]
}
```

#### 2.1.2 Travel 카테고리
```json
{
  "category": "travel",
  "images": [
    {
      "id": "travel_001",
      "title": "Airport Departure Experience",
      "nova_canvas_prompt": "Busy international airport terminal with travelers checking in, security lines, departure boards showing multiple destinations. Diverse passengers with luggage, airport staff assisting, duty-free shops, cafes. Modern architecture, natural lighting, travel excitement atmosphere.",
      "conversation_objectives": [
        "Airport procedure vocabulary",
        "Travel preparation descriptions",
        "International travel terms",
        "Crowd and activity descriptions"
      ]
    },
    {
      "id": "travel_002",
      "title": "Hotel Check-in Experience", 
      "nova_canvas_prompt": "Elegant hotel lobby with travelers checking in at reception. Concierge providing local recommendations, luggage service, comfortable seating areas with other guests. Luxury interior design, welcoming atmosphere, hospitality service visible.",
      "conversation_objectives": [
        "Hospitality service vocabulary",
        "Accommodation descriptions",
        "Customer service interactions",
        "Luxury and comfort expressions"
      ]
    },
    {
      "id": "travel_003",
      "title": "Cultural Site Exploration",
      "nova_canvas_prompt": "Tourists exploring ancient temple with local guide explaining historical significance. Diverse group listening attentively, taking photos, traditional architecture details visible. Cultural artifacts, informational plaques, respectful tourism atmosphere.",
      "conversation_objectives": [
        "Cultural heritage vocabulary",
        "Historical description language",
        "Tourism and sightseeing terms",
        "Educational experience expressions"
      ]
    },
    {
      "id": "travel_004",
      "title": "Local Market Adventure",
      "nova_canvas_prompt": "Vibrant local market with tourists exploring food stalls, handicrafts, and local products. Vendors explaining items, cultural exchange happening, colorful displays, authentic atmosphere. Sensory-rich environment with various textures and colors.",
      "conversation_objectives": [
        "Market and shopping vocabulary",
        "Cultural exchange descriptions",
        "Sensory experience language",
        "Local culture expressions"
      ]
    },
    {
      "id": "travel_005",
      "title": "Transportation Hub",
      "nova_canvas_prompt": "Modern train station with international travelers navigating platforms, checking schedules, boarding trains. Multilingual signs, diverse passengers, efficient transportation system. Movement and journey atmosphere, connection and departure themes.",
      "conversation_objectives": [
        "Transportation vocabulary",
        "Navigation and direction language",
        "Public transport descriptions",
        "Journey and movement expressions"
      ]
    }
  ]
}
```

### 2.2 이미지 생성 API 구현
```typescript
// src/services/imageGeneration.ts
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

export class ImageGenerationService {
  private client: BedrockRuntimeClient;
  private modelId = 'amazon.nova-canvas-v1:0';

  async generateCategoryImages(category: string): Promise<string[]> {
    const prompts = this.getCategoryPrompts(category);
    const imageUrls: string[] = [];

    for (const prompt of prompts) {
      try {
        const command = new InvokeModelCommand({
          modelId: this.modelId,
          body: JSON.stringify({
            taskType: 'TEXT_IMAGE',
            textToImageParams: {
              text: prompt.nova_canvas_prompt,
              images: []
            },
            imageGenerationConfig: {
              numberOfImages: 1,
              height: 1024,
              width: 1024,
              cfgScale: 8.0,
              seed: Math.floor(Math.random() * 1000000)
            }
          })
        });

        const response = await this.client.send(command);
        const result = JSON.parse(response.body.transformToString());
        
        // S3에 이미지 저장
        const imageUrl = await this.saveImageToS3(result.images[0], prompt.id);
        imageUrls.push(imageUrl);
        
        // DynamoDB에 메타데이터 저장
        await this.saveImageMetadata(prompt.id, imageUrl, prompt);
        
      } catch (error) {
        console.error(`Failed to generate image for ${prompt.id}:`, error);
      }
    }

    return imageUrls;
  }

  private getCategoryPrompts(category: string) {
    // 위에서 정의한 카테고리별 프롬프트 반환
    const categoryData = {
      daily_life: [/* daily life prompts */],
      travel: [/* travel prompts */],
      business: [/* business prompts */],
      social: [/* social prompts */],
      academic: [/* academic prompts */]
    };
    
    return categoryData[category] || [];
  }
}
```

---

## 3. Nova Sonic 유도 대화 시스템

### 3.1 실시간 스트리밍 대화 프롬프트
```
You are Nova, an AI conversation guide helping Korean English learners describe images in detail through guided conversation.

ROLE: Conversation Guide (NOT Feedback Provider)
OBJECTIVE: Guide user to describe the image progressively more detailed through natural conversation

CONVERSATION STRATEGY:
1. Start with broad, open questions about the image
2. Gradually guide toward specific details
3. Ask follow-up questions to encourage elaboration
4. Use encouraging responses to maintain flow
5. Help user notice details they might miss
6. Build vocabulary naturally through conversation

CURRENT IMAGE: {image_title}
IMAGE DETAILS: {image_description}
USER LEVEL: {user_level}
CONVERSATION OBJECTIVES: {conversation_objectives}

CONVERSATION FLOW GUIDELINES:

OPENING (Broad Overview):
- "What's the first thing that catches your eye in this image?"
- "Can you give me a general description of what's happening here?"
- "What kind of scene is this?"

DEVELOPMENT (Specific Details):
- "Tell me more about [specific element user mentioned]"
- "What do you notice about the people in this scene?"
- "Can you describe the setting/environment?"
- "What details can you see in the background?"

DEEPENING (Sensory and Emotional):
- "What sounds do you think you would hear in this scene?"
- "How do the people seem to be feeling?"
- "What's the atmosphere like?"
- "If you were there, what would you notice first?"

EXPANSION (Personal Connection):
- "How does this compare to similar situations in your experience?"
- "What would you do in this situation?"
- "Does this remind you of anything?"

CONVERSATION STYLE:
- Natural, flowing conversation (not Q&A format)
- Build on user's responses
- Show genuine interest in their descriptions
- Use "I see..." "That's interesting..." "Tell me more about..."
- Gently introduce new vocabulary in context
- Maintain encouraging, supportive tone

AVOID:
- Correcting grammar or pronunciation during conversation
- Providing feedback or scores
- Interrupting the natural flow
- Making it feel like a test

EXAMPLE CONVERSATION FLOW:
Nova: "What's the first thing you notice in this kitchen scene?"
User: "I see family eating breakfast"
Nova: "A family having breakfast - that sounds lovely! Can you tell me more about the family members you see?"
User: "There are parents and two children"
Nova: "Four people altogether. What are they doing while they eat? I'm curious about the atmosphere around the table."
```

### 3.2 WebSocket 실시간 대화 구현
```typescript
// src/services/conversationGuide.ts
import { Server as SocketIOServer } from 'socket.io';
import { NovaSonicService } from './novaSonic';

export class ConversationGuideService {
  private io: SocketIOServer;
  private novaSonic: NovaSonicService;

  constructor(server: any) {
    this.io = new SocketIOServer(server, {
      cors: { origin: process.env.CORS_ORIGIN?.split(',') }
    });
    this.novaSonic = new NovaSonicService();
    this.setupConversationHandlers();
  }

  private setupConversationHandlers() {
    this.io.on('connection', (socket) => {
      socket.on('start_conversation', async (data) => {
        const { imageId, userId, category } = data;
        
        // 이미지 정보 조회
        const imageData = await this.getImageData(imageId);
        
        // 대화 시작 메시지
        const openingMessage = await this.generateOpeningMessage(imageData);
        
        socket.emit('nova_message', {
          type: 'audio_text',
          audioUrl: openingMessage.audioUrl,
          text: openingMessage.text,
          timestamp: new Date().toISOString()
        });
      });

      socket.on('user_voice', async (data) => {
        try {
          const audioBuffer = Buffer.from(data.audio, 'base64');
          
          // Nova Sonic으로 음성 처리 (유도 대화 모드)
          const response = await this.novaSonic.processGuideConversation(audioBuffer, {
            imageContext: data.imageContext,
            conversationHistory: data.conversationHistory,
            userLevel: data.userLevel,
            conversationStage: data.conversationStage
          });

          socket.emit('nova_message', {
            type: 'guided_response',
            audioUrl: response.audioUrl,
            text: response.text,
            transcription: response.userTranscription,
            nextQuestion: response.suggestedNextQuestion,
            timestamp: new Date().toISOString()
          });

        } catch (error) {
          socket.emit('conversation_error', {
            message: 'Processing failed, please try again',
            error: error.message
          });
        }
      });

      socket.on('end_conversation', async (data) => {
        // 대화 세션 저장
        await this.saveConversationSession(data);
        
        socket.emit('conversation_complete', {
          message: 'Great conversation! Your descriptions were very detailed.',
          sessionSummary: await this.generateSessionSummary(data)
        });
      });
    });
  }

  private async generateOpeningMessage(imageData: any) {
    const openingPrompts = [
      `What's the first thing that catches your eye in this ${imageData.category} scene?`,
      `I'm looking at this interesting ${imageData.title.toLowerCase()} image with you. What do you see?`,
      `Let's explore this ${imageData.category} scene together. Can you give me your first impression?`
    ];

    const selectedPrompt = openingPrompts[Math.floor(Math.random() * openingPrompts.length)];
    
    return await this.novaSonic.generateVoiceResponse(selectedPrompt, {
      conversationStyle: 'opening',
      userLevel: 'adaptive',
      tone: 'encouraging'
    });
  }
}
```

### 3.3 Nova Sonic 유도 대화 모드
```typescript
// src/services/novaSonic.ts (업데이트)
export class NovaSonicService {
  async processGuideConversation(audioBuffer: Buffer, context: {
    imageContext: any;
    conversationHistory: any[];
    userLevel: string;
    conversationStage: string;
  }) {
    const systemPrompt = this.buildGuidePrompt(context);
    
    try {
      const input = {
        modelId: 'amazon.nova-sonic-v1:0',
        body: JSON.stringify({
          audio: audioBuffer.toString('base64'),
          conversationMode: 'guided_description',
          systemPrompt: systemPrompt,
          context: {
            imageDescription: context.imageContext.description,
            conversationObjectives: context.imageContext.objectives,
            conversationHistory: context.conversationHistory,
            currentStage: context.conversationStage
          },
          responseConfig: {
            style: 'conversational_guide',
            includeTranscription: true,
            generateFollowUp: true,
            maintainFlow: true
          }
        })
      };

      const response = await this.client.send(new InvokeModelCommand(input));
      const result = JSON.parse(response.body.transformToString());
      
      return {
        userTranscription: result.transcription,
        text: result.responseText,
        audioUrl: await this.saveAudioResponse(result.responseAudio),
        suggestedNextQuestion: result.followUpQuestion,
        conversationStage: result.nextStage
      };
    } catch (error) {
      throw new Error('Conversation processing failed');
    }
  }

  private buildGuidePrompt(context: any): string {
    return `
You are Nova, guiding a ${context.userLevel} English learner to describe an image through natural conversation.

IMAGE: ${context.imageContext.title}
CONVERSATION STAGE: ${context.conversationStage}
OBJECTIVES: ${context.imageContext.objectives.join(', ')}

GUIDE THE USER TO:
1. Notice and describe visual details progressively
2. Use appropriate vocabulary for their level
3. Elaborate on their initial observations
4. Make personal connections to the scene

CONVERSATION HISTORY:
${context.conversationHistory.map(h => `${h.speaker}: ${h.message}`).join('\n')}

RESPOND AS A CONVERSATION GUIDE:
- Build naturally on what the user just said
- Ask engaging follow-up questions
- Help them notice new details
- Encourage elaboration without being pushy
- Maintain supportive, interested tone
- Don't correct - just guide toward more description

CURRENT FOCUS: Help user describe the image in more detail through natural conversation flow.
    `;
  }
}
```

---

## 4. 업데이트된 API 엔드포인트

### 4.1 카테고리 이미지 조회
```typescript
// GET /api/v1/categories/{category}/images
app.get('/api/v1/categories/:category/images', authMiddleware, async (req, res) => {
  try {
    const { category } = req.params;
    
    // 해당 카테고리의 사전 생성된 이미지 5개 조회
    const images = await docClient.query({
      TableName: 'nova-images',
      IndexName: 'category-index',
      KeyConditionExpression: 'category = :category',
      ExpressionAttributeValues: {
        ':category': category
      },
      Limit: 5
    }).promise();

    res.json({
      success: true,
      data: {
        category,
        images: images.Items.map(item => ({
          imageId: item.imageId,
          title: item.title,
          url: item.s3Url,
          conversationObjectives: item.conversationObjectives,
          estimatedDuration: '10-15 minutes'
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to load category images' }
    });
  }
});
```

### 4.2 대화 세션 시작
```typescript
// POST /api/v1/conversations/start
app.post('/api/v1/conversations/start', authMiddleware, async (req, res) => {
  try {
    const { imageId } = req.body;
    const userId = req.user.userId;
    
    // 이미지 정보 조회
    const imageData = await docClient.get({
      TableName: 'nova-images',
      Key: { imageId }
    }).promise();

    // 대화 세션 생성
    const sessionId = `conv_${Date.now()}_${userId}`;
    
    await docClient.put({
      TableName: 'nova-conversations',
      Item: {
        sessionId,
        userId,
        imageId,
        startTime: new Date().toISOString(),
        status: 'active',
        conversationHistory: []
      }
    }).promise();

    res.json({
      success: true,
      data: {
        sessionId,
        imageData: imageData.Item,
        websocketUrl: `wss://api.nova-english.com/ws/conversations/${sessionId}`,
        instructions: 'Connect to WebSocket to start real-time conversation'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to start conversation' }
    });
  }
});
```

---

## 5. 프론트엔드 업데이트

### 5.1 카테고리 선택 컴포넌트
```typescript
// src/components/CategorySelection.tsx
import React, { useState, useEffect } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Button } from '@mui/material';
import { categoryAPI } from '../services/api';

const categories = [
  { id: 'daily_life', name: 'Daily Life', icon: '🏠' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'social', name: 'Social', icon: '👥' },
  { id: 'academic', name: 'Academic', icon: '📚' }
];

export const CategorySelection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categoryImages, setCategoryImages] = useState<any[]>([]);

  const handleCategorySelect = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    
    try {
      const response = await categoryAPI.getCategoryImages(categoryId);
      setCategoryImages(response.data.images);
    } catch (error) {
      console.error('Failed to load category images:', error);
    }
  };

  return (
    <div>
      {!selectedCategory ? (
        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} md={4} key={category.id}>
              <Card 
                sx={{ cursor: 'pointer', '&:hover': { transform: 'scale(1.05)' } }}
                onClick={() => handleCategorySelect(category.id)}
              >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
                    {category.icon}
                  </Typography>
                  <Typography variant="h5" gutterBottom>
                    {category.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    5 conversation scenarios
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <ImageSelection 
          category={selectedCategory}
          images={categoryImages}
          onBack={() => setSelectedCategory('')}
        />
      )}
    </div>
  );
};
```

### 5.2 실시간 대화 컴포넌트
```typescript
// src/components/ConversationSession.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, CardMedia, IconButton, Typography, Paper } from '@mui/material';
import { MicIcon, StopIcon } from '@mui/icons-material';
import { useWebSocket } from '../hooks/useWebSocket';
import { useVoiceRecording } from '../hooks/useVoiceRecording';

interface ConversationSessionProps {
  sessionId: string;
  imageData: any;
}

export const ConversationSession: React.FC<ConversationSessionProps> = ({ 
  sessionId, 
  imageData 
}) => {
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const [isNovaResponding, setIsNovaResponding] = useState(false);
  
  const { socket, isConnected } = useWebSocket(`/conversations/${sessionId}`);
  const { isRecording, startRecording, stopRecording, audioBlob } = useVoiceRecording();

  useEffect(() => {
    if (socket && isConnected) {
      // 대화 시작
      socket.emit('start_conversation', {
        imageId: imageData.imageId,
        category: imageData.category
      });

      // Nova 메시지 수신
      socket.on('nova_message', (message) => {
        setConversationHistory(prev => [...prev, {
          speaker: 'nova',
          text: message.text,
          audioUrl: message.audioUrl,
          timestamp: message.timestamp
        }]);
        setIsNovaResponding(false);
        
        // 자동으로 Nova 음성 재생
        if (message.audioUrl) {
          playAudio(message.audioUrl);
        }
      });
    }
  }, [socket, isConnected]);

  useEffect(() => {
    if (audioBlob && socket) {
      // 사용자 음성을 Nova에게 전송
      setIsNovaResponding(true);
      
      const reader = new FileReader();
      reader.onload = () => {
        const audioData = reader.result?.toString().split(',')[1]; // base64 데이터
        
        socket.emit('user_voice', {
          audio: audioData,
          imageContext: imageData,
          conversationHistory: conversationHistory,
          conversationStage: determineConversationStage()
        });
      };
      reader.readAsDataURL(audioBlob);
    }
  }, [audioBlob]);

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(console.error);
  };

  const determineConversationStage = () => {
    const userMessages = conversationHistory.filter(m => m.speaker === 'user').length;
    if (userMessages <= 2) return 'opening';
    if (userMessages <= 5) return 'development';
    if (userMessages <= 8) return 'deepening';
    return 'expansion';
  };

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 2 }}>
      {/* 이미지 표시 */}
      <Card sx={{ mb: 3 }}>
        <CardMedia
          component="img"
          height="400"
          image={imageData.url}
          alt={imageData.title}
        />
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">{imageData.title}</Typography>
          <Typography variant="body2" color="text.secondary">
            Have a conversation with Nova about this image
          </Typography>
        </Box>
      </Card>

      {/* 대화 기록 */}
      <Paper sx={{ mb: 3, p: 2, maxHeight: 300, overflow: 'auto' }}>
        {conversationHistory.map((message, index) => (
          <Box key={index} sx={{ mb: 2 }}>
            <Typography 
              variant="subtitle2" 
              color={message.speaker === 'nova' ? 'primary' : 'secondary'}
            >
              {message.speaker === 'nova' ? '🤖 Nova' : '👤 You'}
            </Typography>
            <Typography variant="body1">
              {message.text}
            </Typography>
            {message.audioUrl && (
              <audio controls style={{ width: '100%', marginTop: '8px' }}>
                <source src={message.audioUrl} type="audio/wav" />
              </audio>
            )}
          </Box>
        ))}
        
        {isNovaResponding && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Nova is thinking...
            </Typography>
          </Box>
        )}
      </Paper>

      {/* 음성 입력 */}
      <Box sx={{ textAlign: 'center' }}>
        <IconButton
          size="large"
          color={isRecording ? "error" : "primary"}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isNovaResponding}
          sx={{ 
            width: 80, 
            height: 80,
            border: 2,
            borderColor: isRecording ? 'error.main' : 'primary.main'
          }}
        >
          {isRecording ? <StopIcon sx={{ fontSize: 40 }} /> : <MicIcon sx={{ fontSize: 40 }} />}
        </IconButton>
        
        <Typography variant="body2" sx={{ mt: 1 }}>
          {isRecording ? 'Recording... Click to stop' : 'Click to start speaking'}
        </Typography>
      </Box>
    </Box>
  );
};
```

---

## 6. 데이터베이스 스키마 업데이트

### 6.1 대화 세션 테이블
```json
{
  "TableName": "nova-conversations",
  "Schema": {
    "sessionId": "String (PK)",
    "userId": "String (GSI)",
    "imageId": "String",
    "category": "String",
    "startTime": "ISO8601",
    "endTime": "ISO8601",
    "conversationHistory": [
      {
        "speaker": "nova|user",
        "message": "String",
        "audioUrl": "String",
        "timestamp": "ISO8601"
      }
    ],
    "conversationStages": [
      "opening", "development", "deepening", "expansion", "closing"
    ],
    "totalTurns": "Number",
    "userEngagement": "Number",
    "status": "active|completed|abandoned"
  }
}
```

이렇게 업데이트된 서비스는 Nova Canvas로 미리 생성된 고품질 이미지를 기반으로, Nova Sonic이 실시간 스트리밍으로 사용자와 자연스러운 대화를 나누며 점진적으로 더 구체적인 이미지 서술을 유도하는 방식으로 작동합니다.