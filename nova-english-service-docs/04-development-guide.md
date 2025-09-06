# Nova 영어 학습 서비스 개발 구현 가이드

**프로젝트명**: Nova English Learning Service  
**작성일**: 2025년 1월  
**버전**: 2.0  
**작성자**: Development Team

---

## 1. 개발 환경 설정

### 1.1 필수 도구 설치
```bash
# Node.js 18+ 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# AWS CLI 설치
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Docker 설치
sudo apt-get update
sudo apt-get install docker.io docker-compose

# CDK 설치
npm install -g aws-cdk
```

### 1.2 프로젝트 구조 생성
```bash
mkdir nova-english-service
cd nova-english-service

# 프로젝트 구조 생성
mkdir -p {frontend,backend,infrastructure,docker,docs}
mkdir -p backend/{src/{routes,middleware,services,utils},tests}
mkdir -p frontend/{src/{components,pages,hooks,services,types},public}
mkdir -p infrastructure/{lib,config}
```

### 1.3 환경 변수 설정
```bash
# .env.example 파일 생성
cat > .env.example << 'EOF'
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Cognito Configuration
COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxx
COGNITO_REGION=us-east-1

# DynamoDB Tables
DYNAMODB_USERS_TABLE=nova-users
DYNAMODB_SESSIONS_TABLE=nova-sessions
DYNAMODB_IMAGES_TABLE=nova-images
DYNAMODB_PROGRESS_TABLE=nova-progress

# S3 Buckets
S3_FRONTEND_BUCKET=nova-frontend-prod
S3_IMAGES_BUCKET=nova-learning-images
S3_AUDIO_BUCKET=nova-audio-files

# Bedrock Models
BEDROCK_NOVA_SONIC_MODEL_ID=amazon.nova-sonic-v1:0
BEDROCK_CLAUDE_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
BEDROCK_NOVA_CANVAS_MODEL_ID=amazon.nova-canvas-v1:0

# Application Settings
NODE_ENV=development
PORT=3000
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:3001
EOF
```

---

## 2. 백엔드 개발 (Node.js + Express)

### 2.1 프로젝트 초기화
```bash
cd backend
npm init -y

# 필수 패키지 설치
npm install express cors helmet morgan compression
npm install @aws-sdk/client-dynamodb @aws-sdk/client-s3 @aws-sdk/client-bedrock-runtime
npm install @aws-sdk/client-cognito-identity-provider
npm install jsonwebtoken bcryptjs multer multer-s3
npm install joi express-rate-limit express-validator
npm install ws socket.io

# 개발 도구 설치
npm install -D nodemon typescript @types/node @types/express
npm install -D jest supertest @types/jest eslint prettier
```

### 2.2 TypeScript 설정
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### 2.3 Express 서버 구성
```typescript
// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import imageRoutes from './routes/images';
import sessionRoutes from './routes/sessions';
import progressRoutes from './routes/progress';

import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';

const app = express();

// 보안 미들웨어
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001'],
  credentials: true
}));

// 요청 제한
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 1000, // 최대 1000 요청
  message: 'Too many requests from this IP'
});
app.use(limiter);

// 기본 미들웨어
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 헬스체크
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API 라우트
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', authMiddleware, userRoutes);
app.use('/api/v1/images', authMiddleware, imageRoutes);
app.use('/api/v1/sessions', authMiddleware, sessionRoutes);
app.use('/api/v1/progress', authMiddleware, progressRoutes);

// 오류 처리
app.use(errorHandler);

export default app;
```

### 2.4 AWS 서비스 클라이언트 설정
```typescript
// src/services/aws.ts
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';
import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime';
import { CognitoIdentityProviderClient } from '@aws-sdk/client-cognito-identity-provider';

const region = process.env.AWS_REGION || 'us-east-1';

export const dynamoClient = new DynamoDBClient({ region });
export const s3Client = new S3Client({ region });
export const bedrockClient = new BedrockRuntimeClient({ region });
export const cognitoClient = new CognitoIdentityProviderClient({ region });

// DynamoDB 헬퍼
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
export const docClient = DynamoDBDocumentClient.from(dynamoClient);
```

### 2.5 인증 미들웨어
```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    sub: string;
  };
}

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.COGNITO_USER_POOL_ID!,
  tokenUse: 'access',
  clientId: process.env.COGNITO_CLIENT_ID!,
});

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { code: 'AUTH_001', message: 'No token provided' }
      });
    }

    const payload = await verifier.verify(token);
    
    req.user = {
      userId: payload.sub,
      email: payload.email || '',
      sub: payload.sub
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: { code: 'AUTH_002', message: 'Invalid token' }
    });
  }
};
```

### 2.6 Nova Sonic 대화 유도 서비스
```typescript
// src/services/novaSonic.ts
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

export class NovaSonicService {
  private client: BedrockRuntimeClient;
  private modelId = 'amazon.nova-sonic-v1:0';

  constructor() {
    this.client = new BedrockRuntimeClient({ 
      region: process.env.AWS_REGION || 'us-east-1' 
    });
  }

  async processGuideConversation(audioBuffer: Buffer, context: {
    imageContext: any;
    conversationHistory: any[];
    userLevel: string;
    conversationStage: string;
  }) {
    try {
      const input = {
        modelId: this.modelId,
        body: JSON.stringify({
          audio: audioBuffer.toString('base64'),
          conversationMode: 'guided_description',
          systemPrompt: this.buildGuidePrompt(context),
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

      const command = new InvokeModelCommand(input);
      const response = await this.client.send(command);
      
      const result = JSON.parse(response.body.transformToString());
      
      return {
        userTranscription: result.transcription,
        text: result.responseText,
        audioUrl: await this.saveAudioResponse(result.responseAudio),
        suggestedNextQuestion: result.followUpQuestion,
        conversationStage: result.nextStage
      };
    } catch (error) {
      console.error('Nova Sonic conversation error:', error);
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

### 2.7 Claude 4.0 텍스트 분석 서비스
```typescript
// src/services/claude.ts
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

export class ClaudeService {
  private client: BedrockRuntimeClient;
  private modelId = 'anthropic.claude-3-5-sonnet-20241022-v2:0';

  constructor() {
    this.client = new BedrockRuntimeClient({ 
      region: process.env.AWS_REGION || 'us-east-1' 
    });
  }

  async analyzeDescription(text: string, context: {
    imageDescription: string;
    expectedVocabulary: string[];
    userLevel: string;
  }) {
    const prompt = `
Analyze this English description from a ${context.userLevel} level Korean learner:

Image Context: ${context.imageDescription}
Expected Vocabulary: ${context.expectedVocabulary.join(', ')}
User Description: "${text}"

Please provide:
1. Grammar analysis (errors and corrections)
2. Vocabulary assessment (level appropriateness)
3. Fluency evaluation (sentence structure)
4. Specific improvement suggestions
5. Numerical scores (0-100) for each category

Format as JSON with scores and detailed feedback.
    `;

    try {
      const input = {
        modelId: this.modelId,
        body: JSON.stringify({
          anthropic_version: 'bedrock-2023-05-31',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.3
        })
      };

      const command = new InvokeModelCommand(input);
      const response = await this.client.send(command);
      
      const result = JSON.parse(response.body.transformToString());
      return JSON.parse(result.content[0].text);
    } catch (error) {
      console.error('Claude analysis error:', error);
      throw new Error('Text analysis failed');
    }
  }
}
```

### 2.8 WebSocket 대화 유도 서비스
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

---

## 3. 프론트엔드 개발 (React + TypeScript)

### 3.1 프로젝트 초기화
```bash
cd frontend
npx create-react-app . --template typescript

# 추가 패키지 설치
npm install @aws-amplify/ui-react aws-amplify
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material @mui/lab
npm install react-router-dom @types/react-router-dom
npm install axios socket.io-client
npm install react-query @tanstack/react-query
npm install zustand immer
npm install react-hook-form @hookform/resolvers yup
```

### 3.2 AWS Amplify 설정
```typescript
// src/aws-config.ts
import { Amplify } from 'aws-amplify';

const awsConfig = {
  Auth: {
    region: process.env.REACT_APP_AWS_REGION,
    userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
  },
  API: {
    endpoints: [
      {
        name: 'NovaAPI',
        endpoint: process.env.REACT_APP_API_BASE_URL,
        region: process.env.REACT_APP_AWS_REGION,
      }
    ]
  }
};

Amplify.configure(awsConfig);
```

### 3.3 상태 관리 (Zustand)
```typescript
// src/store/authStore.ts
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface User {
  userId: string;
  email: string;
  name: string;
  profile: {
    level: string;
    interests: string[];
    goals: string[];
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateProfile: (profile: Partial<User['profile']>) => void;
}

export const useAuthStore = create<AuthState>()(
  immer((set) => ({
    user: null,
    isAuthenticated: false,
    token: null,
    
    login: (user, token) =>
      set((state) => {
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
        localStorage.setItem('token', token);
      }),
      
    logout: () =>
      set((state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      }),
      
    updateProfile: (profile) =>
      set((state) => {
        if (state.user) {
          state.user.profile = { ...state.user.profile, ...profile };
        }
      }),
  }))
);
```

### 3.4 API 서비스
```typescript
// src/services/api.ts
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// 요청 인터셉터
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
    
  register: (userData: any) =>
    apiClient.post('/auth/register', userData),
    
  refreshToken: (refreshToken: string) =>
    apiClient.post('/auth/refresh', { refreshToken }),
};

export const sessionAPI = {
  createSession: (imageId: string) =>
    apiClient.post('/sessions', { imageId }),
    
  submitDescription: (sessionId: string, description: string) =>
    apiClient.post(`/sessions/${sessionId}/description`, { description }),
    
  uploadVoice: (sessionId: string, audioFile: File) => {
    const formData = new FormData();
    formData.append('audio', audioFile);
    return apiClient.post(`/sessions/${sessionId}/voice`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export const imageAPI = {
  getRandomImage: (category?: string, difficulty?: string) =>
    apiClient.get('/images/random', { params: { category, difficulty } }),
    
  generateImage: (prompt: string, category: string) =>
    apiClient.post('/images/generate', { prompt, category }),
};
```

### 3.5 WebSocket 대화 훅
```typescript
// src/hooks/useWebSocket.ts
import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseWebSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (event: string, data: any) => void;
}

export const useWebSocket = (endpoint: string): UseWebSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(`${process.env.REACT_APP_WS_URL}${endpoint}`, {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [endpoint]);

  const sendMessage = (event: string, data: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    }
  };

  return {
    socket,
    isConnected,
    sendMessage
  };
};

// src/hooks/useVoiceRecording.ts (업데이트된 버전)
export const useVoiceRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording failed:', error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  return { isRecording, audioBlob, startRecording, stopRecording };
};
```

### 3.6 대화 세션 컴포넌트
```typescript
// src/components/ConversationSession/ConversationSession.tsx
import React, { useState, useEffect } from 'react';
import { Box, Card, CardMedia, IconButton, Typography, Paper } from '@mui/material';
import { MicIcon, StopIcon } from '@mui/icons-material';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useVoiceRecording } from '../../hooks/useVoiceRecording';

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

## 4. 인프라 구축 (AWS CDK)

### 4.1 CDK 프로젝트 초기화
```bash
cd infrastructure
cdk init app --language typescript

# CDK 패키지 설치
npm install @aws-cdk/aws-ecs @aws-cdk/aws-ec2 @aws-cdk/aws-elasticloadbalancingv2
npm install @aws-cdk/aws-s3 @aws-cdk/aws-dynamodb @aws-cdk/aws-cognito
npm install @aws-cdk/aws-cloudfront @aws-cdk/aws-route53
```

### 4.2 ECS Fargate 스택
```typescript
// lib/ecs-stack.ts
import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';

export class EcsStack extends cdk.Stack {
  public readonly cluster: ecs.Cluster;
  public readonly service: ecs.FargateService;
  public readonly loadBalancer: elbv2.ApplicationLoadBalancer;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC 생성
    const vpc = new ec2.Vpc(this, 'NovaVPC', {
      maxAzs: 2,
      natGateways: 1,
      cidr: '10.0.0.0/16',
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'Public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
        },
      ],
    });

    // ECS 클러스터
    this.cluster = new ecs.Cluster(this, 'NovaCluster', {
      vpc,
      clusterName: 'nova-english-cluster',
    });

    // Task Definition
    const taskDefinition = new ecs.FargateTaskDefinition(this, 'NovaTaskDef', {
      memoryLimitMiB: 1024,
      cpu: 512,
    });

    // Container 추가
    const container = taskDefinition.addContainer('NovaAPI', {
      image: ecs.ContainerImage.fromRegistry('nova-api:latest'),
      environment: {
        NODE_ENV: 'production',
        AWS_REGION: this.region,
      },
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: 'nova-api',
        logRetention: 30,
      }),
    });

    container.addPortMappings({
      containerPort: 3000,
      protocol: ecs.Protocol.TCP,
    });

    // Fargate Service
    this.service = new ecs.FargateService(this, 'NovaService', {
      cluster: this.cluster,
      taskDefinition,
      desiredCount: 2,
      assignPublicIp: false,
    });

    // Application Load Balancer
    this.loadBalancer = new elbv2.ApplicationLoadBalancer(this, 'NovaALB', {
      vpc,
      internetFacing: true,
    });

    const listener = this.loadBalancer.addListener('NovaListener', {
      port: 80,
      defaultAction: elbv2.ListenerAction.redirect({
        protocol: 'HTTPS',
        port: '443',
      }),
    });

    const httpsListener = this.loadBalancer.addListener('NovaHTTPSListener', {
      port: 443,
      certificateArns: [process.env.SSL_CERTIFICATE_ARN!],
    });

    httpsListener.addTargets('NovaTargets', {
      port: 3000,
      targets: [this.service],
      healthCheckPath: '/health',
      healthCheckIntervalSecs: 30,
    });

    // Auto Scaling
    const scaling = this.service.autoScaleTaskCount({
      minCapacity: 1,
      maxCapacity: 10,
    });

    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 70,
    });

    scaling.scaleOnMemoryUtilization('MemoryScaling', {
      targetUtilizationPercent: 80,
    });
  }
}
```

### 4.3 DynamoDB 스택
```typescript
// lib/dynamodb-stack.ts
import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class DynamoDBStack extends cdk.Stack {
  public readonly usersTable: dynamodb.Table;
  public readonly sessionsTable: dynamodb.Table;
  public readonly imagesTable: dynamodb.Table;
  public readonly progressTable: dynamodb.Table;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Users 테이블
    this.usersTable = new dynamodb.Table(this, 'UsersTable', {
      tableName: 'nova-users',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.ON_DEMAND,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      pointInTimeRecovery: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Sessions 테이블
    this.sessionsTable = new dynamodb.Table(this, 'SessionsTable', {
      tableName: 'nova-sessions',
      partitionKey: { name: 'sessionId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.ON_DEMAND,
      timeToLiveAttribute: 'ttl',
    });

    // GSI 추가
    this.sessionsTable.addGlobalSecondaryIndex({
      indexName: 'userId-timestamp-index',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.NUMBER },
    });

    // Images 테이블
    this.imagesTable = new dynamodb.Table(this, 'ImagesTable', {
      tableName: 'nova-images',
      partitionKey: { name: 'imageId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.ON_DEMAND,
    });

    this.imagesTable.addGlobalSecondaryIndex({
      indexName: 'category-difficulty-index',
      partitionKey: { name: 'category', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'difficulty', type: dynamodb.AttributeType.STRING },
    });

    // Progress 테이블
    this.progressTable = new dynamodb.Table(this, 'ProgressTable', {
      tableName: 'nova-progress',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'date', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.ON_DEMAND,
    });
  }
}
```

---

## 5. CI/CD 파이프라인

### 5.1 GitHub Actions 워크플로우
```yaml
# .github/workflows/deploy.yml
name: Deploy Nova English Service

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  AWS_REGION: us-east-1
  ECR_REPOSITORY: nova-api
  ECS_SERVICE: nova-api-service
  ECS_CLUSTER: nova-english-cluster

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json
          
      - name: Install dependencies
        run: |
          cd backend
          npm ci
          
      - name: Run tests
        run: |
          cd backend
          npm test
          
      - name: Run linting
        run: |
          cd backend
          npm run lint

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
          
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
        
      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          cd backend
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
          
      - name: Deploy to ECS
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          aws ecs update-service \
            --cluster $ECS_CLUSTER \
            --service $ECS_SERVICE \
            --force-new-deployment
            
      - name: Deploy Frontend to S3
        run: |
          cd frontend
          npm ci
          npm run build
          aws s3 sync build/ s3://${{ secrets.S3_FRONTEND_BUCKET }} --delete
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

### 5.2 Dockerfile (백엔드)
```dockerfile
# backend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS runtime

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs . .

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["npm", "start"]
```

---

## 6. 테스트 전략

### 6.1 백엔드 테스트
```typescript
// backend/tests/auth.test.ts
import request from 'supertest';
import app from '../src/app';

describe('Authentication', () => {
  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
```

### 6.2 프론트엔드 테스트
```typescript
// frontend/src/components/__tests__/StudySession.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { StudySession } from '../StudySession/StudySession';
import * as api from '../../services/api';

jest.mock('../../services/api');
const mockAPI = api as jest.Mocked<typeof api>;

describe('StudySession', () => {
  beforeEach(() => {
    mockAPI.imageAPI.getRandomImage.mockResolvedValue({
      data: {
        imageId: 'test-image',
        url: 'https://example.com/image.jpg',
        title: 'Test Image'
      }
    });
  });

  it('should load and display image', async () => {
    render(<StudySession onSessionComplete={jest.fn()} />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Image')).toBeInTheDocument();
    });
  });

  it('should submit description', async () => {
    mockAPI.sessionAPI.submitDescription.mockResolvedValue({
      data: { analysis: { overallScore: 85 } }
    });

    render(<StudySession onSessionComplete={jest.fn()} />);
    
    const textarea = screen.getByPlaceholderText('Type your description here...');
    fireEvent.change(textarea, { target: { value: 'Test description' } });
    
    const submitButton = screen.getByText('Submit Description');
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockAPI.sessionAPI.submitDescription).toHaveBeenCalled();
    });
  });
});
```

---

## 7. 배포 및 운영

### 7.1 환경별 배포
```bash
# 개발 환경 배포
npm run deploy:dev

# 스테이징 환경 배포
npm run deploy:staging

# 프로덕션 환경 배포
npm run deploy:prod
```

### 7.2 모니터링 설정
```typescript
// src/middleware/monitoring.ts
import { Request, Response, NextFunction } from 'express';
import { CloudWatch } from 'aws-sdk';

const cloudwatch = new CloudWatch({ region: process.env.AWS_REGION });

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  res.on('finish', async () => {
    const duration = Date.now() - startTime;
    
    // API 응답 시간 메트릭
    await cloudwatch.putMetricData({
      Namespace: 'NovaEnglish/API',
      MetricData: [
        {
          MetricName: 'ResponseTime',
          Value: duration,
          Unit: 'Milliseconds',
          Dimensions: [
            { Name: 'Endpoint', Value: req.path },
            { Name: 'Method', Value: req.method }
          ]
        }
      ]
    }).promise();
  });
  
  next();
};
```

이 개발 구현 가이드를 통해 Nova 영어 학습 서비스를 체계적으로 개발할 수 있습니다. 각 단계별로 상세한 코드 예제와 설정 방법을 제공하여 개발팀이 효율적으로 프로젝트를 진행할 수 있도록 지원합니다.