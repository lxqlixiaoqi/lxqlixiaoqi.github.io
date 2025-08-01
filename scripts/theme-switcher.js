// 主题切换功能
class ThemeSwitcher {
  constructor() {
    this.themes = {
      default: {
        primaryColor: '#ff6b8b',
        secondaryColor: '#f8c2d8',
        accentColor: '#ff8fab',
        backgroundColor: '#fff',
        textColor: '#333',
        cardBackgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#ff6b8b'
      },
      blue: {
        primaryColor: '#6bb5ff',
        secondaryColor: '#b8d9ff',
        accentColor: '#8cc5ff',
        backgroundColor: '#f0f7ff',
        textColor: '#333',
        cardBackgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#6bb5ff'
      },
      green: {
        primaryColor: '#7be0ad',
        secondaryColor: '#b7f0d3',
        accentColor: '#94e8ba',
        backgroundColor: '#f0fff7',
        textColor: '#333',
        cardBackgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#7be0ad'
      },
      purple: {
        primaryColor: '#b185db',
        secondaryColor: '#d7c0e8',
        accentColor: '#c0a0e0',
        backgroundColor: '#f7f0ff',
        textColor: '#333',
        cardBackgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: '#b185db'
      }
    };
    this.currentTheme = 'default';
    this.themeToggle = null;
  }

  // 初始化
  init() {
    // 创建主题切换按钮
    this.themeToggle = document.createElement('div');
    this.themeToggle.className = 'theme-switcher';
    this.themeToggle.innerHTML = `
      <button class="theme-btn" data-theme="default" title="默认主题">🌸</button>
      <button class="theme-btn" data-theme="blue" title="蓝色主题">💧</button>
      <button class="theme-btn" data-theme="green" title="绿色主题">🌱</button>
      <button class="theme-btn" data-theme="purple" title="紫色主题">💜</button>
    `;
    this.themeToggle.style.position = 'fixed';
    this.themeToggle.style.bottom = '20px';
    this.themeToggle.style.right = '20px';
    this.themeToggle.style.zIndex = '9998';
    this.themeToggle.style.display = 'flex';
    this.themeToggle.style.gap = '8px';
    document.body.appendChild(this.themeToggle);

    // 添加按钮样式
    const style = document.createElement('style');
    style.textContent = `
      .theme-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid #ff6b8b;
        background-color: white;
        font-size: 18px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .theme-btn:hover {
        transform: scale(1.1);
      }
      .theme-btn.active {
        transform: scale(1.2);
        box-shadow: 0 0 10px rgba(255, 107, 139, 0.5);
      }
    `;
    document.head.appendChild(style);

    // 添加主题切换事件
    const themeButtons = this.themeToggle.querySelectorAll('.theme-btn');
    themeButtons.forEach(button => {
      if (button.dataset.theme === this.currentTheme) {
        button.classList.add('active');
      }

      button.addEventListener('click', () => {
        const theme = button.dataset.theme;
        this.setTheme(theme);

        // 更新按钮状态
        themeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
      });
    });

    // 应用保存的主题
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme && this.themes[savedTheme]) {
      this.setTheme(savedTheme);
      themeButtons.forEach(btn => {
        if (btn.dataset.theme === savedTheme) {
          btn.classList.add('active');
        }
      });
    }
  }

  // 设置主题
  setTheme(themeName) {
    if (!this.themes[themeName]) {
      console.error('主题不存在:', themeName);
      return;
    }

    this.currentTheme = themeName;
    const theme = this.themes[themeName];

    // 应用主题变量
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', theme.secondaryColor);
    document.documentElement.style.setProperty('--accent-color', theme.accentColor);
    document.documentElement.style.setProperty('--bg-color', theme.backgroundColor);
    document.documentElement.style.setProperty('--text-color', theme.textColor);
    document.documentElement.style.setProperty('--card-bg-color', theme.cardBackgroundColor);
    document.documentElement.style.setProperty('--border-color', theme.borderColor);

    // 保存主题选择
    localStorage.setItem('selectedTheme', themeName);

    // 添加切换动画
    document.body.style.transition = 'background-color 0.5s ease';

    // 更新蘑菇雨颜色
    if (window.MushroomRainSystem && document.querySelector('.mushroom-particle')) {
      const particles = document.querySelectorAll('.mushroom-particle');
      particles.forEach(particle => {
        particle.style.filter = `drop-shadow(0 2px 4px ${theme.primaryColor}80)`;
      });
    }
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  const themeSwitcher = new ThemeSwitcher();
  themeSwitcher.init();
});