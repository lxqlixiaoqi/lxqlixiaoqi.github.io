// 虚拟宠物互动
function initMascotInteraction() {
  const mascot = document.getElementById('mascot');
  let isDragging = false;

  // 点击跳舞
  mascot.addEventListener('click', () => {
    mascot.classList.add('dancing');
    setTimeout(() => mascot.classList.remove('dancing'), 2000);
  });

  // 拖拽移动
  mascot.addEventListener('mousedown', () => isDragging = true);
  document.addEventListener('mouseup', () => isDragging = false);
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      mascot.style.left = e.clientX + 'px';
      mascot.style.top = e.clientY + 'px';
    }
  });
}

// 烟花特效
function createFirework(x, y) {
  const colors = ['#ff3366', '#33ccff', '#ffdd33', '#99ff33'];
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'firework-particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.backgroundColor = colors[Math.floor(Math.random() * 4)];
    
    const angle = (Math.PI * 2 * i) / 20;
    const velocity = 5 + Math.random() * 10;
    particle.style.setProperty('--dx', Math.cos(angle) * velocity + 'px');
    particle.style.setProperty('--dy', Math.sin(angle) * velocity + 'px');
    
    document.getElementById('fireworks-container').appendChild(particle);
    setTimeout(() => particle.remove(), 1000);
  }
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  initMascotInteraction();
  
  document.addEventListener('mousemove', (e) => {
    if (Math.random() < 0.3) {
      createFirework(e.clientX, e.clientY);
    }
  });
});