# Nova 영어 학습 서비스 AWS 시스템 아키텍처

**작성자**: CloudOps Agent  
**작성일**: 2025년 1월  
**버전**: 3.0 (Nova Sonic 기반)

---

## 1. 전체 시스템 아키텍처

### 1.1 시스템 개요
Amazon Nova 서비스를 활용한 AI 기반 영어 학습 플랫폼으로 React 프론트엔드와 Express.js 백엔드로 구성

### 1.2 아키텍처 다이어그램
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Web     │    │   CloudFront    │    │   Application   │
│   Page          │◄──►│   CDN           │◄──►│   Load Balancer │
│   (S3 Hosting)  │    │                 │    │   (ALB)         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Authentication│    │   ECS Fargate   │    │   Container     │
│   Cognito       │◄──►│   Cluster       │◄──►│   Registry      │
│                 │    │                 │    │   (ECR)         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       
                                ▼                       
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Services   │    │   S3 Image      │    │   S3 Conversation│
│   Nova Sonic    │◄──►│   Storage       │    │   Storage        │
│                 │    │   (Primary)     │    │                  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │                       
                                ▼                       
                       ┌─────────────────┐              
                       │   DynamoDB      │              
                       │   Image-Text    │              
                       │   Mapping       │              
                       └─────────────────┘              
```

### 1.3 핵심 설계 원칙
- **컨테이너 기반**: ECS Fargate로 확장 가능한 백엔드 서비스
- **AI 중심**: Nova Sonic을 활용한 대화형 학습
- **이미지-텍스트 연계**: DynamoDB로 이미지와 설명 매핑
- **대화 지속성**: S3에 대화 기록 저장으로 진도 추적
- **최적화된 전송**: CloudFront로 전 세계 빠른 이미지 로딩
- **단순화된 배포**: 단일 AZ 배포로 비용 최적화

---

## 2. 아키텍처 컴포넌트

### 2.1 프론트엔드 계층

#### 2.1.1 React Web Page
```yaml
React_Application:
  Purpose: 영어 학습 서비스 사용자 인터페이스
  Features:
    - 대화형 학습 인터페이스
    - 대화 기반 학습 콘텐츠
    - 실시간 AI 대화
    - 진도 추적 대시보드
  Hosting: S3 Static Website
```

#### 2.1.2 CloudFront CDN
```yaml
CloudFront_Distribution:
  Purpose: 최적화된 이미지 서빙을 위한 콘텐츠 전송 네트워크
  Origins:
    - S3 Static Website (React App)
    - Express API Server (Dynamic Content)
  Behaviors:
    - /api/* → Express Server
    - /images/* → S3 Image Storage
    - /* → React Web Page
  Features:
    - 전 세계 빠른 콘텐츠 전송
    - 이미지 캐싱 최적화
    - SSL/TLS 보안
```

### 2.2 백엔드 서비스

#### 2.2.1 Application Load Balancer (ALB)
```yaml
ALB:
  Purpose: Fargate 서비스로 트래픽 분산 및 고가용성 제공
  Configuration:
    - Listeners: Port 80 (HTTP) → 443 (HTTPS)
    - Target Group: ECS Fargate Tasks
    - Health Check: /health endpoint
    - SSL/TLS Termination
  Features:
    - 자동 트래픽 분산
    - 장애 감지 및 복구
    - HTTPS 보안 연결
```

#### 2.2.2 ECS Fargate Cluster
```yaml
ECS_Fargate:
  Purpose: 컨테이너 기반 Express API 서버 실행 (서버리스 컨테이너)
  Configuration:
    - Cluster: nova-english-cluster
    - Service: nova-english-api
    - Task Definition:
      - CPU: 512 (0.5 vCPU)
      - Memory: 1024 MB (1 GB)
      - Container Port: 3000
  Auto_Scaling:
    - Min Tasks: 1
    - Max Tasks: 4
    - Target CPU Utilization: 70%
  Features:
    - 서버리스 컨테이너 실행
    - 자동 스케일링
    - 단일 AZ 배포 (비용 최적화)
    - 관리 오버헤드 최소화
```

#### 2.2.3 ECR (Container Registry)
```yaml
ECR:
  Purpose: Docker 이미지 저장소
  Repository: nova-english-api
  Features:
    - 컨테이너 이미지 버전 관리
    - 보안 스캔
    - 자동 이미지 빌드 통합
```

#### 2.2.4 Express API Application
```yaml
Express_Application:
  Technology: Node.js + Express.js
  Container_Image: node:18-alpine
  Responsibilities:
    - 사용자 인증 및 세션 관리
    - Nova Sonic과의 AI 대화 중개
    - 이미지-텍스트 매핑 관리
    - 학습 진도 추적
  API_Endpoints:
    - /auth/* : 사용자 인증
    - /conversation/* : AI 대화 처리
    - /images/* : 이미지 관리
    - /progress/* : 학습 진도
    - /health : ALB 헬스체크
```

#### 2.2.5 Amazon Cognito
```yaml
Cognito_Service:
  Purpose: 사용자 인증 및 권한 부여 서비스
  Features:
    - 사용자 등록/로그인
    - JWT 토큰 발급 및 검증
    - 세션 관리
  Integration:
    - React → ALB → Fargate → Cognito 인증 플로우
```

### 2.3 AI 서비스

#### 2.3.1 Amazon Nova Sonic
```yaml
Nova_Sonic:
  Purpose: 대화형 AI로 인터랙티브 영어 학습 대화 제공
  Model: amazon.nova-sonic-v1:0
  Capabilities:
    - 개인화된 학습 시나리오 생성
    - 실시간 영어 대화 상대
    - 학습자 수준별 맞춤 응답
    - 발음 및 문법 피드백
  Integration:
    - Express Server → Nova Sonic API
    - 저장된 이미지 설명 활용
    - 대화 기록 S3 저장
```

### 2.4 스토리지 서비스

#### 2.4.1 S3 Image Storage (Primary)
```yaml
S3_Image_Storage:
  Purpose: 학습 콘텐츠용 처리된 이미지 저장
  Bucket: nova-english-images
  Features:
    - 원본 이미지 저장
    - 최적화된 이미지 버전
    - CloudFront 연동
  Organization:
    - /original/ : 원본 이미지
    - /processed/ : 학습용 처리된 이미지
    - /thumbnails/ : 썸네일 이미지
```

#### 2.4.2 S3 Conversation Storage
```yaml
S3_Conversation_Storage:
  Purpose: 대화 기록 및 대화 데이터 저장
  Bucket: nova-english-conversations
  Features:
    - 사용자별 대화 기록
    - 학습 진도 추적 데이터
    - AI 응답 히스토리
  Organization:
    - /users/{userId}/conversations/
    - /sessions/{sessionId}/
    - /progress/{userId}/
```

#### 2.4.3 DynamoDB
```yaml
DynamoDB_Tables:
  ImageTextMapping:
    Purpose: 이미지와 텍스트 설명 매핑 저장
    PartitionKey: imageId (String)
    Attributes:
      - s3ImageKey: 이미지 S3 경로
      - description: 이미지 설명 텍스트
      - difficulty: 난이도 레벨
      - category: 학습 카테고리
      - keywords: 핵심 어휘
      - createdAt: 생성 시간
  
  UserProgress:
    Purpose: 사용자 학습 진도 관리
    PartitionKey: userId (String)
    SortKey: date (String)
    Attributes:
      - sessionsCompleted: 완료한 세션 수
      - totalScore: 총 점수
      - conversationCount: 대화 횟수
      - lastActivity: 마지막 활동 시간
```

### 2.5 데이터 플로우

#### 2.5.1 사용자 인증 플로우
```
사용자 → React → CloudFront → ALB → Fargate → Cognito
1. 사용자가 React 웹페이지에서 로그인 요청
2. CloudFront CDN을 통해 ALB로 라우팅
3. ALB가 ECS Fargate 태스크로 요청 전달
4. Fargate의 Express 서버가 Cognito 인증 처리
5. JWT 토큰 발급 및 클라이언트 반환
```

#### 2.5.2 학습 콘텐츠 플로우
```
Fargate → Nova Sonic → S3 Conversation Storage
1. Fargate Express 서버가 학습 세션 시작
2. Nova Sonic이 개인화된 학습 시나리오 생성
3. 대화 데이터가 S3 Conversation Storage에 저장
4. 진도 추적을 위한 대화 기록 유지
```

#### 2.5.3 이미지 처리 플로우
```
원본 이미지 → S3 Image Storage → DynamoDB 매핑
Fargate → Nova Sonic → 저장된 설명 활용
1. 원본 이미지를 S3 Image Storage에 업로드
2. 이미지 설명을 DynamoDB에 매핑하여 저장
3. Fargate 서버가 Nova Sonic API 호출
4. Nova Sonic이 저장된 설명을 활용하여 학습 대화 생성
```

#### 2.5.4 동적 콘텐츠 생성 플로우
```
대화 데이터 → 이미지 생성 → S3 저장
1. Fargate에서 사용자 대화 데이터 분석
2. Nova Sonic이 맞춤형 학습 이미지 생성
3. 생성된 이미지를 S3에 저장
4. DynamoDB에 새로운 이미지-텍스트 매핑 추가
```

#### 2.5.5 콘텐츠 전송 플로우
```
S3 → CloudFront → React 웹페이지
ALB Health Check → Fargate Tasks
1. S3에서 CloudFront를 통해 최적화된 콘텐츠 전송
2. ALB가 Fargate 태스크 상태 모니터링
3. React 웹페이지에서 빠른 이미지 로딩
4. 장애 시 자동 트래픽 재라우팅
```

---

## 3. 주요 기능

### 3.1 AI 생성 학습 콘텐츠
```yaml
AI_Generated_Content:
  - Nova Sonic이 개인화된 학습 시나리오 생성
  - 사용자 수준과 관심사에 맞춤형 대화 주제
  - 실시간 피드백 및 교정 제안
  - 동적 난이도 조절
```

### 3.2 이미지-텍스트 연관성
```yaml
Image_Text_Association:
  - DynamoDB가 이미지와 설명 텍스트 매핑
  - 학습 연습용 이미지-설명 쌍 관리
  - 카테고리별 이미지 분류 (일상, 여행, 비즈니스)
  - 난이도별 어휘 및 표현 매핑
```

### 3.3 대화 지속성
```yaml
Conversation_Persistence:
  - S3에 대화 기록 저장으로 진도 추적
  - 사용자별 학습 히스토리 관리
  - 세션 간 연속성 유지
  - 장기 학습 패턴 분석
```

### 3.4 최적화된 전송
```yaml
Optimized_Delivery:
  - CloudFront로 전 세계 빠른 이미지 로딩
  - 지역별 캐싱으로 지연 시간 최소화
  - 대역폭 최적화
  - 모바일 친화적 이미지 압축
```

### 3.5 보안 인증
```yaml
Secure_Authentication:
  - Cognito가 사용자 관리 및 보안 처리
  - JWT 토큰 기반 세션 관리
  - 개인정보 보호 및 데이터 암호화
  - 안전한 API 접근 제어
```

---

## 4. 기술 스택

### 4.1 프론트엔드
```yaml
Frontend_Stack:
  - Framework: React
  - Language: JavaScript/TypeScript
  - Styling: CSS Modules / Styled Components
  - State Management: React Context / Redux
  - Build Tool: Create React App / Vite
```

### 4.2 백엔드
```yaml
Backend_Stack:
  - Runtime: Node.js
  - Framework: Express.js
  - Language: JavaScript/TypeScript
  - Middleware: CORS, Body Parser, Authentication
```

### 4.3 인증
```yaml
Authentication_Stack:
  - Service: Amazon Cognito
  - Token Type: JWT
  - Session Management: Cognito User Pools
```

### 4.4 AI 서비스
```yaml
AI_Stack:
  - Primary AI: Amazon Nova Sonic
  - Use Cases: Conversational Learning, Personalization
  - Integration: AWS SDK for JavaScript
```

### 4.5 스토리지
```yaml
Storage_Stack:
  - Object Storage: Amazon S3
  - Database: Amazon DynamoDB
  - CDN: Amazon CloudFront
```

---

## 5. 배포 아키텍처

### 5.1 웹 애플리케이션 호스팅
```yaml
Web_Hosting:
  - React 프론트엔드 호스팅
  - S3 Static Website Hosting
  - CloudFront CDN 통합
  - 자동 HTTPS 인증서
```

### 5.2 ECS Fargate 배포
```yaml
Fargate_Deployment:
  - 컨테이너 기반 Express API 서버
  - 서버리스 컨테이너 실행
  - 단일 AZ 배포로 비용 최적화
  - 자동 스케일링 및 로드 밸런싱
  - Docker 이미지 ECR 저장
  - ALB를 통한 트래픽 분산
```

### 5.3 AWS 서비스 통합
```yaml
AWS_Integration:
  - 확장성과 성능을 위한 AWS 서비스 활용
  - 관리형 서비스로 운영 부담 최소화
  - 자동 스케일링 및 고가용성
  - 보안 및 컴플라이언스 준수
```

### 5.4 CDN 배포
```yaml
CDN_Distribution:
  - 전 세계 콘텐츠 전송
  - 이미지 및 정적 자산 캐싱
  - 지연 시간 최소화
  - 대역폭 비용 최적화
```

---

## 6. 시스템 특징

### 6.1 확장성
```yaml
Scalability:
  - ECS Fargate 자동 스케일링 (CPU 기반)
  - ALB를 통한 트래픽 분산
  - 단일 AZ 배포로 비용 효율성
  - 글로벌 CDN 배포
  - 컨테이너 기반 마이크로서비스 준비
```

### 6.2 성능
```yaml
Performance:
  - ALB Health Check로 장애 태스크 자동 교체
  - Fargate 태스크 병렬 처리
  - CloudFront CDN으로 빠른 로딩
  - DynamoDB 고성능 데이터베이스
  - S3 최적화된 스토리지
  - Nova Sonic 실시간 AI 응답
```

### 6.3 보안
```yaml
Security:
  - Cognito 사용자 인증
  - IAM 역할 기반 접근 제어
  - HTTPS/TLS 암호화
  - 데이터 암호화 (저장 및 전송)
```

### 6.4 비용 효율성
```yaml
Cost_Efficiency:
  - Fargate 사용량 기반 과금 (실행 시간만)
  - ALB 요청 기반 과금
  - 자동 스케일링으로 리소스 최적화
  - 관리형 서비스로 운영 비용 절감
  - 개발 및 배포 복잡도 감소
```

---

## 7. 사용된 AWS 리소스 목록

### 7.1 핵심 서비스 (8개)
```yaml
AWS_Resources:
  Compute:
    - ECS Fargate: 컨테이너 기반 백엔드 실행
    - ALB: 로드 밸런싱 및 트래픽 분산
    - ECR: Docker 이미지 저장소
  
  AI_ML:
    - Amazon Nova Sonic: 대화형 AI 학습 서비스
  
  Authentication:
    - Amazon Cognito: 사용자 인증 및 권한 관리
  
  Storage:
    - S3 Image Storage: 학습 이미지 저장
    - S3 Conversation Storage: 대화 기록 저장
    - S3 Static Website: React 앱 호스팅
  
  Database:
    - DynamoDB: 이미지-텍스트 매핑 및 사용자 진도
  
  Networking:
    - CloudFront CDN: 글로벌 콘텐츠 전송
```

### 7.2 예상 월간 비용 (MVP - 단일 AZ)
```yaml
Cost_Breakdown:
  - ECS Fargate: $25 (0.5 vCPU, 1GB, 단일 AZ, 평균 1-2 tasks)
  - ALB: $16 (기본 요금 + 처리량)
  - ECR: $2 (이미지 저장)
  - Nova Sonic: $50 (예상 API 호출)
  - Cognito: $0 (50,000 MAU 이하 무료)
  - S3: $8 (저장 + 전송)
  - DynamoDB: $5 (On-demand)
  - CloudFront: $5 (CDN 전송)
  
  Total: ~$111/month (단일 AZ로 약 10% 비용 절감)
```

---

**문서 승인**: ProjectLead Agent 검토 필요  
**다음 문서**: API 명세서 작성 (ECS Fargate + Nova Sonic 기반으로 수정 필요)