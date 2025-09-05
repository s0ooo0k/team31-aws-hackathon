# Nova 영어 학습 서비스 개발 가이드

**작성자**: Developer Agent + CloudOps Agent  
**작성일**: 2025년 1월  
**버전**: 1.0

---

## 1. 개발 환경 설정

### 1.1 필수 도구 설치

#### Node.js 환경
```bash
# Node.js 18.x LTS 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 또는 nvm 사용
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### AWS CLI 설정
```bash
# AWS CLI v2 설치
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# 자격증명 설정
aws configure
# AWS Access Key ID: [your-access-key]
# AWS Secret Access Key: [your-secret-key]
# Default region name: us-east-1
# Default output format: json
```

#### 개발 도구
```bash
# Git 설정
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# VS Code 확장 프로그램
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-eslint
code --install-extension amazonwebservices.aws-toolkit-vscode
```

### 1.2 프로젝트 클론 및 설정

```bash
# 저장소 클론
git clone https://github.com/s0ooo0k/team31_0905.git
cd team31_0905

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
```

### 1.3 환경 변수 설정

#### .env 파일 구성
```bash
# AWS 설정
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=123456789012
AWS_PROFILE=default

# Amazon Bedrock Nova 설정
BEDROCK_REGION=us-east-1
NOVA_IMAGE_MODEL_ID=amazon.nova-canvas-v1:0
NOVA_TEXT_MODEL_ID=amazon.nova-pro-v1:0
NOVA_SONIC_MODEL_ID=amazon.nova-micro-v1:0

# 데이터베이스 설정
DYNAMODB_TABLE_PREFIX=nova-english-dev-
DYNAMODB_ENDPOINT=https://dynamodb.us-east-1.amazonaws.com

# API 설정
API_GATEWAY_STAGE=dev
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# S3 설정
S3_BUCKET_NAME=nova-english-dev-bucket
S3_REGION=us-east-1

# 개발 환경 설정
NODE_ENV=development
PORT=3001
LOG_LEVEL=debug
```

---

## 2. 프로젝트 구조

### 2.1 디렉토리 구조
```
nova-english-learning/
├── frontend/                 # React 애플리케이션
│   ├── src/
│   │   ├── components/       # 재사용 가능한 컴포넌트
│   │   ├── pages/           # 페이지 컴포넌트
│   │   ├── hooks/           # 커스텀 훅
│   │   ├── services/        # API 서비스
│   │   ├── utils/           # 유틸리티 함수
│   │   └── types/           # TypeScript 타입 정의
│   ├── public/              # 정적 파일
│   └── package.json
├── backend/                 # Express 서버 (개발용)
│   ├── src/
│   │   ├── routes/          # API 라우트
│   │   ├── middleware/      # 미들웨어
│   │   ├── services/        # 비즈니스 로직
│   │   └── utils/           # 유틸리티
│   └── package.json
├── lambda/                  # AWS Lambda 함수들
│   ├── auth/               # 인증 관련 함수
│   ├── learning/           # 학습 관련 함수
│   ├── content/            # 콘텐츠 관리 함수
│   └── shared/             # 공통 라이브러리
├── infrastructure/         # AWS CDK 코드
│   ├── lib/                # CDK 스택 정의
│   ├── bin/                # CDK 앱 진입점
│   └── config/             # 환경별 설정
├── docs/                   # 프로젝트 문서
└── scripts/                # 빌드/배포 스크립트
```

### 2.2 주요 파일 설명
```bash
# 프론트엔드 진입점
frontend/src/index.tsx        # React 앱 진입점
frontend/src/App.tsx          # 메인 앱 컴포넌트
frontend/src/router.tsx       # 라우팅 설정

# 백엔드 진입점
backend/src/server.ts         # Express 서버
backend/src/app.ts           # 앱 설정

# Lambda 함수
lambda/auth/handler.ts        # 인증 처리
lambda/learning/handler.ts    # 학습 세션 처리
lambda/content/handler.ts     # 콘텐츠 관리

# 인프라 코드
infrastructure/bin/app.ts     # CDK 앱
infrastructure/lib/nova-stack.ts  # 메인 스택
```

---

## 3. 코딩 컨벤션

### 3.1 TypeScript 스타일 가이드

#### 네이밍 컨벤션
```typescript
// 변수, 함수: camelCase
const userName = 'john';
const getUserProfile = () => {};

// 상수: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.nova-english.com';
const MAX_RETRY_COUNT = 3;

// 클래스, 인터페이스: PascalCase
class UserService {}
interface ApiResponse {}

// 타입: PascalCase with 'T' prefix (optional)
type TUserData = {
  id: string;
  name: string;
};

// 컴포넌트: PascalCase
const VoiceRecorder = () => {};
```

#### 파일 네이밍
```bash
# 컴포넌트: PascalCase
VoiceRecorder.tsx
UserProfile.tsx

# 훅: camelCase with 'use' prefix
useAudioRecorder.ts
useUserAuth.ts

# 서비스: camelCase with service suffix
userService.ts
audioService.ts

# 유틸리티: camelCase
formatTime.ts
validateEmail.ts

# 타입 정의: camelCase with .types suffix
user.types.ts
api.types.ts
```

### 3.2 코드 포맷팅

#### Prettier 설정 (.prettierrc)
```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
```

#### ESLint 설정 (.eslintrc.js)
```javascript
module.exports = {
  extends: [
    '@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended'
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off'
  }
};
```

### 3.3 Git 커밋 컨벤션

#### 커밋 메시지 형식
```bash
<type>(<scope>): <subject>

<body>

<footer>
```

#### 커밋 타입
```bash
feat:     새로운 기능 추가
fix:      버그 수정
docs:     문서 수정
style:    코드 포맷팅, 세미콜론 누락 등
refactor: 코드 리팩토링
test:     테스트 코드 추가/수정
chore:    빌드 프로세스, 도구 설정 등

# 예시
feat(auth): add social login functionality
fix(audio): resolve recording permission issue
docs(api): update authentication endpoints
```

---

## 4. 로컬 개발 환경

### 4.1 프론트엔드 개발

#### 개발 서버 실행
```bash
cd frontend
npm install
npm start

# 브라우저에서 http://localhost:3000 접속
```

#### 주요 스크립트
```bash
npm start          # 개발 서버 시작
npm run build      # 프로덕션 빌드
npm test           # 테스트 실행
npm run lint       # ESLint 검사
npm run format     # Prettier 포맷팅
```

#### 환경별 설정
```bash
# .env.development
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENV=development

# .env.production
REACT_APP_API_URL=https://api.nova-english.com/v1
REACT_APP_ENV=production
```

### 4.2 백엔드 개발

#### 개발 서버 실행
```bash
cd backend
npm install
npm run dev

# 서버가 http://localhost:3001에서 실행됨
```

#### 주요 스크립트
```bash
npm run dev        # 개발 서버 (nodemon)
npm run build      # TypeScript 컴파일
npm start          # 프로덕션 서버
npm test           # 테스트 실행
npm run test:watch # 테스트 감시 모드
```

### 4.3 Lambda 함수 로컬 테스트

#### SAM CLI 설치 및 사용
```bash
# SAM CLI 설치
pip install aws-sam-cli

# Lambda 함수 로컬 실행
cd lambda
sam local start-api --port 3002

# 특정 함수 테스트
sam local invoke AuthFunction --event events/login.json
```

#### 로컬 DynamoDB 설정
```bash
# DynamoDB Local 실행
docker run -p 8000:8000 amazon/dynamodb-local

# 테이블 생성 스크립트
aws dynamodb create-table \
  --table-name nova-english-dev-users \
  --attribute-definitions AttributeName=userId,AttributeType=S \
  --key-schema AttributeName=userId,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --endpoint-url http://localhost:8000
```

---

## 5. 테스트 가이드

### 5.1 테스트 구조
```
tests/
├── unit/           # 단위 테스트
├── integration/    # 통합 테스트
├── e2e/           # E2E 테스트
└── fixtures/      # 테스트 데이터
```

### 5.2 단위 테스트 (Jest)

#### 컴포넌트 테스트
```typescript
// VoiceRecorder.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import VoiceRecorder from './VoiceRecorder';

describe('VoiceRecorder', () => {
  test('renders record button', () => {
    render(<VoiceRecorder onRecordingComplete={jest.fn()} />);
    expect(screen.getByText('녹음 시작')).toBeInTheDocument();
  });

  test('starts recording on button click', () => {
    const mockOnComplete = jest.fn();
    render(<VoiceRecorder onRecordingComplete={mockOnComplete} />);
    
    fireEvent.click(screen.getByText('녹음 시작'));
    expect(screen.getByText('녹음 중지')).toBeInTheDocument();
  });
});
```

#### 서비스 테스트
```typescript
// userService.test.ts
import { userService } from './userService';

describe('UserService', () => {
  test('should fetch user profile', async () => {
    const mockUser = { id: '123', name: 'Test User' };
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue({ data: mockUser })
    } as any);

    const result = await userService.getProfile('123');
    expect(result).toEqual(mockUser);
  });
});
```

### 5.3 통합 테스트

#### API 테스트
```typescript
// auth.integration.test.ts
import request from 'supertest';
import app from '../src/app';

describe('Auth API', () => {
  test('POST /auth/login should return token', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body.data.accessToken).toBeDefined();
  });
});
```

### 5.4 E2E 테스트 (Playwright)

#### 설치 및 설정
```bash
npm install @playwright/test
npx playwright install
```

#### E2E 테스트 예시
```typescript
// login.e2e.test.ts
import { test, expect } from '@playwright/test';

test('user can login and access dashboard', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  await page.click('[data-testid="login-button"]');
  await page.fill('[data-testid="email-input"]', 'test@example.com');
  await page.fill('[data-testid="password-input"]', 'password123');
  await page.click('[data-testid="submit-button"]');
  
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('[data-testid="welcome-message"]')).toBeVisible();
});
```

---

## 6. 배포 및 CI/CD (CloudOps 작성)

### 6.1 개발 환경 배포

#### AWS CDK 배포
```bash
# CDK 설치
npm install -g aws-cdk

# 프로젝트 초기화
cd infrastructure
npm install
cdk bootstrap

# 개발 환경 배포
cdk deploy NovaEnglishDevStack
```

#### 환경별 배포 스크립트
```bash
# scripts/deploy-dev.sh
#!/bin/bash
set -e

echo "🚀 Deploying to Development Environment"

# 프론트엔드 빌드
cd frontend
npm run build
aws s3 sync build/ s3://nova-english-dev-frontend --delete

# Lambda 함수 배포
cd ../lambda
sam build
sam deploy --config-env dev

# CDK 스택 업데이트
cd ../infrastructure
cdk deploy NovaEnglishDevStack --require-approval never

echo "✅ Development deployment completed"
```

### 6.2 CI/CD 파이프라인

#### GitHub Actions 워크플로우
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd frontend && npm ci
          cd ../backend && npm ci
      
      - name: Run tests
        run: |
          cd frontend && npm test -- --coverage
          cd ../backend && npm test
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  deploy-dev:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
      - uses: actions/checkout@v3
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy to Development
        run: ./scripts/deploy-dev.sh

  deploy-prod:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy to Production
        run: ./scripts/deploy-prod.sh
```

### 6.3 모니터링 및 로깅

#### CloudWatch 대시보드 설정
```typescript
// infrastructure/lib/monitoring-stack.ts
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

export class MonitoringStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const dashboard = new cloudwatch.Dashboard(this, 'NovaEnglishDashboard', {
      dashboardName: 'nova-english-metrics'
    });

    // Lambda 메트릭
    dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'Lambda Invocations',
        left: [
          new cloudwatch.Metric({
            namespace: 'AWS/Lambda',
            metricName: 'Invocations',
            dimensionsMap: {
              FunctionName: 'nova-english-auth'
            }
          })
        ]
      })
    );
  }
}
```

#### 로그 집계 설정
```bash
# CloudWatch Logs Insights 쿼리 예시
fields @timestamp, @message
| filter @message like /ERROR/
| sort @timestamp desc
| limit 100
```

---

## 7. 디버깅 가이드

### 7.1 일반적인 문제 해결

#### CORS 오류
```typescript
// backend/src/middleware/cors.ts
import cors from 'cors';

const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

export const corsMiddleware = cors(corsOptions);
```

#### AWS 권한 오류
```bash
# IAM 정책 확인
aws iam get-role-policy --role-name lambda-execution-role --policy-name bedrock-access

# CloudTrail 로그 확인
aws logs filter-log-events \
  --log-group-name /aws/lambda/nova-english-auth \
  --filter-pattern "ERROR"
```

### 7.2 성능 최적화

#### React 컴포넌트 최적화
```typescript
import { memo, useMemo, useCallback } from 'react';

const VoiceRecorder = memo(({ onRecordingComplete }) => {
  const audioConfig = useMemo(() => ({
    sampleRate: 16000,
    channels: 1
  }), []);

  const handleRecording = useCallback((audioBlob) => {
    onRecordingComplete(audioBlob);
  }, [onRecordingComplete]);

  return (
    // 컴포넌트 JSX
  );
});
```

#### Lambda 콜드 스타트 최적화
```typescript
// Lambda 함수 외부에서 초기화
const dynamoClient = new DynamoDBClient({ region: 'us-east-1' });
const bedrockClient = new BedrockRuntimeClient({ region: 'us-east-1' });

export const handler = async (event: APIGatewayProxyEvent) => {
  // 핸들러 로직
};
```

---

## 8. 보안 가이드

### 8.1 환경 변수 관리
```bash
# AWS Systems Manager Parameter Store 사용
aws ssm put-parameter \
  --name "/nova-english/dev/jwt-secret" \
  --value "your-secret-key" \
  --type "SecureString"

# Lambda에서 사용
const jwtSecret = await ssm.getParameter({
  Name: '/nova-english/dev/jwt-secret',
  WithDecryption: true
}).promise();
```

### 8.2 입력 검증
```typescript
// 입력 검증 미들웨어
import Joi from 'joi';

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
```

### 8.3 JWT 토큰 관리
```typescript
import jwt from 'jsonwebtoken';

export const generateToken = (userId: string) => {
  return jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
};
```

---

## 9. 문제 해결 FAQ

### 9.1 개발 환경 문제

**Q: npm install 시 권한 오류가 발생합니다.**
```bash
# 해결방법
sudo chown -R $(whoami) ~/.npm
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Q: AWS CLI 자격증명 오류가 발생합니다.**
```bash
# 자격증명 확인
aws sts get-caller-identity

# 프로파일 설정
aws configure --profile nova-english
export AWS_PROFILE=nova-english
```

### 9.2 빌드 및 배포 문제

**Q: TypeScript 컴파일 오류가 발생합니다.**
```bash
# 타입 정의 설치
npm install --save-dev @types/node @types/react

# tsconfig.json 확인
{
  "compilerOptions": {
    "target": "es2020",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  }
}
```

**Q: Lambda 배포 시 패키지 크기 오류가 발생합니다.**
```bash
# 불필요한 의존성 제거
npm prune --production

# webpack으로 번들링
npm install --save-dev webpack webpack-cli
```

---

## 10. 추가 리소스

### 10.1 유용한 도구
- **Postman**: API 테스트
- **AWS Toolkit**: VS Code AWS 통합
- **React DevTools**: React 디버깅
- **Redux DevTools**: 상태 관리 디버깅

### 10.2 참고 문서
- [React 공식 문서](https://reactjs.org/docs)
- [AWS CDK 가이드](https://docs.aws.amazon.com/cdk/)
- [Amazon Bedrock 문서](https://docs.aws.amazon.com/bedrock/)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)

### 10.3 팀 커뮤니케이션
- **Slack**: #nova-english-dev 채널
- **GitHub Issues**: 버그 리포트 및 기능 요청
- **Weekly Standup**: 매주 월요일 10:00 AM

---

**문서 승인**: ProjectLead Agent 검토 필요  
**다음 문서**: 프롬프트 모음 작성