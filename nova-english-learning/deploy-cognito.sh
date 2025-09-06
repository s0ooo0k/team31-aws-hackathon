#!/bin/bash

# Nova English Learning - Cognito 배포 스크립트

STACK_NAME="nova-english-cognito"
REGION="ap-northeast-2"

echo "🚀 Deploying Cognito User Pool..."

# CloudFormation 스택 배포
aws cloudformation deploy \
  --template-file cognito-stack.yaml \
  --stack-name $STACK_NAME \
  --region $REGION \
  --capabilities CAPABILITY_IAM

if [ $? -eq 0 ]; then
  echo "✅ Cognito User Pool deployed successfully!"
  
  # 출력값 가져오기
  echo "📋 Getting configuration values..."
  
  USER_POOL_ID=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`UserPoolId`].OutputValue' \
    --output text)
  
  CLIENT_ID=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --region $REGION \
    --query 'Stacks[0].Outputs[?OutputKey==`UserPoolClientId`].OutputValue' \
    --output text)
  
  echo ""
  echo "🔧 Configuration values:"
  echo "Region: $REGION"
  echo "User Pool ID: $USER_POOL_ID"
  echo "Client ID: $CLIENT_ID"
  echo ""
  echo "📝 Update frontend/public/js/cognito-config.js with these values:"
  echo ""
  echo "const AWS_CONFIG = {"
  echo "  region: '$REGION',"
  echo "  userPoolId: '$USER_POOL_ID',"
  echo "  clientId: '$CLIENT_ID'"
  echo "};"
  echo ""
else
  echo "❌ Deployment failed!"
  exit 1
fi
