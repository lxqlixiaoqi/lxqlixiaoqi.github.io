// 癫狂模式触发逻辑
const CRAZY_MODE_KEY = 'F9';
let touchStartTime = 0;
let touchCount = 0;

// 初始化触发方式
function initCrazyMode() {
  // PC端键盘事件
  document.addEventListener('keydown', (e) => {
    if (e.key === CRAZY_MODE_KEY) {
      activateCrazyMode();
    }
  });

  // 移动端触摸事件
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length === 3) {
      touchStartTime = Date.now();
      touchCount = 3;
    }
  });

  document.addEventListener('touchend', () => {
    if (touchCount === 3 && Date.now() - touchStartTime > 1000) {
      activateCrazyMode();
    }
    touchCount = 0;
  });

  // 按钮触发
  document.getElementById('mobile-crazy-trigger')?.addEventListener('click', activateCrazyMode);
}

function activateCrazyMode() {
  document.body.classList.add('crazy-mode-active');
  setTimeout(() => {
    document.body.classList.remove('crazy-mode-active');
  }, 10000);
}

// 初始化
document.addEventListener('DOMContentLoaded', initCrazyMode);