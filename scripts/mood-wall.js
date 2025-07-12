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

// 初始化时创建 moods 表
(async () => {
    try {
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS moods (
                id INT AUTO_INCREMENT PRIMARY KEY,
                emoji VARCHAR(10) NOT NULL,
                text TEXT NOT NULL,
                created_at DATETIME NOT NULL
            )
        `);
        console.log('moods 表创建成功或已存在');
    } catch (error) {
        console.error('创建 moods 表时出错:', error);
    }
})();

// 初始化加载
window.addEventListener('DOMContentLoaded', loadMoods);

// 加载历史心情记录
async function loadMoodHistory() {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM moods ORDER BY created_at DESC'
        );
        if (rows) {
            const historyContainer = document.querySelector('.mood-history');
            if (historyContainer) {
                historyContainer.innerHTML = rows.map(mood => 
                    `<div class="mood-item">
                      <div class="mood-date">${new Date(mood.created_at).toLocaleString()}</div>
                      <div class="mood-emoji">${mood.emoji}</div>
                      <div class="mood-text">${mood.text}</div>
                    </div>`
                ).join('');
            }
        }
    } catch (error) {
        console.error('加载心情记录时出错:', error);
    }
}

// 页面加载时获取历史记录
window.addEventListener('load', loadMoodHistory);

// 心情日记墙交互逻辑
const moodForm = document.querySelector('.mood-form');
const moodGrid = document.querySelector('.mood-grid');
const emojiOptions = document.querySelectorAll('.emoji-option');
const textarea = moodForm.querySelector('textarea');
const saveButton = moodForm.querySelector('.save-button');

let selectedEmoji = '😊';

// 选择表情
emojiOptions.forEach(option => {
    option.addEventListener('click', () => {
        selectedEmoji = option.textContent;
        emojiOptions.forEach(opt => opt.style.transform = 'scale(1)');
        option.style.transform = 'scale(1.3)';
    });
});

// 保存心情
saveButton.addEventListener('click', async () => {
    const moodText = textarea.value.trim();
    if (moodText) {
        try {
            const created_at = new Date().toISOString();
            // 保存到 MySQL
            const [result] = await pool.execute(
                'INSERT INTO moods (emoji, text, created_at) VALUES (?, ?, ?)',
                [selectedEmoji, moodText, created_at]
            );
            if (result) {
                addMoodCard(selectedEmoji, moodText);
                textarea.value = '';
                // 触发爱心粒子效果
                createHeartParticles();
            }
        } catch (error) {
            console.error('保存失败:', error);
        }
    }
});

// 添加心情卡片
function addMoodCard(emoji, text) {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
    
    const moodCard = document.createElement('div');
    moodCard.className = 'mood-card';
    moodCard.innerHTML = `
        <div class="mood-emoji">${emoji}</div>
        <div class="mood-date">${dateStr}</div>
        <div class="mood-content">${text}</div>
    `;
    
    // 添加动画效果
    moodCard.style.opacity = '0';
    moodCard.style.transform = 'translateY(20px)';
    
    moodGrid.prepend(moodCard);
    
    // 触发动画
    setTimeout(() => {
        moodCard.style.transition = 'all 0.5s ease';
        moodCard.style.opacity = '1';
        moodCard.style.transform = 'translateY(0)';
    }, 10);
}

// 创建爱心粒子效果
function createHeartParticles() {
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.innerHTML = '❤️';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.fontSize = `${Math.random() * 20 + 10}px`;
        heart.style.animation = `heart-float ${Math.random() * 2 + 1}s forwards`;
        
        document.body.appendChild(heart);
        
        // 动画结束后移除
        setTimeout(() => {
            heart.remove();
        }, 1000);
    }
}

// 从 MySQL 加载心情
async function loadMoods() {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM moods ORDER BY created_at DESC'
        );
        if (rows.length > 0) {
            rows.forEach(mood => {
                addMoodCard(mood.emoji, mood.text);
            });
        } else {
            // 默认示例心情
            addMoodCard('😊', '今天天气真好，心情愉悦！');
            addMoodCard('😢', '遇到了一些小挫折，但我会加油的！');
            addMoodCard('🤔', '思考人生中...');
        }
    } catch (error) {
        console.error('加载心情时出错:', error);
        // 默认示例心情
        addMoodCard('😊', '今天天气真好，心情愉悦！');
        addMoodCard('😢', '遇到了一些小挫折，但我会加油的！');
        addMoodCard('🤔', '思考人生中...');
    }
}