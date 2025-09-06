// F1 Racing Effects - 속도감과 멋을 살린 레이싱 이펙트

class RacingEffects {
  constructor() {
    this.init();
  }

  init() {
    this.createRacingParticles();
    this.addSpeedLines();
    this.initTurboEffects();
    this.addRacingHUD();
  }

  // 레이싱 파티클 생성
  createRacingParticles() {
    const container = document.createElement('div');
    container.className = 'racing-particles';
    document.body.appendChild(container);

    // 속도 파티클 생성
    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        this.createSpeedParticle(container);
      }, i * 200);
    }

    // 지속적인 파티클 생성
    setInterval(() => {
      this.createSpeedParticle(container);
    }, 300);
  }

  createSpeedParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'racing-particle';
    
    // 랜덤 위치와 색상
    const colors = ['#ff0040', '#00d4ff', '#ffd700', '#39ff14'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    particle.style.cssText = `
      top: ${Math.random() * 100}vh;
      left: -10px;
      background: ${color};
      box-shadow: 0 0 15px ${color};
      width: ${Math.random() * 6 + 2}px;
      height: 2px;
      animation-duration: ${Math.random() * 1 + 1}s;
      animation-delay: ${Math.random() * 0.5}s;
    `;
    
    container.appendChild(particle);
    
    // 파티클 제거
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 2000);
  }

  // 속도선 효과
  addSpeedLines() {
    const speedLines = document.createElement('div');
    speedLines.className = 'speed-lines-overlay';
    speedLines.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
      background: repeating-linear-gradient(
        90deg,
        transparent 0px,
        rgba(255, 0, 64, 0.05) 1px,
        transparent 2px,
        transparent 30px
      );
      animation: speed-rush 1.5s linear infinite;
    `;
    
    document.body.appendChild(speedLines);
  }

  // 터보 효과
  initTurboEffects() {
    // 버튼에 터보 효과 추가
    document.addEventListener('click', (e) => {
      if (e.target.matches('.racing-btn, .urban-btn, .sky-interactive')) {
        this.createTurboBlast(e.target);
      }
    });

    // 입력 필드에 스피드 효과
    document.addEventListener('focus', (e) => {
      if (e.target.matches('input')) {
        this.addInputSpeedEffect(e.target);
      }
    }, true);
  }

  createTurboBlast(element) {
    const blast = document.createElement('div');
    blast.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      background: radial-gradient(circle, rgba(255, 0, 64, 0.8) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 1000;
      animation: turbo-blast 0.6s ease-out forwards;
    `;
    
    element.style.position = 'relative';
    element.appendChild(blast);
    
    setTimeout(() => {
      if (blast.parentNode) {
        blast.parentNode.removeChild(blast);
      }
    }, 600);
  }

  addInputSpeedEffect(input) {
    const speedGlow = document.createElement('div');
    speedGlow.style.cssText = `
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(90deg, #ff0040, #00d4ff, #ffd700);
      border-radius: 6px;
      z-index: -1;
      opacity: 0;
      animation: input-speed-glow 2s ease-in-out infinite;
    `;
    
    input.style.position = 'relative';
    input.parentNode.insertBefore(speedGlow, input);
    
    input.addEventListener('blur', () => {
      if (speedGlow.parentNode) {
        speedGlow.parentNode.removeChild(speedGlow);
      }
    }, { once: true });
  }

  // 레이싱 HUD 추가
  addRacingHUD() {
    const hud = document.createElement('div');
    hud.className = 'racing-hud-overlay';
    hud.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 200px;
      height: 60px;
      background: rgba(26, 26, 26, 0.9);
      border: 2px solid #ff0040;
      border-radius: 4px;
      padding: 10px;
      font-family: 'Orbitron', monospace;
      color: #00d4ff;
      font-size: 12px;
      z-index: 1000;
      backdrop-filter: blur(10px);
      transform: skewX(-5deg);
    `;
    
    hud.innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
        <span>SPEED:</span>
        <span id="speed-counter">0 KM/H</span>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>MODE:</span>
        <span style="color: #ffd700;">TURBO</span>
      </div>
    `;
    
    document.body.appendChild(hud);
    this.animateSpeedCounter();
  }

  animateSpeedCounter() {
    const counter = document.getElementById('speed-counter');
    if (!counter) return;
    
    let speed = 0;
    const maxSpeed = 350;
    
    const updateSpeed = () => {
      speed = Math.floor(Math.random() * 50) + 300;
      counter.textContent = `${speed} KM/H`;
      counter.style.color = speed > 320 ? '#ff0040' : '#00d4ff';
    };
    
    setInterval(updateSpeed, 1000);
  }
}

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
  @keyframes speed-rush {
    0% { transform: translateX(-30px); }
    100% { transform: translateX(0px); }
  }
  
  @keyframes turbo-blast {
    0% {
      width: 0;
      height: 0;
      opacity: 1;
      transform: translate(-50%, -50%) scale(0);
    }
    100% {
      width: 100px;
      height: 100px;
      opacity: 0;
      transform: translate(-50%, -50%) scale(2);
    }
  }
  
  @keyframes input-speed-glow {
    0%, 100% {
      opacity: 0;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.02);
    }
  }
`;
document.head.appendChild(style);

// 페이지 로드 시 레이싱 효과 시작
document.addEventListener('DOMContentLoaded', () => {
  new RacingEffects();
});

// 이미 로드된 경우 즉시 시작
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new RacingEffects());
} else {
  new RacingEffects();
}