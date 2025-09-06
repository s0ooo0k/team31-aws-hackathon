# AWS Cognito 설정 가이드

## 1. AWS Cognito User Pool 생성

### AWS 콘솔에서 설정:
1. AWS 콘솔에 로그인 → Cognito 서비스로 이동
2. "User pools" → "Create user pool" 클릭

### 기본 설정:
- **Authentication providers**: Email
- **Required attributes**: Email
- **Password policy**: 최소 8자 이상
- **MFA**: 선택사항 (권장: SMS 또는 TOTP)

### App client 설정:
- **App client name**: nova-english-app
- **Generate client secret**: 체크 해제 (JavaScript에서는 사용 안함)
- **Auth flows**: "ALLOW_USER_PASSWORD_AUTH" 활성화

## 2. 설정 값 업데이트

생성 완료 후 다음 값들을 복사:

### User Pool ID
- User Pool 상세 페이지에서 "User pool ID" 복사
- 형식: `ap-northeast-2_XXXXXXXXX`

### App Client ID  
- "App integration" 탭 → App client 클릭
- "Client ID" 복사
- 형식: `XXXXXXXXXXXXXXXXXXXXXXXXXX`

## 3. 코드 업데이트

`frontend/public/js/cognito-config.js` 파일에서 다음 값들을 교체:

```javascript
const AWS_CONFIG = {
  region: 'ap-northeast-2',
  userPoolId: 'ap-northeast-2_XXXXXXXXX', // 실제 User Pool ID로 교체
  clientId: 'XXXXXXXXXXXXXXXXXXXXXXXXXX' // 실제 Client ID로 교체
};
```

## 4. 테스트

1. 웹 애플리케이션 실행
2. 회원가입 테스트
3. 이메일 확인 코드 입력
4. 로그인 테스트

## 5. 주요 기능

- ✅ 이메일 기반 회원가입
- ✅ 이메일 인증
- ✅ 로그인/로그아웃
- ✅ 비밀번호 정책 적용
- ✅ JWT 토큰 기반 인증

## 6. 비용

- 월 50,000 MAU까지 무료
- 이후 MAU당 $0.0055

## 문제 해결

### 일반적인 오류:
- **User Pool ID 형식 오류**: `ap-northeast-2_` 접두사 확인
- **CORS 오류**: App client 설정에서 도메인 허용 확인
- **Auth flow 오류**: "ALLOW_USER_PASSWORD_AUTH" 활성화 확인
