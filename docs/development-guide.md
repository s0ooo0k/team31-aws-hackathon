# 개발 가이드

## 1. 개발 환경 설정

### 1.1 필수 도구 설치

```bash
# Node.js 18+ 설치 확인
node --version

# AWS CLI 설치 및 구성
aws configure

# AWS CDK 설치
npm install -g aws-cdk

# 프로젝트 의존성 설치
npm install
```

### 1.2 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env
```

```env
# AWS 설정
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=123456789012

# Nova API 설정
BEDROCK_REGION=us-east-1
NOVA_MODEL_ID=amazon.nova-canvas-v1:0

# 데이터베이스
DYNAMODB_TABLE_PREFIX=nova-english-

# 기타 설정
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:3000
```

## 2. Q Developer 활용 전략

### 2.1 개발 워크플로우

#### Step 1: 기능 분석
```
Q Developer에게 다음과 같이 요청:
"[기능명]을 구현하기 위한 코드 구조와 필요한 파일들을 분석해주세요"
```

#### Step 2: 코드 생성
```
"다음 요구사항에 맞는 [컴포넌트/함수]를 TypeScript로 생성해주세요:
- 요구사항 1
- 요구사항 2
- 에러 핸들링 포함"
```

#### Step 3: 코드 리뷰
```
"다음 코드를 리뷰하고 개선점을 제시해주세요:
[코드 첨부]"
```

#### Step 4: 테스트 작성
```
"다음 함수에 대한 Jest 테스트를 작성해주세요:
[함수 코드 첨부]"
```

### 2.2 효과적인 프롬프트 작성법

#### 구체적인 요구사항 명시
```
❌ 나쁜 예: "이미지 생성 함수 만들어줘"
✅ 좋은 예: "Amazon Nova를 사용해서 영어 학습용 이미지를 생성하는 Lambda 함수를 TypeScript로 만들어주세요. 난이도별 프롬프트 템플릿과 에러 핸들링을 포함해주세요."
```

#### 컨텍스트 제공
```
"현재 프로젝트는 Nova를 활용한 영어 학습 게임입니다. 
사용자가 이미지를 보고 영어로 설명하면 AI가 질문을 통해 대화를 유도하는 시스템입니다.
이 컨텍스트에서 [구체적 요청]을 구현해주세요."
```

## 3. 코드 구조 및 컨벤션

### 3.1 프로젝트 구조

```
nova-english-learning/
├── frontend/
│   ├── src/
│   │   ├── components/     # 재사용 가능한 컴포넌트
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── hooks/         # 커스텀 훅
│   │   ├── services/      # API 호출 로직
│   │   ├── types/         # TypeScript 타입 정의
│   │   └── utils/         # 유틸리티 함수
│   ├── public/
│   └── package.json
├── backend/
│   ├── lambda/
│   │   ├── generateImage/ # 이미지 생성 함수
│   │   ├── conversation/  # 대화 처리 함수
│   │   └── userData/      # 사용자 데이터 함수
│   └── shared/           # 공통 라이브러리
├── infrastructure/
│   ├── lib/
│   │   ├── api-stack.ts   # API Gateway + Lambda
│   │   ├── database-stack.ts # DynamoDB
│   │   └── frontend-stack.ts # Amplify
│   └── bin/
└── docs/
```

### 3.2 네이밍 컨벤션

#### 파일명
- 컴포넌트: PascalCase (GameBoard.tsx)
- 훅: camelCase (useGameState.ts)
- 유틸리티: camelCase (imageUtils.ts)
- 타입: PascalCase (GameTypes.ts)

#### 변수명
```typescript
// 상수: UPPER_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// 변수/함수: camelCase
const userName = 'john';
const generateImage = () => {};

// 타입/인터페이스: PascalCase
interface GameSession {
  id: string;
  userId: string;
}

// 컴포넌트: PascalCase
const GameBoard: React.FC = () => {};
```

### 3.3 코드 스타일

#### TypeScript 설정
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

#### ESLint 규칙
```json
{
  "extends": [
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "no-console": "warn",
    "prefer-const": "error",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

## 4. 개발 단계별 가이드

### 4.1 Phase 1: 기반 구조 (1주차)

#### Day 1-2: 프로젝트 셋업
```bash
# Q Developer 프롬프트
"React + TypeScript + Vite 프로젝트를 생성하고 다음 라이브러리를 설정해주세요:
- TailwindCSS
- React Router
- Axios
- React Query
기본 폴더 구조도 함께 생성해주세요."
```

#### Day 3-4: AWS 인프라
```bash
# Q Developer 프롬프트
"AWS CDK로 다음 인프라를 구성해주세요:
- API Gateway
- Lambda 함수 (generateImage, conversation, userData)
- DynamoDB 테이블
- IAM 역할 및 정책
TypeScript로 작성하고 환경별 분리해주세요."
```

#### Day 5-7: 기본 UI
```bash
# Q Developer 프롬프트
"게임 메인 화면의 기본 레이아웃을 React + TailwindCSS로 만들어주세요:
- 헤더 (로고, 사용자 정보)
- 이미지 표시 영역
- 대화 인터페이스
- 점수 패널
반응형 디자인으로 구성해주세요."
```

### 4.2 Phase 2: 핵심 기능 (2주차)

#### Nova 이미지 생성 연동
```typescript
// Q Developer 프롬프트 예시
"Amazon Bedrock Nova를 사용해서 이미지를 생성하는 Lambda 함수를 만들어주세요.
다음 기능을 포함해주세요:
- 난이도별 프롬프트 템플릿
- S3에 이미지 저장
- 정답 스크립트 생성
- 에러 핸들링 및 재시도"
```

#### 대화 시스템 구현
```typescript
// Q Developer 프롬프트 예시
"Nova Sonic을 활용한 대화 시스템을 구현해주세요:
- 사용자 입력 분석
- 컨텍스트 기반 질문 생성
- 대화 히스토리 관리
- 실시간 응답 처리"
```

### 4.3 Phase 3: 고도화 (3주차)

#### 점수 시스템
```typescript
// Q Developer 프롬프트 예시
"사용자 응답을 분석하여 점수를 계산하는 시스템을 만들어주세요:
- 문법 정확도 분석
- 어휘 적절성 평가
- 표현 자연스러움 측정
- 종합 점수 및 피드백 생성"
```

#### 개인화 기능
```typescript
// Q Developer 프롬프트 예시
"사용자 학습 데이터를 분석하여 개인화된 학습 경험을 제공하는 시스템을 구현해주세요:
- 학습 패턴 분석
- 강점/약점 식별
- 맞춤형 콘텐츠 추천
- 진도 추적"
```

### 4.4 Phase 4: 최적화 및 배포 (4주차)

#### 성능 최적화
```bash
# Q Developer 프롬프트
"다음 코드들의 성능을 최적화해주세요:
[코드 첨부]
- Lambda 콜드 스타트 개선
- React 렌더링 최적화
- 데이터베이스 쿼리 최적화
- 캐싱 전략 적용"
```

#### 배포 자동화
```bash
# Q Developer 프롬프트
"GitHub Actions를 사용한 CI/CD 파이프라인을 구성해주세요:
- 코드 품질 검사
- 테스트 실행
- 보안 스캔
- 자동 배포
환경별 배포 전략도 포함해주세요."
```

## 5. 테스트 전략

### 5.1 단위 테스트

#### Lambda 함수 테스트
```typescript
// Q Developer 프롬프트
"다음 Lambda 함수에 대한 Jest 테스트를 작성해주세요:
[함수 코드 첨부]
- 정상 케이스
- 에러 케이스
- 모킹 처리
- 커버리지 90% 이상"
```

#### React 컴포넌트 테스트
```typescript
// Q Developer 프롬프트
"다음 React 컴포넌트에 대한 테스트를 React Testing Library로 작성해주세요:
[컴포넌트 코드 첨부]
- 렌더링 테스트
- 사용자 상호작용
- 상태 변화
- 프롭스 전달"
```

### 5.2 통합 테스트

#### API 통합 테스트
```typescript
// Q Developer 프롬프트
"전체 게임 플로우에 대한 통합 테스트를 작성해주세요:
- 게임 시작부터 완료까지
- Nova API 모킹
- 데이터베이스 테스트 환경
- 에러 시나리오"
```

## 6. 문제 해결 가이드

### 6.1 일반적인 이슈

#### Nova API 연동 문제
1. IAM 권한 확인
2. API 호출 형식 검증
3. 요청 제한 확인
4. 네트워크 연결 문제

#### DynamoDB 성능 이슈
1. 인덱스 최적화
2. 파티션 키 설계
3. 쿼리 패턴 개선
4. 캐싱 전략

### 6.2 Q Developer 활용 팁

#### 효과적인 디버깅
```
"다음 에러가 발생했습니다:
[에러 메시지 및 스택 트레이스]
[관련 코드]
원인을 분석하고 해결 방법을 제시해주세요."
```

#### 코드 리팩토링
```
"다음 코드를 더 깔끔하고 유지보수하기 쉽게 리팩토링해주세요:
[기존 코드]
- 가독성 개선
- 성능 최적화
- 타입 안전성 강화"
```

## 7. 배포 및 운영

### 7.1 환경별 배포

#### 개발 환경
```bash
npm run deploy:dev
```

#### 스테이징 환경
```bash
npm run deploy:staging
```

#### 프로덕션 환경
```bash
npm run deploy:prod
```

### 7.2 모니터링

#### CloudWatch 대시보드 설정
- Lambda 함수 메트릭
- API Gateway 메트릭
- DynamoDB 메트릭
- 사용자 활동 지표

#### 알람 설정
- 에러율 임계값 초과
- 응답 시간 지연
- 비용 임계값 초과

## 8. 유지보수 가이드

### 8.1 정기 점검 항목

#### 주간 점검
- 시스템 성능 지표 확인
- 에러 로그 분석
- 사용자 피드백 검토

#### 월간 점검
- 비용 분석 및 최적화
- 보안 업데이트 적용
- 성능 벤치마크 측정

### 8.2 업데이트 전략

#### 기능 업데이트
1. 개발 환경에서 테스트
2. 스테이징 환경 배포
3. 사용자 테스트 진행
4. 프로덕션 배포

#### 보안 업데이트
1. 즉시 적용 필요성 평가
2. 긴급 패치 배포
3. 전체 시스템 점검