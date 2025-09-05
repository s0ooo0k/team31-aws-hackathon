# 문서 작성 업무 할당

## 📋 업무 분담

### 1. API 명세서 → **@Developer**
**담당자**: 풀스택 개발자
**이유**: API 설계 및 구현 전문성
**작업 내용**:
- REST API 엔드포인트 정의
- 요청/응답 스키마 설계
- 에러 코드 및 상태 정의
- Nova Sonic 연동 API 명세

**명령어**:
```
@Developer Nova 영어 학습 서비스의 전체 API 명세서를 작성해주세요. Nova Sonic 연동, 사용자 관리, 학습 세션 관리, 파일 업로드 등 모든 엔드포인트를 포함해주세요.
```

---

### 2. 개발 가이드 → **@Developer** + **@CloudOps**
**담당자**: 개발자 (메인) + 인프라 엔지니어 (배포 부분)
**이유**: 개발 환경 설정과 배포 프로세스 모두 필요
**작업 내용**:
- 로컬 개발 환경 설정
- 코딩 컨벤션 및 스타일 가이드
- 테스트 실행 방법
- 배포 프로세스

**명령어**:
```
@Developer Nova 영어 학습 서비스 개발 가이드를 작성해주세요. 환경 설정, 코딩 컨벤션, 테스트 방법을 포함해주세요.

@CloudOps 개발 가이드에 추가할 배포 및 인프라 관련 섹션을 작성해주세요. CI/CD, 환경별 배포 방법을 포함해주세요.
```

---

### 3. 프로젝트 명세서 → **@ProductManager** + **@ProjectLead**
**담당자**: 기획자 (메인) + 프로젝트 리더 (일정/리소스)
**이유**: 기능 요구사항과 프로젝트 관리 요소 모두 필요
**작업 내용**:
- 프로젝트 개요 및 목표
- 기능 요구사항 정의
- 사용자 스토리 및 시나리오
- 프로젝트 일정 및 마일스톤

**명령어**:
```
@ProductManager Nova 영어 학습 서비스의 프로젝트 명세서를 작성해주세요. 프로젝트 개요, 핵심 기능, 사용자 요구사항, 성공 지표를 포함해주세요.

@ProjectLead 프로젝트 명세서에 추가할 일정 관리, 리소스 계획, 리스크 관리 섹션을 작성해주세요.
```

---

### 4. AWS 시스템 아키텍처 → **@CloudOps**
**담당자**: 클라우드 인프라 엔지니어
**이유**: AWS 서비스 및 인프라 설계 전문성
**작업 내용**:
- 전체 시스템 아키텍처 다이어그램
- AWS 서비스 구성 및 연결
- 보안 및 네트워킹 설계
- 비용 최적화 방안

**명령어**:
```
@CloudOps Nova 영어 학습 서비스의 완전한 AWS 시스템 아키텍처 문서를 작성해주세요. 아키텍처 다이어그램, 각 서비스별 역할, 데이터 플로우, 보안 설계, 비용 최적화 방안을 포함해주세요.
```

---

### 5. 프롬프트 모음 → **@ProductManager** + **@QATester**
**담당자**: 기획자 (메인) + QA 엔지니어 (검증)
**이유**: 교육 콘텐츠 설계 전문성 + 품질 검증 필요
**작업 내용**:
- 학습 시나리오별 프롬프트 설계
- 난이도별 프롬프트 체계
- Nova Sonic 최적화 프롬프트
- 프롬프트 품질 검증 기준

**명령어**:
```
@ProductManager Nova 영어 학습 서비스에서 사용할 프롬프트 모음을 작성해주세요. 학습 시나리오별, 난이도별, 상황별 프롬프트를 체계적으로 정리해주세요.

@QATester 프롬프트 모음의 품질 검증 기준과 테스트 방법을 작성해주세요. 프롬프트 효과성 측정 방법도 포함해주세요.
```

---

## 🔄 작업 순서 (권장)

### Phase 1: 기획 및 설계 (1주차)
1. **@ProductManager** → 프로젝트 명세서 작성
2. **@CloudOps** → AWS 시스템 아키텍처 설계
3. **@ProjectLead** → 프로젝트 일정 및 리소스 계획

### Phase 2: 개발 준비 (2주차)  
4. **@Developer** → API 명세서 작성
5. **@Developer** + **@CloudOps** → 개발 가이드 작성
6. **@ProductManager** → 프롬프트 모음 초안

### Phase 3: 검증 및 완성 (3주차)
7. **@QATester** → 프롬프트 품질 검증
8. **@ProjectLead** → 전체 문서 통합 검토
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