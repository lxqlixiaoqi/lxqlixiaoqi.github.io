// 初始化加载
window.addEventListener('DOMContentLoaded', loadMoods);

// 从后端加载心情
async function loadMoods() {
  try {
    const response = await fetch('/load-moods.php');
    const moods = await response.json();
    const container = document.querySelector('.mood-grid');
    if (moods.length > 0) {
      moods.forEach(mood => {
        addMoodCard(mood.emoji, mood.text);
      });
    } else {
      // 默认示例心情
      addMoodCard('😊', '今天天气真好，心情愉悦！');
      addMoodCard('😢', '遇到了一些小挫折，但我会加油的！');
      addMoodCard('🤔', '思考人生中...');
    }
  } catch (error) {
    console.error('加载心情记录失败:', error);
    // 默认示例心情
    addMoodCard('😊', '今天天气真好，心情愉悦！');
    addMoodCard('😢', '遇到了一些小挫折，但我会加油的！');
    addMoodCard('🤔', '思考人生中...');
  }
}

// 页面加载时获取历史记录
window.addEventListener('load', loadMoodHistory);

// 心情日记墙交互逻辑
const moodForm = document.querySelector('.mood-form');
const moodGrid = document.querySelector('.mood-grid');
const emojiOptions = document.querySelectorAll('.emoji-option');
const textarea = moodForm.querySelector('textarea');
const saveButton = moodForm.querySelector('.save-button');

let selectedEmoji = '😊';

// 选择表情
emojiOptions.forEach(option => {
    option.addEventListener('click', () => {
        selectedEmoji = option.textContent;
        emojiOptions.forEach(opt => opt.style.transform = 'scale(1)');
        option.style.transform = 'scale(1.3)';
    });
});

// 保存心情
saveButton.addEventListener('click', async () => {
    const moodText = textarea.value.trim();
    if (moodText) {
        try {
            const created_at = new Date().toISOString();
            // 发送到PHP后端保存
            const response = await fetch('/save-mood.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    emoji: selectedEmoji,
                    text: moodText,
                    created_at: created_at
                })
            });
            const data = await response.json();
            if (data.success) {
                addMoodCard(data.mood.emoji, data.mood.text, data.mood.created_at);
                textarea.value = '';
                // 触发爱心粒子效果
                createHeartParticles();
            }
        } catch (error) {
            console.error('保存失败:', error);
        }
    }
});

// 添加心情卡片
function addMoodCard(emoji, text, created_at) {
    const dateStr = formatDate(created_at);
    
    const moodCard = document.createElement('div');
    moodCard.className = 'mood-card';
    moodCard.innerHTML = `
        <div class="mood-emoji">${emoji}</div>
        <div class="mood-date">${dateStr}</div>
        <div class="mood-content">${text}</div>
    `;
    
    // 添加动画效果
    moodCard.style.opacity = '0';
    moodCard.style.transform = 'translateY(20px)';
    
    moodGrid.prepend(moodCard);
    
    // 触发动画
    setTimeout(() => {
        moodCard.style.transition = 'all 0.5s ease';
        moodCard.style.opacity = '1';
        moodCard.style.transform = 'translateY(0)';
    }, 10);
}

// 工具函数：格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
}

// 创建爱心粒子效果
function createHeartParticles() {
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.innerHTML = '❤️';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.fontSize = `${Math.random() * 20 + 10}px`;
        heart.style.animation = 'heart-float ' + (Math.random() * 2 + 1) + 's forwards';
        
        document.body.appendChild(heart);
        
        // 动画结束后移除
        setTimeout(() => {
            heart.remove();
        }, 1000);
    }
}
