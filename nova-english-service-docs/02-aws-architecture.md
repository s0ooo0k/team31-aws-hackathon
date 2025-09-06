# Nova 영어 학습 서비스 AWS 아키텍처

**프로젝트명**: Nova English Learning Service  
**작성일**: 2025년 1월  
**버전**: 2.0  
**작성자**: Cloud Architect

---

## 1. 아키텍처 개요

### 1.1 전체 시스템 아키텍처
```
┌─────────────────────────────────────────────────────────────────┐
│                        Internet Users                            │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                   Route 53 DNS                                  │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                 CloudFront CDN                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Origin 1: S3 Static Website (React App)                │   │
│  │ Origin 2: ALB (API Endpoints)                           │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌───────────────┐            ┌─────────────────┐
│   S3 Bucket   │            │ Application     │
│ (Static Web)  │            │ Load Balancer   │
│               │            │     (ALB)       │
└───────────────┘            └─────────┬───────┘
                                       │
                             ┌─────────▼───────┐
                             │   ECS Fargate   │
                             │    Cluster      │
                             │                 │
                             │ ┌─────────────┐ │
                             │ │   Task 1    │ │
                             │ │ (API Server)│ │
                             │ └─────────────┘ │
                             │ ┌─────────────┐ │
                             │ │   Task 2    │ │
                             │ │ (API Server)│ │
                             │ └─────────────┘ │
                             └─────────┬───────┘
                                       │
        ┌──────────────────────────────┼──────────────────────────────┐
        │                              │                              │
        ▼                              ▼                              ▼
┌─────────────┐              ┌─────────────────┐            ┌─────────────┐
│  DynamoDB   │              │   Amazon S3     │            │   Amazon    │
│             │              │                 │            │  Bedrock    │
│ ┌─────────┐ │              │ ┌─────────────┐ │            │             │
│ │ Users   │ │              │ │   Images    │ │            │ ┌─────────┐ │
│ └─────────┘ │              │ └─────────────┘ │            │ │Nova     │ │
│ ┌─────────┐ │              │ ┌─────────────┐ │            │ │Sonic    │ │
│ │Sessions │ │              │ │Audio Files  │ │            │ └─────────┘ │
│ └─────────┘ │              │ └─────────────┘ │            │ ┌─────────┐ │
│ ┌─────────┐ │              │ ┌─────────────┐ │            │ │Claude   │ │
│ │Progress │ │              │ │Conversation │ │            │ │4.0      │ │
│ └─────────┘ │              │ │   Logs      │ │            │ └─────────┘ │
└─────────────┘              │ └─────────────┘ │            │ ┌─────────┐ │
                             └─────────────────┘            │ │Nova     │ │
                                                            │ │Canvas   │ │
┌─────────────┐                                            │ └─────────┘ │
│   Cognito   │                                            └─────────────┘
│ User Pool   │
│             │
│ ┌─────────┐ │
│ │Identity │ │
│ │Provider │ │
│ └─────────┘ │
└─────────────┘
```

### 1.2 네트워크 아키텍처
```
VPC (10.0.0.0/16)
├── Public Subnet A (10.0.1.0/24) - us-east-1a
│   ├── ALB (Internet-facing)
│   └── NAT Gateway
├── Public Subnet B (10.0.2.0/24) - us-east-1b
│   └── ALB (Internet-facing)
├── Private Subnet A (10.0.11.0/24) - us-east-1a
│   └── ECS Fargate Tasks
└── Private Subnet B (10.0.12.0/24) - us-east-1b
    └── ECS Fargate Tasks
```

---

## 2. 핵심 AWS 서비스 구성

### 2.1 프론트엔드 인프라

#### 2.1.1 Amazon S3 (정적 웹사이트 호스팅)
```yaml
S3 Configuration:
  Bucket Name: nova-english-frontend-prod
  Website Hosting: Enabled
  Public Access: Blocked (CloudFront Only)
  Versioning: Enabled
  
  Bucket Policy:
    - Allow CloudFront OAI access only
    - Deny direct public access
    
  Objects:
    - React build files (HTML, CSS, JS)
    - Static assets (images, fonts)
    - Service worker for PWA
```

#### 2.1.2 Amazon CloudFront
```yaml
CloudFront Distribution:
  Origins:
    - S3 Static Website (Primary)
    - ALB API Endpoints (Secondary)
  
  Behaviors:
    - Default: S3 Origin (React App)
    - /api/*: ALB Origin (API Routes)
    - /auth/*: ALB Origin (Authentication)
  
  Caching:
    - Static Assets: 1 year TTL
    - HTML Files: 1 hour TTL
    - API Responses: No cache
  
  Security:
    - SSL Certificate (ACM)
    - Security Headers
    - WAF Integration
```

### 2.2 백엔드 컨테이너 인프라

#### 2.2.1 Amazon ECS Fargate
```yaml
ECS Cluster:
  Name: nova-english-cluster
  Capacity Providers: [FARGATE, FARGATE_SPOT]
  
Service Configuration:
  Service Name: nova-api-service
  Task Definition: nova-api-task
  Desired Count: 2
  Min Capacity: 1
  Max Capacity: 10
  
  Auto Scaling:
    Target CPU: 70%
    Target Memory: 80%
    Scale Out Cooldown: 300s
    Scale In Cooldown: 300s
  
  Network:
    VPC: nova-vpc
    Subnets: [private-subnet-a, private-subnet-b]
    Security Groups: [ecs-sg]
```

#### 2.2.2 Task Definition
```json
{
  "family": "nova-api-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::account:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "nova-api",
      "image": "account.dkr.ecr.us-east-1.amazonaws.com/nova-api:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "AWS_REGION", "value": "us-east-1"}
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:account:secret:nova-db-credentials"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/nova-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      }
    }
  ]
}
```

#### 2.2.3 Application Load Balancer
```yaml
ALB Configuration:
  Name: nova-english-alb
  Scheme: internet-facing
  Type: application
  
  Listeners:
    - Port: 80 (HTTP -> HTTPS Redirect)
    - Port: 443 (HTTPS)
      SSL Certificate: ACM Certificate
      
  Target Groups:
    - Name: nova-api-tg
      Protocol: HTTP
      Port: 3000
      Health Check:
        Path: /health
        Interval: 30s
        Timeout: 5s
        Healthy Threshold: 2
        Unhealthy Threshold: 3
  
  Security Groups:
    - Allow HTTP/HTTPS from Internet
    - Allow outbound to ECS tasks
```

### 2.3 데이터 저장소

#### 2.3.1 Amazon DynamoDB
```yaml
Tables:
  Users:
    Partition Key: userId (String)
    Billing Mode: On-Demand
    Encryption: AWS Managed
    Point-in-time Recovery: Enabled
    
  Conversations:
    Partition Key: sessionId (String)
    Sort Key: timestamp (Number)
    GSI: userId-timestamp-index
    Billing Mode: On-Demand
    TTL: 90 days
    
  Images:
    Partition Key: imageId (String)
    GSI: category-index
    Billing Mode: On-Demand
    Pre-populated: 25 Nova Canvas generated images
    
  UserProgress:
    Partition Key: userId (String)
    Sort Key: date (String)
    Billing Mode: On-Demand
```

#### 2.3.2 Amazon S3 (데이터 저장)
```yaml
Buckets:
  nova-learning-images:
    Purpose: Pre-generated Nova Canvas images (25 images)
    Versioning: Enabled
    Lifecycle: 
      - Retain indefinitely (core learning content)
    Access: Private (Pre-signed URLs)
    
  nova-audio-files:
    Purpose: Real-time conversation audio
    Versioning: Disabled
    Lifecycle:
      - Delete objects after 30 days
    Encryption: AES-256
    
  nova-conversation-logs:
    Purpose: Conversation transcripts and analysis
    Versioning: Enabled
    Lifecycle:
      - IA after 30 days
      - Glacier after 90 days
    Compression: Enabled
```

### 2.4 AI 서비스 (Amazon Bedrock)

#### 2.4.1 Nova Sonic (Speech-to-Speech)
```yaml
Model Configuration:
  Model ID: amazon.nova-sonic-v1:0
  Use Case: Real-time guided conversation
  
  Input Format:
    - Audio: WAV, MP3 (16kHz, 16-bit)
    - Max Duration: 30 seconds
    
  Output Format:
    - Audio: WAV (16kHz, 16-bit)
    - Conversation guidance and follow-up questions
    - Natural conversational responses
    
  Performance:
    - Latency: < 2 seconds
    - Throughput: 100 concurrent conversations
    - Audio: WAV (16kHz, 16-bit)
    - Metadata: Confidence scores, timing
    
  Performance:
    - Latency: < 2 seconds
    - Throughput: 100 concurrent requests
```

#### 2.4.2 Claude 4.0 (Conversation Analysis)
```yaml
Model Configuration:
  Model ID: anthropic.claude-3-5-sonnet-20241022-v2:0
  Use Case: Post-conversation analysis and insights
  
  Input Limits:
    - Max Tokens: 4096
    - Context Window: 200k tokens
    
  Output Format:
    - Conversation quality assessment
    - Learning progress insights
    - Personalized recommendations
```

#### 2.4.3 Nova Canvas (Pre-generated Images)
```yaml
Model Configuration:
  Model ID: amazon.nova-canvas-v1:0
  Use Case: Pre-generated educational images (25 total)
  
  Parameters:
    - Resolution: 1024x1024
    - Style: Photorealistic educational
    - Safety Filters: Enabled
    - Categories: 5 categories × 5 images each
    
  Output:
    - Format: PNG, JPEG
    - Quality: High resolution for detailed description
    - Metadata: Conversation objectives and guidance
```

### 2.5 인증 및 보안

#### 2.5.1 Amazon Cognito
```yaml
User Pool:
  Name: nova-english-users
  
  Authentication:
    - Username: Email
    - Password Policy: 
      - Min Length: 8
      - Require: Uppercase, Lowercase, Numbers
    - MFA: Optional (SMS, TOTP)
    
  Attributes:
    - Email (Required, Verified)
    - Name (Required)
    - Custom: learning_level, interests
    
  Triggers:
    - Pre Sign-up: Email validation
    - Post Confirmation: Create DynamoDB record
    
Identity Pool:
  Name: nova-english-identity
  
  Roles:
    - Authenticated: Access to API, S3, DynamoDB
    - Unauthenticated: Limited read access
```

#### 2.5.2 IAM 역할 및 정책
```yaml
ECS Task Role:
  Policies:
    - DynamoDB: Read/Write to user tables
    - S3: Read/Write to designated buckets
    - Bedrock: Invoke AI models
    - Secrets Manager: Read database credentials
    
ECS Execution Role:
  Policies:
    - ECR: Pull container images
    - CloudWatch: Write logs
    - Secrets Manager: Read secrets
    
Lambda Execution Role:
  Policies:
    - DynamoDB: Read/Write
    - S3: Read/Write
    - Cognito: User management
```

---

## 3. 네트워크 및 보안

### 3.1 VPC 구성
```yaml
VPC:
  CIDR: 10.0.0.0/16
  DNS Hostnames: Enabled
  DNS Resolution: Enabled
  
Subnets:
  Public Subnets:
    - public-subnet-a: 10.0.1.0/24 (us-east-1a)
    - public-subnet-b: 10.0.2.0/24 (us-east-1b)
    
  Private Subnets:
    - private-subnet-a: 10.0.11.0/24 (us-east-1a)
    - private-subnet-b: 10.0.12.0/24 (us-east-1b)
    
Route Tables:
  Public Route Table:
    - 0.0.0.0/0 -> Internet Gateway
    
  Private Route Table:
    - 0.0.0.0/0 -> NAT Gateway
    - 10.0.0.0/16 -> Local
```

### 3.2 보안 그룹
```yaml
ALB Security Group:
  Inbound:
    - Port 80: 0.0.0.0/0 (HTTP)
    - Port 443: 0.0.0.0/0 (HTTPS)
  Outbound:
    - Port 3000: ECS Security Group (API)
    
ECS Security Group:
  Inbound:
    - Port 3000: ALB Security Group
  Outbound:
    - Port 443: 0.0.0.0/0 (HTTPS)
    - Port 80: 0.0.0.0/0 (HTTP)
```

### 3.3 SSL/TLS 구성
```yaml
ACM Certificate:
  Domain: api.nova-english.com
  Validation: DNS
  
CloudFront:
  SSL Certificate: ACM Certificate
  Security Policy: TLSv1.2_2021
  
ALB:
  SSL Certificate: ACM Certificate
  Security Policy: ELBSecurityPolicy-TLS-1-2-2017-01
```

---

## 4. 모니터링 및 로깅

### 4.1 Amazon CloudWatch
```yaml
Metrics:
  ECS Metrics:
    - CPU Utilization
    - Memory Utilization
    - Task Count
    - Service Events
    
  ALB Metrics:
    - Request Count
    - Response Time
    - Error Rate
    - Target Health
    
  DynamoDB Metrics:
    - Read/Write Capacity
    - Throttled Requests
    - Item Count
    
  Custom Metrics:
    - API Response Time
    - User Session Duration
    - AI Model Latency
    - Error Rates by Endpoint
```

### 4.2 로그 관리
```yaml
Log Groups:
  /ecs/nova-api:
    Retention: 30 days
    
  /aws/lambda/nova-functions:
    Retention: 14 days
    
  /aws/apigateway/nova-api:
    Retention: 7 days
    
Log Streams:
  - Application logs
  - Access logs
  - Error logs
  - Performance logs
```

### 4.3 알림 및 경고
```yaml
CloudWatch Alarms:
  High CPU Usage:
    Threshold: > 80%
    Period: 5 minutes
    Action: SNS notification + Auto Scaling
    
  High Error Rate:
    Threshold: > 5%
    Period: 2 minutes
    Action: SNS notification
    
  DynamoDB Throttling:
    Threshold: > 0
    Period: 1 minute
    Action: SNS notification
    
SNS Topics:
  - nova-alerts-critical
  - nova-alerts-warning
  - nova-alerts-info
```

---

## 5. 백업 및 재해 복구

### 5.1 데이터 백업
```yaml
DynamoDB:
  Point-in-time Recovery: Enabled
  Backup Retention: 35 days
  Cross-region Backup: Enabled (us-west-2)
  
S3:
  Versioning: Enabled
  Cross-region Replication: us-west-2
  Lifecycle Policies:
    - IA: 30 days
    - Glacier: 90 days
    - Deep Archive: 365 days
```

### 5.2 재해 복구 계획
```yaml
RTO (Recovery Time Objective): 4 hours
RPO (Recovery Point Objective): 1 hour

Disaster Recovery Strategy:
  Primary Region: us-east-1
  DR Region: us-west-2
  
  Failover Process:
    1. Route 53 health check failure
    2. Automatic DNS failover
    3. Activate standby resources in DR region
    4. Restore data from backups
    5. Update application configuration
```

---

## 6. 비용 최적화

### 6.1 예상 월간 비용 (USD)
```yaml
Compute:
  ECS Fargate: $45
    - 2 tasks × 0.5 vCPU × 1GB RAM × 24/7
  ALB: $16
    - Base cost + LCU charges
    
Storage:
  S3: $10
    - 25 pre-generated images + conversation audio
  DynamoDB: $20
    - On-demand pricing (reduced with pre-generated content)
    
AI Services:
  Bedrock Nova Sonic: $80
    - Real-time conversation processing (increased usage)
  Bedrock Claude 4.0: $15
    - Post-conversation analysis (reduced frequency)
  Bedrock Nova Canvas: $5
    - One-time generation cost amortized
    
Network:
  CloudFront: $10
    - 1TB data transfer
  Data Transfer: $8
    - WebSocket real-time communication
    
Other:
  Cognito: $5
    - 10,000 MAU
  CloudWatch: $12
    - Enhanced real-time monitoring
    
Total Estimated Cost: $226/month
```

### 6.2 비용 최적화 전략
```yaml
Compute Optimization:
  - Fargate Spot instances for background tasks
  - WebSocket connection pooling
  - Efficient real-time streaming
  
Storage Optimization:
  - Pre-generated images reduce Nova Canvas costs
  - Conversation audio lifecycle management
  - Intelligent tiering for conversation logs
  
AI Services Optimization:
  - Real-time streaming reduces latency costs
  - Focused Nova Sonic usage for conversations
  - Reduced Claude 4.0 usage with targeted analysis
```

---

## 7. 확장성 및 성능

### 7.1 자동 스케일링
```yaml
ECS Service Auto Scaling:
  Target Tracking:
    - CPU: 70%
    - Memory: 80%
    - ALB Request Count: 1000/minute
  
  Step Scaling:
    - Scale Out: +2 tasks when CPU > 80%
    - Scale In: -1 task when CPU < 50%
    
DynamoDB Auto Scaling:
  Read Capacity:
    - Target: 70%
    - Min: 5 RCU
    - Max: 4000 RCU
    
  Write Capacity:
    - Target: 70%
    - Min: 5 WCU
    - Max: 4000 WCU
```

### 7.2 성능 최적화
```yaml
Caching Strategy:
  CloudFront:
    - Static assets: 1 year
    - API responses: No cache
    
  Application Level:
    - Redis for session data
    - In-memory caching for frequent queries
    
Database Optimization:
  DynamoDB:
    - Proper partition key design
    - GSI for query patterns
    - Batch operations
    
  S3:
    - Transfer acceleration
    - Multi-part uploads
    - CloudFront integration
```

이 AWS 아키텍처는 확장 가능하고 비용 효율적이며 고성능의 Nova 영어 학습 서비스를 제공하기 위해 설계되었습니다.