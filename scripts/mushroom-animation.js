// 蘑菇图标点击动画效果
class MushroomAnimation {
  constructor() {
    this.mushroomElements = [];
    this.animationTypes = [
      this.floatAnimation,
      this.spinAnimation,
      this.pulseAnimation,
      this.scaleAnimation
    ];
  }

  // 初始化
  init() {
    // 查找所有蘑菇图标
    this.mushroomElements = document.querySelectorAll('.logo-icon, .mushroom-icon');

    // 为每个蘑菇图标添加点击事件
    this.mushroomElements.forEach(element => {
      element.addEventListener('click', () => {
        // 随机选择一种动画
        const randomAnimation = this.animationTypes[Math.floor(Math.random() * this.animationTypes.length)];
        randomAnimation.call(this, element);

        // 创建一些小蘑菇粒子
        this.createMushroomParticles(element);
      });
    });
  }

  // 浮动动画
  floatAnimation(element) {
    element.style.transition = 'transform 0.5s ease-in-out';
    element.style.transform = 'translateY(-20px) rotate(10deg)';

    setTimeout(() => {
      element.style.transform = 'translateY(0) rotate(0)';
    }, 500);
  }

  // 旋转动画
  spinAnimation(element) {
    element.style.transition = 'transform 0.8s ease-in-out';
    element.style.transform = 'rotate(360deg) scale(1.2)';

    setTimeout(() => {
      element.style.transform = 'rotate(0) scale(1)';
    }, 800);
  }

  // 脉冲动画
  pulseAnimation(element) {
    element.style.transition = 'transform 0.3s ease-in-out';
    let scale = 1;
    const interval = setInterval(() => {
      scale = scale === 1 ? 1.2 : 1;
      element.style.transform = `scale(${scale})`;
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      element.style.transform = 'scale(1)';
    }, 1500);
  }

  // 缩放动画
  scaleAnimation(element) {
    element.style.transition = 'transform 0.5s ease-in-out';
    element.style.transform = 'scale(1.5)';

    setTimeout(() => {
      element.style.transform = 'scale(1)';
    }, 500);
  }

  // 创建蘑菇粒子
  createMushroomParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 创建8个粒子
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'mushroom-particle-small';
      particle.innerHTML = '🍄';
      particle.style.position = 'fixed';
      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;
      particle.style.fontSize = `${Math.random() * 10 + 10}px`;
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '9999';

      // 随机角度和距离
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 50 + 20;
      const duration = Math.random() * 1000 + 500;

      // 设置动画
      particle.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out`;
      particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
      particle.style.opacity = '1';

      document.body.appendChild(particle);

      // 动画结束后移除粒子
      setTimeout(() => {
        particle.style.opacity = '0';
        setTimeout(() => {
          particle.remove();
        }, 300);
      }, duration);
    }
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  const mushroomAnimation = new MushroomAnimation();
  mushroomAnimation.init();
});