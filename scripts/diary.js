/**
 * 日记API交互模块
 * 重构版：使用新的API端点获取和提交日记
 * 集成JsonUtils安全处理JSON响应
 */

// API端点URL
const API_URL = {
    GET_DIARIES: '/api/diary/read.php',
    CREATE_DIARY: '/api/diary/create.php'
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
 * 获取所有日记
 * @returns {Promise<Array>} 日记列表
 */
async function fetchDiaries() {
    try {
        const response = await fetch(API_URL.GET_DIARIES);
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
        console.error('获取日记网络错误:', error);
        showError('获取数据失败: ' + error.message);
        return [];
    }
}


/**
 * 提交新日记
 * @param {Object} diary 日记数据
 * @returns {Promise<boolean>} 是否提交成功
 */
async function submitDiary(diary) {
    try {
        const response = await fetch(API_URL.CREATE_DIARY, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(diary)
        });

        // 获取原始响应文本
        const rawResponse = await response.text();
        let result;

        // 使用JsonUtils安全解析JSON
        if (jsonUtils) {
            result = jsonUtils.processResponse(rawResponse);
        } else {
            // 回退方案：尝试使用标准JSON解析
            try {
                result = JSON.parse(rawResponse);
            } catch (e) {
                console.error('JSON解析失败:', e);
                showError('服务器响应格式错误');
                return false;
            }
        }

        if (!result.success) {
            console.error('提交日记失败:', result.error);
            showError(result.error || '提交日记失败，请重试');
            return false;
        }

        return true;
    } catch (error) {
        console.error('提交日记网络错误:', error);
        showError('网络错误，无法连接到服务器');
        return false;
    }
}

/**
 * 渲染日记列表
 * @param {Array} diaries 日记数据数组
 */
function renderDiaries(diaries) {
    const container = document.getElementById('diaries-container') || document.getElementById('diaryContainer');
    if (!container) return;

    if (diaries.length === 0) {
        container.innerHTML = '<div class="no-diaries">暂无日记记录，开始记录你的第一篇日记吧！</div>';
        return;
    }

    // 按创建时间降序排序（最新的在前）
    diaries.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    container.innerHTML = diaries.map(diary => `
        <div class="diary-item">
            <div class="diary-header">
                <h2>${escapeHtml(diary.title || '无标题')}</h2>
                <time>${formatDate(diary.created_at)}</time>
            </div>
            <div class="diary-content">${escapeHtml(diary.content)}</div>
            <div class="diary-meta">
                <span class="diary-author">作者: ${escapeHtml(diary.author || '匿名')}</span>
                ${diary.weather ? `<span class="diary-weather">天气: ${escapeHtml(diary.weather)}</span>` : ''}
                ${diary.mood ? `<span class="diary-mood">心情: ${escapeHtml(diary.mood)}</span>` : ''}
            </div>
        </div>
    `).join('');
}


/**
 * 页面加载时初始化日记功能
 */
document.addEventListener('DOMContentLoaded', async () => {
    // 等待JsonUtils初始化完成
    if (!jsonUtils) {
        // 如果JsonUtils尚未加载，等待1秒后重试
        setTimeout(async () => {
            const diaries = await fetchDiaries();
            renderDiaries(diaries);
        }, 1000);
    } else {
        // 获取并渲染日记列表
        const diaries = await fetchDiaries();
        renderDiaries(diaries);
    }

    // 绑定日记提交表单事件
    const diaryForm = document.getElementById('diaryForm');
    if (diaryForm) {
        diaryForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const diary = {
                title: document.getElementById('title').value,
                content: document.getElementById('content').value,
                author: document.getElementById('author').value || '匿名',
                weather: document.getElementById('weather')?.value || '',
                mood: document.getElementById('mood')?.value || ''
            };

            // 简单验证
            if (!diary.content) {
                showError('日记内容不能为空');
                return;
            }

            // 提交日记
            const success = await submitDiary(diary);
            if (success) {
                // 重置表单
                diaryForm.reset();
                // 重新加载并渲染日记列表
                const diaries = await fetchDiaries();
                renderDiaries(diaries);
                showSuccess('日记保存成功！');
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

// 初始化日记功能
function initDiary() {
    // 可以在这里添加额外的初始化逻辑
}

// 启动日记功能
initDiary();
