// 引入 Supabase 客户端
import { createClient } from '@supabase/supabase-js';

// 初始化 Supabase 客户端
const supabaseUrl = 'https://xlifqkkeewtsejxrrabg.supabase.co';
const supabaseKey = 'YeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsaWZxa2tlZXd0c2VqeHJyYWJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTYwMjU2NiwiZXhwIjoyMDYxMTc4NTY2fQ.s1RYh4_ElBSJnqRX_FTq7dBUvGUlg1eARD6iPAwCIoQ';
const supabase = createClient(supabaseUrl, supabaseKey);

// 处理GitHub Issues留言提交
document.getElementById('messageForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const contact = document.getElementById('contact').value;
  const content = document.getElementById('content').value;

  try {
    // 替换本地存储逻辑，将新留言插入到 Supabase
    const { data, error } = await supabase
      .from('messages')
      .insert([{ name: name, contact: contact, content: content, created_at: new Date() }]);

    if (error) {
      throw error;
    }

    alert('留言提交成功！🎉');
    e.target.reset();
    // 重新加载留言
    loadMessages();
  } catch (error) {
    console.error('Error:', error);
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
    // 从 Supabase 获取留言
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const messagesContainer = document.querySelector('.messages');
    messagesContainer.innerHTML = '加载中...';
    messagesContainer.innerHTML = '';
    messages.forEach(message => {      
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message-item';
      messageDiv.innerHTML = `
        <div class="message-header">\n          <span class="username">👤 ${issue.user.login}</span>
          <span class="timestamp">⏰ ${new Date(issue.created_at).toLocaleString()}</span>
        </div>
        <div class="message-content">💬 ${issue.body}</div>
      `;
      messagesContainer.appendChild(messageDiv);
    });
  } catch (error) {
    messagesContainer.innerHTML = '留言加载失败，请稍后刷新';
  }
}

// 页面加载时获取留言
window.addEventListener('DOMContentLoaded', loadMessages);

// 注意：实际部署时需要配置CORS代理并保护令牌安全