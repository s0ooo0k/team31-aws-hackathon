# Nova 영어 이미지 서술 회화 스터디 서비스 개발 계획

**프로젝트명**: Nova English Image Description Study Service  
**작성일**: 2025년 1월  
**버전**: 1.0  
**작성자**: Development Team  
**기반 코드**: `/Users/eunjilee/Desktop/qqq/amazon-nova-samples/speech-to-speech/sample-codes/websocket-nodejs`

---

## 🎯 서비스 핵심 개념

**Nova Sonic STT+TTS 통합 모델**을 활용한 실시간 음성 대화 기반 영어 학습 플랫폼

### 핵심 플로우
1. **사용자 로그인** → **카테고리 선택** → **이미지 자동 표시**
2. **사용자 음성 서술** → **Nova Sonic 유도 질문** → **점진적 서술 향상**
3. **실시간 STT+TTS** → **자연스러운 대화 학습**

### 기존 샘플 코드 활용
- Nova Sonic WebSocket 실시간 통신 (100% 활용)
- 음성 스트리밍 처리 로직 (100% 활용)
- 세션 관리 시스템 (80% 활용)

---

## 📋 개발 단계별 계획

### Phase 1: 기반 인프라 및 Nova Sonic 통합 (2주)

#### 1.1 Nova Sonic WebSocket 서버 확장
```
기존 샘플 코드 확장:
/amazon-nova-samples/speech-to-speech/sample-codes/websocket-nodejs/
├── src/
│   ├── server.ts           # ✅ 기존 활용 + API 엔드포인트 추가
│   ├── client.ts           # ✅ 기존 활용 + 영어 학습 로직 추가
│   ├── imageService.ts     # 🆕 이미지 관리 서비스
│   ├── userService.ts      # 🆕 사용자 관리 서비스
│   └── conversationService.ts # 🆕 대화 세션 관리
```

#### 1.2 영어 학습 전용 시스템 프롬프트
```javascript
// 기존 샘플의 SYSTEM_PROMPT 대체
const ENGLISH_TUTOR_PROMPT = `
You are an English conversation tutor helping users describe images in detail.

Your role:
- Ask ONE specific follow-up question at a time
- Focus on details: colors, brands, sizes, locations, emotions, atmosphere
- Encourage elaboration, not correction
- Keep responses short (1-2 sentences)
- Be encouraging and supportive

Example interaction:
User: "I see a laptop"
You: "That's great! What color is the laptop?"

User: "It's silver"
You: "Nice! What brand do you think it might be?"
`;
```

#### 1.3 데이터베이스 설계 (DynamoDB)
```json
{
  "Users": {
    "userId": "String (PK)",
    "email": "String", 
    "level": "beginner|intermediate|advanced",
    "preferredCategories": ["String"],
    "createdAt": "ISO8601"
  },
  "Images": {
    "imageId": "String (PK)",
    "s3Url": "String",
    "category": "String",
    "description": "String",
    "expectedVocabulary": ["String"],
    "guidingQuestions": ["String"]
  },
  "ConversationSessions": {
    "sessionId": "String (PK)",
    "userId": "String (GSI)",
    "imageId": "String", 
    "conversationHistory": "Array",
    "startTime": "ISO8601",
    "endTime": "ISO8601",
    "metrics": {
      "totalTurns": "Number",
      "duration": "Number",
      "vocabularyUsed": ["String"]
    }
  }
}
```

### Phase 2: 백엔드 API 확장 (2주)

#### 2.1 Express API 엔드포인트 추가 (기존 server.ts 확장)
```typescript
// 기존 Nova Sonic 서버에 추가
app.use(express.static(path.join(__dirname, '../public'))); // ✅ 기존 유지

// 🆕 새로운 API 엔드포인트
app.get('/api/categories', getCategoriesHandler);
app.get('/api/images/:categoryId', getImagesByCategoryHandler);
app.post('/api/sessions', createSessionHandler);
app.get('/api/sessions/:sessionId', getSessionHandler);
app.post('/api/auth/login', loginHandler);
app.post('/api/auth/register', registerHandler);
```

#### 2.2 Nova Sonic 대화 로직 확장 (기존 client.ts 확장)
```typescript
// 기존 NovaSonicBidirectionalStreamClient 확장
export class EnglishTutorSession extends StreamSession {
  private imageContext: string;
  private conversationStage: 'opening' | 'details' | 'emotions' | 'comparison';
  private vocabularyUsed: string[] = [];
  
  public setImageContext(imageDescription: string, guidingQuestions: string[]) {
    this.imageContext = imageDescription;
    // 기존 setupSystemPrompt 메서드 활용하여 이미지 컨텍스트 설정
    const contextualPrompt = ENGLISH_TUTOR_PROMPT + 
      `\n\nImage Context: ${imageDescription}\nGuiding Questions: ${guidingQuestions.join(', ')}`;
    this.setupSystemPrompt(DefaultTextConfiguration, contextualPrompt);
  }
  
  public async processUserDescription(audioData: Buffer) {
    // ✅ 기존 streamAudio 메서드 그대로 활용
    await this.streamAudio(audioData);
  }
  
  // 🆕 대화 단계 추적
  private updateConversationStage(userInput: string) {
    // 사용자 입력 분석하여 대화 단계 업데이트
  }
}
```

#### 2.3 이미지 관리 시스템
```typescript
// imageService.ts - 새로 생성
export class ImageService {
  async getImagesByCategory(category: string): Promise<Image[]> {
    // DynamoDB에서 카테고리별 이미지 조회
    const params = {
      TableName: 'Images',
      FilterExpression: 'category = :category',
      ExpressionAttributeValues: { ':category': category }
    };
    return await dynamoClient.scan(params).promise();
  }
  
  async getRandomImage(category: string): Promise<Image> {
    const images = await this.getImagesByCategory(category);
    return images[Math.floor(Math.random() * images.length)];
  }
}
```

### Phase 3: 프론트엔드 개발 (3주)

#### 3.1 React 애플리케이션 구조
```
frontend/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── Categories/
│   │   │   └── CategorySelector.tsx
│   │   ├── Conversation/
│   │   │   ├── ImageDisplay.tsx
│   │   │   ├── ConversationInterface.tsx
│   │   │   └── AudioControls.tsx
│   │   └── Progress/
│   │       └── SessionSummary.tsx
│   ├── hooks/
│   │   ├── useNovaSonic.ts      # 🔄 기존 main.js를 React 훅으로 변환
│   │   ├── useAudio.ts          # 🔄 기존 오디오 로직 활용
│   │   └── useConversation.ts   # 🆕 대화 상태 관리
│   └── services/
│       ├── api.ts               # 🆕 REST API 클라이언트
│       └── websocket.ts         # 🔄 기존 Socket.io 로직 활용
```

#### 3.2 Nova Sonic WebSocket 연동 훅 (기존 main.js → React 훅 변환)
```typescript
// useNovaSonic.ts - 기존 main.js 로직을 React 훅으로 변환
export const useNovaSonic = () => {
  const [socket, setSocket] = useState<Socket>();
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [audioPlayer] = useState(() => new AudioPlayer()); // ✅ 기존 AudioPlayer 활용
  
  // ✅ 기존 initializeSession 로직 활용
  const startConversation = async (imageContext: string, guidingQuestions: string[]) => {
    const contextualPrompt = ENGLISH_TUTOR_PROMPT + 
      `\n\nImage Context: ${imageContext}\nGuiding Questions: ${guidingQuestions.join(', ')}`;
    
    socket?.emit('promptStart');
    socket?.emit('systemPrompt', contextualPrompt);
    socket?.emit('audioStart');
  };
  
  // ✅ 기존 audioInput 이벤트 그대로 활용
  const streamAudio = (audioData: string) => {
    socket?.emit('audioInput', audioData);
  };
  
  // ✅ 기존 이벤트 핸들러들 활용
  useEffect(() => {
    if (!socket) return;
    
    socket.on('textOutput', handleTextOutput);
    socket.on('audioOutput', handleAudioOutput);
    socket.on('contentStart', handleContentStart);
    socket.on('contentEnd', handleContentEnd);
    
    return () => {
      socket.off('textOutput');
      socket.off('audioOutput');
      socket.off('contentStart');
      socket.off('contentEnd');
    };
  }, [socket]);
  
  return { 
    startConversation, 
    streamAudio, 
    conversationHistory, 
    isStreaming,
    setIsStreaming 
  };
};
```

#### 3.3 오디오 처리 훅 (기존 main.js 오디오 로직 활용)
```typescript
// useAudio.ts - 기존 main.js의 오디오 처리 로직 활용
export const useAudio = () => {
  const [audioContext, setAudioContext] = useState<AudioContext>();
  const [audioStream, setAudioStream] = useState<MediaStream>();
  const [processor, setProcessor] = useState<ScriptProcessorNode>();
  
  // ✅ 기존 initAudio 로직 그대로 활용
  const initAudio = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });
    
    const context = new AudioContext({ sampleRate: 16000 });
    setAudioStream(stream);
    setAudioContext(context);
  };
  
  // ✅ 기존 startStreaming 로직 활용
  const startRecording = (onAudioData: (data: string) => void) => {
    if (!audioContext || !audioStream) return;
    
    const sourceNode = audioContext.createMediaStreamSource(audioStream);
    const scriptProcessor = audioContext.createScriptProcessor(512, 1, 1);
    
    // ✅ 기존 onaudioprocess 로직 그대로 활용
    scriptProcessor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const pcmData = new Int16Array(inputData.length);
      
      for (let i = 0; i < inputData.length; i++) {
        pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
      }
      
      const base64Data = arrayBufferToBase64(pcmData.buffer);
      onAudioData(base64Data);
    };
    
    sourceNode.connect(scriptProcessor);
    scriptProcessor.connect(audioContext.destination);
    setProcessor(scriptProcessor);
  };
  
  return { initAudio, startRecording, stopRecording };
};
```

#### 3.4 핵심 컴포넌트
```tsx
// ConversationInterface.tsx
const ConversationInterface = ({ imageUrl, imageDescription, guidingQuestions }) => {
  const { startConversation, streamAudio, conversationHistory } = useNovaSonic();
  const { startRecording, stopRecording } = useAudio();
  const [isRecording, setIsRecording] = useState(false);
  
  useEffect(() => {
    // 이미지 선택 시 자동으로 대화 시작
    startConversation(imageDescription, guidingQuestions);
  }, [imageUrl]);
  
  const handleStartRecording = () => {
    setIsRecording(true);
    startRecording(streamAudio);
  };
  
  const handleStopRecording = () => {
    setIsRecording(false);
    stopRecording();
  };
  
  return (
    <div className="conversation-container">
      <ImageDisplay src={imageUrl} alt={imageDescription} />
      <ConversationHistory messages={conversationHistory} />
      <AudioControls 
        isRecording={isRecording}
        onStartRecording={handleStartRecording}
        onStopRecording={handleStopRecording}
      />
    </div>
  );
};
```

### Phase 4: Nova Canvas 이미지 준비 및 통합 (1주)

#### 4.1 카테고리별 이미지 생성 (Nova Canvas)
```
생성할 이미지 카테고리:
├── Daily Life (일상생활) - 5개
│   ├── 카페에서 노트북 작업하는 사람
│   ├── 공원에서 산책하는 가족
│   ├── 주방에서 요리하는 모습
│   ├── 거실에서 TV 시청하는 장면
│   └── 침실에서 책 읽는 모습
├── Travel (여행) - 5개
│   ├── 공항 체크인 카운터
│   ├── 호텔 로비 풍경
│   ├── 관광지 기념품 가게
│   ├── 레스토랑에서 식사하는 모습
│   └── 해변에서 휴식하는 장면
├── Business (비즈니스) - 5개
│   ├── 회의실에서 프레젠테이션
│   ├── 오피스에서 팀 미팅
│   ├── 카페에서 비즈니스 미팅
│   ├── 컴퓨터로 작업하는 모습
│   └── 전화 통화하는 장면
├── Social (사교) - 5개
│   ├── 친구들과 파티
│   ├── 레스토랑에서 저녁 식사
│   ├── 카페에서 대화
│   ├── 공원에서 피크닉
│   └── 집에서 게임하는 모습
└── Academic (학업) - 5개
    ├── 도서관에서 공부하는 학생
    ├── 강의실에서 수업 듣는 모습
    ├── 연구실에서 실험하는 장면
    ├── 그룹 스터디하는 모습
    └── 온라인 수업 듣는 장면
```

#### 4.2 이미지 메타데이터 설정
```json
{
  "imageId": "daily_life_001",
  "s3Url": "https://nova-english-images.s3.amazonaws.com/daily_life_cafe_laptop.jpg",
  "category": "Daily Life",
  "description": "A busy coffee shop with a person working on a silver laptop. There are other customers in the background, warm lighting, and coffee cups on wooden tables.",
  "expectedVocabulary": [
    "laptop", "coffee shop", "barista", "customers", "atmosphere", 
    "wooden table", "warm lighting", "busy", "background", "silver"
  ],
  "guidingQuestions": [
    "What color is the laptop?",
    "What are the people in the background doing?", 
    "How would you describe the atmosphere of this coffee shop?",
    "What material is the table made of?",
    "What kind of lighting do you see?"
  ]
}
```

#### 4.3 이미지 업로드 및 메타데이터 저장
```typescript
// imageUpload.ts - 이미지 업로드 스크립트
const uploadImagesToS3 = async () => {
  const images = [
    {
      file: 'daily_life_cafe_laptop.jpg',
      metadata: { /* 위 JSON 데이터 */ }
    },
    // ... 총 25개 이미지
  ];
  
  for (const image of images) {
    // S3 업로드
    await s3.upload({
      Bucket: 'nova-english-images',
      Key: image.file,
      Body: fs.readFileSync(image.file)
    }).promise();
    
    // DynamoDB 메타데이터 저장
    await dynamodb.put({
      TableName: 'Images',
      Item: image.metadata
    }).promise();
  }
};
```

### Phase 5: 배포 및 테스트 (1주)

#### 5.1 ECS Fargate 배포 (기존 샘플 구조 활용)
```dockerfile
# Dockerfile - 기존 샘플 코드 기반
FROM node:18-alpine
WORKDIR /app

# ✅ 기존 package.json 활용 + 새로운 의존성 추가
COPY package*.json ./
RUN npm install

# ✅ 기존 빌드 프로세스 활용
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

#### 5.2 AWS 인프라 설정
```yaml
# docker-compose.yml - 로컬 테스트용
version: '3.8'
services:
  nova-english-service:
    build: .
    ports:
      - "3000:3000"
    environment:
      - AWS_REGION=us-east-1
      - AWS_PROFILE=bedrock-test
      - NODE_ENV=development
    volumes:
      - ~/.aws:/root/.aws:ro
```

#### 5.3 성능 테스트 목표
```
성능 지표:
- Nova Sonic 응답 시간: < 3초 (기존 샘플 기준)
- 동시 사용자: 50명 (단계적 확장)
- 음성 스트리밍 지연: < 500ms (기존 샘플 성능 유지)
- 시스템 가용성: 99%
- 메모리 사용량: < 512MB per container
```

---

## 🛠 기술 스택 (기존 샘플 기반)

### 백엔드 (기존 샘플 확장)
- **Node.js + TypeScript** ✅ 기존 샘플 유지
- **Express.js + Socket.io** ✅ 기존 샘플 유지  
- **AWS SDK v3** ✅ 기존 샘플 유지
- **Nova Sonic Bidirectional Stream** ✅ 기존 샘플 활용
- **DynamoDB** 🆕 사용자/이미지/세션 데이터
- **Amazon Cognito** 🆕 사용자 인증

### 프론트엔드 (기존 샘플 React 변환)
- **React 18 + TypeScript** 🔄 기존 Vanilla JS → React 변환
- **Socket.io-client** ✅ 기존 샘플 활용
- **Web Audio API** ✅ 기존 샘플 활용
- **Material-UI** 🆕 UI 컴포넌트 라이브러리

### AI 서비스
- **Nova Sonic** ✅ STT + TTS 통합 (기존 샘플 활용)
- **Nova Canvas** 🆕 이미지 생성

### 인프라
- **ECS Fargate** 🆕 컨테이너 실행
- **ALB** 🆕 로드 밸런싱
- **S3** 🆕 이미지 저장
- **CloudFront** 🆕 CDN

---

## 📊 예상 비용 (월간)

```
AWS 서비스 비용 (50명 동시 사용자 기준):
├── ECS Fargate (2 tasks): $30
├── ALB: $16  
├── Nova Sonic API: $100 (음성 처리 증가)
├── Nova Canvas: $20 (이미지 사전 생성)
├── DynamoDB: $10
├── S3 + CloudFront: $15
├── Cognito: $5
└── 기타 (VPC, 모니터링): $15

총 예상 비용: ~$211/월
```

---

## 🎯 MVP 핵심 기능

### Phase 1 MVP (기존 샘플 확장)
1. ✅ **Nova Sonic 실시간 음성 대화** (기존 샘플 100% 활용)
2. ✅ **WebSocket 실시간 통신** (기존 샘플 100% 활용)
3. ✅ **음성 스트리밍 처리** (기존 샘플 100% 활용)
4. 🆕 사용자 로그인 (Cognito)
5. 🆕 카테고리 선택 UI
6. 🆕 이미지 자동 표시
7. 🆕 영어 학습 전용 프롬프트
8. 🆕 대화 기록 저장

### 향후 확장 기능 (Phase 2)
- 개인화 이미지 생성 (Nova Canvas 실시간)
- 발음 평가 시스템
- 학습 진도 분석 대시보드
- 소셜 학습 기능
- 모바일 앱 개발

---

## 📅 개발 일정

| 주차 | 작업 내용 | 기존 샘플 활용도 | 담당 |
|------|-----------|------------------|------|
| 1-2주 | Nova Sonic 서버 확장, DB 설계 | 80% 활용 | Backend Dev |
| 3-4주 | API 엔드포인트 추가, 대화 로직 확장 | 60% 활용 | Backend Dev |
| 5-7주 | React 프론트엔드 개발 (main.js → React) | 40% 활용 | Frontend Dev |
| 8주 | Nova Canvas 이미지 통합 | 신규 개발 | Full Stack |
| 9주 | ECS Fargate 배포 및 테스트 | 20% 활용 | DevOps |

---

## 🔧 기존 샘플 코드 활용 전략

### 100% 활용 (그대로 사용)
- **Nova Sonic WebSocket 통신**: `client.ts`, `server.ts`의 핵심 로직
- **음성 스트리밍**: `main.js`의 오디오 처리 로직
- **세션 관리**: `StreamSession` 클래스
- **이벤트 핸들링**: Socket.io 이벤트 처리

### 80% 활용 (확장 사용)
- **시스템 프롬프트**: 영어 학습용으로 커스터마이징
- **Express 서버**: API 엔드포인트 추가
- **프로젝트 구조**: 기존 구조 기반 확장

### 40% 활용 (변환 사용)  
- **프론트엔드**: Vanilla JS → React 컴포넌트 변환
- **UI/UX**: 기존 스타일 기반 학습 UI 개발

### 신규 개발
- **사용자 인증**: Amazon Cognito 연동
- **이미지 관리**: Nova Canvas 이미지 시스템
- **데이터베이스**: DynamoDB 스키마 및 API
- **배포 인프라**: ECS Fargate, ALB 설정

이 계획을 통해 기존 Nova Sonic WebSocket 샘플 코드를 최대한 활용하여 개발 시간을 단축하고, 검증된 음성 스트리밍 로직을 그대로 사용할 수 있습니다.