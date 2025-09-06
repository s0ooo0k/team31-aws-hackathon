# AWS Cognito 수동 설정 (필수)

## 1. AWS 콘솔에서 User Pool 생성

### 단계별 설정:

1. **AWS 콘솔** → **Amazon Cognito** → **User pools** → **Create user pool**

2. **Step 1: Configure sign-in experience**
   - ✅ **Email** (Username attributes)

3. **Step 2: Configure security requirements**
   - **Password policy**: Default
   - **Multi-factor authentication**: No MFA

4. **Step 3: Configure sign-up experience**
   - ✅ **Enable self-registration**
   - **Required attributes**: Email
   - **Verification**: Email

5. **Step 4: Configure message delivery**
   - **Email provider**: Send email with Cognito

6. **Step 5: Integrate your app**
   - **User pool name**: `nova-english-user-pool`
   - **App client name**: `nova-english-app`
   - ❌ **Generate a client secret** (체크 해제 - 중요!)
   - **Authentication flows**: 
     - ✅ ALLOW_USER_PASSWORD_AUTH
     - ✅ ALLOW_REFRESH_TOKEN_AUTH

7. **Review and create**

## 2. 설정값 복사

생성 완료 후 다음 값들을 복사:

### User Pool 상세 페이지에서:
- **User pool ID**: `ap-northeast-2_XXXXXXXXX`

### App integration 탭 → App clients에서:
- **Client ID**: `XXXXXXXXXXXXXXXXXXXXXXXXXX`

## 3. 설정 업데이트

아래 명령어 실행:

```bash
cd nova-english-learning
./update-config.sh
```

또는 직접 `frontend/public/js/cognito-config.js` 파일 수정:

```javascript
const AWS_CONFIG = {
  region: 'ap-northeast-2',
  userPoolId: 'ap-northeast-2_XXXXXXXXX', // 실제 값으로 교체
  clientId: 'XXXXXXXXXXXXXXXXXXXXXXXXXX' // 실제 값으로 교체
};
```

## 4. 테스트

1. 웹 서버 실행
2. `/login.html` 접속
3. 회원가입 테스트
4. 이메일 확인 코드 입력
5. 로그인 테스트

## ⚠️ 중요 사항

- **Client secret 생성 안함**: JavaScript에서는 사용할 수 없음
- **ALLOW_USER_PASSWORD_AUTH 활성화**: 필수 설정
- **이메일 인증 활성화**: 보안을 위해 권장
