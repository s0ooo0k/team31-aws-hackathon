# 시스템 아키텍처

## 1. 전체 아키텍처 개요

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Lambda        │
│   (React)       │◄──►│                 │◄──►│   Functions     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                       ┌─────────────────┐             │
                       │   Amazon Nova   │◄────────────┤
                       │   (Bedrock)     │             │
                       └─────────────────┘             │
                                                        │
                       ┌─────────────────┐             │
                       │   DynamoDB      │◄────────────┘
                       │                 │
                       └─────────────────┘
```

## 2. 컴포넌트별 상세 설계

### 2.1 Frontend (React + TypeScript)

#### 주요 컴포넌트
- **GameBoard**: 메인 게임 화면
- **ImageDisplay**: Nova 생성 이미지 표시
- **ChatInterface**: 대화형 인터페이스
- **ScorePanel**: 점수 및 피드백 표시
- **UserProfile**: 사용자 프로필 및 진도

#### 상태 관리
```typescript
interface GameState {
  currentImage: string;
  conversation: Message[];
  score: number;
  userProgress: UserProgress;
}
```

### 2.2 Backend (AWS Lambda)

#### 핵심 Lambda 함수들

##### 2.2.1 이미지 생성 함수
```
generateImage/
├── handler.ts          # Nova 이미지 생성 로직
├── prompts.ts         # 이미지 생성 프롬프트 템플릿
└── validation.ts      # 입력 검증
```

##### 2.2.2 대화 처리 함수
```
processConversation/
├── handler.ts         # Nova Sonic 대화 처리
├── context.ts         # 대화 컨텍스트 관리
└── scoring.ts         # 응답 점수 계산
```

##### 2.2.3 사용자 데이터 함수
```
userData/
├── handler.ts         # 사용자 데이터 CRUD
├── analytics.ts       # 학습 분석
└── personalization.ts # 개인화 로직
```

### 2.3 데이터베이스 (DynamoDB)

#### 테이블 설계

##### Users 테이블
```json
{
  "userId": "string",
  "email": "string",
  "level": "number",
  "totalScore": "number",
  "createdAt": "timestamp",
  "lastActive": "timestamp"
}
```

##### GameSessions 테이블
```json
{
  "sessionId": "string",
  "userId": "string",
  "imageUrl": "string",
  "correctScript": "string",
  "userResponses": "array",
  "finalScore": "number",
  "feedback": "string",
  "createdAt": "timestamp"
}
```

##### UserProgress 테이블
```json
{
  "userId": "string",
  "completedLevels": "array",
  "strengths": "array",
  "weaknesses": "array",
  "preferences": "object",
  "updatedAt": "timestamp"
}
```

## 3. API 설계

### 3.1 RESTful API 엔드포인트

```
POST /api/game/start
- 새 게임 세션 시작
- 이미지 생성 및 정답 스크립트 생성

POST /api/conversation/message
- 사용자 메시지 처리
- Nova Sonic 응답 생성

GET /api/user/progress
- 사용자 학습 진도 조회

POST /api/game/submit
- 게임 결과 제출 및 점수 계산
```

### 3.2 WebSocket (실시간 대화)

```
ws://api.domain.com/chat
- 실시간 대화 연결
- 즉시 응답 및 피드백
```

## 4. Amazon Nova 통합

### 4.1 이미지 생성 워크플로우

```typescript
// 이미지 생성 프롬프트 예시
const imagePrompts = {
  beginner: "A simple scene with a red car in front of a house",
  intermediate: "A busy street scene with multiple vehicles and people",
  advanced: "A complex urban intersection during rush hour"
};
```

### 4.2 대화 시스템 워크플로우

```typescript
// Nova Sonic 대화 컨텍스트
interface ConversationContext {
  imageDescription: string;
  userLevel: string;
  previousMessages: Message[];
  learningObjectives: string[];
}
```

## 5. 보안 및 인증

### 5.1 인증 시스템
- AWS Cognito를 통한 사용자 인증
- JWT 토큰 기반 세션 관리
- 소셜 로그인 지원 (Google, Facebook)

### 5.2 API 보안
- API Gateway에서 Rate Limiting
- Lambda 함수별 IAM 역할 분리
- 민감 데이터 암호화 (KMS)

## 6. 모니터링 및 로깅

### 6.1 CloudWatch 메트릭
- Lambda 함수 실행 시간
- API Gateway 요청 수
- DynamoDB 읽기/쓰기 용량
- Nova API 호출 횟수

### 6.2 로깅 전략
- 구조화된 JSON 로그
- 사용자 행동 추적
- 에러 및 예외 상황 로깅

## 7. 배포 및 CI/CD

### 7.1 인프라 as 코드 (AWS CDK)
```typescript
// CDK 스택 구조
├── NetworkStack      # VPC, 서브넷
├── DatabaseStack     # DynamoDB 테이블
├── ApiStack         # API Gateway, Lambda
├── FrontendStack    # Amplify 호스팅
└── MonitoringStack  # CloudWatch, 알람
```

### 7.2 배포 파이프라인
```
GitHub → CodeBuild → CDK Deploy → Amplify
```

## 8. 성능 최적화

### 8.1 캐싱 전략
- CloudFront를 통한 정적 자산 캐싱
- DynamoDB DAX를 통한 데이터 캐싱
- Lambda 함수 웜업 전략

### 8.2 비용 최적화
- Lambda 함수 메모리 최적화
- DynamoDB On-Demand 모드 활용
- S3 Intelligent Tiering