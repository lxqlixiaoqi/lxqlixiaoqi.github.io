// 可爱鼠标跟随特效
class CursorFollower {
  constructor() {
    this.cursor = null;
    this.isActive = false;
    this.emojis = ['🐶', '🐱', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'];
    this.heartEmoji = '💖';
    this.lastEmoji = '';
  }

  // 初始化
  init() {
    // 创建跟随元素
    this.cursor = document.createElement('div');
    this.cursor.className = 'cursor-follower';
    this.cursor.style.position = 'fixed';
    this.cursor.style.pointerEvents = 'none';
    this.cursor.style.zIndex = '9999';
    this.cursor.style.width = '40px';
    this.cursor.style.height = '40px';
    this.cursor.style.display = 'flex';
    this.cursor.style.alignItems = 'center';
    this.cursor.style.justifyContent = 'center';
    this.cursor.style.fontSize = '24px';
    this.cursor.style.transition = 'all 0.1s ease-out';
    this.cursor.style.opacity = '0';
    document.body.appendChild(this.cursor);

    // 添加鼠标移动事件
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));

    // 添加链接悬停事件
    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
      link.addEventListener('mouseenter', this.handleLinkHover.bind(this, true));
      link.addEventListener('mouseleave', this.handleLinkHover.bind(this, false));
    });

    this.isActive = true;
  }

  // 处理鼠标移动
  handleMouseMove(e) {
    if (!this.isActive) return;

    // 设置位置
    this.cursor.style.left = `${e.clientX - 20}px`;
    this.cursor.style.top = `${e.clientY - 20}px`;
    this.cursor.style.opacity = '1';

    // 随机更换表情
    if (Math.random() > 0.98 && !this.isLinkHovered) {
      let newEmoji;
      do {
        newEmoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
      } while (newEmoji === this.lastEmoji);
      this.lastEmoji = newEmoji;
      this.cursor.textContent = newEmoji;
    }
  }

  // 处理鼠标按下
  handleMouseDown() {
    if (!this.isActive) return;
    this.cursor.style.transform = 'scale(1.2) rotate(10deg)';
    this.cursor.textContent = this.heartEmoji;
  }

  // 处理鼠标释放
  handleMouseUp() {
    if (!this.isActive) return;
    this.cursor.style.transform = 'scale(1) rotate(0)';
  }

  // 处理链接悬停
  handleLinkHover(isHovering) {
    if (!this.isActive) return;
    this.isLinkHovered = isHovering;

    if (isHovering) {
      this.cursor.style.transform = 'scale(1.3)';
      this.cursor.textContent = this.heartEmoji;
      this.cursor.style.color = '#ff6b8b';
    } else {
      this.cursor.style.transform = 'scale(1)';
      this.cursor.style.color = '#000';
    }
  }

  // 停止跟随
  stop() {
    this.isActive = false;
    this.cursor.style.opacity = '0';
  }

  // 开始跟随
  start() {
    if (!this.isActive) {
      this.isActive = true;
      this.cursor.style.opacity = '1';
    }
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  const cursorFollower = new CursorFollower();
  cursorFollower.init();

  // 添加开关功能
  window.toggleCursorEffect = function() {
    if (cursorFollower.isActive) {
      cursorFollower.stop();
    } else {
      cursorFollower.start();
    }
  };
});