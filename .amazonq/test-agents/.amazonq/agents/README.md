# Amazon Q Agents - Nova 영어 학습 서비스 개발팀

이 디렉토리는 Nova 영어 학습 서비스 개발을 위한 전문가 Agent들을 포함합니다.

## 팀 구성

### 1. ProductManager (`@ProductManager`)
- **경력**: 8년차 영어 회화 교육 서비스 기획자
- **전문분야**: 교육 콘텐츠 설계, UX/UI 기획, 게이미피케이션
- **주요역할**: 사용자 스토리, 학습 경로 설계, KPI 설정

### 2. Developer (`@Developer`)
- **경력**: 10년차 웹 개발 풀스택 개발자
- **기술스택**: React, Node.js, TypeScript, AWS, Nova Models
- **주요역할**: 웹 애플리케이션 개발, API 구현, 실시간 처리

### 3. CloudOps (`@CloudOps`)
- **경력**: 7년차 AWS 클라우드 인프라 엔지니어
- **전문분야**: 서버리스 아키텍처, 컨테이너, CI/CD, 모니터링
- **주요역할**: AWS 인프라 설계, 성능 최적화, 비용 관리

### 4. QATester (`@QATester`)
- **경력**: 10년차 QA Engineer
- **전문분야**: 테스트 자동화, 성능 테스트, AI/ML 품질 검증
- **주요역할**: 테스트 전략, 품질 보증, 버그 관리

### 5. ProjectLead (`@ProjectLead`)
- **역할**: 프로젝트 관리 및 팀 협업 조율
- **주요기능**: 작업 순서 관리, 의존성 조율, 진행 상황 모니터링

## 사용 방법

### 개별 Agent 호출
```
@ProductManager 사용자 레벨별 학습 경로를 설계해주세요
@Developer Nova Sonic API를 연동한 음성 처리 컴포넌트를 만들어주세요
@CloudOps 실시간 음성 처리를 위한 AWS 아키텍처를 설계해주세요
@QATester 음성 인식 정확도 테스트 케이스를 작성해주세요
```

### 팀 협업 워크플로우
```
@ProjectLead Nova 영어 학습 서비스 개발 로드맵을 수립해주세요
```

## 개발 단계별 Agent 활용

### Phase 1: 기획 및 설계
1. `@ProductManager` - 요구사항 정의, 사용자 스토리
2. `@CloudOps` - 아키텍처 설계
3. `@QATester` - 테스트 전략 수립

### Phase 2: 개발 및 구현
1. `@Developer` - 기능 구현
2. `@CloudOps` - 인프라 구축
3. `@QATester` - 테스트 케이스 작성

### Phase 3: 테스트 및 배포
1. `@QATester` - 품질 검증
2. `@CloudOps` - 배포 및 모니터링
3. `@ProjectLead` - 전체 검토 및 다음 단계 계획

## 주요 기능

- **순차적 작업 관리**: 각 단계별 완료 확인 후 다음 단계 진행
- **전문성 기반 조언**: 각 분야별 전문가 수준의 상세한 가이드
- **실행 가능한 결과물**: 코드, 설계서, 테스트 케이스 등 구체적 산출물
- **팀 협업 최적화**: 의존성 관리 및 커뮤니케이션 효율화