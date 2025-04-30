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
    alert('留言提交成功！🎉');
    e.target.reset();
    // 确保在异步操作完成后重新加载留言
    await loadMessages();
  } catch (error) {
    console.error('提交留言时出错:', error);
    alert('提交失败，请稍后重试');
  }
});



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
      messageElement.className = 'message';
      messageElement.innerHTML = `
        <h3>${message.name}</h3>
        <p>${message.content}</p>
        <small>${new Date(message.created_at).toLocaleString()}</small>
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