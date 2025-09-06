// 하늘 테마 로고 생성기

function createSkyLogo(container, size = 'medium') {
  const sizes = {
    small: { width: 120, height: 40, fontSize: 16 },
    medium: { width: 180, height: 60, fontSize: 20 },
    large: { width: 240, height: 80, fontSize: 24 }
  };
  
  const config = sizes[size];
  
  const logoHTML = `
    <div class="sky-logo-container" style="
      position: relative;
      width: ${config.width}px;
      height: ${config.height}px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    ">
      <!-- 햇빛 배경 -->
      <div class="sun-rays" style="
        position: absolute;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at 30% 30%, 
          rgba(255, 223, 0, 0.3) 0%, 
          rgba(255, 255, 255, 0.1) 40%, 
          transparent 70%);
        animation: sun-glow 4s ease-in-out infinite;
      "></div>
      
      <!-- 구름 레이어 -->
      <div class="cloud-layer" style="
        position: absolute;
        width: 120%;
        height: 120%;
        background: 
          radial-gradient(ellipse 40px 20px at 20% 60%, rgba(255, 255, 255, 0.8) 0%, transparent 70%),
          radial-gradient(ellipse 30px 15px at 70% 40%, rgba(255, 255, 255, 0.6) 0%, transparent 70%),
          radial-gradient(ellipse 25px 12px at 50% 70%, rgba(255, 255, 255, 0.7) 0%, transparent 70%);
        animation: cloud-drift 8s ease-in-out infinite;
      "></div>
      
      <!-- 별빛 효과 -->
      <div class="star-sparkles" style="
        position: absolute;
        width: 100%;
        height: 100%;
      ">
        <div style="
          position: absolute;
          top: 15%;
          right: 20%;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, transparent 70%);
          border-radius: 50%;
          animation: star-twinkle 2s ease-in-out infinite;
        "></div>
        <div style="
          position: absolute;
          top: 70%;
          left: 15%;
          width: 3px;
          height: 3px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
          border-radius: 50%;
          animation: star-twinkle 3s ease-in-out infinite 0.5s;
        "></div>
        <div style="
          position: absolute;
          top: 40%;
          right: 10%;
          width: 2px;
          height: 2px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, transparent 70%);
          border-radius: 50%;
          animation: star-twinkle 2.5s ease-in-out infinite 1s;
        "></div>
      </div>
      
      <!-- 로고 텍스트 -->
      <div class="logo-text" style="
        position: relative;
        z-index: 10;
        font-family: 'Poppins', sans-serif;
        font-size: ${config.fontSize}px;
        font-weight: 700;
        background: linear-gradient(135deg, 
          #E0F6FF 0%, 
          #87CEEB 30%, 
          #4682B4 70%, 
          #2F4F4F 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-shadow: 
          0 0 10px rgba(255, 255, 255, 0.5),
          0 0 20px rgba(135, 206, 235, 0.3);
        animation: logo-glow 3s ease-in-out infinite;
        letter-spacing: 1px;
      ">
        ☁️ NOVA SKY
      </div>
    </div>
  `;
  
  container.innerHTML = logoHTML;
}

// 심플 버전 (작은 공간용)
function createSimpleSkyLogo(container) {
  const logoHTML = `
    <div class="simple-sky-logo" style="
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
    ">
      <div style="
        position: relative;
        display: inline-block;
      ">
        <span style="
          font-size: 20px;
          filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
          animation: float 3s ease-in-out infinite;
        ">☁️</span>
        <span style="
          position: absolute;
          top: -2px;
          right: -2px;
          font-size: 8px;
          animation: star-twinkle 2s ease-in-out infinite;
        ">✨</span>
      </div>
      <span style="
        background: linear-gradient(135deg, #87CEEB 0%, #4682B4 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-size: 16px;
      ">NOVA</span>
    </div>
  `;
  
  container.innerHTML = logoHTML;
}

// CSS 애니메이션 추가
function addSkyLogoStyles() {
  if (!document.querySelector('#sky-logo-styles')) {
    const style = document.createElement('style');
    style.id = 'sky-logo-styles';
    style.textContent = `
      @keyframes sun-glow {
        0%, 100% { 
          opacity: 0.6;
          transform: scale(1);
        }
        50% { 
          opacity: 0.9;
          transform: scale(1.1);
        }
      }
      
      @keyframes cloud-drift {
        0%, 100% { 
          transform: translateX(0px) translateY(0px);
        }
        50% { 
          transform: translateX(10px) translateY(-5px);
        }
      }
      
      @keyframes star-twinkle {
        0%, 100% { 
          opacity: 0.4;
          transform: scale(0.8);
        }
        50% { 
          opacity: 1;
          transform: scale(1.2);
        }
      }
      
      @keyframes logo-glow {
        0%, 100% { 
          text-shadow: 
            0 0 10px rgba(255, 255, 255, 0.5),
            0 0 20px rgba(135, 206, 235, 0.3);
        }
        50% { 
          text-shadow: 
            0 0 15px rgba(255, 255, 255, 0.7),
            0 0 30px rgba(135, 206, 235, 0.5);
        }
      }
      
      @keyframes float {
        0%, 100% { 
          transform: translateY(0px);
        }
        50% { 
          transform: translateY(-3px);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// 자동 초기화
document.addEventListener('DOMContentLoaded', () => {
  addSkyLogoStyles();
  
  // 기존 로고들을 자동으로 교체
  const logoSelectors = [
    '.logo h1',
    '.sky-logo h1', 
    '.logo-text',
    '[class*="logo"]'
  ];
  
  logoSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      if (element.textContent.includes('NOVA') || element.textContent.includes('SPEAK')) {
        const container = element.closest('.logo') || element.parentElement;
        if (container && !container.querySelector('.sky-logo-container')) {
          createSimpleSkyLogo(container);
          element.style.display = 'none';
        }
      }
    });
  });
});