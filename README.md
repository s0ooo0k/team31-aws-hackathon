
# SPEEK-SEE-PIC : Amazon Nova Family 활용한 Gen AI 기반 실시간 영어 스트리밍 회화 학습 서비스

SPEEK-SEE-PIC은 Amazon Nova Family(Nova Sonic, Nova Pro, Nova Canvas)를 활용한 실시간 AI 양방향 스트리밍 대화형 영어 학습 플랫폼입니다. WebSocket 기반 실시간 통신과 이미지 기반 상황 서술 학습을 통해 자연스러운 영어 회화 연습이 가능한 웹 애플리케이션입니다.

## 어플리케이션 개요

SPEEK-SEE-PIC은 Amazon Nova Family의 강력한 AI 기능들을 종합적으로 활용하여 실시간 영어 학습 경험을 제공합니다.

### 🎯 Nova Family 통합 활용
- **Nova Sonic**: 실시간 음성 대화 및 발음 교정
- **Nova Pro**: 학습 이미지의 구체적인 내용을 자세한 텍스트로 분석 및 설명
- **Nova Canvas**: 사용자가 실시간으로 말하는 내용을 반영한 실시간 이미지 생성

복잡한 설치 과정 없이 웹 브라우저에서 바로 접속하여 AI와 영어 대화를 시작할 수 있습니다.

이 서비스는 Node.js/TypeScript 백엔드와 바닐라 JavaScript 프론트엔드로 구성되어 있으며, AWS ECS Fargate에서 컨테이너로 실행됩니다. 사용자 인증은 Amazon Cognito를 통해 처리되며, 실시간 음성 스트리밍은 Socket.IO를 통해 구현되었습니다.

동물, 소셜, K-POP 등 다양한 상황별 이미지를 Nova Canvas로 생성하여 실제 생활에서 사용할 수 있는 실용적인 영어 표현을 학습할 수 있습니다. Nova Sonic과의 자연스러운 대화를 통해 발음 교정과 실시간 피드백을 받을 수 있습니다.

## 주요 기능

### 🎙️ Nova Sonic 기반 실시간 음성 대화
- **실시간 음성 스트리밍**: WebSocket을 통한 즉시 응답으로 자연스러운 영어 대화
- **발음 교정 및 피드백**: AI가 실시간으로 발음을 분석하고 개선점 제시
- **음성 인식 정확도**: 다양한 억양과 발음 패턴을 정확히 인식

### 🧠 Nova Pro 기반 멀티모달 이미지 분석
- **이미지 내용 텍스트 변환**: 학습 이미지가 어떤 이미지인지 구체적으로 자세한 텍스트로 출력
- **상황 맥락 제공**: 이미지 속 상황, 인물, 배경 등을 상세히 분석하여 대화 주제 제공
- **시각적 요소 설명**: 이미지의 색상, 구도, 객체 등을 영어로 설명하여 어휘 학습 지원

### 🎨 Nova Canvas 기반 실시간 이미지 생성
- **실시간 대화 반영 이미지 생성**: 사용자가 실시간으로 말하는 내용을 반영하여 즉시 이미지로 생성
- **동적 시각화**: 대화 주제와 사용자 발화 내용에 맞는 상황별 이미지를 실시간으로 생성하여 몰입감 증대
- **맥락 연결 학습**: 사용자의 말과 시각적 요소를 연결하여 기억력 향상

### 🔐 통합 시스템 기능
- **사용자 인증 시스템**: Amazon Cognito를 통한 안전한 사용자 인증 및 세션 관리
- **반응형 웹 인터페이스**: 모바일과 데스크톱 모두에서 최적화된 사용자 경험
- **실시간 동기화**: 모든 Nova 모델 간의 seamless한 데이터 연동

## 동영상 데모
![KakaoTalk_Photo_2025-09-06-16-36-26](https://github.com/user-attachments/assets/b8ad6769-890e-41d0-a54a-290d27c93350)
![KakaoTalk_Photo_2025-09-06-16-37-09](https://github.com/user-attachments/assets/128c8b51-65d6-428c-8f98-f2627d5c207b)
![KakaoTalk_Photo_2025-09-06-16-37-38](https://github.com/user-attachments/assets/48bc63a3-d454-408a-ac01-02b57c0dce8a)
![KakaoTalk_Photo_2025-09-06-16-38-12](https://github.com/user-attachments/assets/959f1021-f2be-4193-a3f3-555e79687f1d)

## MCP-Notion을 활용한 프로젝트 관리 및 개발

### 🔗 Notion과 Amazon Q Developer 연동

이 프로젝트는 **MCP-Notion**을 통해 Notion과 Amazon Q Developer를 연동하여 효율적인 프로젝트 관리와 개발을 진행했습니다.

#### 주요 활용 사례
- **팀 아이디에이션**: 분산된 브레인스토밍 내용을 Notion에서 체계적으로 정리
- **R&R 정의**: 팀원별 역할과 책임을 명확히 문서화
- **프로젝트 계획**: 러프한 계획을 구체적인 실행 가능한 로드맵으로 발전
- **IaC 코드 생성**: Notion의 요구사항을 바탕으로 AWS 인프라 코드 자동 생성

#### MCP-Notion 워크플로우
```
Notion 문서 작성 → MCP 연동 → Amazon Q Developer 분석 → 코드/문서 생성
```

### 📋 Notion 기반 프로젝트 문서화

**주요 Notion 페이지 구성**:
- 프로젝트 개요 및 목표
- 팀원 R&R 매트릭스
- 기술 스택 선정 근거
- AWS 아키텍처 설계 문서
- 개발 일정 및 마일스톤
- 이슈 트래킹 및 해결 방안

### 🚀 MCP를 통한 자동화된 개발 프로세스

1. **요구사항 정리**: Notion에서 분산된 아이디어를 구조화
2. **코드 생성**: Amazon Q Developer가 Notion 내용을 분석하여 IaC 템플릿 생성
3. **문서 동기화**: 개발 진행사항을 Notion에 자동 반영
4. **팀 협업**: 실시간으로 업데이트되는 프로젝트 상태 공유

이러한 MCP-Notion 연동을 통해 프로젝트의 일관성을 유지하고, 개발 효율성을 크게 향상시킬 수 있었습니다.

### 🎨 Draw.io MCP를 통한 인프라 시각화 및 개선

#### 인프라 설계 및 개선 워크플로우
```
Draw.io 인프라 도식 → MCP 연동 → Amazon Q 분석 → 개선 제안 → 배포 → 시각화 업데이트
```

#### 주요 활용 과정
1. **초기 설계**: Draw.io로 AWS 인프라 아키텍처 도식 작성
2. **MCP 연동**: Draw.io MCP를 통해 도식을 Amazon Q Developer로 가져오기
3. **AI 기반 분석**: Amazon Q와의 대화를 통한 인프라 구조 분석 및 개선점 도출
4. **최적화 적용**: 제안된 개선사항을 실제 인프라에 배포
5. **결과 시각화**: 배포된 인프라를 다시 Draw.io MCP로 시각화하여 문서 업데이트

#### Draw.io MCP 활용 효과
- **시각적 설계**: 복잡한 AWS 아키텍처를 직관적으로 설계 및 공유
- **실시간 개선**: Amazon Q의 AI 분석을 통한 즉시 최적화 제안
- **문서 자동화**: 배포 후 인프라 변경사항을 자동으로 도식에 반영
- **팀 협업**: 시각화된 인프라 도식을 통한 효율적인 팀 커뮤니케이션

## 기술 스택 및 아키텍처

### 사용된 기술 스택
- **Backend**: Node.js 18, TypeScript, Express.js, Socket.IO
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Container**: Docker, Amazon ECS Fargate
- **Database**: DynamoDB, S3
- **Authentication**: Amazon Cognito User Pool
- **AI Services**: Amazon Nova Family (Nova Sonic, Nova Pro, Nova Canvas)
- **Infrastructure**: AWS CloudFormation, Amazon ECR
- **Real-time Communication**: WebSocket (Socket.IO)
- **CI/CD**: AWS CodeBuild (buildspec.yml)
- **Monitoring**: Amazon CloudWatch

### 시스템 아키텍처 및 데이터 플로우

#### 전체 아키텍처
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              사용자 브라우저                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │   HTML/CSS/JS   │  │   Socket.IO     │  │   Cognito SDK              │  │
│  │   (UI 렌더링)     │  │   (실시간 통신)   │  │   (사용자 인증)              │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS/WSS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Application Load Balancer                          │
│                              (트래픽 분산)                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/WebSocket
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            ECS Fargate 컨테이너                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │   Express.js    │  │   Socket.IO     │  │   Nova Family Client       │  │
│  │   (HTTP 서버)    │  │   (WebSocket)   │  │   (Bedrock SDK)            │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ AWS SDK
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AWS 서비스                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │   Cognito       │  │   Nova Sonic    │  │   CloudWatch               │  │
│  │   (사용자 인증)    │  │   (음성 대화)     │  │   (로그 및 모니터링)          │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │   Nova Pro      │  │   Nova Canvas   │  │   ECR                      │  │
│  │   (이미지 분석)    │  │   (이미지 생성)    │  │   (컨테이너 레지스트리)        │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │   S3            │  │   DynamoDB      │  │   CodeBuild                │  │
│  │   (파일 저장)      │  │   (데이터베이스)   │  │   (CI/CD)                  │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 프로젝트 구조 및 주요 컴포넌트
```
nova-english-learning/
├── backend/                 # Node.js/TypeScript 서버
│   ├── src/
│   │   ├── server.ts        # Express 서버 + Socket.IO 설정
│   │   ├── client.ts        # Nova Family Bedrock 클라이언트
│   │   ├── types.ts         # WebSocket 이벤트 타입 정의
│   │   └── consts.ts        # Nova Family 설정 상수
│   ├── package.json         # 의존성: express, socket.io, @aws-sdk
│   └── tsconfig.json        # TypeScript 컴파일 설정
├── frontend/                # 정적 웹 애플리케이션
│   └── public/
│       ├── css/global.css   # 반응형 스타일시트
│       ├── js/
│       │   ├── AudioPlayer.js          # 음성 재생 처리
│       │   ├── cognito-config.js       # Cognito 인증 설정
│       │   └── ObjectsExt.js          # 유틸리티 함수
│       ├── assets/          # 상황별 학습 이미지 (카페, 공항 등)
│       ├── login.html       # Cognito 로그인 페이지
│       ├── categories.html  # 학습 카테고리 선택
│       ├── study.html       # 실시간 음성 대화 페이지
│       └── evaluation.html  # 학습 결과 평가
├── Dockerfile               # Multi-stage 빌드 설정
├── task-definition.json     # ECS Fargate 태스크 정의
├── cognito-stack.yaml       # Cognito User Pool CloudFormation
└── buildspec.yml           # CodeBuild CI/CD 파이프라인
```

### 핵심 기술 구현
- **실시간 통신**: Socket.IO를 통한 양방향 WebSocket 연결
- **음성 처리**: Web Audio API + Nova Sonic 스트리밍
- **이미지 분석**: Nova Pro를 통한 이미지 내용의 구체적인 텍스트 변환
- **실시간 이미지 생성**: Nova Canvas를 통한 사용자 발화 내용 기반 동적 시각화
- **인증 플로우**: Cognito SDK를 통한 JWT 토큰 기반 인증
- **컨테이너화**: Docker multi-stage build로 최적화된 이미지
- **서버리스 컨테이너**: ECS Fargate로 인프라 관리 없는 배포

## 리소스 배포하기
### 1. 사전 요구 사항
- AWS CLI 설치 및 구성
- Node.js 설치 (>= 18.0)
- Docker 설치
- 적절한 AWS 권한 (ECS, ECR, Cognito, CloudFormation, CodeBuild 관리 권한)

### 2. 프로젝트 설정

```bash
# 저장소 클론
git clone <repository-url>
cd qqq

# 백엔드 의존성 설치
cd nova-english-learning/backend
npm install

# 프론트엔드 의존성 설치
cd ../frontend
npm install
```

### 3. Cognito 사용자 풀 배포

```bash
# CloudFormation으로 Cognito 스택 배포
cd nova-english-learning
aws cloudformation deploy \
  --template-file cognito-stack.yaml \
  --stack-name nova-english-cognito \
  --capabilities CAPABILITY_IAM

# 출력값 확인
aws cloudformation describe-stacks \
  --stack-name nova-english-cognito \
  --query 'Stacks[0].Outputs'
```

### 4. ECR 리포지토리 생성 및 Docker 이미지 빌드

```bash
# ECR 리포지토리 생성
aws ecr create-repository --repository-name nova-english-learning

# Docker 이미지 빌드
docker build -t nova-english-learning .

# ECR 로그인 및 이미지 푸시
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
docker tag nova-english-learning:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/nova-english-learning:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/nova-english-learning:latest
```

### 5. ECS 서비스 배포

```bash
# ECS 클러스터 생성
aws ecs create-cluster --cluster-name nova-english-cluster

# 태스크 정의 등록 (task-definition.json 수정 후)
aws ecs register-task-definition --cli-input-json file://task-definition.json

# ECS 서비스 생성
aws ecs create-service \
  --cluster nova-english-cluster \
  --service-name nova-english-service \
  --task-definition nova-english-learning-task \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

### 6. CodeBuild를 통한 CI/CD (선택사항)

```bash
# CodeBuild 프로젝트 생성 (buildspec.yml 사용)
# Parameter Store에 환경 변수 저장
aws ssm put-parameter \
  --name "/nova-english-learning/env" \
  --value "$(cat .env)" \
  --type "SecureString"
```

### 7. 시스템 아키텍처 및 데이터 플로우

#### 전체 아키텍처
```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              사용자 브라우저                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │   HTML/CSS/JS   │  │   Socket.IO     │  │   Cognito SDK              │  │
│  │   (UI 렌더링)     │  │   (실시간 통신)   │  │   (사용자 인증)              │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS/WSS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Application Load Balancer                          │
│                              (트래픽 분산)                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/WebSocket
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            ECS Fargate 컨테이너                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │   Express.js    │  │   Socket.IO     │  │   Nova Family Client       │  │
│  │   (HTTP 서버)    │  │   (WebSocket)   │  │   (Bedrock SDK)            │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ AWS SDK
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AWS 서비스                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │   Cognito       │  │   Nova Sonic    │  │   CloudWatch               │  │
│  │   (사용자 인증)    │  │   (음성 대화)     │  │   (로그 및 모니터링)          │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │   Nova Pro      │  │   Nova Canvas   │  │   ECR                      │  │
│  │   (이미지 분석)    │  │   (이미지 생성)    │  │   (컨테이너 레지스트리)        │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │   S3            │  │   DynamoDB      │  │   CodeBuild                │  │
│  │   (파일 저장)      │  │   (데이터베이스)   │  │   (CI/CD)                  │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 배포된 AWS 리소스
- **컨테이너 플랫폼**: Amazon ECS Fargate
- **컨테이너 레지스트리**: Amazon ECR
- **사용자 인증**: Amazon Cognito User Pool
- **AI 서비스**: Amazon Nova Family (Nova Sonic, Nova Pro, Nova Canvas)
- **모니터링**: Amazon CloudWatch
- **네트워킹**: VPC, Security Groups
- **데이터베이스**: DynamoDB, S3
- **CI/CD**: AWS CodeBuild

### 8. 리소스 정리

인프라를 삭제하려면:

```bash
# ECS 서비스 삭제
aws ecs update-service --cluster nova-english-cluster --service nova-english-service --desired-count 0
aws ecs delete-service --cluster nova-english-cluster --service nova-english-service

# ECS 클러스터 삭제
aws ecs delete-cluster --cluster nova-english-cluster

# Cognito 스택 삭제
aws cloudformation delete-stack --stack-name nova-english-cognito

# ECR 리포지토리 삭제
aws ecr delete-repository --repository-name nova-english-learning --force
```

## 기술 스택 및 아키텍처

### 사용된 기술 스택
- **Backend**: Node.js 18, TypeScript, Express.js, Socket.IO
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Container**: Docker, Amazon ECS Fargate
- **Database**: DynamoDB, S3
- **Authentication**: Amazon Cognito User Pool
- **AI Services**: Amazon Nova Family (Nova Sonic, Nova Pro, Nova Canvas)
- **Infrastructure**: AWS CloudFormation, Amazon ECR
- **Real-time Communication**: WebSocket (Socket.IO)
- **CI/CD**: AWS CodeBuild (buildspec.yml)
- **Monitoring**: Amazon CloudWatch

### 프로젝트 구조 및 주요 컴포넌트
```
nova-english-learning/
├── backend/                 # Node.js/TypeScript 서버
│   ├── src/
│   │   ├── server.ts        # Express 서버 + Socket.IO 설정
│   │   ├── client.ts        # Nova Family Bedrock 클라이언트
│   │   ├── types.ts         # WebSocket 이벤트 타입 정의
│   │   └── consts.ts        # Nova Family 설정 상수
│   ├── package.json         # 의존성: express, socket.io, @aws-sdk
│   └── tsconfig.json        # TypeScript 컴파일 설정
├── frontend/                # 정적 웹 애플리케이션
│   └── public/
│       ├── css/global.css   # 반응형 스타일시트
│       ├── js/
│       │   ├── AudioPlayer.js          # 음성 재생 처리
│       │   ├── cognito-config.js       # Cognito 인증 설정
│       │   └── ObjectsExt.js          # 유틸리티 함수
│       ├── assets/          # 상황별 학습 이미지 (카페, 공항 등)
│       ├── login.html       # Cognito 로그인 페이지
│       ├── categories.html  # 학습 카테고리 선택
│       ├── study.html       # 실시간 음성 대화 페이지
│       └── evaluation.html  # 학습 결과 평가
├── Dockerfile               # Multi-stage 빌드 설정
├── task-definition.json     # ECS Fargate 태스크 정의
├── cognito-stack.yaml       # Cognito User Pool CloudFormation
└── buildspec.yml           # CodeBuild CI/CD 파이프라인
```

### 핵심 기술 구현
- **실시간 통신**: Socket.IO를 통한 양방향 WebSocket 연결
- **음성 처리**: Web Audio API + Nova Sonic 스트리밍
- **이미지 분석**: Nova Pro를 통한 이미지 내용의 구체적인 텍스트 변환
- **실시간 이미지 생성**: Nova Canvas를 통한 사용자 발화 내용 기반 동적 시각화
- **인증 플로우**: Cognito SDK를 통한 JWT 토큰 기반 인증
- **컨테이너화**: Docker multi-stage build로 최적화된 이미지
- **서버리스 컨테이너**: ECS Fargate로 인프라 관리 없는 배포

## 프로젝트 기대 효과 및 예상 사용 사례

### 1. 기대 효과
- **실시간 대화 학습**: Nova Sonic과의 즉시 응답으로 자연스러운 영어 대화 연습
- **이미지 분석 학습**: Nova Pro를 통한 이미지 내용의 구체적인 텍스트 변환 및 영어 설명 제공
- **실시간 시각화**: Nova Canvas로 사용자 발화 내용을 즉시 이미지로 생성하여 몰입형 학습
- **접근성 향상**: 웹 브라우저만으로 언제 어디서나 영어 학습 가능
- **상황별 학습**: 이미지 기반 맥락 학습으로 실용적인 영어 표현 습득
- **확장 가능한 아키텍처**: ECS Fargate 기반으로 사용자 증가에 따른 자동 확장
- **비용 효율성**: 서버리스 컨테이너로 사용량에 따른 과금
- **높은 가용성**: AWS 관리형 서비스로 안정적인 서비스 운영

### 2. 예상 사용 사례
- **개인 학습자**: 집에서 편리하게 영어 회화 연습
- **교육 기관**: 보조 학습 도구로 활용
- **기업 교육**: 직원 영어 교육 프로그램
- **여행 준비**: 해외 여행 전 상황별 영어 표현 학습
- **면접 준비**: 영어 면접 대비 실전 연습

## Amazon Q 에이전트 활용 개발

이 프로젝트는 Amazon Q의 전문가 에이전트 팀을 활용하여 개발되었습니다. 각 분야별 전문 에이전트가 협업하여 Nova Sonic 기반 영어 학습 서비스를 구축했습니다.

### 🤖 전문가 에이전트 팀

#### @ProductManager - 영어 교육 서비스 기획 전문가
- **전문분야**: 8년차 영어 회화 교육 서비스 기획자
- **핵심역할**: 학습자 페르소나 분석, 게이미피케이션 설계, 커리큘럼 구성
- **활용예시**: `@ProductManager 영어 학습자의 주요 페인 포인트는 무엇인가요?`

#### @Developer - 풀스택 개발 전문가  
- **기술스택**: 10년차 React, Node.js, TypeScript, AWS 전문가
- **핵심역할**: Nova Family 통합 구현, 실시간 음성-이미지 연동, 멀티모달 AI 연동
- **활용예시**: `@Developer Nova Pro 이미지 분석과 Nova Canvas 실시간 이미지 생성을 연동해주세요`

#### @CloudOps - AWS 인프라 전문가
- **전문분야**: 7년차 AWS 클라우드 인프라 엔지니어 - 서버리스 및 컨테이너 전문가
- **핵심역할**: AWS 서버리스 아키텍처, 컨테이너 오케스트레이션, Amazon Bedrock Nova Family 인프라
- **활용예시**: `@CloudOps Nova Family 통합 영어 학습 서비스의 AWS 아키텍처를 설계해주세요`

#### @QATester - 테스트 자동화 및 품질 보증 전문가
- **전문분야**: 10년차 QA Engineer - 테스트 자동화 및 품질 보증 전문가
- **핵심역할**: Amazon Bedrock Nova 모델 응답 품질 검증, 음성-텍스트 변환 정확도 테스트
- **활용예시**: `@QATester Nova Sonic 음성 처리 기능의 테스트 전략을 수립해주세요`

#### @ProjectLead - 프로젝트 관리 및 팀 협업 조율 전문가
- **핵심역할**: Nova 영어 학습 서비스 개발 팀의 코디네이터
- **팀구성**: 영어교육기획자, 풀스택개발자, 클라우드인프라엔지니어, QA엔지니어
- **활용예시**: `@ProjectLead Nova 영어 학습 서비스 개발 로드맵을 수립해주세요`

### 🚀 개발 단계별 Amazon Q 에이전트 활용 방법

**Phase 1: 기획 및 설계**
```
@ProductManager 영어 학습자의 주요 페인 포인트는 무엇인가요?
@CloudOps Nova 기반 영어 학습 서비스의 AWS 아키텍처를 설계해주세요
@QATester Nova Sonic 음성 처리 기능의 테스트 전략을 수립해주세요
```

**Phase 2: 개발 및 구현**
```
@Developer Nova Pro 이미지 분석과 Nova Canvas 실시간 이미지 생성을 연동해주세요
@CloudOps 실시간 음성-이미지 처리를 위한 인프라 구성은?
@QATester Nova Pro 이미지 분석 정확도 테스트 케이스를 작성해주세요
```

**Phase 3: 테스트 및 배포**
```
@QATester AI 모델 응답 품질을 어떻게 검증할까요?
@CloudOps 모니터링 및 알람 시스템을 구축해주세요
@ProjectLead 현재 진행 상황을 점검하고 다음 단계를 안내해주세요
```

#### 3. 팀 협업 워크플로우
```
# 전체 팀 협업 시작
@ProjectLead Nova Sonic 기반 대화형 영어 학습 서비스 개발 로드맵을 수립해주세요

# 각 분야별 전문가 의견 수렴
@ProductManager 이미진 분석 기반 영어 학습의 교육적 효과는?
@Developer Nova Pro 이미지 분석과 Nova Canvas 실시간 생성을 연동해주세요
@CloudOps Nova Family 3개 모델 동시 사용 시 인프라 고려사항은?
@QATester Nova Pro 이미지 분석 정확도와 Nova Canvas 생성 품질 테스트 방법은?
```

### 📋 에이전트 설정 파일 위치
```
.amazonq/agents/
├── product-manager.yaml              # 영어 교육 기획 전문가
├── fullstack-developer.yaml          # 풀스택 개발 전문가
├── cloud-engineer.yaml               # AWS 인프라 전문가
├── qa-engineer.yaml                  # 테스트 자동화 전문가
├── team-coordinator.yaml             # 프로젝트 관리 전문가
├── document-consistency-reviewer.yaml # 문서 일관성 검토 전문가
└── README.md                         # 에이전트 팀 가이드
```

### 💡 활용 팁
- **구체적인 질문**: "Nova 연동 방법"보다 "Nova Pro 이미지 분석 결과를 Nova Canvas 실시간 생성에 어떻게 활용할까요?"
- **역할별 전문성 활용**: 기획은 @ProductManager, 개발은 @Developer, 인프라는 @CloudOps, 테스트는 @QATester
- **단계별 진행**: @ProjectLead로 전체 계획 수립 후 각 전문가에게 세부 작업 요청
- **결과물 문서화**: 각 에이전트의 답변을 `docs/` 폴더에 정리하여 팀 공유


