# 🚀 Nova English Learning - Quick Setup

## AWS Cognito 수동 설정 (5분 완료)

### 1. AWS 콘솔에서 User Pool 생성

1. **AWS 콘솔** → **Cognito** → **User pools** → **Create user pool**

2. **Step 1: Configure sign-in experience**
   - ✅ Email

3. **Step 2: Configure security requirements**
   - Password policy: Default (8자 이상)
   - MFA: No MFA (선택사항)

4. **Step 3: Configure sign-up experience**
   - ✅ Enable self-registration
   - Required attributes: Email

5. **Step 4: Configure message delivery**
   - Email: Send email with Cognito

6. **Step 5: Integrate your app**
   - User pool name: `nova-english-user-pool`
   - App client name: `nova-english-app`
   - ❌ Generate a client secret (체크 해제)

7. **Review and create**

### 2. 설정값 복사

생성 완료 후:
- **User pool ID**: `ap-northeast-2_XXXXXXXXX`
- **App client ID**: `XXXXXXXXXXXXXXXXXXXXXXXXXX`

### 3. 자동 설정 업데이트

```bash
cd nova-english-learning
./update-config.sh
```

입력 요청 시 위에서 복사한 값들을 붙여넣기

### 4. 테스트

```bash
# 개발 서버 실행 (예시)
cd frontend
python -m http.server 3000
```

브라우저에서 `http://localhost:3000/login.html` 접속하여 테스트

## 완료! 🎉

이제 다음 기능들이 작동합니다:
- ✅ 회원가입 (이메일 인증)
- ✅ 로그인/로그아웃
- ✅ JWT 토큰 기반 인증
