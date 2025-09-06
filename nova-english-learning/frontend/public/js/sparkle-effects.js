// 하늘을 나는 느낌의 반짝이고 빛나는 효과

// 햇빛 효과 생성
function createSunlightEffects() {
  const sunContainer = document.createElement('div');
  sunContainer.className = 'sunlight-container';
  sunContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    opacity: 0.6;
  `;
  document.body.appendChild(sunContainer);

  // 하얀 빛 보케 효과
  for (let i = 0; i < 8; i++) {
    const light = document.createElement('div');
    const size = Math.random() * 50 + 25;
    light.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, 
        rgba(255, 255, 255, 0.7) 0%, 
        rgba(255, 255, 255, 0.3) 30%, 
        rgba(255, 255, 255, 0.1) 60%, 
        transparent 80%);
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: light-dance ${12 + Math.random() * 6}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
      filter: blur(${Math.random() * 1}px);
    `;
    sunContainer.appendChild(light);
  }
  
  // 별빛 효과 추가
  for (let i = 0; i < 6; i++) {
    const star = document.createElement('div');
    star.style.cssText = `
      position: absolute;
      width: 3px;
      height: 3px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: star-twinkle ${2 + Math.random() * 3}s ease-in-out infinite;
      animation-delay: ${Math.random() * 2}s;
      box-shadow: 0 0 6px rgba(255, 255, 255, 0.8);
    `;
    sunContainer.appendChild(star);
  }
}

// 햇빛 광선 효과 생성
function createSunRays() {
  for (let i = 0; i < 4; i++) {
    const ray = document.createElement('div');
    ray.style.cssText = `
      position: fixed;
      width: 1px;
      height: 100vh;
      background: linear-gradient(180deg, 
        rgba(255, 223, 0, 0.3) 0%, 
        rgba(255, 255, 255, 0.2) 30%, 
        rgba(255, 255, 255, 0.15) 50%, 
        rgba(255, 255, 255, 0.1) 80%, 
        transparent 100%);
      left: ${60 + i * 10}%;
      top: 0;
      transform: rotate(${-5 + Math.random() * 10}deg);
      animation: sun-ray-dance ${12 + Math.random() * 8}s ease-in-out infinite;
      animation-delay: ${Math.random() * 3}s;
      pointer-events: none;
      z-index: 1;
      opacity: 0.6;
    `;
    document.body.appendChild(ray);
  }
}

// 미세한 먼지 파티클 생성 (학습 방해 최소화)
function createDustParticles() {
  setInterval(() => {
    if (Math.random() < 0.3) { // 30% 확률로만 생성
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: fixed;
        width: 1px;
        height: 1px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: 100vh;
        pointer-events: none;
        z-index: 1;
        animation: dust-float ${8 + Math.random() * 4}s linear forwards;
      `;
      document.body.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 12000);
    }
  }, 2000);
}

// 요소에 반짝임 효과 추가
function addShimmerEffect(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    element.classList.add('shimmer');
  });
}

// 요소에 빛나는 효과 추가
function addGlowEffect(selector) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    element.classList.add('glow');
  });
}

// 부드러운 마우스 트레일 효과 (학습 방해 최소화)
function addSoftMouseTrail() {
  let lastTime = 0;
  
  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTime > 200 && Math.random() < 0.1) { // 200ms 간격, 10% 확률
      const trail = document.createElement('div');
      trail.style.cssText = `
        position: fixed;
        left: ${e.clientX - 5}px;
        top: ${e.clientY - 5}px;
        width: 10px;
        height: 10px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: soft-fade 1.5s ease-out forwards;
      `;
      document.body.appendChild(trail);
      lastTime = now;

      setTimeout(() => {
        if (trail.parentNode) {
          trail.parentNode.removeChild(trail);
        }
      }, 1500);
    }
  });
}

// 클릭 시 빛나는 효과
function addClickGlow() {
  document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.left = (e.clientX - 25) + 'px';
    ripple.style.top = (e.clientY - 25) + 'px';
    ripple.style.width = '50px';
    ripple.style.height = '50px';
    ripple.style.background = 'radial-gradient(circle, rgba(135, 206, 235, 0.6) 0%, transparent 70%)';
    ripple.style.borderRadius = '50%';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '9999';
    ripple.style.animation = 'ripple-expand 0.6s ease-out forwards';
    document.body.appendChild(ripple);

    // 리플 애니메이션 CSS 추가
    if (!document.querySelector('#ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = `
        @keyframes ripple-expand {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          100% {
            transform: scale(4);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  });
}

// 페이지 로드 시 햇빛 효과 초기화
document.addEventListener('DOMContentLoaded', () => {
  // 햇빛 배경 효과들
  createSunlightEffects();
  createSunRays();
  createDustParticles();
  
  // 미니멀한 인터랙션 효과
  addSoftMouseTrail();
  addClickGlow();
  
  // CSS 애니메이션 추가
  addAnimationStyles();
  
  // 특정 요소들에 미묘한 효과 적용
  setTimeout(() => {
    addShimmerEffect('.login-btn, .sky-btn, button');
    addGlowEffect('h1, .sky-title, .logo h1');
  }, 500);
});

// 애니메이션 스타일 추가
function addAnimationStyles() {
  if (!document.querySelector('#bokeh-animations')) {
    const style = document.createElement('style');
    style.id = 'bokeh-animations';
    style.textContent = `
      @keyframes light-dance {
        0%, 100% { 
          transform: translateY(0px) translateX(0px) scale(1);
          opacity: 0.3;
        }
        50% { 
          transform: translateY(-12px) translateX(6px) scale(1.03);
          opacity: 0.6;
        }
      }
      
      @keyframes star-twinkle {
        0%, 100% { 
          opacity: 0.3;
          transform: scale(0.8);
        }
        50% { 
          opacity: 1;
          transform: scale(1.2);
        }
      }
      
      @keyframes sun-ray-dance {
        0%, 100% { 
          opacity: 0.3; 
          transform: translateX(0px) rotate(0deg); 
        }
        50% { 
          opacity: 0.6; 
          transform: translateX(3px) rotate(1deg); 
        }
      }
      
      @keyframes light-ray {
        0%, 100% { opacity: 0.1; transform: translateX(0px) rotate(0deg); }
        50% { opacity: 0.3; transform: translateX(5px) rotate(1deg); }
      }
      
      @keyframes dust-float {
        0% { 
          transform: translateY(0px) translateX(0px);
          opacity: 0;
        }
        10% { opacity: 0.6; }
        90% { opacity: 0.6; }
        100% { 
          transform: translateY(-100vh) translateX(20px);
          opacity: 0;
        }
      }
      
      @keyframes soft-fade {
        0% { opacity: 0.4; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.2); }
        100% { opacity: 0; transform: scale(0.8); }
      }
    `;
    document.head.appendChild(style);
  }
}

// 스크롤 시 파티클 효과
let ticking = false;
document.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      // 스크롤 시 추가 파티클 생성
      if (Math.random() < 0.1) {
        const particle = document.createElement('div');
        particle.className = 'magic-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '100vh';
        document.body.appendChild(particle);

        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, 6000);
      }
      ticking = false;
    });
    ticking = true;
  }
});