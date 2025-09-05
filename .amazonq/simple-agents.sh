#!/bin/bash

# Nova Agents - 간단한 Bash 스크립트 버전

# Agent 프롬프트 정의
declare -A AGENTS
AGENTS[ProductManager]="당신은 8년차 영어 회화 교육 서비스 기획자입니다. 교육 콘텐츠 설계, UX/UI 기획, 게이미피케이션 전문가로서 답변해주세요."
AGENTS[Developer]="당신은 10년차 웹 개발 풀스택 개발자입니다. React, Node.js, TypeScript, AWS, Nova Models 전문가로서 실행 가능한 코드와 함께 답변해주세요."
AGENTS[CloudOps]="당신은 7년차 AWS 클라우드 인프라 엔지니어입니다. 서버리스 아키텍처, 컨테이너, CI/CD, 모니터링 전문가로서 답변해주세요."
AGENTS[QATester]="당신은 10년차 QA Engineer입니다. 테스트 자동화, 성능 테스트, AI/ML 품질 검증 전문가로서 답변해주세요."
AGENTS[ProjectLead]="당신은 Nova 영어 학습 서비스 개발 팀의 프로젝트 리더입니다. 팀 협업 조율 및 프로젝트 관리 전문가로서 답변해주세요."

# 사용법 출력
usage() {
    echo "사용법: $0 <agent> <message>"
    echo ""
    echo "사용 가능한 Agent:"
    for agent in "${!AGENTS[@]}"; do
        echo "  - $agent"
    done
    echo ""
    echo "예시:"
    echo "  $0 ProductManager '영어 초급자 학습 시나리오 만들어주세요'"
    echo "  $0 Developer 'React 음성 녹음 컴포넌트 만들어주세요'"
}

# Agent 호출 함수
call_agent() {
    local agent=$1
    local message=$2
    
    if [[ -z "${AGENTS[$agent]}" ]]; then
        echo "❌ 알 수 없는 Agent: $agent"
        usage
        exit 1
    fi
    
    local system_prompt="${AGENTS[$agent]}"
    local full_prompt="$system_prompt\n\n사용자 질문: $message"
    
    echo "🤖 $agent Agent 호출 중..."
    echo ""
    
    # AWS CLI로 Bedrock 호출
    aws bedrock-runtime invoke-model \
        --model-id anthropic.claude-3-sonnet-20240229-v1:0 \
        --body "{
            \"anthropic_version\": \"bedrock-2023-05-31\",
            \"max_tokens\": 2000,
            \"messages\": [{
                \"role\": \"user\",
                \"content\": \"$full_prompt\"
            }]
        }" \
        --cli-binary-format raw-in-base64-out \
        /tmp/agent_response.json
    
    # 응답 파싱 및 출력
    if [[ $? -eq 0 ]]; then
        echo "💬 $agent 응답:"
        echo "$(printf '%.0s─' {1..50})"
        cat /tmp/agent_response.json | jq -r '.content[0].text'
        echo "$(printf '%.0s─' {1..50})"
        rm -f /tmp/agent_response.json
    else
        echo "❌ Agent 호출 실패"
    fi
}

# 메인 실행
if [[ $# -lt 2 ]]; then
    usage
    exit 1
fi

call_agent "$1" "$2"