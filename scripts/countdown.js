/**
 * 生日倒计时功能
 * 负责动态计算并显示距离目标生日的剩余天数
 */
class BirthdayCountdown {
  constructor() {
    this.targetMonth = 8; // 9月 (0-based索引)
    this.targetDay = 15;
    this.countdownElement = document.querySelector('.countdown');
    this.init();
  }

  /**
   * 初始化倒计时功能
   */
  init() {
    // 立即计算并显示一次
    this.updateCountdown();
    
    // 设置定时器，每天凌晨0点更新一次
    this.setupDailyUpdate();
  }

  /**
   * 计算并更新倒计时显示
   */
  updateCountdown() {
    const today = new Date();
    let targetDate = new Date(today.getFullYear(), this.targetMonth, this.targetDay);

    // 如果今年的生日已过，则计算到明年
    if (today > targetDate) {
      targetDate.setFullYear(targetDate.getFullYear() + 1);
    }

    // 计算时间差（毫秒）
    const timeDiff = targetDate - today;

    // 计算剩余天数（向上取整）
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    // 更新显示
    if (this.countdownElement) {
      this.countdownElement.textContent = `${daysLeft}天`;
      // 添加数字变化动画
      this.addCountdownAnimation();
    }

    console.log(`生日倒计时更新: 距离${targetDate.getFullYear()}年${this.targetMonth + 1}月${this.targetDay}日还有${daysLeft}天`);
  }

  /**
   * 设置每天自动更新
   */
  setupDailyUpdate() {
    // 计算距离明天凌晨0点的时间差
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeToMidnight = tomorrow - now;

    // 设置定时器，在明天凌晨0点更新一次
    setTimeout(() => {
      this.updateCountdown();
      // 之后每天更新一次
      setInterval(() => this.updateCountdown(), 24 * 60 * 60 * 1000);
    }, timeToMidnight);
  }

  /**
   * 添加倒计时数字变化动画
   */
  addCountdownAnimation() {
    this.countdownElement.classList.add('countdown-animation');
    setTimeout(() => {
      this.countdownElement.classList.remove('countdown-animation');
    }, 1000);
  }
}

// 页面加载完成后初始化倒计时
document.addEventListener('DOMContentLoaded', () => {
  // 等待300ms确保DOM完全渲染
  setTimeout(() => {
    new BirthdayCountdown();
  }, 300);
});