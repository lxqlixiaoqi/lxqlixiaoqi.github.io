// 初始化日记编辑器
window.addEventListener('DOMContentLoaded', () => {
    initDiaryEditor();
    loadDiaries();
});

// 初始化富文本编辑器
function initDiaryEditor() {
    const quill = new Quill('#editor', {
        theme: 'snow',
        modules: { toolbar: '#toolbar' },
        placeholder: '记录属于你的魔法时刻...✨'
    });

    // 自动保存到本地存储
    quill.on('text-change', () => {
        localStorage.setItem('diaryDraft', quill.root.innerHTML);
    });

    // 加载草稿
    const draft = localStorage.getItem('diaryDraft');
    if (draft) quill.root.innerHTML = draft;

    return quill;
}

// 从后端加载日记
async function loadDiaries() {
    try {
        const response = await fetch('load-diary.php');
        const diaries = await response.json();
        const container = document.querySelector('.diary-list-container .diary-list');
        container.innerHTML = ''; // 清空现有内容

        if (diaries.length > 0) {
            diaries.forEach(diary => addDiaryEntry(container, diary));
        } else {
            container.innerHTML = '<div class="empty-state">还没有日记呢～开始记录你的第一篇日记吧！</div>';
        }
    } catch (error) {
        console.error('加载日记失败:', error);
        showNotification('加载日记失败，请稍后重试');
    }
}

// 保存日记
async function saveDiary() {
    const quill = window.diaryQuill || initDiaryEditor();
    const content = quill.root.innerHTML;
    const weather = document.getElementById('weather').value;
    const mood = document.getElementById('mood').value;

    if (!content.trim()) {
        showNotification('日记内容不能为空哦～');
        return;
    }

    try {
        const response = await fetch('save-diary.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                content: content,
                weather: weather,
                mood: mood,
                created_at: new Date().toISOString()
            })
        });

        const data = await response.json();
        if (data.success) {
            const container = document.querySelector('.diary-list-container .diary-list');
            addDiaryEntry(container, data.diary);
            quill.root.innerHTML = '';
            localStorage.removeItem('diaryDraft');
            showNotification('日记保存成功！');
            createSparkleEffect();
        }
    } catch (error) {
        console.error('保存日记失败:', error);
        showNotification('保存失败，请检查网络连接');
    }
}

// 添加日记条目到页面
function addDiaryEntry(container, diary) {
    const diaryCard = document.createElement('div');
    diaryCard.className = 'diary-card';
    diaryCard.innerHTML = `
        <div class="diary-metadata">
            <span class="diary-date">${formatDate(diary.created_at)}</span>
            <span class="diary-weather">${getWeatherEmoji(diary.weather)}</span>
            <span class="diary-mood">${getMoodEmoji(diary.mood)}</span>
        </div>
        <div class="diary-content">${diary.content}</div>
    `;

    // 添加入场动画
    diaryCard.style.opacity = '0';
    diaryCard.style.transform = 'translateY(20px)';
    container.prepend(diaryCard);

    setTimeout(() => {
        diaryCard.style.transition = 'all 0.5s ease';
        diaryCard.style.opacity = '1';
        diaryCard.style.transform = 'translateY(0)';
    }, 10);
}

// 工具函数：格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
}

// 工具函数：获取天气表情
function getWeatherEmoji(weather) {
    const map = {
        'sunny': '☀️', 'cloudy': '☁️', 'rainy': '🌧️', 'snowy': '❄️'
    };
    return map[weather] || '🌈';
}

// 工具函数：获取心情表情
function getMoodEmoji(mood) {
    const map = {
        'happy': '😊', 'sad': '😢', 'angry': '😠', 'calm': '😌'
    };
    return map[mood] || '😐';
}

// 显示通知
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'diary-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

// 绑定保存按钮事件
document.querySelector('.save-button').addEventListener('click', saveDiary);

// 创建爱心粒子效果
function createHeartParticles() {
    for (let i = 0; i < 10; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.innerHTML = '❤️';
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.fontSize = `${Math.random() * 20 + 10}px`;
        heart.style.animation = 'heart-float ' + (Math.random() * 2 + 1) + 's forwards';
        
        document.body.appendChild(heart);
        
        // 动画结束后移除
        setTimeout(() => {
            heart.remove();
        }, 1000);
    }
}
