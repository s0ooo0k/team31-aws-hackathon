# Nova English Learning Game

Amazon Nova를 활용한 AI 기반 영어 게이미피케이션 학습 플랫폼

## 🎯 서비스 개요

Nova 이미지 생성과 대화형 AI를 통해 영어 학습을 게임화한 인터랙티브 플랫폼입니다.

### 핵심 기능
- **AI 이미지 생성**: Amazon Nova로 학습용 이미지 자동 생성
- **대화형 학습**: Nova Sonic과의 실시간 영어 대화
- **점수 시스템**: 사용자 응답과 정답 비교를 통한 피드백
- **개인화**: 사용자 입력 데이터 기반 맞춤형 이미지 생성

## 🏗️ 기술 스택

- **Frontend**: React + TypeScript
- **Backend**: Node.js + Express
- **AI Services**: Amazon Nova (Image Generation + Sonic)
- **Database**: DynamoDB
- **Hosting**: AWS Amplify
- **API**: AWS API Gateway + Lambda

## 🚀 빠른 시작

```bash
# 프로젝트 클론
git clone <repository-url>
cd nova-english-learning

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env

# 개발 서버 실행
npm run dev
```

## 📁 프로젝트 구조

```
nova-english-learning/
├── frontend/          # React 앱
├── backend/           # Express 서버
├── lambda/            # AWS Lambda 함수들
├── docs/              # 프로젝트 문서
└── infrastructure/    # AWS CDK 코드
```

## 🎮 게임 플로우

1. **이미지 제시**: Nova가 생성한 학습 이미지 표시
2. **대화 시작**: 사용자가 이미지 설명 시작
3. **AI 응답**: Nova Sonic이 질문으로 대화 유도
4. **점수 계산**: 정답 스크립트와 사용자 입력 비교
5. **피드백**: 개선점과 다음 단계 제안

## 📋 개발 로드맵

- [ ] Phase 1: 기본 UI/UX 구현
- [ ] Phase 2: Nova 이미지 생성 연동
- [ ] Phase 3: Nova Sonic 대화 시스템
- [ ] Phase 4: 점수 및 피드백 시스템
- [ ] Phase 5: 사용자 데이터 기반 개인화

## 🔧 환경 설정

AWS 계정과 다음 서비스 권한이 필요합니다:
- Amazon Nova (Bedrock)
- DynamoDB
- API Gateway
- Lambda
- Amplify