// 处理GitHub Issues留言提交
document.getElementById('messageForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const contact = document.getElementById('contact').value;
  const content = document.getElementById('content').value;

  try {
    const response = await fetch('https://api.github.com/repos/lxqlixiaoqi/lxqlixiaoqi.github.io/issues', {
      method: 'POST',
      headers: {
        // 'Authorization': 'token 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',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: `来自${name}的留言`,
        body: `**联系方式**: ${contact || '未提供'}\n\n${content}`
      })
    });

    if (response.ok) {
      alert('留言提交成功！🎉');
      e.target.reset();
    } else {
      throw new Error('提交失败');
    }
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
    const response = await fetch('https://api.github.com/repos/lxqlixiaoqi/lxqlixiaoqi.github.io/issues', {
      headers: {
        // 'Authorization': 'token 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',
      }
    });

    const messagesContainer = document.querySelector('.messages');
    messagesContainer.innerHTML = '加载中...';

    const issues = await response.json();
    messagesContainer.innerHTML = '';
    
    issues.reverse().forEach(issue => {
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message-item';
      messageDiv.innerHTML = `
        <div class="message-header">
          <span class="username">👤 ${issue.user.login}</span>
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