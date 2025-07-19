document.addEventListener('DOMContentLoaded', () => {
    // 加载心情数据
    loadMoods();

    // 提交心情按钮事件
    document.querySelector('.mood-submit').addEventListener('click', submitMood);

    // 加载心情函数
    async function loadMoods() {
        try {
            const response = await fetch('/api/mood/read.php', { mode: 'cors' });
            if (!response.ok) throw new Error(`HTTP错误: ${response.status}`);
            // 根据Content-Type解析响应（支持JSON/文本/XML等格式）
            let result;
            const contentType = response.headers.get('Content-Type');
            try {
                if (contentType?.includes('application/json')) {
                    result = await response.json();
                } else if (contentType?.includes('text/xml')) {
                    const xmlText = await response.text();
                    const parser = new DOMParser();
                    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
                    result = { success: true, data: xmlDoc };
                } else if (contentType?.includes('text/plain')) {
                    const text = await response.text();
                    result = { success: true, data: text };
                } else {
                    const text = await response.text();
                    result = { success: false, error: `不支持的响应类型: ${contentType || '未指定'}` };
                }
            } catch (parseError) {
                const text = await response.text();
                result = { success: false, error: `解析失败（${contentType || '未知类型'}）: ${parseError.message} - ${text.substring(0, 100)}...` };
            }
            if (!result.success) throw new Error(result.error || '加载心情失败');

            if (result.data.length > 0) {
                renderMoodWall(result.data);
            } else {
                document.querySelector('.mood-wall').innerHTML = '<p>暂无心情记录，分享你的心情吧！</p>';
            }
        } catch (error) {
            console.error('加载心情失败:', error);
            document.querySelector('.mood-wall').innerHTML = `<p class='error-message'>加载失败: ${error.message}</p>`;
        }
    }

    // 提交心情函数
    async function submitMood() {
        const content = document.getElementById('mood-content').value.trim();
        const moodType = document.querySelector('input[name="mood-type"]:checked')?.value;

        if (!content || !moodType) {
            showNotification('请输入心情内容并选择心情类型', 'error');
            return;
        }

        try {
            const response = await fetch('/api/mood/create.php', {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, mood_type: moodType })
            });

            const result = await response.json();

            if (result.success) {
                // 显示成功提示
                showNotification('心情发布成功！', 'success');
                // 清空输入框
                document.getElementById('mood-content').value = '';
                // 重新加载心情墙
                loadMoods();
                // 添加动画效果
                createMoodEffect(moodType);
            } else {
                throw new Error(result.error || '发布心情失败');
            }
        } catch (error) {
            console.error('发布心情失败:', error);
            showNotification(`发布失败: ${error.message}`, 'error');
        }
    }

    // 渲染心情墙
    function renderMoodWall(moods) {
        const moodWall = document.querySelector('.mood-wall');
        moodWall.innerHTML = '';

        moods.forEach(mood => {
            const moodCard = document.createElement('div');
            moodCard.className = `mood-card card ${getMoodClass(mood.mood_type)}`;
            moodCard.innerHTML = `
                <div class='mood-header'>
                    <span class='mood-emoji'>${getMoodEmoji(mood.mood_type)}</span>
                    <span class='mood-date'>${formatDate(mood.created_at)}</span>
                </div>
                <div class='mood-content'>${escapeHtml(mood.content)}</div>
            `;
            moodWall.appendChild(moodCard);
        });
    }

    // 辅助函数：获取心情表情
    function getMoodEmoji(moodType) {
        const moodMap = {
            'happy': '😊',
            'sad': '😢',
            'angry': '😠',
            'excited': '🎉',
            'worried': '😟',
            'calm': '😌'
        };
        return moodMap[moodType] || '😐';
    }

    // 辅助函数：获取心情卡片样式类
    function getMoodClass(moodType) {
        const classMap = {
            'happy': 'mood-happy',
            'sad': 'mood-sad',
            'angry': 'mood-angry',
            'excited': 'mood-excited',
            'worried': 'mood-worried',
            'calm': 'mood-calm'
        };
        return classMap[moodType] || '';
    }

    // 辅助函数：格式化日期
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
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
});