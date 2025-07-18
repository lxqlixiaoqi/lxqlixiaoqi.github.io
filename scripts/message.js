// 处理留言提交
const messageForm = document.getElementById('messageForm');
if (messageForm) {
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const contact = document.getElementById('contact').value;
        const content = document.getElementById('content').value;
        const created_at = new Date().toISOString();

        try {
            console.log('尝试提交留言:', { name, contact, content });
            // 发送到PHP后端保存
            const response = await fetch('/save-message.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name: name,
                    contact: contact,
                    content: content,
                    created_at: created_at
                })
            });

            const data = await response.json();
            console.log('留言提交成功:', data);
            if (!data.success) throw new Error(data.error);
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

async function loadMessages() {
    try {
        // 从后端获取所有留言
        const response = await fetch('load-messages.php');
        if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
        const rows = await response.json();

        const messagesContainer = document.querySelector('.messages');
        if (!messagesContainer) {
            console.error('未找到留言容器元素');
            return;
        }
        messagesContainer.innerHTML = '';

        if (!rows.length) {
            messagesContainer.innerHTML = '<div class="no-messages">暂无留言，快来添加第一条留言吧~</div>';
            return;
        }

        rows.forEach(message => {
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
        const messagesContainer = document.querySelector('.messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = `<div class="error-message">加载留言失败: ${error.message}</div>`;
        }
    }
}

// 页面加载时初始化留言
window.addEventListener('DOMContentLoaded', loadMessages);