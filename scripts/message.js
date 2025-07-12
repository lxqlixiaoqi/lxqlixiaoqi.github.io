// 引入 MySQL 连接库
const mysql = require('mysql2/promise');

// 创建 MySQL 连接池
const pool = mysql.createPool({    
    host: 'sql309.infinityfree.com',
    user: 'if0_39452447',
    password: 'wyz831201',
    database: 'if0_39452447_lxqdata',
    port: 3306
});

// 初始化时创建 messages 表
(async () => {
    try {
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                contact VARCHAR(255),
                content TEXT NOT NULL,
                created_at DATETIME NOT NULL
            )
        `);
        console.log('messages 表创建成功或已存在');
    } catch (error) {
        console.error('创建 messages 表时出错:', error);
    }
})();


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
            // 将新留言插入到 MySQL
            const [result] = await pool.execute(
                'INSERT INTO messages (name, contact, content, created_at) VALUES (?, ?, ?, ?)',
                [name, contact, content, created_at]
            );

            console.log('留言提交成功:', result);
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

// 加载并显示所有留言
async function loadMessages() {
    try {
        // 从 MySQL 获取所有留言
        const [rows] = await pool.execute(
            'SELECT * FROM messages ORDER BY created_at DESC'
        );

        const messagesContainer = document.querySelector('.messages');
        messagesContainer.innerHTML = '';

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
    }
}

// 页面加载时初始化留言
window.addEventListener('DOMContentLoaded', loadMessages);

// 注意：实际部署时需要配置 CORS 代理并保护数据库凭据