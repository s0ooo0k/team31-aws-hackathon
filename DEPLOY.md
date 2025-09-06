# 배포 규칙
1. 로컬에 있는 코드 중 /nova-english-learning 내의 코드를 하나의 Docker image로 빌드하여 배포.
2. Image 빌드를 위해서 /nova-english-learning/Dockerfile 을 이용
3. ECR에 코드를 올리고, ECS+Fargate+ALB+CloudFront로 배포

### 리소스 이름
ECR: nova-english-learning
ECS 클러스터: nova-english-learning-cluster
ECS 서비스: nova-english-service
ALB: nova-english-alb-v2
CloudFront: E2KC4USFO0754G

### 주의할점
Docker로 이미지 빌드할 때는 linux/amd64에 맞춰서 빌드하기
ex. docker build --platform linux/amd64 -t nova-english-learning ./nova-english-learning

