document.addEventListener('DOMContentLoaded', () => {
    // 加载留言
    loadMessages();

    // 提交留言按钮事件
    document.querySelector('.message-submit').addEventListener('click', submitMessage);

    // 加载留言函数
    async function loadMessages() {
        try {
            const response = await fetch('/api/message/read.php', { mode: 'cors' });
            if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
            const result = await response.json();

            if (result.success && result.data.length > 0) {
                renderMessages(result.data);
            } else {
                document.querySelector('.message-list').innerHTML = '<p>暂无留言，成为第一个留言的人吧！</p>';
            }
        } catch (error) {
            console.error('加载留言失败:', error);
            document.querySelector('.message-list').innerHTML = `<p class='error-message'>加载失败: ${error.message}</p>`;
        }
    }

    // 提交留言函数
    async function submitMessage() {
        const nameInput = document.getElementById('message-name');
        const contentInput = document.getElementById('message-content');
        const name = nameInput.value.trim();
        const content = contentInput.value.trim();

        if (!name || !content) {
            showNotification('请输入您的姓名和留言内容', 'error');
            return;
        }

        try {
            const response = await fetch('/api/message/create.php', {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, content })
            });

            const result = await response.json();

            if (result.success) {
                // 显示成功提示
                showNotification('留言发布成功！', 'success');
                // 清空输入框
                nameInput.value = '';
                contentInput.value = '';
                // 重新加载留言列表
                loadMessages();
                // 添加动画效果
                createMessageEffect();
            } else {
                throw new Error(result.error || '发布留言失败');
            }
        } catch (error) {
            console.error('发布留言失败:', error);
            showNotification(`发布失败: ${error.message}`, 'error');
        }
    }

    // 渲染留言列表
    function renderMessages(messages) {
        const messageList = document.querySelector('.message-list');
        messageList.innerHTML = '';

        messages.forEach(message => {
            const messageCard = document.createElement('div');
            messageCard.className = 'message-card card';
            messageCard.innerHTML = `
                <div class='message-header'>
                    <span class='message-author'>${escapeHtml(message.name)}</span>
                    <span class='message-date'>${formatDate(message.created_at)}</span>
                </div>
                <div class='message-content'>${escapeHtml(message.content)}</div>
                <div class='message-divider'></div>
            `;
            messageList.appendChild(messageCard);
        });
    }

    // 辅助函数：格式化日期
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // 辅助函数：转义HTML
    function escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // 辅助函数：显示通知
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // 创建留言提交动画效果
    function createMessageEffect() {
        const effectContainer = document.createElement('div');
        effectContainer.className = 'message-effect';
        effectContainer.innerHTML = '✉️';
        effectContainer.style.left = '50%';
        effectContainer.style.top = '50%';
        document.body.appendChild(effectContainer);

        setTimeout(() => effectContainer.remove(), 1500);
    }
});

// 添加样式
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 8px;
        color: white;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        z-index: 1000;
    }
    .notification.show {
        transform: translateX(0);
    }
    .notification.success { background-color: #4CAF50; }
    .notification.error { background-color: #F44336; }

    .message-list {
        margin-top: 20px;
    }
    .message-card {
        padding: 15px;
        margin-bottom: 15px;
        border-radius: 8px;
        transition: transform 0.2s, box-shadow 0.2s;
    }
    .message-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .message-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        padding-bottom: 5px;
        border-bottom: 1px solid #eee;
    }
    .message-author {
        font-weight: bold;
        color: #333;
    }
    .message-date {
        font-size: 0.8em;
        color: #666;
    }
    .message-content {
        line-height: 1.6;
        color: #444;
    }
    .message-divider {
        margin-top: 10px;
        border-top: 1px dashed #eee;
    }

    .message-effect {
        position: fixed;
        font-size: 5em;
        pointer-events: none;
        animation: message-float 1.5s ease-out forwards;
        z-index: 1001;
    }

    @keyframes message-float {
        0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0.8; }
        50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
        100% { transform: translate(-50%, -50%) scale(0.8) translateY(-100px); opacity: 0; }
    }
`;
document.head.appendChild(style);