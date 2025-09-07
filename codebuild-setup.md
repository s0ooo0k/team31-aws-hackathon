# CodeBuild CI/CD Setup

## Created Resources

- **CodeBuild Project**: `nova-english-learning-build`
- **Service Role**: `CodeBuildServiceRole`
- **Build Spec**: `buildspec.yml`

## Setup Process


1. CodeBuild project monitors GitHub repository
2. On push to main branch, builds Docker image
3. Pushes image to ECR with commit hash tag
4. Creates `imagedefinitions.json` for ECS deployment

## Manual Trigger

```bash
aws codebuild start-build --project-name nova-english-learning-build
```

## Next Steps

1. GitHub webhook 설정 (자동 빌드 트리거)
2. CodePipeline 생성 (CodeBuild + ECS 배포 연결)
3. ECS 서비스 업데이트 자동화
