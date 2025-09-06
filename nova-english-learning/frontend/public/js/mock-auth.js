// Mock 인증 시스템 (개발/테스트용)
class MockAuth {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('mockUsers') || '{}');
    this.pendingVerifications = JSON.parse(localStorage.getItem('mockPendingVerifications') || '{}');
  }

  // 회원가입
  signUp(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.users[email]) {
          reject(new Error('User already exists'));
          return;
        }

        // 임시 사용자 저장 (미확인 상태)
        this.pendingVerifications[email] = {
          password: password,
          code: Math.floor(100000 + Math.random() * 900000).toString()
        };
        localStorage.setItem('mockPendingVerifications', JSON.stringify(this.pendingVerifications));
        
        console.log(`Verification code for ${email}: ${this.pendingVerifications[email].code}`);
        resolve({ message: 'Verification code sent to email' });
      }, 500);
    });
  }

  // 이메일 확인
  confirmSignUp(email, code) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const pending = this.pendingVerifications[email];
        if (!pending) {
          reject(new Error('No pending verification found'));
          return;
        }

        if (pending.code !== code) {
          reject(new Error('Invalid verification code'));
          return;
        }

        // 사용자 등록 완료
        this.users[email] = {
          email: email,
          password: pending.password,
          verified: true
        };
        localStorage.setItem('mockUsers', JSON.stringify(this.users));
        
        // 대기 중인 확인 제거
        delete this.pendingVerifications[email];
        localStorage.setItem('mockPendingVerifications', JSON.stringify(this.pendingVerifications));
        
        resolve({ message: 'Email verified successfully' });
      }, 500);
    });
  }

  // 로그인
  signIn(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = this.users[email];
        if (!user) {
          reject(new Error('User not found'));
          return;
        }

        if (user.password !== password) {
          reject(new Error('Incorrect password'));
          return;
        }

        if (!user.verified) {
          reject(new Error('Email not verified'));
          return;
        }

        // JWT 토큰 시뮬레이션
        const token = btoa(JSON.stringify({
          email: email,
          exp: Date.now() + 3600000 // 1시간
        }));

        resolve({
          accessToken: token,
          user: { email: email }
        });
      }, 500);
    });
  }

  // 확인 코드 재전송
  resendCode(email) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const pending = this.pendingVerifications[email];
        if (!pending) {
          reject(new Error('No pending verification found'));
          return;
        }

        // 새 코드 생성
        pending.code = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem('mockPendingVerifications', JSON.stringify(this.pendingVerifications));
        
        console.log(`New verification code for ${email}: ${pending.code}`);
        resolve({ message: 'New verification code sent' });
      }, 500);
    });
  }
}

// 전역 Mock Auth 인스턴스
window.mockAuth = new MockAuth();
