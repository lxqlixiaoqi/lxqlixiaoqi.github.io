// JSONBin.io 日记配置
const weatherEmoji = {
  sunny: '☀️',
  cloudy: '☁️',
  rainy: '🌧️',
  snowy: '❄️'
};

const moodEmoji = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  calm: '😌'
};

const DIARY_BIN_ID = '680c72658561e97a5007df6e';  // ← 替换为实际Bin ID
const DIARY_API_KEY = '$2a$10$9u9AY94zM2cw7CG4tHCk8uHyPoAd5jyUKSiWVKPhGBPZiKGXspf/y'; // ← 替换为实际Secret Key
const DIARY_ENDPOINT = `https://api.jsonbin.io/v3/b/${DIARY_BIN_ID}`;

// 初始化富文本编辑器
const quill = new Quill('#editor', {
  theme: 'snow',
  modules: {
    toolbar: '#toolbar'
  },
  placeholder: '记录属于你的魔法时刻...✨'
});

// 处理日记保存
document.querySelector('.save-button').addEventListener('click', async () => {
  const content = quill.root.innerHTML;
  const weather = document.getElementById('weather').value;
  const mood = document.getElementById('mood').value;

  try {
    // 获取现有日记
    const response = await fetch(DIARY_ENDPOINT, {
      headers: {'X-Master-Key': `${DIARY_API_KEY}`}
    });
    const { record: { diaries } } = await response.json();

    // 添加新日记
    await fetch(DIARY_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': `${'$2a$10$9u9AY94zM2cw7CG4tHCk8uHyPoAd5jyUKSiWVKPhGBPZiKGXspf/y'}`
      },
      body: JSON.stringify({
        diaries: [...diaries, {
          content,
          weather,
          mood,
          created_at: new Date().toISOString()
        }]
      })
    });

    alert('日记保存成功！✨');
    window.location.reload();
  } catch (error) {
    console.error('保存失败:', error);
    alert('保存失败，请检查网络');
  }
});

// 加载历史日记
async function loadDiaries() {
  try {
    const response = await fetch(DIARY_ENDPOINT, {
      headers: {'X-Master-Key': `${'$2a$10$9u9AY94zM2cw7CG4tHCk8uHyPoAd5jyUKSiWVKPhGBPZiKGXspf/y'}`}
    });
    const { record: { diaries } } = await response.json();

    const container = document.querySelector('.diary-list');
    diaries.reverse().forEach(diary => {
      const card = document.createElement('div');
      card.className = 'diary-card card';
      card.innerHTML = `
        <div class="diary-meta">
          <span class="weather">${weatherEmoji[diary.weather]}</span>
          <span class="mood">${moodEmoji[diary.mood]}</span>
          <span class="date">${new Date(diary.created_at).toLocaleString()}</span>
        </div>
        <div class="diary-content">${diary.content}</div>
      `;
      container.prepend(card);
    });
  } catch (error) {
    console.error('加载失败:', error);
  }
}

// 初始化加载
window.addEventListener('DOMContentLoaded', loadDiaries);