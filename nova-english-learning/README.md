# Nova English Learning Service

Amazon Nova Sonic을 활용한 AI 기반 대화형 영어 학습 플랫폼

## 🎯 서비스 개요

Nova Sonic과의 실시간 대화를 통한 인터랙티브 영어 학습 서비스입니다. 이미지 기반 상황별 대화 연습과 실시간 음성 피드백을 제공합니다.

### ✅ 구현 완료 기능
- **AI 대화 학습**: Amazon Nova Sonic과의 실시간 영어 대화 연습
- **음성 인식**: 16kHz PCM 실시간 음성 처리 및 응답
- **이미지 기반 학습**: 5개 카테고리 시각적 콘텐츠 활용
- **Barge-in 기능**: 자연스러운 대화 중단 및 응답 (INTERRUPTED 감지)
- **채팅 인터페이스**: 실시간 대화 UI
- **4페이지 완전 구현**: 로그인 → 카테고리 → 학습 → 평가

## 🏗️ 기술 스택

### 프론트엔드
- **Static Files**: HTML, CSS, JavaScript
- **Audio Processing**: Web Audio API + AudioWorklet
- **Real-time Communication**: Socket.IO Client

### 백엔드
- **Runtime**: Node.js + TypeScript + Express.js
- **Real-time**: Socket.IO Server
- **AI Service**: Amazon Nova Sonic (Bedrock)
- **Audio**: Bidirectional streaming with 16kHz PCM

## 🚀 빠른 시작

### 개발 환경 설정
```bash
# 저장소 클론
git clone <repository-url>
cd nova-english-learning

# 백엔드 설정
cd backend
npm install
npm run build

# 프론트엔드 설정 (선택사항)
cd ../frontend
npm install

# 환경 변수 설정
# AWS 프로필 'bedrock-test' 설정 필요
```

### 서버 실행
```bash
# 백엔드 서버 실행 (프론트엔드 포함)
cd backend
npm start

# 브라우저에서 접속
# http://localhost:3000
```

## 📁 프로젝트 구조 (정리 완료)

```
nova-english-learning/
├── frontend/                    # 프론트엔드 (정적 파일)
│   ├── public/                  # 웹 페이지 및 정적 자원
│   │   ├── js/                  # JavaScript 모듈
│   │   │   ├── AudioPlayer.js           # Nova Sonic 공식 오디오 플레이어
│   │   │   ├── AudioPlayerProcessor.worklet.js  # 오디오 워클릿
│   │   │   └── ObjectsExt.js            # 유틸리티 함수
│   │   ├── login.html           # 로그인 페이지 ✅
│   │   ├── categories.html      # 카테고리 선택 페이지 ✅
│   │   ├── study.html          # 학습 세션 페이지 ✅ (개선된 채팅 UI)
│   │   └── evaluation.html     # 평가 결과 페이지 ✅
│   └── package.json            # 프론트엔드 의존성
├── backend/                    # 백엔드 서버
│   ├── src/                    # TypeScript 소스
│   │   ├── server.ts           # Express + Socket.IO 서버 ✅
│   │   ├── client.ts           # Nova Sonic 양방향 스트림 클라이언트 ✅
│   │   ├── consts.ts           # 이미지 카테고리 및 프롬프트 ✅
│   │   └── types.ts            # 타입 정의 ✅
│   ├── package.json            # 백엔드 의존성
│   ├── package-lock.json       # 의존성 잠금
│   ├── server.log             # 서버 로그 (실행 시 생성)
│   └── tsconfig.json          # TypeScript 설정
└── README.md                  # 프로젝트 문서 (업데이트됨)
```

## 🎮 학습 플로우

1. **로그인**: 사용자 인증 (시뮬레이션)
2. **카테고리 선택**: 5가지 학습 주제 중 선택
3. **이미지 제시**: 상황별 학습 이미지 표시
4. **음성 대화**: Nova Sonic과 실시간 영어 대화
5. **실시간 피드백**: 발음, 문법, 어휘 즉시 교정
6. **Barge-in**: 자연스러운 대화 중단 및 응답
7. **세션 완료**: 학습 결과 및 평가 확인

## 🔧 주요 기능 (구현 완료)

### 🎤 실시간 음성 처리
- **입력**: 16kHz PCM, Web Audio API ScriptProcessor
- **출력**: Nova Sonic 24kHz → AudioWorklet 기반 부드러운 재생
- **지연시간**: 1024 샘플 버퍼로 최소 지연 달성
- **브라우저 호환**: Firefox/Chrome 각각 최적화

### 🗣️ Barge-in 기능 (완전 구현)
- **자연스러운 중단**: AI 말하는 중 사용자 발언 즉시 감지
- **INTERRUPTED 감지**: Nova Sonic contentEnd 이벤트 기반
- **오디오 동기화**: AudioPlayer.bargeIn()으로 즉시 중단
- **UI 필터링**: interrupted 메시지 자동 제거

### 💬 채팅 UI
- **실시간 메시지**: Socket.IO 기반 즉시 반영
- **메시지 필터링**: 시스템 메시지 자동 제거
- **반응형**: 데스크톱/태블릿/모바일 최적화

## 🔧 환경 설정

### AWS 설정
```bash
# AWS CLI 프로필 설정
aws configure --profile bedrock-test
# Access Key ID: [제공된 키]
# Secret Access Key: [제공된 시크릿]
# Region: us-east-1
```

### 필요 권한
- **Amazon Bedrock**: Nova Sonic 모델 접근
- **실시간 스트리밍**: 양방향 오디오 스트림

## 🎨 UI/UX 특징

### 반응형 디자인
- **데스크톱**: 2열 레이아웃 (이미지 | 채팅)
- **태블릿**: 적응형 그리드
- **모바일**: 단일 열 스택 레이아웃

### 접근성
- **키보드 네비게이션**: 전체 기능 접근 가능
- **스크린 리더**: 적절한 ARIA 라벨
- **색상 대비**: WCAG 2.1 AA 준수

## 🔍 개발 가이드

### 백엔드 개발
```bash
cd backend
npm run dev    # 개발 모드 (nodemon)
npm run build  # TypeScript 컴파일
npm start      # 프로덕션 실행
```

### 프론트엔드 개발
```bash
cd frontend
npm run dev    # live-server로 개발 서버
```

### 디버깅
- **서버 로그**: `backend/server.log`
- **브라우저 콘솔**: Socket.IO 이벤트 로그
- **네트워크 탭**: WebSocket 연결 상태

## 🚀 실행 방법

### 현재 상태: 완전 동작 가능
```bash
# 1. 프로젝트 클론 및 이동
cd nova-english-learning/backend

# 2. 의존성 설치
npm install

# 3. TypeScript 컴파일
npm run build

# 4. 서버 실행 (프론트엔드 포함)
npm start

# 5. 브라우저 접속
# http://localhost:3000
```

### AWS 설정 필요
```bash
# bedrock-test 프로필 설정
aws configure --profile bedrock-test
# Access Key, Secret Key, Region (us-east-1) 입력
```

## 📊 개발 현황

### ✅ 완료된 기능
- [x] Nova Sonic 양방향 스트리밍 연동
- [x] 실시간 음성 인식 및 응답
- [x] Barge-in 기능 (대화 중단)
- [x] 4페이지 완전 구현 (로그인/카테고리/학습/평가)
- [x] 실시간 채팅 인터페이스
- [x] 5개 카테고리 이미지 데이터
- [x] 프론트엔드/백엔드 구조 분리
- [x] TypeScript 기반 타입 안전성

### 🔄 향후 개선 계획
- [ ] React 기반 프론트엔드 마이그레이션
- [ ] 실제 이미지 생성 AI 연동
- [ ] 사용자 인증 시스템 (Cognito)
- [ ] 학습 진도 데이터베이스 저장
- [ ] Docker 컨테이너화
- [ ] AWS ECS 배포

## 📄 라이선스

MIT License