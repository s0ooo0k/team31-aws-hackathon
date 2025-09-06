// 하얀 빛이 쏟아지는 하늘을 나는 효과

// 빛 광선 생성
function createLightRays() {
  for (let i = 0; i < 15; i++) {
    const ray = document.createElement('div');
    ray.style.cssText = `
      position: fixed;
      width: 2px;
      height: 120vh;
      background: linear-gradient(180deg, 
        rgba(255, 255, 255, 1) 0%, 
        rgba(255, 255, 255, 0.8) 15%, 
        rgba(255, 255, 255, 0.6) 40%, 
        rgba(255, 255, 255, 0.3) 70%, 
        transparent 100%);
      left: ${3 + i * 6.5}%;
      top: -15%;
      transform: rotate(${-25 + Math.random() * 50}deg);
      animation: light-cascade ${5 + Math.random() * 3}s ease-in-out infinite;
      animation-delay: ${Math.random() * 2}s;
      pointer-events: none;
      z-index: 1;
      box-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
    `;
    document.body.appendChild(ray);
  }
}

// 떨어지는 빛 입자들
function createFallingLights() {
  setInterval(() => {
    if (Math.random() < 0.6) {
      const light = document.createElement('div');
      const size = Math.random() * 8 + 4;
      light.style.cssText = `
        position: fixed;
        width: ${size}px;
        height: ${size}px;
        background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.6) 50%, transparent 80%);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: -30px;
        pointer-events: none;
        z-index: 1;
        animation: light-fall ${3 + Math.random() * 2}s linear forwards;
        box-shadow: 
          0 0 ${size * 3}px rgba(255, 255, 255, 0.9),
          0 0 ${size * 6}px rgba(255, 255, 255, 0.5);
      `;
      document.body.appendChild(light);

      setTimeout(() => {
        if (light.parentNode) {
          light.parentNode.removeChild(light);
        }
      }, 5000);
    }
  }, 200);
}

// 하늘을 나는 빛 구름들
function createFloatingClouds() {
  for (let i = 0; i < 8; i++) {
    const cloud = document.createElement('div');
    const size = Math.random() * 120 + 80;
    cloud.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size * 0.6}px;
      background: radial-gradient(ellipse, 
        rgba(255, 255, 255, 0.8) 0%, 
        rgba(255, 255, 255, 0.5) 30%, 
        rgba(255, 255, 255, 0.2) 60%, 
        transparent 85%);
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: cloud-drift ${12 + Math.random() * 8}s ease-in-out infinite;
      animation-delay: ${Math.random() * 4}s;
      pointer-events: none;
      z-index: 1;
      filter: blur(1.5px);
      box-shadow: 0 0 ${size/2}px rgba(255, 255, 255, 0.4);
    `;
    document.body.appendChild(cloud);
  }
}

// 반짝이는 별빛들
function createTwinklingStars() {
  for (let i = 0; i < 30; i++) {
    const star = document.createElement('div');
    const size = Math.random() * 3 + 2;
    star.style.cssText = `
      position: fixed;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, rgba(255, 255, 255, 1) 0%, transparent 70%);
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: star-twinkle ${1.5 + Math.random() * 2}s ease-in-out infinite;
      animation-delay: ${Math.random() * 1.5}s;
      pointer-events: none;
      z-index: 1;
      box-shadow: 
        0 0 ${size * 3}px rgba(255, 255, 255, 1),
        0 0 ${size * 6}px rgba(255, 255, 255, 0.6);
    `;
    document.body.appendChild(star);
  }
}

// CSS 애니메이션 추가
function addLightCascadeStyles() {
  if (!document.querySelector('#light-cascade-styles')) {
    const style = document.createElement('style');
    style.id = 'light-cascade-styles';
    style.textContent = `
      @keyframes shooting-star {
        0% { 
          opacity: 0;
          transform: translateX(-100px) translateY(-50px) rotate(45deg);
        }
        10% { 
          opacity: 1;
        }
        90% { 
          opacity: 1;
        }
        100% { 
          opacity: 0;
          transform: translateX(100vw) translateY(100vh) rotate(45deg);
        }
      }
      
      @keyframes light-fall {
        0% { 
          opacity: 0;
          transform: translateY(0px) scale(0.5);
        }
        10% { 
          opacity: 1;
          transform: scale(1);
        }
        90% { 
          opacity: 1;
        }
        100% { 
          opacity: 0;
          transform: translateY(100vh) scale(0.3);
        }
      }
      
      @keyframes cloud-drift {
        0%, 100% { 
          transform: translateX(0px) translateY(0px);
          opacity: 0.4;
        }
        50% { 
          transform: translateX(30px) translateY(-20px);
          opacity: 0.7;
        }
      }
      
      @keyframes star-twinkle {
        0%, 100% { 
          opacity: 0.3;
          transform: scale(0.8);
        }
        50% { 
          opacity: 1;
          transform: scale(1.5);
        }
      }
    `;
    document.head.appendChild(style);
  }
}

// 페이지 로드 시 모든 효과 초기화
document.addEventListener('DOMContentLoaded', () => {
  addLightCascadeStyles();
  createShootingStars();
  createFallingLights();
  createFloatingClouds();
  createTwinklingStars();
});