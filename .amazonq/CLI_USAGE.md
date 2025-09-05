# Nova Agents CLI 사용 가이드

## 설치 및 설정

### 1. 의존성 설치
```bash
cd .amazonq
npm install
```

### 2. Agent JSON 파일 생성
```bash
npm run export
# 또는
node export-agents.js
```

### 3. AWS 자격증명 설정
```bash
# AWS CLI 설정
aws configure

# 또는 환경변수
export AWS_ACCESS_KEY_ID=your-key
export AWS_SECRET_ACCESS_KEY=your-secret
export AWS_REGION=us-east-1
```

## 사용 방법

### 기본 사용법
```bash
node cli-agent.js <agent-name> "<message>"
```

### 사용 가능한 Agent 목록 확인
```bash
node cli-agent.js --list
```

### 실제 사용 예시

#### ProductManager Agent
```bash
node cli-agent.js ProductManager "영어 초급자를 위한 이미지 기반 학습 시나리오 3개 만들어주세요"
```

#### Developer Agent  
```bash
node cli-agent.js Developer "Nova Sonic API를 사용한 실시간 음성 처리 React 컴포넌트를 만들어주세요"
```

#### CloudOps Agent
```bash
node cli-agent.js CloudOps "Lambda에서 Nova Sonic을 호출하는 서버리스 아키텍처를 설계해주세요"
```

#### QATester Agent
```bash
node cli-agent.js QATester "음성 인식 정확도를 측정하는 자동화 테스트를 작성해주세요"
```

#### ProjectLead Agent
```bash
node cli-agent.js ProjectLead "이번 스프린트의 개발 일정과 각 팀원의 작업을 정리해주세요"
```

## 전역 설치 (선택사항)

### 전역 설치
```bash
npm run install-global
```

### 전역 사용
```bash
nova-agent ProductManager "학습 시나리오 만들어줘"
nova-agent --list
```

## 배치 처리 스크립트

### 여러 Agent 순차 호출
```bash
#!/bin/bash
# batch-agents.sh

echo "=== Nova English Learning Service 개발 계획 ==="

echo "1. 기획자 의견:"
node cli-agent.js ProductManager "이미지 기반 영어 학습의 핵심 기능을 정의해주세요"

echo -e "\n2. 개발자 의견:"
node cli-agent.js Developer "위 기능을 구현하기 위한 기술 스택과 아키텍처를 제안해주세요"

echo -e "\n3. 인프라 의견:"
node cli-agent.js CloudOps "제안된 기술 스택을 AWS에서 구현하는 방법을 설계해주세요"

echo -e "\n4. QA 의견:"
node cli-agent.js QATester "전체 시스템의 테스트 전략을 수립해주세요"

echo -e "\n5. PM 정리:"
node cli-agent.js ProjectLead "위 의견들을 종합하여 개발 로드맵을 작성해주세요"
```

## 결과 저장

### 파일로 저장
```bash
# 단일 결과 저장
node cli-agent.js ProductManager "학습 시나리오 만들어줘" > output/product-scenarios.md

# 타임스탬프와 함께 저장
echo "$(date): ProductManager 결과" >> logs/agent-history.log
node cli-agent.js ProductManager "학습 시나리오 만들어줘" >> logs/agent-history.log
```

### JSON 형태로 저장
```bash
# 구조화된 결과 저장
node -e "
const AgentCLI = require('./cli-agent.js');
const cli = new AgentCLI();
cli.callAgent('ProductManager', '학습 시나리오 만들어줘').then(result => {
  const output = {
    timestamp: new Date().toISOString(),
    agent: 'ProductManager',
    query: '학습 시나리오 만들어줘',
    response: result
  };
  console.log(JSON.stringify(output, null, 2));
});
"
```

## 팀 협업 워크플로우

### 1. 일일 스탠드업
```bash
# daily-standup.sh
node cli-agent.js ProjectLead "오늘의 개발 목표와 각 팀원의 작업을 정리해주세요"
```

### 2. 기능 개발 프로세스
```bash
# feature-development.sh
FEATURE_NAME="음성 녹음 기능"

echo "=== $FEATURE_NAME 개발 프로세스 ==="
node cli-agent.js ProductManager "$FEATURE_NAME의 요구사항을 정의해주세요"
node cli-agent.js Developer "$FEATURE_NAME을 구현하는 코드를 작성해주세요"  
node cli-agent.js CloudOps "$FEATURE_NAME을 위한 인프라를 설계해주세요"
node cli-agent.js QATester "$FEATURE_NAME의 테스트 케이스를 작성해주세요"
```

### 3. 코드 리뷰
```bash
# code-review.sh
CODE_FILE="VoiceRecorder.jsx"

node cli-agent.js Developer "$CODE_FILE 코드를 리뷰하고 개선점을 제안해주세요"
node cli-agent.js QATester "$CODE_FILE의 테스트 커버리지를 분석해주세요"
```

## 문제 해결

### Agent를 찾을 수 없는 경우
```bash
# 1. JSON 파일 재생성
npm run export

# 2. Agent 목록 확인
node cli-agent.js --list

# 3. 파일 존재 확인
ls -la exported/
```

### AWS 권한 오류
```bash
# Bedrock 권한 확인
aws bedrock list-foundation-models

# 자격증명 확인  
aws sts get-caller-identity
```

### 응답이 없는 경우
```bash
# 디버그 모드로 실행
DEBUG=* node cli-agent.js ProductManager "테스트"

# 네트워크 연결 확인
curl -I https://bedrock-runtime.us-east-1.amazonaws.com
```

## 확장 기능

### 커스텀 Agent 추가
```javascript
// custom-agent.json
{
  "name": "CustomAgent",
  "description": "커스텀 전문가",
  "instructions": "당신은 특정 분야의 전문가입니다..."
}
```

### 플러그인 시스템
```javascript
// plugins/slack-integration.js
const { WebClient } = require('@slack/web-api');

class SlackPlugin {
  async sendToSlack(agentResponse) {
    // Slack으로 결과 전송
  }
}
```