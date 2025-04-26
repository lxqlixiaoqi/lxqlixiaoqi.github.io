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
if (typeof quill === 'undefined') {
  var quill = new Quill('#editor', {
    theme: 'snow',
    modules: {
      toolbar: '#toolbar'
    },
    placeholder: '记录属于你的魔法时刻...✨'
  });
}

// 处理日记保存
document.querySelector('.save-button').addEventListener('click', async () => {
  const content = quill.root.innerHTML;
  const weather = document.getElementById('weather').value;
  const mood = document.getElementById('mood').value;

  // 添加元素存在性检查
  if(!document.querySelector('.save-button')) {
    console.error('保存按钮元素未找到');
    return;
  }

  try {
    // 添加网络连接检测
    if(!navigator.onLine) {
      alert('⚠️ 网络连接不可用');
      return;
    }

    // 获取现有日记（添加超时机制）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(DIARY_ENDPOINT, {
      headers: {'X-Master-Key': `${DIARY_API_KEY}`},
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    // 添加HTTP状态检查
    if(!response.ok) {
      const errorData = await response.text();
      console.error('API请求失败:', {
        status: response.status,
        headers: response.headers,
        errorData
      });
      throw new Error(`API请求失败: ${response.status}`);
    }

    const { record: { diaries } } = await response.json();

    // 添加新日记
    await fetch(DIARY_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': `${DIARY_API_KEY}`
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
    console.error('完整错误信息:', {
  message: error.message,
  stack: error.stack,
  requestInfo: error.request
});
alert(`魔法失效啦！✨\n错误原因: ${error.message}\n请截图控制台联系管理员`);
    console.error('完整请求信息:', {
      url: DIARY_ENDPOINT,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': '***'+DIARY_API_KEY.slice(-6)
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
  }
});

// 加载历史日记
async function loadDiaries() {
  try {
    const response = await fetch(`${DIARY_ENDPOINT}/latest`, {
      headers: {
        'X-Master-Key': DIARY_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorBody = await response.text();
      console.error('获取日记失败:', {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        errorBody
      });
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }
    
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