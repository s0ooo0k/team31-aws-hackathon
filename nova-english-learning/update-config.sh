#!/bin/bash

# Nova English Learning - Cognito 설정 업데이트 스크립트

echo "🔧 Nova English Learning - Cognito Configuration Update"
echo ""

# 사용자 입력 받기
read -p "Enter User Pool ID (e.g., ap-northeast-2_XXXXXXXXX): " USER_POOL_ID
read -p "Enter Client ID (e.g., XXXXXXXXXXXXXXXXXXXXXXXXXX): " CLIENT_ID

# 입력 검증
if [[ -z "$USER_POOL_ID" || -z "$CLIENT_ID" ]]; then
  echo "❌ Error: Both User Pool ID and Client ID are required!"
  exit 1
fi

# cognito-config.js 파일 업데이트
CONFIG_FILE="frontend/public/js/cognito-config.js"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "❌ Error: $CONFIG_FILE not found!"
  exit 1
fi

# 백업 생성
cp "$CONFIG_FILE" "$CONFIG_FILE.backup"

# 설정 업데이트
cat > "$CONFIG_FILE" << EOF
// AWS Cognito 설정
const AWS_CONFIG = {
  region: 'ap-northeast-2', // 서울 리전
  userPoolId: '$USER_POOL_ID', // Cognito User Pool ID
  clientId: '$CLIENT_ID' // Cognito App Client ID
};

// Cognito User Pool 초기화
const poolData = {
  UserPoolId: AWS_CONFIG.userPoolId,
  ClientId: AWS_CONFIG.clientId
};

const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// AWS SDK 설정
AWS.config.region = AWS_CONFIG.region;

console.log('✅ AWS Cognito configured successfully!');
EOF

echo ""
echo "✅ Configuration updated successfully!"
echo "📁 File: $CONFIG_FILE"
echo "💾 Backup: $CONFIG_FILE.backup"
echo ""
echo "🚀 You can now test the login functionality!"
