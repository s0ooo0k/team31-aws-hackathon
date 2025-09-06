
# SPEEK-SEE-PIC : Amazon Nova Family 활용한 Gen AI 기반 실시간 영어 스트리밍 회화 학습 서비스

SPEEK-SEE-PIC은 Amazon Nova Sonic을 활용한 실시간 AI 양방향 스트리밍 대화형 영어 학습 플랫폼입니다. WebSocket 기반 실시간 통신과 이미지 기반 상황 서술 학습을 통해 자연스러운 영어 회화 연습이 가능한 웹 애플리케이션입니다.

## 어플리케이션 개요

SPEEK-SEE-PIC은 Amazon Nova Sonic의 음성 대화 기능을 활용하여 실시간 영어 학습 경험을 제공합니다. 복잡한 설치 과정 없이 웹 브라우저에서 바로 접속하여 AI와 영어 대화를 시작할 수 있습니다.

이 서비스는 Node.js/TypeScript 백엔드와 바닐라 JavaScript 프론트엔드로 구성되어 있으며, AWS ECS Fargate에서 컨테이너로 실행됩니다. 사용자 인증은 Amazon Cognito를 통해 처리되며, 실시간 음성 스트리밍은 Socket.IO를 통해 구현되었습니다.

동물, 소셜, K-POP 등 다양한 상황별 이미지를 제공하여 실제 생활에서 사용할 수 있는 실용적인 영어 표현을 노바 소닉과 진짜 사람과 대화하는 것 같이 실감나는 학습할 수 있습니다. Nova Sonic과의 자연스러운 대화를 통해 발음 교정과 실시간 피드백을 받을 수 있습니다.

## 주요 기능

- **실시간 음성 대화**: Amazon Nova Sonic과 WebSocket을 통한 실시간 음성 스트리밍으로 자연스러운 영어 대화가 가능합니다. 브라우저에서 마이크 권한만 허용하면 바로 대화를 시작할 수 있습니다.

- **이미지 기반 상황 학습**: AWS, 애니메이션, 자연 등 실생활 상황을 담은 이미지를 제공하여 상황별 영어 표현을 학습할 수 있습니다.

- **사용자 인증 시스템**: Amazon Cognito를 통한 안전한 사용자 인증 및 세션 관리를 제공합니다. 이메일 기반 회원가입과 로그인을 지원합니다.

- **반응형 웹 인터페이스**: 모바일과 데스크톱 모두에서 최적화된 사용자 경험을 제공합니다. 직관적인 UI로 누구나 쉽게 사용할 수 있습니다.

## 동영상 데모
![데모](docs/speek-see-pic-demo.gif)

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
│                            ECS Fargate 컨테이너                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────────────┐  │
│  │   Express.js    │  │   Socket.IO     │  │   Nova Sonic Client        │  │
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
│  │   (사용자 인증)    │  │   (AI 대화)      │  │   (로그 및 모니터링)          │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 배포된 AWS 리소스
- **컨테이너 플랫폼**: Amazon ECS Fargate
- **컨테이너 레지스트리**: Amazon ECR
- **사용자 인증**: Amazon Cognito User Pool
- **AI 서비스**: Amazon Nova Sonic (Bedrock)
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
- **AI Service**: Amazon Nova Sonic (Bedrock)
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
│   │   ├── client.ts        # Nova Sonic Bedrock 클라이언트
│   │   ├── types.ts         # WebSocket 이벤트 타입 정의
│   │   └── consts.ts        # Nova Sonic 설정 상수
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
- **인증 플로우**: Cognito SDK를 통한 JWT 토큰 기반 인증
- **컨테이너화**: Docker multi-stage build로 최적화된 이미지
- **서버리스 컨테이너**: ECS Fargate로 인프라 관리 없는 배포

## 프로젝트 기대 효과 및 예상 사용 사례

### 1. 기대 효과
- **실시간 대화 학습**: Nova Sonic과의 즉시 응답으로 자연스러운 영어 대화 연습
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
- **핵심역할**: Nova Sonic S2S 모델 웹 구현, 실시간 음성 처리 아키텍처
- **활용예시**: `@Developer Nova Sonic S2S 모델을 웹에서 어떻게 구현할까요?`

#### @CloudOps - AWS 인프라 전문가
- **전문분야**: 7년차 AWS 클라우드 인프라 엔지니어 - 서버리스 및 컨테이너 전문가
- **핵심역할**: AWS 서버리스 아키텍처, 컨테이너 오케스트레이션, Amazon Bedrock 인프라
- **활용예시**: `@CloudOps Nova 기반 영어 학습 서비스의 AWS 아키텍처를 설계해주세요`

#### @QATester - 테스트 자동화 및 품질 보증 전문가
- **전문분야**: 10년차 QA Engineer - 테스트 자동화 및 품질 보증 전문가
- **핵심역할**: Amazon Bedrock Nova 모델 응답 품질 검증, 음성-텍스트 변환 정확도 테스트
- **활용예시**: `@QATester Nova Sonic 음성 처리 기능의 테스트 전략을 수립해주세요`

#### @ProjectLead - 프로젝트 관리 및 팀 협업 조율 전문가
- **핵심역할**: Nova 영어 학습 서비스 개발 팀의 코디네이터
- **팀구성**: 영어교육기획자, 풀스택개발자, 클라우드인프라엔지니어, QA엔지니어
- **활용예시**: `@ProjectLead Nova 영어 학습 서비스 개발 로드맵을 수립해주세요`

### 🚀 Amazon Q 에이전트 활용 방법

#### 1. IDE 환경에서 직접 활용
```bash
# 프로젝트 클론 후 IDE에서 Amazon Q 플러그인 설치
git clone <repository-url>
cd qqq

# VS Code 또는 IntelliJ에서 Amazon Q 확장/플러그인 설치
# .amazonq/agents/ 폴더가 자동으로 인식됨
```

#### 2. 개발 단계별 에이전트 활용

**Phase 1: 기획 및 설계**
```
@ProductManager 영어 학습자의 주요 페인 포인트는 무엇인가요?
@CloudOps Nova 기반 영어 학습 서비스의 AWS 아키텍처를 설계해주세요
@QATester Nova Sonic 음성 처리 기능의 테스트 전략을 수립해주세요
```

**Phase 2: 개발 및 구현**
```
@Developer Nova Sonic S2S 모델을 웹에서 어떻게 구현할까요?
@CloudOps 실시간 음성 처리를 위한 인프라 구성은?
@QATester 이미지 기반 영어 학습 기능의 테스트 케이스를 작성해주세요
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
@ProductManager 게이미피케이션 요소를 어떻게 적용할까요?
@Developer 사용자 인증 및 세션 관리 시스템을 구현해주세요
@CloudOps 비용 최적화를 위한 서버리스 설계 방안은?
@QATester 실시간 음성 처리 성능 테스트 방법은?
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
- **구체적인 질문**: "Nova Sonic 연동 방법"보다 "Nova Sonic S2S 모델을 웹에서 어떻게 구현할까요?"
- **역할별 전문성 활용**: 기획은 @ProductManager, 개발은 @Developer, 인프라는 @CloudOps, 테스트는 @QATester
- **단계별 진행**: @ProjectLead로 전체 계획 수립 후 각 전문가에게 세부 작업 요청
- **결과물 문서화**: 각 에이전트의 답변을 `docs/` 폴더에 정리하여 팀 공유


