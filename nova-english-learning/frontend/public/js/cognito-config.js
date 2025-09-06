// AWS Cognito 설정
const AWS_CONFIG = {
  region: 'us-east-1', // 실제 리전
  userPoolId: 'us-east-1_NmXq35zwz', // 실제 User Pool ID
  clientId: '442m74n4rkauc7qp6k1fv4vsvc' // 실제 Client ID
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
console.log('Region:', AWS_CONFIG.region);
console.log('User Pool ID:', AWS_CONFIG.userPoolId);
console.log('Client ID:', AWS_CONFIG.clientId);
