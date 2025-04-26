// 点击生成表情包
document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', (e) => {
    const emojis = ['🐶','🐱','🐻','🐼','🐨','🦊'];
    const emoji = document.createElement('div');
    emoji.className = 'emoji-pop';
    emoji.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    Object.assign(emoji.style, {
      left: `${e.clientX-15}px`,
      top: `${e.clientY-15}px`
    });
    if(document.querySelector('.emojis-container')) {
      document.querySelector('.emojis-container').appendChild(emoji);
    }
    setTimeout(() => emoji.remove(), 800);
  });
});

// 触摸爱心效果
document.addEventListener('DOMContentLoaded', () => {
  document.addEventListener('touchstart', (e) => {
    Array.from({length: 8}).forEach((_,i) => {
      const heart = document.createElement('div');
      heart.className = 'heart-particle';
      heart.innerHTML = '💖';
      Object.assign(heart.style, {
        left: `${e.touches[0].clientX + (i%3-1)*30}px`,
        top: `${e.touches[0].clientY}px`,
        fontSize: `${Math.random()*20 + 15}px`,
        animation: `heart-float ${Math.random()*2 + 1}s ease-out`
      });
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 2000);
    });
  });
});

// 名字输入特效
document.addEventListener('DOMContentLoaded', () => {
  const nameElement = document.getElementById('dynamicName');
  if(nameElement) {
    nameElement.addEventListener('click', () => {
      const newName = prompt('请输入你的魔法名字✨', '晓琪');
      if(newName) {
        nameElement.textContent = newName;
        // 添加粒子特效
        Array.from({length: 12}).forEach(() => {
          const sparkle = document.createElement('div');
          sparkle.className = 'sparkle';
          sparkle.style.left = `${Math.random()*100}%`;
          sparkle.style.top = `${Math.random()*100}%`;
          document.querySelector('.sparkle-container').appendChild(sparkle);
          setTimeout(() => sparkle.remove(), 1000);
        });
      }
    });
  }
});

// 动态天气图标
document.addEventListener('DOMContentLoaded', () => {
  const weatherIcons = ['🌞','⛅','🌧️','❄️','🌈'];
  setInterval(() => {
    const weather = document.createElement('div');
    weather.className = 'weather-icon';
    weather.textContent = weatherIcons[Math.floor(Math.random()*weatherIcons.length)];
    Object.assign(weather.style, {
      left: `${Math.random()*90 + 5}%`,
      top: `${Math.random()*30}%`,
      animation: `weather-drift ${Math.random()*10 + 5}s linear infinite`
    });
    document.querySelector('.weather-container')?.appendChild(weather);
  }, 5000);
});

// 吉祥物互动
document.addEventListener('DOMContentLoaded', function() {
  const mascot = document.getElementById('mascot');
  if(mascot) {
    mascot.addEventListener('mouseenter', () => {
      mascot.style.transform = 'scale(1.2)';
      mascot.style.transition = 'all 0.3s';
    });
  }
});