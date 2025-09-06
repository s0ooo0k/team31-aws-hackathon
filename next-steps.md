# 다음 단계: CI/CD 완성

## 1. GitHub 연동 (수동 설정 필요)

AWS Console에서 다음 작업 수행:

### CodeBuild 프로젝트 수정
1. AWS Console → CodeBuild → `nova-english-learning-build`
2. Edit → Source → GitHub 연결
3. OAuth 토큰으로 GitHub 계정 연결
4. Webhook 설정: Push events, Branch filter: `^refs/heads/main$`

## 2. 현재 상태

✅ **완료된 작업:**
- S3 버킷 + CloudFront CDN
- ECR 저장소
- ECS 클러스터
- CodeBuild 프로젝트
- buildspec.yml

⏳ **수동 설정 필요:**
- GitHub OAuth 연결
- Webhook 설정

## 3. 테스트 방법

```bash
# 수동 빌드 실행
aws codebuild start-build --project-name nova-english-learning-build

# 빌드 상태 확인
aws codebuild batch-get-builds --ids <build-id>
```

## 4. 자동 배포 완성 후

1. `main` 브랜치에 push
2. CodeBuild 자동 실행
3. Docker 이미지 ECR 업로드
4. ECS 서비스 수동 업데이트 (또는 CodePipeline 추가)
