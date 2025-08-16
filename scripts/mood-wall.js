/**
 * 心情墙API交互模块
 * 重构版：使用新的API端点获取和提交心情
 * 集成JsonUtils安全处理JSON响应
 */

// API端点URL
const API_URL = {
    GET_MOODS: '/api/mood/read.php',
    CREATE_MOOD: '/api/mood/create.php'
};

// 等待JsonUtils加载完成
let jsonUtils = null;

// 监听DOM加载完成事件
document.addEventListener('DOMContentLoaded', () => {
    // 确保JsonUtils已加载
    if (window.JsonUtils) {
        jsonUtils = new JsonUtils();
    } else {
        console.error('JsonUtils未加载，请确保已引入json-utils.js');
        // 尝试延迟初始化
        setTimeout(() => {
            if (window.JsonUtils) {
                jsonUtils = new JsonUtils();
            }
        }, 1000);
    }
});

/**
 * 获取所有心情
 * @returns {Promise<Array>} 心情列表
 */
async function fetchMoods() {
    try {
        const response = await fetch(API_URL.GET_MOODS);
        // 获取原始响应文本
        const rawResponse = await response.text();
        
        // 使用JsonUtils安全解析JSON
        if (jsonUtils) {
            const result = jsonUtils.processResponse(rawResponse);
            return result.data || [];
        } else {
            // 回退方案：尝试使用标准JSON解析
            try {
                const result = JSON.parse(rawResponse);
                return result.data || [];
            } catch (e) {
                console.error('JSON解析失败，回退到原始数据:', e);
                return [];
            }
        }
    } catch (error) {
        console.error('获取心情网络错误:', error);
        showError('获取数据失败: ' + error.message);
        return [];
    }
}

/**
 * 提交新心情
 * @param {Object} mood 心情数据
 * @returns {Promise<boolean>} 是否提交成功
 */
async function submitMood(mood) {
    try {
        const response = await fetch(API_URL.CREATE_MOOD, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mood)
        });

        // 获取原始响应文本
        const rawResponse = await response.text();
        
        // 使用JsonUtils安全解析JSON
        if (jsonUtils) {
            const result = jsonUtils.processResponse(rawResponse);
            if (!result.success) {
                console.error('提交心情失败:', result.error);
                showError(result.error || '提交心情失败，请重试');
                return false;
            }
            return true;
        } else {
            // 回退方案：尝试使用标准JSON解析
            try {
                const result = JSON.parse(rawResponse);
                if (!result.success) {
                    console.error('提交心情失败:', result.error);
                    showError(result.error || '提交心情失败，请重试');
                    return false;
                }
                return true;
            } catch (e) {
                console.error('JSON解析失败:', e);
                showError('提交心情失败，服务器响应格式异常');
                return false;
            }
        }
    } catch (error) {
        console.error('提交心情网络错误:', error);
        showError('获取数据失败: ' + error.message);
        return false;
    }
}

/**
 * 渲染心情墙
 * @param {Array} moods 心情数据数组
 */
function renderMoodWall(moods) {
    const container = document.getElementById('moods-container');
    if (!container) return;

    if (moods.length === 0) {
        container.innerHTML = '<div class="no-moods">暂无心情记录，分享你的心情吧！</div>';
        return;
    }

    // 按创建时间降序排序（最新的在前）
    moods.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    container.innerHTML = moods.map(mood => `
        <div class="mood-item" style="animation-delay: ${Math.random() * 0.5}s">
            <div class="mood-emoji">${getMoodEmoji(mood.mood_type)}</div>
            <div class="mood-content">${escapeHtml(mood.content)}</div>
            <div class="mood-meta">
                <span class="mood-author">${escapeHtml(mood.author || '匿名')}</span>
                <time>${formatDate(mood.created_at)}</time>
            </div>
        </div>
    `).join('');
}

/**
 * 根据心情类型获取对应的表情
 * @param {string} moodType 心情类型
 * @returns {string} 表情符号
 */
function getMoodEmoji(moodType) {
    const moodMap = {
        'happy': '😊',
        'sad': '😢',
        'angry': '😠',
        'calm': '😌',
        'excited': '🎉',
        'worried': '😟',
        'surprised': '😲',
        'tired': '😴'
    };
    return moodMap[moodType] || '😐';
}

/**
 * 页面加载时初始化心情墙功能
 */
document.addEventListener('DOMContentLoaded', async () => {
    // 等待JsonUtils初始化完成
    if (!jsonUtils) {
        // 如果JsonUtils尚未加载，等待1秒后重试
        setTimeout(async () => {
            const moods = await fetchMoods();
            renderMoodWall(moods);
        }, 1000);
    } else {
        // 获取并渲染心情列表
        const moods = await fetchMoods();
        renderMoodWall(moods);
    }

    // 绑定心情提交表单事件
    const moodForm = document.getElementById('moodForm');
    if (moodForm) {
        moodForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const mood = {
                mood_type: document.getElementById('mood-type').value,
                content: document.getElementById('mood-content').value,
                author: document.getElementById('mood-author').value || '匿名'
            };

            // 简单验证
            if (!mood.mood_type || !mood.content) {
                showError('请选择心情类型并输入心情内容');
                return;
            }

            // 提交心情
            const success = await submitMood(mood);
            if (success) {
                // 重置表单
                moodForm.reset();
                // 重新加载并渲染心情列表
                if (jsonUtils) {
                    const moods = await fetchMoods();
                    renderMoodWall(moods);
                } else {
                    setTimeout(async () => {
                        const moods = await fetchMoods();
                        renderMoodWall(moods);
                    }, 1000);
                }
                showSuccess('心情发布成功！');
            }
        });
    }
});
    

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

// 初始化心情墙
function initMoodWall() {
    // 添加基础样式
    const style = document.createElement('style');
    style.textContent = `
        .moods-container {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
            padding: 20px;
        }
        .mood-item {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            opacity: 0;
            transform: translateY(20px);
            animation: fadeInUp 0.5s forwards;
        }
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .mood-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .mood-emoji {
            font-size: 2.5rem;
            margin-bottom: 10px;
        }
        .mood-content {
            margin-bottom: 15px;
            line-height: 1.6;
            color: #333;
        }
        .mood-meta {
            display: flex;
            justify-content: space-between;
            font-size: 0.85rem;
            color: #666;
        }
        .no-moods {
            grid-column: 1 / -1;
            text-align: center;
            padding: 60px 20px;
            color: #999;
            font-size: 1.2rem;
        }
        .mood-form {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .form-group {
            margin-bottom: 15px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }
        input, textarea, select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 1rem;
        }
        textarea {
            min-height: 100px;
            resize: vertical;
        }
        .submit-button {
            background: #4285f4;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        .submit-button:hover {
            background: #3367d6;
        }
    `;
    document.head.appendChild(style);
}

// 启动心情墙功能
initMoodWall();