// Urban Modern Effects - 도시적 효과들

// 네온 파티클 생성
function createNeonParticles() {
  const container = document.createElement('div');
  container.className = 'urban-particles';
  container.id = 'urban-particles';
  document.body.appendChild(container);
  
  setInterval(() => {
    if (Math.random() < 0.3) {
      const particle = document.createElement('div');
      particle.className = 'urban-particle';
      
      const colors = ['#00d4ff', '#8b5cf6', '#10b981'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      particle.style.cssText = `
        left: ${Math.random() * 100}%;
        background: ${color};
        box-shadow: 0 0 6px ${color};
        animation-duration: ${4 + Math.random() * 4}s;
        animation-delay: ${Math.random() * 2}s;
      `;
      
      container.appendChild(particle);
      
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 8000);
    }
  }, 200);
}

// 홀로그램 효과
function createHologramEffect(element) {
  element.style.position = 'relative';
  element.style.overflow = 'hidden';
  
  const hologram = document.createElement('div');
  hologram.style.cssText = `
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(0, 212, 255, 0.1) 25%, 
      rgba(139, 92, 246, 0.1) 75%, 
      transparent 100%);
    animation: hologram-sweep 3s ease-in-out infinite;
    pointer-events: none;
  `;
  
  element.appendChild(hologram);
}

// 글리치 효과
function addGlitchEffect(element) {
  element.addEventListener('mouseenter', () => {
    element.style.animation = 'glitch 0.3s ease-in-out';
    setTimeout(() => {
      element.style.animation = '';
    }, 300);
  });
}

// 네온 글로우 효과
function addNeonGlow(element) {
  element.addEventListener('mouseenter', () => {
    element.style.textShadow = `
      0 0 5px #00d4ff,
      0 0 10px #00d4ff,
      0 0 15px #00d4ff,
      0 0 20px #00d4ff
    `;
    element.style.transition = 'text-shadow 0.3s ease';
  });
  
  element.addEventListener('mouseleave', () => {
    element.style.textShadow = '';
  });
}

// 사이버 그리드 배경
function createCyberGrid() {
  const grid = document.createElement('div');
  grid.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
    z-index: 0;
    opacity: 0.3;
    animation: grid-pulse 4s ease-in-out infinite;
  `;
  document.body.appendChild(grid);
}

// CSS 애니메이션 추가
function addUrbanAnimations() {
  if (!document.querySelector('#urban-animations')) {
    const style = document.createElement('style');
    style.id = 'urban-animations';
    style.textContent = `
      @keyframes hologram-sweep {
        0% { left: -100%; }
        100% { left: 100%; }
      }
      
      @keyframes glitch {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
      }
      
      @keyframes grid-pulse {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 0.4; }
      }
      
      @keyframes neon-flicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
    `;
    document.head.appendChild(style);
  }
}

// 자동 초기화
document.addEventListener('DOMContentLoaded', () => {
  addUrbanAnimations();
  createNeonParticles();
  createCyberGrid();
  
  // 모든 버튼에 홀로그램 효과 적용
  document.querySelectorAll('button, .btn').forEach(btn => {
    createHologramEffect(btn);
    addGlitchEffect(btn);
  });
  
  // 제목들에 네온 글로우 효과 적용
  document.querySelectorAll('h1, h2, h3').forEach(title => {
    addNeonGlow(title);
  });
});