// 蘑菇雨粒子系统 v2.0
class MushroomRainSystem {
  static get config() {
    const isMobile = window.innerWidth <= 768;
    return {
      IMG_PATH: 'icon.png',
      MAX_INSTANCES: isMobile ? 15 : 30,
      BASE_SPEED: isMobile ? 0.4 : 0.5,
      WIND_FACTOR: isMobile ? 0.2 : 0.3,
      MIN_SIZE: isMobile ? 18 : 25,
      MAX_SIZE: isMobile ? 30 : 45
    };
  }

  constructor() {
    this.container = document.querySelector('.sakura-fall');
    if (!this.container) {
      console.error('未找到蘑菇雨容器，请检查HTML中是否存在.sakura-fall元素');
      return;
    }
    this.particles = [];
    this.rafId = null;
    this.lastFrameTime = performance.now();
    this.windOffset = 0;
  }

  // 创建单个蘑菇粒子
  createParticle() {
    const particle = {
      element: new Image(),
      x: Math.random() * window.innerWidth,
      y: -50,
      rotation: Math.random() * 360,
      scale: MushroomRainSystem.config.MIN_SIZE + Math.random() * (MushroomRainSystem.config.MAX_SIZE - MushroomRainSystem.config.MIN_SIZE),
      velocity: MushroomRainSystem.config.BASE_SPEED + Math.random() * 0.7,
      angle: Math.random() * Math.PI * 2
    };

    // 设置粒子图片
    particle.element.src = MushroomRainSystem.config.IMG_PATH;
    particle.element.alt = '蘑菇粒子';
    particle.element.className = 'mushroom-particle';
    particle.element.style.cssText = `
      position: absolute;
      pointer-events: none;
      width: ${particle.scale}px;
      height: auto;
      will-change: transform;
      filter: drop-shadow(0 2px 4px rgba(255, 158, 181, 0.6));
    `;

    // 图片加载失败处理
    particle.element.onerror = () => {
      console.error('蘑菇粒子图片加载失败:', MushroomRainSystem.config.IMG_PATH);
      particle.element.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiNmZmYiLz48L3N2Zz4=';
    };

    this.container.appendChild(particle.element);
    return particle;
  }

  // 重置粒子位置
  resetParticle(particle) {
    particle.x = Math.random() * window.innerWidth;
    particle.y = -50;
    particle.rotation = Math.random() * 360;
    particle.velocity = MushroomRainSystem.config.BASE_SPEED + Math.random() * 0.7;
  }

  // 动画循环
  animate(timestamp) {
    const deltaTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;

    // 风场效果
    this.windOffset += deltaTime * 0.0005;
    const wind = Math.sin(this.windOffset) * MushroomRainSystem.config.WIND_FACTOR;

    // 更新所有粒子
    this.particles.forEach(particle => {
      particle.y += particle.velocity * deltaTime * 0.25;
      particle.x += Math.cos(particle.angle) * wind;
      particle.rotation += deltaTime * 0.03;

      particle.element.style.transform = `
        translate(${particle.x}px, ${particle.y}px)
        rotate(${particle.rotation}deg)
      `;

      // 粒子超出屏幕时重置
      if (particle.y > window.innerHeight + 100) {
        this.resetParticle(particle);
      }
    });

    this.rafId = requestAnimationFrame(this.animate.bind(this));
  }

  // 启动粒子系统
  start() {
    // 初始化粒子池
    for (let i = 0; i < MushroomRainSystem.config.MAX_INSTANCES; i++) {
      setTimeout(() => {
        this.particles.push(this.createParticle());
      }, i * 80); // 错开创建时间，避免性能峰值
    }
    // 启动动画
    this.animate(performance.now());
  }

  // 停止粒子系统
  stop() {
    cancelAnimationFrame(this.rafId);
    this.particles.forEach(p => p.element.remove());
    this.particles = [];
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  const mushroomRain = new MushroomRainSystem();
  if (mushroomRain.container) {
    mushroomRain.start();
  }
});