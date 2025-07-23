document.addEventListener('DOMContentLoaded', () => {
    // 加载留言
    loadMessages();

    // 表单提交事件
    document.getElementById('messageForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitMessage();
    });

    // 加载留言函数
    async function loadMessages() {
        try {
            const response = await fetch('/api/message/read.php', { mode: 'cors' });
            if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
            /**
 * 留言板API交互模块
 * 重构版：使用新的API端点获取和提交留言
 */

// API端点URL
const API_URL = {
    GET_MESSAGES: '/api/message/read.php',
    CREATE_MESSAGE: '/api/message/create.php'
};

/**
 * 获取所有留言
 * @returns {Promise<Array>} 留言列表
 */
async function fetchMessages() {
    try {
        const response = await fetch(API_URL.GET_MESSAGES);
        const result = await response.json();

        if (!result.success) {
            console.error('获取留言失败:', result.error);
            showError(result.error || '获取留言失败，请重试');
            return [];
        }

        return result.data || [];
    } catch (error) {
        console.error('获取留言网络错误:', error);
        showError('网络错误，无法连接到服务器');
        return [];
    }
}

/**
 * 提交新留言
 * @param {Object} message 留言数据
 * @returns {Promise<boolean>} 是否提交成功
 */
async function submitMessage(message) {
    try {
        const response = await fetch(API_URL.CREATE_MESSAGE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });

        const result = await response.json();

        if (!result.success) {
            console.error('提交留言失败:', result.error);
            showError(result.error || '提交留言失败，请重试');
            return false;
        }

        return true;
    } catch (error) {
        console.error('提交留言网络错误:', error);
        showError('网络错误，无法连接到服务器');
        return false;
    }
}

// 页面加载时获取并显示留言
document.addEventListener('DOMContentLoaded', async () => {
    const messages = await fetchMessages();
    renderMessages(messages);

    // 绑定表单提交事件
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const message = {
                name: document.getElementById('name').value,
                contact: document.getElementById('contact').value,
                content: document.getElementById('content').value
            };

            // 简单验证
            if (!message.name || !message.content) {
                showError('姓名和留言内容不能为空');
                return;
            }

            // 提交留言
            const success = await submitMessage(message);
            if (success) {
                // 重置表单
                messageForm.reset();
                // 重新加载留言列表
                const messages = await fetchMessages();
                renderMessages(messages);
                showSuccess('留言发布成功！');
            }
        });
    }
});

/**
 * 渲染留言列表
 * @param {Array} messages 留言数据数组
 */
function renderMessages(messages) {
    const container = document.getElementById('messages-container');
    if (!container) return;

    if (messages.length === 0) {
        container.innerHTML = '<div class="no-messages">暂无留言，成为第一个留言的人吧！</div>';
        return;
    }

    container.innerHTML = messages.map(msg => `
        <div class="message-item">
            <div class="message-header">
                <h3>${escapeHtml(msg.name)}</h3>
                <time>${formatDate(msg.created_at)}</time>
            </div>
            ${msg.contact ? `<div class="message-contact">${escapeHtml(msg.contact)}</div>` : ''}
            <div class="message-content">${escapeHtml(msg.content)}</div>
        </div>
    `).join('');
}

/**
 * 显示错误消息
 * @param {string} text 错误文本
 */
function showError(text) {
    const errorEl = document.getElementById('error-message') || createMessageElement('error-message');
    errorEl.textContent = text;
    errorEl.style.display = 'block';
    setTimeout(() => errorEl.style.display = 'none', 5000);
}

/**
 * 显示成功消息
 * @param {string} text 成功文本
 */
function showSuccess(text) {
    const successEl = document.getElementById('success-message') || createMessageElement('success-message');
    successEl.textContent = text;
    successEl.style.display = 'block';
    setTimeout(() => successEl.style.display = 'none', 3000);
}

/**
 * 创建消息元素
 * @param {string} id 元素ID
 * @returns {HTMLElement} 创建的元素
 */
function createMessageElement(id) {
    const el = document.createElement('div');
    el.id = id;
    el.className = id.includes('error') ? 'alert error' : 'alert success';
    el.style.position = 'fixed';
    el.style.bottom = '20px';
    el.style.left = '50%';
    el.style.transform = 'translateX(-50%)';
    el.style.padding = '10px 20px';
    el.style.borderRadius = '4px';
    el.style.color = 'white';
    el.style.zIndex = '1000';
    el.style.display = 'none';
    document.body.appendChild(el);
    return el;
}

/**
 * HTML转义函数
 * @param {string} text 原始文本
 * @returns {string} 转义后的文本
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 日期格式化函数
 * @param {string} dateStr 日期字符串
 * @returns {string} 格式化后的日期
 */
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// 工具函数：检查并创建所需的DOM元素
function initMessageBoard() {
    // 可以在这里添加初始化逻辑
}

// 初始化留言板
initMessageBoard();
            // 直接显示服务器返回的原始内容
            const text = await response.text();
            const messageContainer = document.getElementById('messages-container');
            messageContainer.textContent = text;
            messageContainer.style.whiteSpace = 'pre-wrap';
            messageContainer.style.fontFamily = 'monospace';
        } catch (error) {
            console.error('加载留言失败:', error);
            document.getElementById('messages-container').innerHTML = `<p class='error-message'>加载失败: ${error.message}</p>`;
        }
    }

    // 提交留言函数
    async function submitMessage() {
        const nameInput = document.getElementById('name');
        const contentInput = document.getElementById('content');
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
                body: JSON.stringify({ name, contact: document.getElementById('contact').value.trim(), content })
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