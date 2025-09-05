# Amazon Q Agents - Nova Sonic 영어 학습 서비스 개발팀

이 디렉토리는 Nova Sonic 기반 대화형 영어 학습 서비스 개발을 위한 전문가 Agent들을 포함합니다.

## 팀 구성

### 1. ProductManager (`@ProductManager`)
- **경력**: 8년차 Nova Sonic 대화형 AI 영어 학습 서비스 기획자
- **전문분야**: 대화형 학습 콘텐츠 설계, UX/UI 기획, AI 대화 시나리오
- **주요역할**: 사용자 스토리, Nova Sonic 대화 경로 설계, KPI 설정

### 2. Developer (`@Developer`)
- **경력**: 10년차 ECS Fargate 기반 풀스택 개발자
- **기술스택**: React, Node.js, TypeScript, ECS Fargate, ALB, Nova Sonic
- **주요역할**: Docker 컨테이너 웹 애플리케이션 개발, Nova Sonic API 구현, 실시간 대화 처리

### 3. CloudOps (`@CloudOps`)
- **경력**: 7년차 ECS Fargate + ALB 전문 AWS 인프라 엔지니어
- **전문분앺**: ECS Fargate, ALB, ECR, 단일 AZ 배포, CI/CD, 모니터링
- **주요역할**: 단일 AZ ECS Fargate 인프라 설계, 비용 최적화 (~$111/month), Nova Sonic 연동

### 4. QATester (`@QATester`)
- **경력**: 10년차 대화형 AI 전문 QA Engineer
- **전문분야**: Nova Sonic 테스트 자동화, 대화 품질 검증, 프롬프트 효과성 측정
- **주요역할**: 대화형 AI 테스트 전략, Nova Sonic 품질 보증, 프롬프트 검증

### 5. ProjectLead (`@ProjectLead`)
- **역할**: Nova Sonic 기반 프로젝트 관리 및 4명 팀 협업 조율
- **주요기능**: ECS Fargate 개발 순서 관리, 단일 AZ 비용 최적화, 진행 상황 모니터링

### 6. DocumentConsistencyReviewer (`@document-consistency-reviewer`)
- **역할**: 아키텍처 문서와 다른 문서들 간의 일관성 검토 전문 에이전트
- **전문분야**: 문서 일관성 분석, 아키텍처 정합성 검증, 기술 스택 통일성 확인
- **주요기능**: ECS Fargate 아키텍처 기준 문서 검토, Nova Sonic 중심 내용 검증, 단일 AZ 배포 일관성 확인

## 사용 방법

### 개별 Agent 호출
```
@ProductManager Nova Sonic 대화 시나리오별 학습 경로를 설계해주세요
@Developer ECS Fargate에서 Nova Sonic API를 연동한 대화 처리 컴포넌트를 만들어주세요
@CloudOps 단일 AZ ECS Fargate + ALB 기반 Nova Sonic 연동 아키텍처를 설계해주세요
@QATester Nova Sonic 대화 품질 및 프롬프트 효과성 테스트 케이스를 작성해주세요
@document-consistency-reviewer 모든 문서가 ECS Fargate 아키텍처와 일관성이 있는지 검토해주세요
```

### 팀 협업 워크플로우
```
@ProjectLead Nova Sonic 기반 대화형 영어 학습 서비스 개발 로드맵을 수립해주세요
```

## 개발 단계별 Agent 활용

### Phase 1: 기획 및 설계
1. `@ProductManager` - Nova Sonic 대화 요구사항 정의, 사용자 스토리
2. `@CloudOps` - ECS Fargate + ALB 아키텍처 설계
3. `@QATester` - 대화형 AI 테스트 전략 수립

### Phase 2: 개발 및 구현
1. `@Developer` - Docker 컨테이너 기반 Nova Sonic 연동 기능 구현
2. `@CloudOps` - 단일 AZ ECS Fargate 인프라 구축
3. `@QATester` - 대화 품질 테스트 케이스 작성

### Phase 3: 테스트 및 배포
1. `@QATester` - Nova Sonic 대화 품질 검증
2. `@CloudOps` - ECS Fargate 배포 및 모니터링
3. `@ProjectLead` - 전체 문서 일관성 검토 및 다음 단계 계획

## 주요 기능

- **Nova Sonic 중심 작업 관리**: 대화형 AI 기반 각 단계별 완료 확인 후 다음 단계 진행
- **ECS Fargate 전문성**: 컨테이너 기반 아키텍처 전문가 수준의 상세한 가이드
- **실행 가능한 결과물**: Docker 컨테이너, ECS 설정, Nova Sonic 연동 코드, 대화 테스트 케이스 등
- **4명 팀 협업 최적화**: 단일 AZ 비용 최적화 및 커뮤니케이션 효율화