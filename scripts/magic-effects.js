// 互动彩蛋功能
function createRandomEgg() {
  const egg = document.createElement('div');
  egg.className = 'magic-egg';
  egg.style.top = Math.random() * 90 + '%';
  egg.style.left = Math.random() * 90 + '%';
  egg.innerHTML = '✨';
  
  egg.addEventListener('click', () => {
    egg.classList.add('explode');
    setTimeout(() => egg.remove(), 1000);
  });
  
  document.body.appendChild(egg);
}

// 星座运势模块
function initHoroscope() {
  const signs = ['♈白羊', '♉金牛', '♊双子', '♋巨蟹', '♌狮子', '♍处女', 
                '♎天秤', '♏天蝎', '♐射手', '♑摩羯', '♒水瓶', '♓双鱼'];
  
  const prediction = {
    love: ['❤️甜蜜邂逅', '💔注意沟通', '💞感情升温'],
    luck: ['🍀好运爆棚', '⚠️谨慎行事', '🎉惊喜连连']
  };

  document.querySelector('.horoscope-btn').addEventListener('click', () => {
    const randomSign = signs[Math.floor(Math.random() * signs.length)];
    const randomLove = prediction.love[Math.floor(Math.random() * 3)];
    const randomLuck = prediction.luck[Math.floor(Math.random() * 3)];
    
    document.getElementById('horoscope-result').innerHTML = `
      ${randomSign}今日运势：
      💖爱情：${randomLove}
      🍀运势：${randomLuck}
    `;
  });
}

// 语音留言功能
function initVoiceMessage() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'zh-CN';

  document.getElementById('voice-btn').addEventListener('click', () => {
    recognition.start();
    document.getElementById('voice-status').textContent = '聆听中...🎤';
  });

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById('voice-input').value = transcript;
    document.getElementById('voice-status').textContent = '识别完成 ✅';
  };
}

// 初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
  // 每隔30秒生成彩蛋
  setInterval(createRandomEgg, 30000);
  
  if(document.querySelector('.horoscope-container')) {
    initHoroscope();
  }
  
  if(document.getElementById('voice-btn')) {
    initVoiceMessage();
  }
});