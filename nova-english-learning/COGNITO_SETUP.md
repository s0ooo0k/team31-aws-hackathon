# AWS Cognito 설정 가이드

## 1. AWS Cognito User Pool 생성

### CloudFormation 사용 (권장)
```bash
aws cloudformation create-stack \
  --stack-name nova-cognito \
  --template-body file://cognito-setup.yaml \
  --region ap-northeast-2
```

### 수동 설정
1. AWS Console에서 Cognito 서비스로 이동
2. "User pools" 선택
3. "Create user pool" 클릭
4. 다음 설정 적용:
   - Pool name: `nova-english-learning-users`
   - Sign-in options: Email
   - Password policy: 최소 8자, 대소문자 포함, 숫자 포함
   - MFA: Optional (선택사항)
   - Email verification: Required

## 2. App Client 생성
1. 생성된 User Pool에서 "App integration" 탭 선택
2. "App clients" 섹션에서 "Create app client" 클릭
3. 설정:
   - App client name: `nova-english-learning-client`
   - Authentication flows: `USER_PASSWORD_AUTH` 체크
   - Generate client secret: 체크 해제

## 3. 설정 파일 업데이트

`frontend/public/js/cognito-config.js` 파일에서 다음 값들을 업데이트:

```javascript
const AWS_CONFIG = {
  region: 'ap-northeast-2',
  userPoolId: 'YOUR_USER_POOL_ID', // User Pool ID로 교체
  clientId: 'YOUR_CLIENT_ID' // App Client ID로 교체
};
```

## 4. 기능 설명

### 로그인
- 이메일과 비밀번호로 로그인
- JWT 토큰을 localStorage에 저장
- 성공 시 categories 페이지로 리다이렉트

### 회원가입
- 이메일과 비밀번호로 회원가입
- 이메일 확인 코드 전송
- 확인 후 로그인 가능

### 이메일 확인
- 회원가입 후 이메일로 전송된 코드 입력
- 코드 재전송 기능 제공

## 5. 보안 고려사항

- 비밀번호는 최소 8자 이상, 대소문자 및 숫자 포함
- JWT 토큰은 localStorage에 저장 (프로덕션에서는 httpOnly 쿠키 권장)
- HTTPS 사용 필수 (프로덕션 환경)

## 6. 테스트

1. 회원가입 테스트
2. 이메일 확인 테스트
3. 로그인 테스트
4. 토큰 저장 및 페이지 리다이렉트 테스트
