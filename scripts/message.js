// 处理留言提交
const messageForm = document.getElementById('messageForm');
if (messageForm) {
  messageForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value;
  const contact = document.getElementById('contact').value;
  const content = document.getElementById('content').value;

  try {
    console.log('尝试提交留言:', { name, contact, content });
    // 替换本地存储逻辑，将新留言插入到 Supabase
    
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        name: name,
        contact: contact,
        content: content,
        created_at: new Date().toISOString()
      }]);
      
    if (error) {
      console.error('保存失败:', error);
      throw new Error(`保存失败: ${error.message}`);
    }

    console.log('留言提交成功:', data);
    // 显示更丰富的成功反馈
      const successMsg = document.createElement('div');
      successMsg.className = 'submit-success';
      successMsg.innerHTML = '✨ 留言已成功提交！';
      messageForm.appendChild(successMsg);
      
      // 3秒后自动移除成功提示
      setTimeout(() => {
        successMsg.remove();
      }, 3000);
      
      e.target.reset();
      await loadMessages();
    } catch (error) {
      console.error('提交留言时出错:', error);
      
      // 显示更详细的错误提示
      const errorMsg = document.createElement('div');
      errorMsg.className = 'submit-error';
      errorMsg.innerHTML = `❌ 提交失败: ${error.message}`;
      messageForm.appendChild(errorMsg);
      
      // 5秒后自动移除错误提示
      setTimeout(() => {
        errorMsg.remove();
      }, 5000);
    }
});
}



// 注意：实际部署时需要配置CORS代理并保护令牌安全





// 加载并显示所有留言
async function loadMessages() {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    const messagesContainer = document.querySelector('.messages');
    messagesContainer.innerHTML = '';
    
    data.forEach(message => {
      const messageElement = document.createElement('div');
      messageElement.className = 'message-item';
      messageElement.innerHTML = `
        <div class="message-header">
          <span>${message.name}</span>
          <small>${message.contact ? `联系方式: ${message.contact}` : ''}</small>
        </div>
        <div class="message-content">${message.content}</div>
        <small class="message-time">${new Date(message.created_at).toLocaleString()}</small>
      `;
      messagesContainer.appendChild(messageElement);
    });
  } catch (error) {
    console.error('加载留言时出错:', error);
  }
}

// 页面加载时初始化留言
window.addEventListener('DOMContentLoaded', loadMessages);

// 注意：实际部署时需要配置CORS代理并保护令牌安全