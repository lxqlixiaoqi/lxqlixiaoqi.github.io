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
        // 获取原始响应文本，不进行JSON解析
        const rawResponse = await response.text();
        return rawResponse;
    } catch (error) {
        console.error('获取留言网络错误:', error);
        return '获取数据失败: ' + error.message;
    }
}

// 已删除重复定义的旧submitMessage函数
// 使用文件下方的增强版submitMessage函数

// 页面加载时获取并显示留言
// 页面加载完成后初始化
 document.addEventListener('DOMContentLoaded', async () => { 
     // 获取并显示留言
     const rawResponse = await fetchMessages();
     renderMessages(rawResponse);
 
     // 绑定表单提交事件
     const messageForm = document.getElementById('messageForm');
     if (messageForm) {
         messageForm.addEventListener('submit', async (e) => {
             e.preventDefault();
             submitMessage();
         });
     }
 });

/**
 * 渲染留言列表
 * @param {string} rawResponse 原始响应文本
 */
function renderMessages(rawResponse) {
    try {
        // 尝试解析JSON
        const messages = JSON.parse(rawResponse);
        const messageContainer = document.getElementById('message-container');

        if (!messageContainer) return;

        // 清空容器
        messageContainer.innerHTML = '';

        // 检查是否有留言数据
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            messageContainer.innerHTML = '<div class="no-message">暂无留言</div>';
            return;
        }

        // 渲染每条留言
        messages.forEach(message => {
            const messageEl = createMessageElement('message-item');
            messageEl.innerHTML = `
                <div class="message-header">
                    <h3>${escapeHtml(message.name)}</h3>
                    <span>${formatDate(message.created_at)}</span>
                </div>
                <div class="message-content">${escapeHtml(message.content)}</div>
                ${message.contact ? `<div class="message-contact">联系方式: ${escapeHtml(message.contact)}</div>` : ''}
            `;
            messageContainer.appendChild(messageEl);
        });
    } catch (error) {
        console.error('解析留言数据失败:', error);
        const messageContainer = document.getElementById('message-container');
        if (messageContainer) {
            messageContainer.innerHTML = '<div class="error-message">数据加载失败</div>';
        }
    }
}

/**
 * 创建消息元素
 * @param {string} className 类名
 * @returns {HTMLElement} 创建的元素
 */
function createMessageElement(className) {
    const element = document.createElement('div');
    element.className = className;
    return element;
}

/**
 * 格式化日期
 * @param {string} dateString 日期字符串
 * @returns {string} 格式化后的日期
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * 转义HTML特殊字符
 * @param {string} text 要转义的文本
 * @returns {string} 转义后的文本
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
  * @param {string} text - 需要转义的文本
  * @returns {string} 转义后的文本
  */
function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>'"]/g, function(match) {
        const escapeMap = {'&':'&amp;','<':'&lt;','>':'&gt;','\'':'&#39;','"':'&quot;'}
        return escapeMap[match];
    });
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
// 加载留言函数
async function loadMessages() {
    try {
        const response = await fetch(API_URL.GET_MESSAGES);
        // 直接显示服务器返回的原始内容
        const text = await response.text();
        const messageContainer = document.getElementById('messages-container');
        if (messageContainer) {
            messageContainer.textContent = text;
            messageContainer.style.whiteSpace = 'pre-wrap';
            messageContainer.style.fontFamily = 'monospace';
        }
    } catch (error) {
        console.error('加载留言失败:', error);
        const messagesContainer = document.getElementById('messages-container');
        if (messagesContainer) {
            messagesContainer.innerHTML = `<p class='error-message'>加载失败: ${error.message}</p>`;
        }
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
            const messageData = {
                name: name,
                contact: document.getElementById('contact').value.trim(),
                content: content
            };
            console.log('提交的JSON数据:', JSON.stringify(messageData));

            const response = await fetch(API_URL.CREATE_MESSAGE, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(messageData)
            });

            console.log('服务器响应状态:', response.status);

            // 先检查响应状态
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`服务器响应错误: ${response.status} - ${errorText.substring(0, 100)}`);
            }

            // 尝试以文本形式获取响应，以便处理非JSON响应
            const text = await response.text();
            console.log('服务器响应文本:', text);
            let result;

            try {
                // 尝试解析为JSON
                result = JSON.parse(text);
                console.log('解析后的JSON响应:', result);
            } catch (jsonError) {
                // 如果解析失败，将文本作为错误信息抛出
                throw new Error(`服务器返回非JSON响应: ${text.substring(0, 100)}...`);
            }

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
    function renderMessages(rawResponse) {
    const messageContainer = document.getElementById('messageContainer');
    if (!messageContainer) return;

    // 创建用于显示原始响应的容器
    const preElement = document.createElement('pre');
    preElement.className = 'raw-response';
    preElement.textContent = rawResponse;

    // 清空容器并添加原始响应
    messageContainer.innerHTML = '';
    messageContainer.appendChild(preElement);

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .raw-response {
            background-color: #f5f5f5;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            white-space: pre-wrap;
            word-wrap: break-word;
            max-height: 400px;
            overflow-y: auto;
            color: #333;
        }
    `;
    document.head.appendChild(style);
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



// 加载留言函数
async function loadMessages() {
    try {
        const response = await fetch(API_URL.GET_MESSAGES);
        if (!response.ok) {
            throw new Error(`服务器响应错误: ${response.status}`);
        }
        const text = await response.text();
        renderMessages(text);
    } catch (error) {
        console.error('加载留言失败:', error);
        const messagesContainer = document.getElementById('messages-container');
        if (messagesContainer) {
            messagesContainer.innerHTML = `<p class='error-message'>加载留言失败: ${error.message}</p>`;
        }
    }
}

// 添加表单提交事件监听器
document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', function(event) {
            event.preventDefault();
            submitMessage();
        });
    } else {
        console.error('未找到留言表单元素');
    }

    // 页面加载时加载留言
    loadMessages();
});

// 合并样式定义
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
    .notification.show { transform: translateX(0); }
    .notification.success { background-color: #4CAF50; }
    .notification.error { background-color: #F44336; }

    .raw-response {
        background-color: #f5f5f5;
        padding: 15px;
        border-radius: 8px;
        font-family: monospace;
        white-space: pre-wrap;
        word-wrap: break-word;
        max-height: 400px;
        overflow-y: auto;
        color: #333;
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