// JSONBin.io 配置
const JSONBIN_BIN_ID = '680C700D8561E97A5007DE7D';
const JSONBIN_API_KEY = '$2a$10$9u9AY94zM2cw7CG4tHCk8uHyPoAd5jyUKSiWVKPhGBPZiKGXspf/y';
const JSONBIN_ENDPOINT = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

// 处理留言提交
document.getElementById('messageForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const contact = document.getElementById('contact').value;
  const content = document.getElementById('content').value;

  try {
    console.log('尝试提交留言:', { name, contact, content });
    // 替换本地存储逻辑，将新留言插入到 Supabase
    // 获取现有消息
    const getResponse = await fetch(JSONBIN_ENDPOINT, {
      headers: {
        'X-Master-Key': `${'$2a$10$9u9AY94zM2cw7CG4tHCk8uHyPoAd5jyUKSiWVKPhGBPZiKGXspf/y'}`
      }
    });
    const { record: { messages: existingMessages } } = await getResponse.json();

    const response = await fetch(JSONBIN_ENDPOINT, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': `${'$2a$10$9u9AY94zM2cw7CG4tHCk8uHyPoAd5jyUKSiWVKPhGBPZiKGXspf/y'}`,
        'X-Bin-Versioning': 'false'
      },
      body: JSON.stringify({
        messages: [...existingMessages, {
          name,
          contact,
          content,
          created_at: new Date().toISOString()
        }]
      })
    });
    const data = await response.json();

    console.log('留言提交成功:', data);
    alert('留言提交成功！🎉');
    e.target.reset();
    // 确保在异步操作完成后重新加载留言
    await loadMessages();
  } catch (error) {
    console.error('提交留言时出错:', error);
    alert('提交失败，请稍后重试');
  }
});

// 获取并显示历史留言
// 更新后的loadMessages函数
document.addEventListener('DOMContentLoaded', function() {
  loadMessages();
});

async function loadMessages() {
  try {
    console.log('尝试加载留言');
    // 从 Supabase 获取留言
    const response = await fetch(JSONBIN_ENDPOINT, {
      headers: {
        'X-Master-Key': `${'$2a$10$9u9AY94zM2cw7CG4tHCk8uHyPoAd5jyUKSiWVKPhGBPZiKGXspf/y'}`
      }
    });
    const { record: { messages } } = await response.json();

    console.log('留言加载成功:', messages);
    const messagesContainer = document.querySelector('.messages');
    messagesContainer.innerHTML = '加载中...';
    messagesContainer.innerHTML = '';
    messages.forEach(message => {      
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message-item';
      messageDiv.innerHTML = `
        <div class="message-header">
          <span class="username">👤 ${message.name}</span>
          <span class="timestamp">⏰ ${new Date(message.created_at).toLocaleString()}</span>
        </div>
        <div class="message-content">💬 ${message.content}</div>
      `;
      messagesContainer.appendChild(messageDiv);
    });
  } catch (error) {
    console.error('加载留言时出错:', error);
    if (error.message.includes('requested path is invalid')) {
      messagesContainer.innerHTML = JSON.stringify({ "error": "requested path is invalid" });
    } else {
      messagesContainer.innerHTML = '留言加载失败，请稍后刷新';
    }
  }
}

// 页面加载时获取留言
window.addEventListener('DOMContentLoaded', loadMessages);

// 注意：实际部署时需要配置CORS代理并保护令牌安全

    if (!response.ok) {
      const errorData = await response.json();
      const errorMap = {
        400: '请求格式错误，请检查留言内容',
        401: 'API密钥无效',
        403: '存储空间不足或权限限制',
        404: '留言存储空间不存在',
        413: '留言内容超出存储限制',
        'Content-Type': '需要设置 Content-Type 为 application/json',
        'Invalid Bin Id': '提供的 Bin ID 无效',
        'Bin cannot be blank': '请求体需要包含 JSON 数据',
        'Schema Doc Validation Mismatch': 'JSON 数据与 Schema 文档不匹配'
      };
      throw new Error(errorMap[response.status] || errorMap[errorData.message] || `服务器错误: ${response.status}`);
    }
// 由于不清楚这个 } 对应的是哪个函数或代码块，这里暂时添加一个空的函数声明作为示例
function emptyFunction() {}

// 获取并显示历史留言
// 更新后的loadMessages函数
document.addEventListener('DOMContentLoaded', function() {
  loadMessages();
});

async function loadMessages() {
  try {
    console.log('尝试加载留言');
    // 从 Supabase 获取留言
    const response = await fetch(JSONBIN_ENDPOINT, {
      headers: {
        'X-Master-Key': `${'$2a$10$9u9AY94zM2cw7CG4tHCk8uHyPoAd5jyUKSiWVKPhGBPZiKGXspf/y'}`
      }
    });
    const { record: { messages } } = await response.json();

    console.log('留言加载成功:', messages);
    const messagesContainer = document.querySelector('.messages');
    messagesContainer.innerHTML = '加载中...';
    messagesContainer.innerHTML = '';
    messages.forEach(message => {      
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message-item';
      messageDiv.innerHTML = `
        <div class="message-header">
          <span class="username">👤 ${message.name}</span>
          <span class="timestamp">⏰ ${new Date(message.created_at).toLocaleString()}</span>
        </div>
        <div class="message-content">💬 ${message.content}</div>
      `;
      messagesContainer.appendChild(messageDiv);
    });
  } catch (error) {
    console.error('加载留言时出错:', error);
    if (error.message.includes('requested path is invalid')) {
      messagesContainer.innerHTML = JSON.stringify({ "error": "requested path is invalid" });
    } else {
      messagesContainer.innerHTML = '留言加载失败，请稍后刷新';
    }
  }
}

// 页面加载时获取留言
window.addEventListener('DOMContentLoaded', loadMessages);

// 注意：实际部署时需要配置CORS代理并保护令牌安全
// 删除多