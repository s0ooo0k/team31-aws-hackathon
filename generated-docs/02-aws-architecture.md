# Nova 영어 학습 서비스 AWS 시스템 아키텍처

**작성자**: CloudOps Agent  
**작성일**: 2025년 1월  
**버전**: 1.0

---

## 1. 전체 시스템 아키텍처

### 1.1 아키텍처 개요
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   CDN/WAF       │    │   API Gateway   │
│   (React SPA)   │◄──►│   CloudFront    │◄──►│   REST APIs     │
│                 │    │   + WAF         │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Authentication│    │   Load Balancer │    │   Lambda        │
│   Cognito       │◄──►│   ALB           │◄──►│   Functions     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   File Storage  │    │   AI Services   │    │   Database      │
│   S3 Buckets    │◄──►│   Bedrock Nova  │◄──►│   DynamoDB      │
│                 │    │   + Sonic       │    │   + ElastiCache │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Monitoring    │    │   Messaging     │    │   Analytics     │
│   CloudWatch    │◄──►│   SQS + SNS     │◄──►│   Kinesis       │
│   + X-Ray       │    │                 │    │   + QuickSight  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 1.2 핵심 설계 원칙
- **서버리스 우선**: Lambda, DynamoDB, S3 중심 설계
- **마이크로서비스**: 기능별 독립적인 Lambda 함수
- **확장성**: Auto Scaling 및 관리형 서비스 활용
- **보안**: 최소 권한 원칙 및 암호화 적용
- **비용 최적화**: Pay-as-you-use 모델 활용

---

## 2. 상세 컴포넌트 설계

### 2.1 프론트엔드 계층

#### 2.1.1 CloudFront CDN
```yaml
Distribution:
  Origins:
    - S3 Static Website (React App)
    - API Gateway (Dynamic Content)
  Behaviors:
    - /api/* → API Gateway
    - /* → S3 Static Website
  Security:
    - WAF Rules (DDoS, SQL Injection 방어)
    - SSL/TLS Certificate
    - CORS Configuration
```

#### 2.1.2 S3 Static Website
```yaml
Buckets:
  - nova-english-frontend:
      Purpose: React SPA 호스팅
      Features:
        - Static Website Hosting
        - CloudFront Integration
        - Versioning Enabled
  - nova-english-assets:
      Purpose: 이미지, 오디오 파일 저장
      Features:
        - Lifecycle Policies (30일 후 IA, 90일 후 Glacier)
        - CORS Configuration
        - Encryption at Rest
```

### 2.2 API 계층

#### 2.2.1 API Gateway
```yaml
APIs:
  - NovaEnglishAPI:
      Type: REST API
      Endpoints:
        - POST /auth/login
        - POST /auth/register
        - GET /user/profile
        - POST /learning/session
        - POST /audio/process
        - GET /learning/progress
        - POST /image/generate
      Features:
        - Request Validation
        - Rate Limiting (100 req/min per user)
        - API Keys for Mobile Apps
        - CORS Headers
        - CloudWatch Logging
```

#### 2.2.2 Lambda Functions
```yaml
Functions:
  - AuthHandler:
      Runtime: Node.js 18.x
      Memory: 256MB
      Timeout: 10s
      Environment:
        - COGNITO_USER_POOL_ID
        - JWT_SECRET
      
  - AudioProcessor:
      Runtime: Node.js 18.x
      Memory: 1024MB
      Timeout: 30s
      Environment:
        - BEDROCK_REGION
        - S3_AUDIO_BUCKET
      
  - ImageGenerator:
      Runtime: Python 3.11
      Memory: 512MB
      Timeout: 60s
      Environment:
        - NOVA_MODEL_ID
        - S3_IMAGE_BUCKET
      
  - LearningManager:
      Runtime: Node.js 18.x
      Memory: 512MB
      Timeout: 15s
      Environment:
        - DYNAMODB_TABLE_NAME
        - ELASTICACHE_ENDPOINT
```

### 2.3 AI 서비스 계층

#### 2.3.1 Amazon Bedrock Integration
```yaml
Models:
  - Nova Canvas (Image Generation):
      Model ID: amazon.nova-canvas-v1:0
      Use Cases:
        - 학습 시나리오 이미지 생성
        - 사용자 맞춤형 콘텐츠 이미지
      Configuration:
        - Max Tokens: 4096
        - Temperature: 0.7
        
  - Nova Sonic (Speech-to-Speech):
      Model ID: amazon.nova-micro-v1:0
      Use Cases:
        - 실시간 음성 대화
        - 발음 교정 피드백
      Configuration:
        - Audio Format: WAV, 16kHz
        - Max Duration: 60s
        
  - Nova Pro (Text Generation):
      Model ID: amazon.nova-pro-v1:0
      Use Cases:
        - 학습 콘텐츠 생성
        - 피드백 메시지 작성
      Configuration:
        - Max Tokens: 2048
        - Temperature: 0.5
```

### 2.4 데이터 계층

#### 2.4.1 DynamoDB Tables
```yaml
Tables:
  - Users:
      PartitionKey: userId (String)
      Attributes:
        - email, name, level, preferences
        - createdAt, lastLoginAt
      GSI:
        - email-index (for login)
      
  - LearningSessions:
      PartitionKey: userId (String)
      SortKey: sessionId (String)
      Attributes:
        - sessionType, startTime, endTime
        - score, accuracy, feedback
      TTL: 90 days
      
  - UserProgress:
      PartitionKey: userId (String)
      SortKey: date (String)
      Attributes:
        - dailyScore, streakDays, completedLessons
        - weakAreas, strengths
      
  - GeneratedContent:
      PartitionKey: contentType (String)
      SortKey: contentId (String)
      Attributes:
        - s3Key, metadata, tags
        - generatedAt, usageCount
      TTL: 30 days
```

#### 2.4.2 ElastiCache Redis
```yaml
Clusters:
  - SessionCache:
      Node Type: cache.t3.micro
      Nodes: 2 (Multi-AZ)
      Use Cases:
        - 사용자 세션 데이터
        - 임시 학습 상태
        - API 응답 캐싱
      TTL: 1 hour
      
  - ContentCache:
      Node Type: cache.r6g.large
      Nodes: 3 (Cluster Mode)
      Use Cases:
        - 생성된 이미지 메타데이터
        - 자주 사용되는 프롬프트
        - 사용자 선호도 데이터
      TTL: 24 hours
```

### 2.5 보안 및 인증

#### 2.5.1 Amazon Cognito
```yaml
UserPool:
  - NovaEnglishUsers:
      Features:
        - Email/Password Authentication
        - Social Login (Google, Facebook)
        - MFA Optional
        - Password Policy (8+ chars, mixed case)
      Triggers:
        - PreSignUp: Email validation
        - PostConfirmation: Create DynamoDB record
        
IdentityPool:
  - NovaEnglishIdentity:
      AuthenticatedRole:
        - DynamoDB: Read/Write own data
        - S3: Upload to user folder
        - Bedrock: Invoke Nova models
      UnauthenticatedRole:
        - Limited API access for demo
```

#### 2.5.2 IAM Roles & Policies
```yaml
Roles:
  - LambdaExecutionRole:
      Policies:
        - AWSLambdaBasicExecutionRole
        - DynamoDBCrudPolicy
        - S3AccessPolicy
        - BedrockInvokePolicy
        
  - APIGatewayRole:
      Policies:
        - CloudWatchLogsPolicy
        - LambdaInvokePolicy
        
  - CognitoAuthenticatedRole:
      Policies:
        - UserDataAccessPolicy
        - S3UserFolderPolicy
```

---

## 3. 네트워킹 및 보안

### 3.1 VPC 설계
```yaml
VPC:
  - NovaEnglishVPC:
      CIDR: 10.0.0.0/16
      Subnets:
        - Public Subnets: 10.0.1.0/24, 10.0.2.0/24
        - Private Subnets: 10.0.10.0/24, 10.0.20.0/24
      
      Components:
        - Internet Gateway
        - NAT Gateway (Multi-AZ)
        - Route Tables
        - Security Groups
```

### 3.2 보안 그룹
```yaml
SecurityGroups:
  - ALB-SG:
      Inbound: 80, 443 from 0.0.0.0/0
      Outbound: All to Lambda-SG
      
  - Lambda-SG:
      Inbound: All from ALB-SG
      Outbound: 443 to 0.0.0.0/0 (AWS APIs)
      
  - ElastiCache-SG:
      Inbound: 6379 from Lambda-SG
      Outbound: None
```

### 3.3 데이터 암호화
```yaml
Encryption:
  - At Rest:
      - DynamoDB: AWS KMS
      - S3: SSE-S3
      - ElastiCache: In-transit and at-rest
      
  - In Transit:
      - All API calls: TLS 1.2+
      - CloudFront: SSL/TLS certificates
      - Internal: VPC endpoints for AWS services
```

---

## 4. 모니터링 및 로깅

### 4.1 CloudWatch 설정
```yaml
Metrics:
  - Custom Metrics:
      - Learning session duration
      - AI model response time
      - User engagement rate
      - Error rates by function
      
  - Alarms:
      - Lambda error rate > 5%
      - API Gateway latency > 2s
      - DynamoDB throttling
      - S3 4xx/5xx errors
```

### 4.2 X-Ray 트레이싱
```yaml
Tracing:
  - Services:
      - API Gateway: All requests
      - Lambda: All functions
      - DynamoDB: All operations
      
  - Sampling Rules:
      - 10% of successful requests
      - 100% of error requests
      - Custom rules for critical paths
```

### 4.3 로그 관리
```yaml
LogGroups:
  - /aws/lambda/nova-english-*
  - /aws/apigateway/nova-english
  - /aws/cloudfront/nova-english
  
  Retention: 30 days
  Export: S3 for long-term storage
```

---

## 5. 성능 최적화

### 5.1 캐싱 전략
```yaml
Levels:
  - CloudFront:
      - Static assets: 1 year
      - API responses: 5 minutes
      - Dynamic content: No cache
      
  - ElastiCache:
      - User sessions: 1 hour
      - Generated content metadata: 24 hours
      - Frequently accessed data: 6 hours
      
  - Lambda:
      - Connection pooling for DynamoDB
      - Warm-up strategies
      - Memory optimization
```

### 5.2 Auto Scaling
```yaml
Scaling:
  - Lambda:
      - Concurrent executions: 1000
      - Reserved concurrency for critical functions
      
  - DynamoDB:
      - On-demand billing mode
      - Auto scaling for provisioned tables
      
  - ElastiCache:
      - Cluster mode for horizontal scaling
      - Read replicas for read-heavy workloads
```

---

## 6. 비용 최적화

### 6.1 비용 구조
```yaml
Monthly Estimates (1000 MAU):
  - Lambda: $50 (2M requests)
  - DynamoDB: $25 (On-demand)
  - S3: $30 (100GB storage + transfer)
  - CloudFront: $20 (1TB transfer)
  - Bedrock Nova: $200 (10K image generations)
  - ElastiCache: $50 (t3.micro cluster)
  - API Gateway: $35 (2M requests)
  
  Total: ~$410/month
```

### 6.2 최적화 전략
```yaml
Strategies:
  - Reserved Instances:
      - ElastiCache: 1-year term (30% savings)
      - CloudFront: Committed usage (20% savings)
      
  - Lifecycle Policies:
      - S3: IA after 30 days, Glacier after 90 days
      - CloudWatch Logs: 30-day retention
      
  - Resource Optimization:
      - Lambda memory tuning
      - DynamoDB capacity planning
      - S3 intelligent tiering
```

---

## 7. 재해 복구 및 백업

### 7.1 백업 전략
```yaml
Backups:
  - DynamoDB:
      - Point-in-time recovery: Enabled
      - Daily backups: 35-day retention
      - Cross-region replication: Optional
      
  - S3:
      - Versioning: Enabled
      - Cross-region replication: Critical buckets
      - MFA delete: Enabled for production
      
  - ElastiCache:
      - Daily snapshots: 7-day retention
      - Multi-AZ deployment
```

### 7.2 재해 복구 계획
```yaml
DR Strategy:
  - RTO (Recovery Time Objective): 4 hours
  - RPO (Recovery Point Objective): 1 hour
  
  Procedures:
    1. Route 53 health checks
    2. Cross-region failover
    3. Database restoration
    4. Application deployment
    
  Testing:
    - Monthly DR drills
    - Automated failover testing
```

---

## 8. 배포 및 CI/CD

### 8.1 배포 파이프라인
```yaml
Pipeline:
  - Source: GitHub
  - Build: CodeBuild
  - Test: Automated testing
  - Deploy: CodeDeploy + CloudFormation
  
  Environments:
    - Development: Auto-deploy on commit
    - Staging: Manual approval required
    - Production: Blue/green deployment
```

### 8.2 Infrastructure as Code
```yaml
Tools:
  - AWS CDK (TypeScript)
  - CloudFormation templates
  - Parameter Store for configuration
  
  Structure:
    - /infrastructure/stacks/
    - /infrastructure/constructs/
    - /infrastructure/config/
```

---

## 9. 보안 및 컴플라이언스

### 9.1 보안 체크리스트
```yaml
Security:
  - ✅ All data encrypted at rest and in transit
  - ✅ IAM roles follow least privilege principle
  - ✅ API Gateway has rate limiting
  - ✅ WAF rules configured for common attacks
  - ✅ VPC endpoints for AWS service communication
  - ✅ Security groups restrict unnecessary access
  - ✅ CloudTrail logging enabled
  - ✅ GuardDuty threat detection enabled
```

### 9.2 컴플라이언스
```yaml
Standards:
  - GDPR: User data handling and deletion
  - COPPA: Age verification for users under 13
  - SOC 2: AWS compliance inheritance
  - ISO 27001: Security management practices
```

---

## 10. 운영 및 유지보수

### 10.1 운영 절차
```yaml
Procedures:
  - Daily health checks
  - Weekly performance reviews
  - Monthly cost optimization
  - Quarterly security audits
  
  Automation:
    - Automated scaling
    - Self-healing systems
    - Proactive monitoring
```

### 10.2 업데이트 전략
```yaml
Updates:
  - Lambda functions: Blue/green deployment
  - Database schema: Migration scripts
  - Frontend: Rolling updates via CloudFront
  - Infrastructure: CloudFormation stack updates
```

---

**문서 승인**: ProjectLead Agent 검토 필요  
**다음 문서**: API 명세서 작성