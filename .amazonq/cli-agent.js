#!/usr/bin/env node

const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const fs = require('fs');
const path = require('path');

class AgentCLI {
    constructor() {
        this.client = new BedrockRuntimeClient({ region: 'us-east-1' });
        this.agents = this.loadAgents();
    }

    loadAgents() {
        try {
            const agentsPath = path.join(__dirname, 'exported', 'all-agents.json');
            return JSON.parse(fs.readFileSync(agentsPath, 'utf8'));
        } catch (error) {
            console.error('❌ Agent 파일을 찾을 수 없습니다. export-agents.js를 먼저 실행하세요.');
            process.exit(1);
        }
    }

    async callAgent(agentName, userMessage) {
        const agent = this.agents[agentName];
        if (!agent) {
            console.error(`❌ Agent '${agentName}'을 찾을 수 없습니다.`);
            console.log('📋 사용 가능한 Agent:', Object.keys(this.agents).join(', '));
            return;
        }

        console.log(`🤖 ${agentName} Agent 호출 중...`);
        
        const systemPrompt = agent.instructions;
        const fullPrompt = `${systemPrompt}\n\n사용자 질문: ${userMessage}`;

        try {
            const command = new InvokeModelCommand({
                modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
                contentType: 'application/json',
                body: JSON.stringify({
                    anthropic_version: 'bedrock-2023-05-31',
                    max_tokens: 2000,
                    messages: [{
                        role: 'user',
                        content: fullPrompt
                    }]
                })
            });

            const response = await this.client.send(command);
            const responseBody = JSON.parse(new TextDecoder().decode(response.body));
            
            console.log(`\n💬 ${agentName} 응답:`);
            console.log('─'.repeat(50));
            console.log(responseBody.content[0].text);
            console.log('─'.repeat(50));
            
        } catch (error) {
            console.error('❌ Bedrock 호출 실패:', error.message);
        }
    }

    listAgents() {
        console.log('📋 사용 가능한 Agent 목록:');
        Object.entries(this.agents).forEach(([name, agent]) => {
            console.log(`  • ${name}: ${agent.description}`);
        });
    }
}

// CLI 인터페이스
async function main() {
    const args = process.argv.slice(2);
    const cli = new AgentCLI();

    if (args.length === 0 || args[0] === '--help') {
        console.log(`
🤖 Nova English Learning Agents CLI

사용법:
  node cli-agent.js <agent-name> "<message>"
  node cli-agent.js --list

예시:
  node cli-agent.js ProductManager "영어 초급자 학습 시나리오 만들어줘"
  node cli-agent.js Developer "React 음성 녹음 컴포넌트 코드 작성해줘"
  node cli-agent.js CloudOps "Lambda에서 Nova Sonic 호출 구조 설계해줘"
  node cli-agent.js QATester "음성 업로드 테스트 케이스 작성해줘"
  node cli-agent.js ProjectLead "이번 주 개발 일정 정리해줘"
        `);
        return;
    }

    if (args[0] === '--list') {
        cli.listAgents();
        return;
    }

    if (args.length < 2) {
        console.error('❌ 메시지를 입력해주세요.');
        console.log('사용법: node cli-agent.js <agent-name> "<message>"');
        return;
    }

    const agentName = args[0];
    const message = args.slice(1).join(' ');
    
    await cli.callAgent(agentName, message);
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = AgentCLI;