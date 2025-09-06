# AWS 노바 소닉 이미지 영어 서술 스터디 웹 서비스 구현 계획

## 🎯 서비스 개요
AWS Nova Sonic을 활용한 이미지 기반 영어 서술 학습 플랫폼으로, 사용자가 이미지를 보고 영어로 설명하면 AI가 실시간 피드백을 제공하는 서비스입니다.

## 🏗️ AWS 리소스 구성

### 1. 프론트엔드 (정적 웹 호스팅)
| AWS 서비스 | 목적 | 구성 요소 |
|-----------|------|----------|
| **S3** | 정적 웹사이트 호스팅 | React 빌드 파일, 이미지 에셋 |
| **CloudFront** | CDN 및 글로벌 배포 | 캐싱, HTTPS, 지연시간 최적화 |

### 2. 백엔드 (컨테이너 기반 API)
| AWS 서비스 | 목적 | 구성 요소 |
|-----------|------|----------|
| **ECS Fargate** | 서버리스 컨테이너 실행 | Node.js API 서버, 자동 스케일링 |
| **ALB** | 로드 밸런싱 | HTTPS 종료, 헬스체크, 트래픽 분산 |
| **ECR** | 컨테이너 이미지 저장소 | Docker 이미지 버전 관리 |

### 3. AI 서비스 (Amazon Bedrock)
| 모델 | 목적 | 사용 시나리오 |
|------|------|-------------|
| **Nova Sonic (S2S)** | 음성-음성 대화 | 실시간 영어 발음 교정 및 대화 |
| **Claude 4.0** | 텍스트 분석 및 피드백 | 문법 교정, 어휘 개선 제안 |
| **Nova Canvas** | 이미지 생성 | 학습용 커스텀 이미지 생성 |

### 4. 데이터 저장소
| AWS 서비스 | 목적 | 데이터 타입 |
|-----------|------|----------|
| **DynamoDB** | NoSQL 데이터베이스 | 사용자 진도, 학습 기록, 이미지 메타데이터 |
| **S3** | 객체 스토리지 | 학습 이미지, 음성 파일, 대화 기록 |

### 5. 인증 및 보안
| AWS 서비스 | 목적 | 기능 |
|-----------|------|------|
| **Cognito** | 사용자 인증 | 회원가입, 로그인, JWT 토큰 관리 |
| **IAM** | 권한 관리 | 서비스 간 접근 제어 |

### 6. CI/CD 파이프라인
| AWS 서비스 | 목적 | 역할 |
|-----------|------|------|
| **CodeBuild** | 빌드 서비스 | Docker 이미지 빌드, 테스트 실행 |
| **CodeDeploy** | 배포 서비스 | ECS 서비스 무중단 배포 |
| **GitHub** | 소스 코드 관리 | 버전 관리, 웹훅 트리거 |

## 🚀 구현 단계별 계획

### Phase 1: 인프라 기반 구축 (1-2주)

#### 1.1 네트워크 및 보안 설정
```bash
# VPC, 서브넷, 보안 그룹 생성
- VPC (10.0.0.0/16)
- Public Subnet (ALB용)
- Private Subnet (ECS Fargate용)
- Security Groups (ALB, ECS, RDS)
```

#### 1.2 컨테이너 인프라
```bash
# ECS 클러스터 및 서비스 구성
- ECS Fargate 클러스터 생성
- ECR 리포지토리 생성
- ALB 및 타겟 그룹 설정
- 서비스 디스커버리 구성
```

#### 1.3 데이터 저장소 설정
```bash
# DynamoDB 테이블 생성
- Users 테이블 (사용자 정보)
- StudySessions 테이블 (학습 세션)
- ImageDescriptions 테이블 (이미지-설명 매핑)
- UserProgress 테이블 (학습 진도)

# S3 버킷 생성
- 정적 웹사이트 호스팅 버킷
- 학습 이미지 저장 버킷
- 음성 파일 저장 버킷
```

### Phase 2: 백엔드 API 개발 (2-3주)

#### 2.1 Express.js API 서버 구현
```javascript
// 주요 API 엔드포인트
POST /api/auth/login          // Cognito 로그인
GET  /api/images/random       // 랜덤 학습 이미지
POST /api/study/session       // 학습 세션 시작
POST /api/study/description   // 이미지 설명 제출
POST /api/study/voice         // 음성 업로드
GET  /api/user/progress       // 학습 진도 조회
```

#### 2.2 Amazon Bedrock 연동
```javascript
// Nova Sonic (S2S) 연동
const novaSonicClient = new BedrockRuntimeClient({
  region: 'us-east-1'
});

// Claude 4.0 텍스트 분석
const claudeClient = new BedrockRuntimeClient({
  region: 'us-east-1'
});

// Nova Canvas 이미지 생성
const novaCanvasClient = new BedrockRuntimeClient({
  region: 'us-east-1'
});
```

#### 2.3 실시간 음성 처리
```javascript
// WebSocket 연결로 실시간 음성 스트리밍
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', async (audioData) => {
    // Nova Sonic S2S 처리
    const response = await processVoiceWithNovaSonic(audioData);
    ws.send(response);
  });
});
```

### Phase 3: 프론트엔드 개발 (2-3주)

#### 3.1 React 애플리케이션 구조
```
src/
├── components/
│   ├── ImageViewer/         # 이미지 표시 컴포넌트
│   ├── VoiceRecorder/       # 음성 녹음 컴포넌트
│   ├── FeedbackPanel/       # AI 피드백 표시
│   └── ProgressTracker/     # 학습 진도 추적
├── pages/
│   ├── Login/              # 로그인 페이지
│   ├── Dashboard/          # 대시보드
│   └── StudySession/       # 학습 세션
├── services/
│   ├── api.js             # API 클라이언트
│   ├── auth.js            # Cognito 인증
│   └── websocket.js       # 실시간 통신
└── hooks/
    ├── useVoiceRecording.js
    ├── useStudySession.js
    └── useProgress.js
```

#### 3.2 핵심 컴포넌트 구현
```jsx
// 음성 녹음 및 실시간 피드백
const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState('');
  
  const startRecording = async () => {
    // 음성 녹음 시작
    // Nova Sonic S2S 실시간 처리
  };
  
  return (
    <div>
      <button onClick={startRecording}>
        {isRecording ? 'Stop' : 'Start'} Recording
      </button>
      <div>{feedback}</div>
    </div>
  );
};
```

### Phase 4: AI 서비스 통합 (1-2주)

#### 4.1 Nova Sonic (S2S) 통합
```javascript
// 실시간 음성 대화 처리
const processVoiceWithNovaSonic = async (audioStream) => {
  const params = {
    modelId: 'amazon.nova-sonic-v1:0',
    contentType: 'audio/wav',
    body: audioStream
  };
  
  const response = await bedrockClient.invokeModelWithResponseStream(params);
  return response.body;
};
```

#### 4.2 Claude 4.0 텍스트 분석
```javascript
// 영어 설명 문법 및 어휘 분석
const analyzeDescriptionWithClaude = async (description) => {
  const prompt = `
    Analyze this English description for grammar, vocabulary, and fluency:
    "${description}"
    
    Provide feedback on:
    1. Grammar errors
    2. Vocabulary improvements
    3. Fluency suggestions
  `;
  
  const response = await claudeClient.invokeModel({
    modelId: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      messages: [{ role: 'user', content: prompt }]
    })
  });
  
  return JSON.parse(response.body);
};
```

#### 4.3 Nova Canvas 이미지 생성
```javascript
// 커스텀 학습 이미지 생성
const generateImageWithNovaCanvas = async (prompt) => {
  const response = await bedrockClient.invokeModel({
    modelId: 'amazon.nova-canvas-v1:0',
    body: JSON.stringify({
      taskType: 'TEXT_IMAGE',
      textToImageParams: {
        text: prompt,
        images: []
      },
      imageGenerationConfig: {
        numberOfImages: 1,
        height: 512,
        width: 512
      }
    })
  });
  
  return response.body;
};
```

### Phase 5: CI/CD 파이프라인 구축 (1주)

#### 5.1 GitHub Actions 워크플로우
```yaml
# .github/workflows/deploy.yml
name: Deploy to AWS
on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker Image
        run: |
          docker build -t nova-english-api .
          
      - name: Push to ECR
        run: |
          aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_URI
          docker tag nova-english-api:latest $ECR_URI:latest
          docker push $ECR_URI:latest
          
      - name: Deploy to ECS
        run: |
          aws ecs update-service --cluster nova-cluster --service nova-api --force-new-deployment
```

#### 5.2 CodeBuild 설정
```yaml
# buildspec.yml
version: 0.2
phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com
  build:
    commands:
      - echo Build started on `date`
      - echo Building the Docker image...
      - docker build -t $IMAGE_REPO_NAME:$IMAGE_TAG .
      - docker tag $IMAGE_REPO_NAME:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG
  post_build:
    commands:
      - echo Build completed on `date`
      - echo Pushing the Docker image...
      - docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG
```

## 📊 예상 비용 (월간)

| 서비스 | 예상 비용 | 설명 |
|--------|----------|------|
| ECS Fargate | $30 | 0.25 vCPU, 0.5GB RAM |
| ALB | $16 | 기본 요금 |
| CloudFront | $5 | 1TB 전송량 |
| S3 | $10 | 100GB 저장 + 요청 |
| DynamoDB | $15 | 온디맨드 모드 |
| Cognito | $5 | 10,000 MAU |
| Bedrock (Nova Sonic) | $50 | API 호출량 기준 |
| Bedrock (Claude 4.0) | $30 | 텍스트 분석 |
| Bedrock (Nova Canvas) | $20 | 이미지 생성 |
| **총 예상 비용** | **$181/월** | |

## 🔧 환경 변수 설정

```bash
# .env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Cognito
COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxx

# DynamoDB
DYNAMODB_USERS_TABLE=nova-users
DYNAMODB_SESSIONS_TABLE=nova-sessions
DYNAMODB_PROGRESS_TABLE=nova-progress

# S3
S3_IMAGES_BUCKET=nova-learning-images
S3_AUDIO_BUCKET=nova-audio-files

# Bedrock
BEDROCK_NOVA_SONIC_MODEL_ID=amazon.nova-sonic-v1:0
BEDROCK_CLAUDE_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
BEDROCK_NOVA_CANVAS_MODEL_ID=amazon.nova-canvas-v1:0
```

## 🚦 성공 지표

1. **기술적 지표**
   - API 응답 시간 < 500ms
   - 음성 처리 지연 시간 < 2초
   - 시스템 가용성 > 99.5%

2. **사용자 경험 지표**
   - 학습 세션 완료율 > 80%
   - 사용자 만족도 > 4.0/5.0
   - 일일 활성 사용자 증가율

3. **비즈니스 지표**
   - 월간 활성 사용자 1,000명
   - 사용자 유지율 > 60%
   - 평균 학습 시간 > 15분/세션

이 구현 계획을 통해 AWS Nova Sonic을 활용한 혁신적인 이미지 기반 영어 학습 플랫폼을 구축할 수 있습니다.