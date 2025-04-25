// 点击生成表情包
document.addEventListener('click', (e) => {
  const emojis = ['🐶','🐱','🐻','🐼','🐨','🦊'];
  const emoji = document.createElement('div');
  emoji.className = 'emoji-pop';
  emoji.textContent = emojis[Math.floor(Math.random()*emojis.length)];
  Object.assign(emoji.style, {
    left: `${e.clientX-15}px`,
    top: `${e.clientY-15}px`
  });
  document.querySelector('.emojis-container').appendChild(emoji);
  setTimeout(() => emoji.remove(), 800);
});

// 吉祥物互动
const mascot = document.getElementById('mascot');
mascot.addEventListener('mouseenter', () => {
  mascot.style.transform = 'scale(1.2)';
  mascot.style.transition = 'all 0.3s';
});