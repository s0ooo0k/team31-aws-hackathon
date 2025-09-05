# Nova 영어 학습 서비스 문서 작성 업무 할당

## 📋 업무 분담

### 1. API 명세서 → **@Developer**
**담당자**: 풀스택 개발자
**이유**: API 설계 및 구현 전문성
**작업 내용**:
- ECS Fargate 기반 REST API 엔드포인트 정의
- ALB 경유 요청/응답 스키마 설계
- 에러 코드 및 상태 정의
- Nova Sonic 대화형 AI 연동 API 명세

**명령어**:
```
@Developer Nova 영어 학습 서비스의 전체 API 명세서를 작성해주세요. ECS Fargate + ALB 기반으로 Nova Sonic 대화형 AI 연동, 사용자 관리, 학습 세션 관리, 대화 데이터 저장 등 모든 엔드포인트를 포함해주세요.
```

---

### 2. 개발 가이드 → **@Developer** + **@CloudOps**
**담당자**: 개발자 (메인) + 인프라 엔지니어 (배포 부분)
**이유**: 개발 환경 설정과 배포 프로세스 모두 필요
**작업 내용**:
- Docker 기반 로컬 개발 환경 설정
- ECS Fargate 컨테이너 개발 가이드
- 코딩 컨벤션 및 스타일 가이드
- 테스트 실행 방법
- ECS + ALB 배포 프로세스

**명령어**:
```
@Developer Nova 영어 학습 서비스 개발 가이드를 작성해주세요. Docker 컨테이너 환경 설정, ECS Fargate 개발 방법, 코딩 컨벤션, 테스트 방법을 포함해주세요.

@CloudOps 개발 가이드에 추가할 ECS Fargate + ALB 배포 및 인프라 관련 섹션을 작성해주세요. ECR, CI/CD, 단일 AZ 배포 방법을 포함해주세요.
```

---

### 3. 프로젝트 명세서 → **@ProductManager** + **@ProjectLead**
**담당자**: 기획자 (메인) + 프로젝트 리더 (일정/리소스)
**이유**: 기능 요구사항과 프로젝트 관리 요소 모두 필요
**작업 내용**:
- Nova Sonic 기반 대화형 학습 서비스 개요
- 게이미피케이션 제거된 순수 학습 기능 요구사항
- 사용자 스토리 및 대화 시나리오
- 단일 AZ 배포 기반 프로젝트 일정

**명령어**:
```
@ProductManager Nova Sonic 기반 영어 학습 서비스의 프로젝트 명세서를 작성해주세요. 대화형 AI 학습에 집중한 프로젝트 개요, 핵심 기능, 사용자 요구사항, 성공 지표를 포함해주세요.

@ProjectLead 프로젝트 명세서에 추가할 ECS Fargate 기반 개발 일정, 4명 팀 리소스 계획, 리스크 관리 섹션을 작성해주세요.
```

---

### 4. AWS 시스템 아키텍처 → **@CloudOps**
**담당자**: 클라우드 인프라 엔지니어
**이유**: AWS 서비스 및 인프라 설계 전문성
**작업 내용**:
- ECS Fargate + ALB 기반 시스템 아키텍처 다이어그램
- 단일 AZ 배포 AWS 서비스 구성
- Nova Sonic 연동 설계
- 보안 및 네트워킹 설계
- 단일 AZ 비용 최적화 방안 (~$111/month)

**명령어**:
```
@CloudOps Nova 영어 학습 서비스의 ECS Fargate + ALB 기반 AWS 시스템 아키텍처 문서를 작성해주세요. 단일 AZ 배포 아키텍처 다이어그램, Nova Sonic 연동, 각 서비스별 역할, 데이터 플로우, 보안 설계, 비용 최적화 방안을 포함해주세요.
```

---

### 5. 프롬프트 모음 → **@ProductManager** + **@QATester**
**담당자**: 기획자 (메인) + QA 엔지니어 (검증)
**이유**: 교육 콘텐츠 설계 전문성 + 품질 검증 필요
**작업 내용**:
- Nova Sonic 대화형 학습 시나리오별 프롬프트 설계
- 난이도별 대화 프롬프트 체계
- ECS Fargate 컨테이너 최적화 프롬프트
- 프롬프트 품질 검증 기준

**명령어**:
```
@ProductManager Nova Sonic 기반 영어 학습 서비스에서 사용할 대화형 프롬프트 모음을 작성해주세요. 대화 시나리오별, 난이도별, 상황별 프롬프트를 체계적으로 정리하고 ECS Fargate 환경에 최적화해주세요.

@QATester 대화형 프롬프트 모음의 품질 검증 기준과 테스트 방법을 작성해주세요. Nova Sonic 프롬프트 효과성 측정 방법도 포함해주세요.
```

---

## 🔄 작업 순서 (권장)

### Phase 1: 기획 및 설계 (1주차)
1. **@ProductManager** → Nova Sonic 기반 프로젝트 명세서 작성
2. **@CloudOps** → ECS Fargate + ALB 시스템 아키텍처 설계
3. **@ProjectLead** → 단일 AZ 배포 기반 프로젝트 일정 및 4명 팀 리소스 계획

### Phase 2: 개발 준비 (2주차)  
4. **@Developer** → ECS Fargate 기반 API 명세서 작성
5. **@Developer** + **@CloudOps** → Docker 컨테이너 개발 가이드 작성
6. **@ProductManager** → Nova Sonic 대화형 프롬프트 모음 초안

### Phase 3: 검증 및 완성 (3주차)
7. **@QATester** → Nova Sonic 프롬프트 품질 검증
8. **@ProjectLead** → 전체 문서 일관성 검토 (ECS Fargate 아키텍처 기준)
9. **전체 팀** → 문서 리뷰 및 피드백

---

## 📝 문서 저장 위치

```
docs/
├── api-specification.md          # @Developer
├── development-guide.md          # @Developer + @CloudOps  
├── project-specification.md      # @ProductManager + @ProjectLead
├── aws-architecture.md           # @CloudOps
└── prompts-collection.md         # @ProductManager + @QATester
```

---

## ✅ 완료 체크리스트

- [ ] API 명세서 (@Developer)
- [ ] 개발 가이드 (@Developer + @CloudOps)
- [ ] 프로젝트 명세서 (@ProductManager + @ProjectLead)
- [ ] AWS 시스템 아키텍처 (@CloudOps)
- [ ] 프롬프트 모음 (@ProductManager + @QATester)
- [ ] 전체 문서 통합 검토 (@ProjectLead)
- [ ] 팀 리뷰 완료 (전체)