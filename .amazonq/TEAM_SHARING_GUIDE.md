# Amazon Q Agent 팀 공유 가이드

## 현재 제약사항
- Amazon Q Agent는 **IDE 환경에서만** 작동 (VS Code, IntelliJ 등)
- CLI나 웹 인터페이스에서는 직접 사용 불가
- 각 팀원이 개별적으로 IDE에 설정해야 함

## 팀 공유 방법

### 1. GitHub 저장소 공유
```bash
# 현재 Agent 설정을 GitHub에 푸시
git add .amazonq/
git commit -m "Add Amazon Q Agents for Nova English Learning Service"
git push origin main
```

### 2. 팀원 설정 방법

#### Step 1: 저장소 클론
```bash
git clone https://github.com/s0ooo0k/team31_0905.git
cd team31_0905
```

#### Step 2: IDE에서 Amazon Q 플러그인 설치
- **VS Code**: Amazon Q 확장 설치
- **IntelliJ**: Amazon Q 플러그인 설치
- **기타 IDE**: 지원되는 IDE 확인

#### Step 3: Agent 활성화
- IDE에서 프로젝트 열기
- `.amazonq/agents/` 폴더가 자동으로 인식됨
- Amazon Q Chat에서 `@ProductManager`, `@Developer` 등 사용 가능

### 3. 대안 솔루션

#### A. 표준 프롬프트 템플릿 생성
```markdown
# prompts/product-manager.md
당신은 8년차 영어 회화 교육 서비스 기획자입니다.
[Agent 설정 내용을 일반 프롬프트로 변환]
```

#### B. CLI 도구 개발
```javascript
// cli-agent.js
const { BedrockRuntimeClient } = require('@aws-sdk/client-bedrock-runtime');

class AgentCLI {
  constructor(agentType) {
    this.agentType = agentType;
    this.prompts = require(`./prompts/${agentType}.json`);
  }
  
  async ask(question) {
    const systemPrompt = this.prompts.instructions;
    // Bedrock 호출 로직
  }
}

// 사용법: node cli-agent.js ProductManager "학습 시나리오 만들어줘"
```

#### C. 웹 인터페이스 구축
```html
<!-- team-agents.html -->
<div class="agent-selector">
  <button onclick="selectAgent('ProductManager')">기획자</button>
  <button onclick="selectAgent('Developer')">개발자</button>
  <button onclick="selectAgent('CloudOps')">인프라</button>
  <button onclick="selectAgent('QATester')">QA</button>
  <button onclick="selectAgent('ProjectLead')">PM</button>
</div>
```

## 권장 팀 워크플로우

### 1. 개발 환경 통일
```bash
# 팀 전체 개발 환경 설정 스크립트
#!/bin/bash
echo "Nova English Learning Team Setup"

# 1. 저장소 클론
git clone https://github.com/s0ooo0k/team31_0905.git
cd team31_0905

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env
echo "Please configure your .env file"

# 4. Amazon Q 설정 안내
echo "Install Amazon Q extension in your IDE"
echo "Agents available: @ProductManager @Developer @CloudOps @QATester @ProjectLead"
```

### 2. Agent 사용 가이드라인
```markdown
## 팀 협업 규칙

### 역할별 책임
- **@ProductManager**: 요구사항 정의, UX 설계
- **@Developer**: 코드 구현, API 설계  
- **@CloudOps**: 인프라 구축, 배포
- **@QATester**: 테스트 전략, 품질 검증
- **@ProjectLead**: 일정 관리, 팀 조율

### 작업 순서
1. @ProjectLead → 스프린트 계획 수립
2. @ProductManager → 기능 요구사항 정의
3. @Developer → 구현 방법 제시
4. @CloudOps → 인프라 요구사항 검토
5. @QATester → 테스트 계획 수립
6. 구현 → 테스트 → 배포 → 회고
```

### 3. 결과물 공유 시스템
```bash
# 각 Agent 결과물을 문서화
mkdir -p docs/agents-output/
echo "ProductManager 결과물" > docs/agents-output/product-requirements.md
echo "Developer 결과물" > docs/agents-output/technical-specs.md
echo "CloudOps 결과물" > docs/agents-output/infrastructure.md
echo "QATester 결과물" > docs/agents-output/test-plans.md
```

## 팀원별 설정 체크리스트

### 필수 설정
- [ ] IDE에 Amazon Q 플러그인 설치
- [ ] AWS 계정 및 권한 설정
- [ ] 프로젝트 저장소 클론
- [ ] `.env` 파일 설정
- [ ] Agent 테스트 실행

### 선택 설정  
- [ ] CLI 도구 설치 (개발 예정)
- [ ] 웹 인터페이스 접근 (개발 예정)
- [ ] Slack 봇 연동 (향후 계획)

## 문제 해결

### Agent가 인식되지 않는 경우
1. `.amazonq/agents/` 폴더 위치 확인
2. YAML 파일 문법 검증
3. IDE 재시작
4. Amazon Q 플러그인 재설치

### 권한 오류 발생 시
1. AWS 계정 권한 확인
2. Bedrock 모델 접근 권한 검증
3. 지역(Region) 설정 확인

## 향후 개선 계획

### Phase 1: 현재 (IDE 기반)
- [x] Agent 설정 파일 생성
- [x] GitHub 공유
- [ ] 팀원 온보딩

### Phase 2: CLI 도구 개발
- [ ] Node.js CLI 도구 개발
- [ ] 프롬프트 템플릿 시스템
- [ ] 결과물 자동 저장

### Phase 3: 웹 인터페이스
- [ ] 웹 기반 Agent 인터페이스
- [ ] 팀 협업 대시보드
- [ ] 실시간 결과 공유

### Phase 4: 통합 플랫폼
- [ ] Slack/Teams 봇 연동
- [ ] 자동화된 워크플로우
- [ ] 프로젝트 관리 통합