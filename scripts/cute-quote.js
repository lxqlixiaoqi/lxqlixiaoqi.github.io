// 每日可爱语录功能
class CuteQuoteGenerator {
  constructor() {
    this.quotes = [
      '今天的你，比昨天更可爱了呢～',
      '见到你，我的心情就像吃了棉花糖一样甜',
      '你笑起来的时候，整个世界都变得明亮了',
      '像星星一样闪亮的你，今天也要开心呀',
      '你的存在，就是我每天的小确幸',
      '就算是乌云密布的天气，想到你也会放晴',
      '你是我藏在心里的小糖果，甜甜的',
      '今天也要像小猫咪一样，懒洋洋地享受生活',
      '你的眼睛里有星星，一眨一眨的',
      '像小兔子一样蹦蹦跳跳地开启今天吧',
      '可爱的你，值得所有美好的事情',
      '每想你一次，我的心里就开出一朵小花',
      '你是我每天都想见到的人呀',
      '和你在一起的时光，都像被施了魔法一样',
      '你的笑容，是我一天中最美好的风景',
      '像小熊维尼喜欢蜂蜜一样，我喜欢你',
      '今天的风，好像都带着你的味道',
      '你是我的小太阳，温暖又明亮',
      '想到你，我就忍不住嘴角上扬',
      '你是我生命中最可爱的小意外'
    ];
    this.element = null;
  }

  // 初始化
  init() {
    this.element = document.getElementById('cute-quote');
    if (!this.element) {
      console.error('未找到可爱语录元素，请检查HTML中是否存在id为cute-quote的元素');
      return;
    }

    // 显示随机语录
    this.displayRandomQuote();

    // 每小时更新一次语录
    setInterval(() => {
      this.displayRandomQuote();
    }, 3600000);
  }

  // 显示随机语录
  displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * this.quotes.length);
    const quote = this.quotes[randomIndex];

    // 添加淡入效果
    this.element.style.opacity = '0';
    setTimeout(() => {
      this.element.textContent = quote;
      this.element.style.opacity = '1';
    }, 300);
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  const cuteQuoteGenerator = new CuteQuoteGenerator();
  cuteQuoteGenerator.init();
});