document.addEventListener('DOMContentLoaded', () => {
    // 初始化Quill编辑器
    const quill = new Quill('#editor', {
        theme: 'snow',
        modules: { toolbar: '#toolbar' },
        placeholder: '记录属于你的魔法时刻...✨'
    });

    // 加载已保存的日记
    loadDiaries();

    // 保存日记按钮事件
    document.querySelector('.save-button').addEventListener('click', saveDiary);

    // 加载日记函数
    async function loadDiaries() {
        try {
            const response = await fetch('/api/diary/read.php', { mode: 'cors' });
            if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
            // 校验响应类型是否为JSON
            const contentType = response.headers.get('Content-Type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('接收到非JSON格式响应');
            }
            const result = await response.json();

            if (!result.success) throw new Error(result.error || '加载日记失败');

            if (result.data.length > 0) {
                renderDiaryList(result.data);
            } else {
                document.querySelector('.diary-list').innerHTML = '<p>暂无日记记录，开始创建你的第一篇日记吧！</p>';
            }
        } catch (error) {
            console.error('加载日记失败:', error);
            document.querySelector('.diary-list').innerHTML = `<p class='error-message'>加载失败: ${error.message}</p>`;
        }
    }

    // 保存日记函数
    async function saveDiary() {
        const content = quill.root.innerHTML;
        const weather = document.getElementById('weather').value;
        const mood = document.getElementById('mood').value;

        if (!content.trim()) {
            alert('日记内容不能为空哦！');
            return;
        }

        try {
            const response = await fetch('/api/diary/create.php', {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, weather, mood })
            });

            const result = await response.json();

            if (result.success) {
                // 显示成功提示
                showNotification('日记保存成功！', 'success');
                // 清空编辑器
                quill.root.innerHTML = '';
                // 重新加载日记列表
                loadDiaries();
            } else {
                throw new Error(result.error || '保存日记失败');
            }
        } catch (error) {
            console.error('保存日记失败:', error);
            showNotification(`保存失败: ${error.message}`, 'error');
        }
    }

    // 渲染日记列表
    function renderDiaryList(diaries) {
        const diaryList = document.querySelector('.diary-list');
        diaryList.innerHTML = '';

        diaries.forEach(diary => {
            const diaryCard = document.createElement('div');
            diaryCard.className = 'diary-card card';
            diaryCard.innerHTML = `
                <div class='diary-header'>
                    <span class='diary-date'>${formatDate(diary.created_at)}</span>
                    <span class='diary-weather'>${getWeatherEmoji(diary.weather)}</span>
                    <span class='diary-mood'>${getMoodEmoji(diary.mood)}</span>
                </div>
                <div class='diary-content'>${diary.content}</div>
            `;
            diaryList.appendChild(diaryCard);
        });
    }

    // 辅助函数：格式化日期
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // 辅助函数：获取天气表情
    function getWeatherEmoji(weather) {
        const weatherMap = {
            'sunny': '☀️ 晴天',
            'cloudy': '☁️ 多云',
            'rainy': '🌧️ 雨天',
            'snowy': '❄️ 雪天'
        };
        return weatherMap[weather] || weather || '🌈 未知';
    }

    // 辅助函数：获取心情表情
    function getMoodEmoji(mood) {
        const moodMap = {
            'happy': '😊 开心',
            'sad': '😢 难过',
            'angry': '😠 生气',
            'calm': '😌 平静'
        };
        return moodMap[mood] || mood || '😐 平常';
    }

    // 辅助函数：显示通知
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
});

// 添加通知样式
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
    .notification.success {
        background-color: #4CAF50;
    }
    .notification.error {
        background-color: #F44336;
    }
    .diary-card {
        margin-bottom: 15px;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .diary-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        font-size: 0.9em;
        color: #666;
    }
    .diary-content {
        line-height: 1.6;
    }
`;
document.head.appendChild(style);
