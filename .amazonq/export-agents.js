#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// YAML 파일들을 JSON으로 변환
function exportAgentsToJSON() {
    const agentsDir = path.join(__dirname, 'agents');
    const outputDir = path.join(__dirname, 'exported');
    
    // 출력 디렉토리 생성
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    
    const agents = {};
    const files = fs.readdirSync(agentsDir).filter(file => file.endsWith('.yaml'));
    
    files.forEach(file => {
        const filePath = path.join(agentsDir, file);
        const yamlContent = fs.readFileSync(filePath, 'utf8');
        const agentData = yaml.load(yamlContent);
        
        const agentName = agentData.name;
        agents[agentName] = agentData;
        
        // 개별 JSON 파일로도 저장
        fs.writeFileSync(
            path.join(outputDir, `${agentName.toLowerCase()}.json`),
            JSON.stringify(agentData, null, 2)
        );
    });
    
    // 통합 JSON 파일 생성
    fs.writeFileSync(
        path.join(outputDir, 'all-agents.json'),
        JSON.stringify(agents, null, 2)
    );
    
    console.log('✅ Agents exported to JSON successfully!');
    console.log(`📁 Output directory: ${outputDir}`);
    console.log(`📄 Files created: ${Object.keys(agents).length + 1}`);
}

if (require.main === module) {
    exportAgentsToJSON();
}

module.exports = { exportAgentsToJSON };