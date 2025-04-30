// 初始化Supabase客户端
const supabaseUrl = 'https://xlifqkkeewtsejxrrabg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsaWZxa2tlZXd0c2VqeHJyYWJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2MDI1NjYsImV4cCI6MjA2MTE3ODU2Nn0.n8L-yTNGd4W82Ax7M9_6MdfcH73nRSx5zW6kzrDw5Hc';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

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
    const { data, error } = await supabase
      .from('diaries')
      .insert([
        {
          content,
          weather,
          mood,
          created_at: new Date().toISOString()
        }
      ]);
      
    if (error) {
      console.error('保存失败:', error);
      throw new Error(`保存失败: ${error.message}`);
    }

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      const errorMap = {
        400: '请求格式错误，请检查日记内容',
        401: 'API密钥无效',
        403: '存储空间不足或权限限制',
        404: '日记存储空间不存在',
        413: '日记内容超出存储限制',
        'Content-Type': '需要设置 Content-Type 为 application/json',
        'Invalid Bin Id': '提供的 Bin ID 无效',
        'Bin cannot be blank': '请求体需要包含 JSON 数据',
        'Schema Doc Validation Mismatch': 'JSON 数据与 Schema 文档不匹配'
      };
      throw new Error(errorMap[updateResponse.status] || errorMap[errorData.message] || `服务器错误: ${updateResponse.status}`);
    }

    alert('日记保存成功！✨');
    window.location.reload();
  } catch (error) {
    console.error('详细错误日志:', {
      message: error.message,
      stack: error.stack,
      requestHeaders: {
        'Content-Type': 'application/json',
        'X-Master-Key': '***'+DIARY_API_KEY.slice(-6),
        'X-Bin-Versioning': 'false'
      },
      responseStatus: error.response?.status,
      responseHeaders: error.response?.headers
    });
    console.error('完整错误信息:', {
  message: error.message,
  stack: error.stack,
  requestInfo: error.request
});
alert(`魔法失效啦！✨\n错误原因: ${error.message}\n请截图控制台联系管理员`);
    console.error('请求元数据:', {
      url: DIARY_ENDPOINT,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': '***'+DIARY_API_KEY.slice(-6),
        'X-Bin-Versioning': 'false'
      },
      payload_size: `${JSON.stringify(body).length} bytes`
    });
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