# Nova English Learning Service

Amazon Nova Sonic을 활용한 AI 기반 대화형 영어 학습 플랫폼

## 🎯 서비스 개요

Nova Sonic과의 실시간 대화를 통한 인터랙티브 영어 학습 서비스입니다. ECS Fargate 기반 컨테이너 아키텍처로 확장 가능하고 비용 효율적인 학습 플랫폼을 제공합니다.

### 핵심 기능
- **AI 대화 학습**: Amazon Nova Sonic과의 실시간 영어 대화 연습
- **음성 인식**: 실시간 음성 처리 및 발음 피드백
- **개인화 학습**: 사용자 수준과 관심사 기반 맞춤형 학습 경로
- **진도 추적**: 학습 기록 저장 및 성과 분석
- **이미지 기반 학습**: 시각적 콘텐츠를 활용한 상황별 대화 연습

## 🏗️ 기술 스택

### 프론트엔드
- **Framework**: React + TypeScript
- **Hosting**: S3 Static Website + CloudFront CDN
- **State Management**: React Context/Redux
- **Styling**: CSS Modules/Styled Components

### 백엔드
- **Runtime**: Node.js + Express.js
- **Container**: ECS Fargate (서버리스 컨테이너)
- **Load Balancer**: Application Load Balancer (ALB)
- **Registry**: Amazon ECR

### AI 서비스
- **대화형 AI**: Amazon Nova Sonic
- **음성 처리**: 실시간 음성 인식 및 응답
- **개인화**: 사용자 맞춤형 학습 시나리오

### 데이터 & 스토리지
- **Database**: DynamoDB (이미지-텍스트 매핑, 사용자 진도)
- **Object Storage**: S3 (이미지, 대화 기록)
- **Authentication**: Amazon Cognito

## 🚀 빠른 시작

### 개발 환경 설정
```bash
# 저장소 클론
git clone https://github.com/s0ooo0k/team31-aws-hackathon.git
cd team31-aws-hackathon

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env

# 프론트엔드 개발 서버
cd frontend
npm start  # http://localhost:3000

# 백엔드 개발 서버
cd backend
npm run dev  # http://localhost:3001
```

### Docker 로컬 테스트
```bash
# Docker Compose로 전체 환경 실행
cd docker
docker-compose up -d

# 백엔드 컨테이너만 실행
docker-compose up backend
```

## 📁 프로젝트 구조

```
nova-english-learning/
├── frontend/                 # React 애플리케이션 (S3 호스팅)
│   ├── src/
│   │   ├── components/       # 재사용 가능한 컴포넌트
│   │   ├── pages/           # 페이지 컴포넌트
│   │   ├── hooks/           # 커스텀 훅
│   │   ├── services/        # API 서비스
│   │   └── types/           # TypeScript 타입 정의
│   └── package.json
├── backend/                 # Express 서버 (ECS Fargate)
│   ├── src/
│   │   ├── routes/          # API 라우트
│   │   ├── middleware/      # 미들웨어
│   │   ├── services/        # 비즈니스 로직
│   │   └── utils/           # 유틸리티
│   ├── Dockerfile           # Docker 컨테이너 설정
│   └── package.json
├── infrastructure/         # AWS CDK 코드
│   ├── lib/                # CDK 스택 정의
│   │   ├── ecs-stack.ts     # ECS Fargate 스택
│   │   ├── alb-stack.ts     # ALB 스택
│   │   └── ecr-stack.ts     # ECR 스택
│   └── config/             # 환경별 설정
├── docker/                 # Docker 관련 파일
│   └── docker-compose.yml   # 로컬 개발용
├── generated-docs/         # 프로젝트 문서
│   ├── 01-project-specification.md
│   ├── 02-aws-architecture.md
│   ├── 03-api-specification.md
│   └── 04-development-guide.md
└── .amazonq/              # Amazon Q 에이전트 설정
    └── agents/            # 전문가 에이전트 팀
```

## 🎮 학습 플로우

1. **세션 시작**: 사용자 수준과 관심사 기반 학습 세션 생성
2. **이미지 제시**: 상황별 학습 이미지 표시 (카페, 공항, 병원 등)
3. **음성 대화**: Nova Sonic과 실시간 영어 대화
4. **실시간 피드백**: 발음, 문법, 어휘 즉시 교정
5. **진도 저장**: S3에 대화 기록 저장 및 DynamoDB에 진도 업데이트
6. **개인화 추천**: 다음 학습 콘텐츠 및 난이도 조절

## 🏛️ 시스템 아키텍처

### ECS Fargate 기반 컨테이너 아키텍처
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Web     │    │   CloudFront    │    │   Application   │
│   (S3 Hosting)  │◄──►│   CDN           │◄──►│   Load Balancer │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Amazon        │    │   ECS Fargate   │    │   Container     │
│   Cognito       │◄──►│   Cluster       │◄──►│   Registry      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       
                                ▼                       
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nova Sonic    │    │   S3 Storage    │    │   DynamoDB      │
│   AI Service    │◄──►│   (Images +     │◄──►│   (Mapping +    │
│                 │    │   Conversations)│    │   Progress)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 주요 특징
- **확장성**: ECS Fargate 자동 스케일링
- **비용 효율성**: 단일 AZ 배포로 ~$111/month
- **고성능**: ALB + CloudFront CDN
- **보안**: Cognito 인증 + IAM 역할 기반 접근 제어

## 📋 개발 로드맵

### Phase 1: 기획 및 설계 (완료)
- [x] 프로젝트 명세서 작성
- [x] AWS 아키텍처 설계
- [x] API 명세서 정의
- [x] 개발 가이드 작성

### Phase 2: 인프라 구축
- [ ] ECS Fargate 클러스터 구성
- [ ] ALB 및 ECR 설정
- [ ] DynamoDB 테이블 생성
- [ ] S3 버킷 및 CloudFront 배포

### Phase 3: 백엔드 개발
- [ ] Express API 서버 구현
- [ ] Nova Sonic 연동
- [ ] 인증 및 사용자 관리
- [ ] 음성 처리 파이프라인

### Phase 4: 프론트엔드 개발
- [ ] React 컴포넌트 구현
- [ ] 음성 녹음 인터페이스
- [ ] 실시간 대화 UI
- [ ] 진도 추적 대시보드

### Phase 5: 테스트 및 배포
- [ ] 단위/통합 테스트
- [ ] E2E 테스트
- [ ] CI/CD 파이프라인
- [ ] 프로덕션 배포

## 🔧 환경 설정

### AWS 서비스 권한
- **Amazon Bedrock**: Nova Sonic 모델 접근
- **ECS Fargate**: 컨테이너 실행
- **ECR**: Docker 이미지 저장
- **ALB**: 로드 밸런싱
- **S3**: 정적 호스팅 및 파일 저장
- **DynamoDB**: 데이터베이스
- **Cognito**: 사용자 인증
- **CloudFront**: CDN

### 예상 비용 (단일 AZ)
- ECS Fargate: $25/month
- ALB: $16/month
- Nova Sonic API: $50/month
- 기타 AWS 서비스: $20/month
- **총 예상 비용**: ~$111/month

## 👥 개발팀 (Amazon Q 에이전트)

프로젝트는 전문가 에이전트 팀이 협업하여 개발합니다:

- **@ProductManager**: Nova Sonic 대화형 학습 서비스 기획
- **@Developer**: ECS Fargate 기반 풀스택 개발
- **@CloudOps**: ECS Fargate + ALB 인프라 구축
- **@QATester**: 대화형 AI 품질 검증
- **@ProjectLead**: 팀 협업 조율 및 진행 관리

## 📚 문서

상세한 프로젝트 문서는 `generated-docs/` 디렉토리에서 확인할 수 있습니다:

1. [프로젝트 명세서](./generated-docs/01-project-specification.md)
2. [AWS 아키텍처](./generated-docs/02-aws-architecture.md)
3. [API 명세서](./generated-docs/03-api-specification.md)
4. [개발 가이드](./generated-docs/04-development-guide.md)
5. [프롬프트 모음](./generated-docs/05-prompts-collection.md)

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.