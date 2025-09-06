# Nova English Learning - AWS 배포 상태

## 배포 개요
- **프로젝트**: Nova English Learning MVP
- **환경**: Development (dev)
- **리전**: us-east-1
- **배포 시작**: 2025-09-05 21:19:40 UTC

## 전체 스택 구조

| 순서 | 스택명 | 상태 | 주요 리소스 | 의존성 |
|------|--------|------|-------------|--------|
| 1 | `nova-storage-dev` | ✅ **완료** | S3, DynamoDB | 없음 |
| 2 | `nova-cognito-dev` | ⏳ 예정 | Cognito User Pool | 없음 |
| 3 | `nova-iam-dev` | ⏳ 예정 | IAM Roles, Policies | 없음 |
| 4 | `nova-compute-dev` | ⏳ 예정 | ECR, ECS, ALB | IAM |
| 5 | `nova-cdn-dev` | ⏳ 예정 | CloudFront | S3 |

## 배포된 스택

### 1. nova-storage-dev ✅ **완료**
**스택 ID**: `arn:aws:cloudformation:us-east-1:471112588210:stack/nova-storage-dev/1f6640f0-8aa4-11f0-810e-1289bf4a5721`

**상태**: `UPDATE_COMPLETE`

**포함된 리소스**:
- **S3 버킷**: `nova-english-learning-dev-471112588210`
  - 프론트엔드 호스팅 (frontend/)
  - 이미지 저장 (images/)
  - 대화 데이터 저장 (conversations/)
  
- **DynamoDB 테이블** (4개):
  - `nova-english-learning-users-dev` - 사용자 프로필
  - `nova-english-learning-sessions-dev` - 학습 세션
  - `nova-english-learning-turns-dev` - 턴별 대화 + 이미지 메타데이터
  - `nova-english-learning-evaluations-dev` - Nova Pro 평가 결과

**설정**:
- BillingMode: PAY_PER_REQUEST (온디맨드)
- Point-in-Time Recovery: 활성화
- DynamoDB Streams: 활성화

**생성된 리소스**:
- ✅ S3 버킷: `nova-english-learning-dev-471112588210`
- ✅ S3 Bucket Policy (퍼블릭 읽기 권한)
- ✅ DynamoDB 테이블 4개 (Users, Sessions, Turns, Evaluations)

## 다음 배포 예정

### 2. nova-cognito-dev ⏳
**템플릿**: `01-cognito.yaml`
- Cognito User Pool
- User Pool Client  
- User Pool Domain

### 3. nova-iam-dev ⏳
**템플릿**: `03-iam.yaml`
- ECS Task Role
- ECS Execution Role
- Bedrock 접근 정책 (Nova Sonic, Nova Pro, Nova Canvas)
- S3/DynamoDB 접근 정책

### 4. nova-compute-dev ⏳
**템플릿**: `04-compute.yaml`
- ECR Repository
- ECS Fargate Cluster
- ECS Service (단일 AZ)
- Application Load Balancer
- Security Groups

### 5. nova-cdn-dev ⏳
**템플릿**: `05-cdn.yaml`
- CloudFront Distribution
- S3 Origin Access Control

## 예상 비용 (월)
- **현재 스택**: ~$5/월 (S3 + DynamoDB)
- **전체 완료 시**: ~$76/월

## 배포 명령어 기록
```bash
# 스토리지 스택 배포
aws cloudformation create-stack \
  --stack-name nova-storage-dev \
  --template-body file://cloudformation/02-storage.yaml \
  --parameters file://parameters/dev-params.json \
  --region us-east-1

# 상태 확인
aws cloudformation describe-stacks \
  --stack-name nova-storage-dev \
  --region us-east-1
```

## 배포 명령어 (순서대로)
```bash
# 1. 스토리지 (완료)
aws cloudformation create-stack --stack-name nova-storage-dev --template-body file://cloudformation/02-storage.yaml --parameters file://parameters/dev-params.json --region us-east-1

# 2. 인증 (다음)
aws cloudformation create-stack --stack-name nova-cognito-dev --template-body file://cloudformation/01-cognito.yaml --parameters file://parameters/dev-params.json --region us-east-1

# 3. IAM
aws cloudformation create-stack --stack-name nova-iam-dev --template-body file://cloudformation/03-iam.yaml --parameters file://parameters/dev-params.json --capabilities CAPABILITY_IAM --region us-east-1

# 4. 컴퓨팅
aws cloudformation create-stack --stack-name nova-compute-dev --template-body file://cloudformation/04-compute.yaml --parameters file://parameters/dev-params.json --region us-east-1

# 5. CDN
aws cloudformation create-stack --stack-name nova-cdn-dev --template-body file://cloudformation/05-cdn.yaml --parameters file://parameters/dev-params.json --region us-east-1
```

## 문제 해결 기록
1. **DynamoDB BillingMode 오류**: `ON_DEMAND` → `PAY_PER_REQUEST`로 수정
2. **S3 Bucket Policy 실패**: 잘못된 Resource 경로 → `arn:aws:s3:::${BucketName}/*` 형식으로 수정
3. **스택 재배포**: 실패 시 삭제 후 재생성으로 해결

---
*마지막 업데이트: 2025-09-05 22:30 UTC*