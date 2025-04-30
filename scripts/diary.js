// 初始化Supabase客户端
const supabaseUrl = 'https://xlifqkkeewtsejxrrabg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsaWZxa2tlZXd0c2VqeHJyYWJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2MDI1NjYsImV4cCI6MjA2MTE3ODU2Nn0.n8L-yTNGd4W82Ax7M9_6MdfcH73nRSx5zW6kzrDw5Hc';
const supabase = supabase.createClient(supabaseUrl, supabaseKey, {
  global: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT'
    }
  }
});

// 加载历史日记
async function loadDiaryHistory() {
  const { data, error } = await supabase
    .from('diaries')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (!error && data) {
    const historyContainer = document.querySelector('.diary-history');
    if (historyContainer) {
      historyContainer.innerHTML = data.map(diary => 
        `<div class="diary-item">
          <div class="diary-date">${new Date(diary.created_at).toLocaleString()}</div>
          <div class="diary-weather">${weatherEmoji[diary.weather] || ''}</div>
          <div class="diary-mood">${moodEmoji[diary.mood] || ''}</div>
          <div class="diary-content">${diary.content}</div>
        </div>`
      ).join('');
    }
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

    // 保存日记到Supabase
    // 清理Quill生成的HTML内容，移除不必要的样式和类
    const cleanHtmlContent = htmlContent
      .replace(/class=".*?"/g, '')
      .replace(/style=".*?"/g, '');

    const { data, error } = await supabase
      .from('diaries')
      .insert([
        {
          content: cleanHtmlContent,
          weather,
          mood,
          created_at: new Date().toISOString()
        }
      ]);
      
    if (error) {
      console.error('保存失败:', error);
      throw new Error(`保存失败: ${error.message}`);
    }

    alert('日记保存成功！✨');
    quill.setContents([]); // 清空编辑器内容
    document.getElementById('weather').value = '';
    document.getElementById('mood').value = '';
    loadDiaries(); // 刷新日记列表
  } catch (error) {
    console.error('保存日记时出错:', error);
    alert(`保存失败: ${error.message}`);
  }
});

// 加载历史日记
async function loadDiaries() {
  try {
    const { data, error } = await supabase
      .from('diaries')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('获取日记失败:', error);
      throw new Error(`获取日记失败: ${error.message}`);
    }
    
    const diaries = data;
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
      stack: error.stack,
      url: `${DIARY_ENDPOINT}/latest?meta=false`,
      method: 'GET',
      headers: {
        'X-Master-Key': '***'+DIARY_API_KEY.slice(-6),
        'Content-Type': 'application/json',
        'X-Bin-Meta': 'false'
      }
    });
  }
}

// 初始化加载
window.addEventListener('DOMContentLoaded', loadDiaries);