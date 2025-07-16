// 引入 MySQL 连接库
const mysql = require('mysql2/promise');

// 创建 MySQL 连接池
const pool = mysql.createPool({
    host: 'sql309.infinityfree.com',
    user: 'if0_39452447',
    password: 'wyz831201',
    database: 'if0_39452447_lxqdata',
    port: 3306
});

// 初始化时创建 diaries 表
(async () => {
    try {
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS diaries (
                id INT AUTO_INCREMENT PRIMARY KEY,
                content TEXT NOT NULL,
                weather VARCHAR(50) NOT NULL,
                mood VARCHAR(50) NOT NULL,
                created_at DATETIME NOT NULL
            )
        `);
        console.log('diaries 表创建成功或已存在');
    } catch (error) {
        console.error('创建 diaries 表时出错:', error);
    }
})();

// 加载历史日记
async function loadDiaryHistory() {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM diaries ORDER BY created_at DESC'
        );
        if (rows) {
            const historyContainer = document.querySelector('.diary-history');
            if (historyContainer) {
                historyContainer.innerHTML = rows.map(diary => 
                    `<div class="diary-item">
                      <div class="diary-date">${new Date(diary.created_at).toLocaleString()}</div>
                      <div class="diary-weather">${weatherEmoji[diary.weather] || ''}</div>
                      <div class="diary-mood">${moodEmoji[diary.mood] || ''}</div>
                      <div class="diary-content">${diary.content}</div>
                    </div>`
                ).join('');
            }
        }
    } catch (error) {
        console.error('加载历史日记时出错:', error);
    }
}

// 页面加载时获取历史记录
window.addEventListener('load', loadDiaryHistory);

// 表情配置
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

// 初始化富文本编辑器
if (typeof quill === 'undefined') {
  var quill = new Quill('#editor', {
    theme: 'snow',
    modules: { toolbar: '#toolbar' },
    placeholder: '记录属于你的魔法时刻...✨'
  });
}

// 处理日记保存
document.querySelector('.save-button').addEventListener('click', async () => {
  const content = quill.root.innerHTML;
  const weather = document.getElementById('weather').value;
  const mood = document.getElementById('mood').value;
  
  // 确保内容以HTML格式存储
  const htmlContent = quill.root.innerHTML;

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

    // 清理Quill生成的HTML内容，移除不必要的样式和类
    const cleanHtmlContent = htmlContent
      .replace(/class=".*?"/g, '')
      .replace(/style=".*?"/g, '');

    const created_at = new Date().toISOString();
    // 发送到PHP后端保存
    const response = await fetch('/save-diary.php', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        content: cleanHtmlContent,
        weather: weather,
        mood: mood,
        created_at: created_at
      })
    });

    const data = await response.json();
    if (data.success) {
      alert('日记保存成功！✨');
      quill.setContents([]); // 清空编辑器内容
      document.getElementById('weather').value = '';
      document.getElementById('mood').value = '';
      loadDiaries(); // 刷新日记列表
    } else {
      alert(`保存失败: ${data.error}`);
    }
  } catch (error) {
    console.error('保存日记时出错:', error);
    alert(`保存失败: ${error.message}`);
  }
});

// 加载历史日记
async function loadDiaries() {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM diaries ORDER BY created_at DESC'
    );
    
    const diaries = rows;
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
    console.error('加载失败:', {
      message: error.message,
      stack: error.stack
    });
  }
}

// 初始化加载
window.addEventListener('DOMContentLoaded', loadDiaries);