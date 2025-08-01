/**
 * 日记API交互模块
 * 重构版：使用新的API端点获取和提交日记
 */

// API端点URL
const API_URL = {
    GET_DIARIES: '/api/diary/read.php',
    CREATE_DIARY: '/api/diary/create.php'
};

/**
 * 获取所有日记
 * @returns {Promise<Array>} 日记列表
 */
async function fetchDiaries() {
    try {
        const response = await fetch('/api/diary/read.php');
        const rawResponse = await response.text();
        renderDiaries(rawResponse);
    } catch (error) {
        console.error('获取日记失败:', error);
        document.getElementById('diaryContainer').innerHTML = `<div class="error-message">加载失败: ${error.message}</div>`;
    }
}
    try {
        const response = await fetch(API_URL.GET_DIARIES);
        const result = await response.json();

        if (!result.success) {
            console.error('获取日记失败:', result.error);
            showError(result.error || '获取日记失败，请重试');
            return [];
        }

        return result.data || [];
    } catch (error) {
        console.error('获取日记网络错误:', error);
        showError('网络错误，无法连接到服务器');
        return [];
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

        const result = await response.json();

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
function renderDiaries(rawResponse) {
    const diaryContainer = document.getElementById('diaryContainer');
    if (!diaryContainer) return;

    // 创建用于显示原始响应的容器
    const preElement = document.createElement('pre');
    preElement.className = 'raw-response';
    preElement.textContent = rawResponse;

    // 清空容器并添加原始响应
    diaryContainer.innerHTML = '';
    diaryContainer.appendChild(preElement);

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
    const container = document.getElementById('diaries-container');
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
                <h2>${escapeHtml(diary.title)}</h2>
                <time>${formatDate(diary.created_at)}</time>
            </div>
            <div class="diary-content">${escapeHtml(diary.content)}</div>
            <div class="diary-meta">
                <span class="diary-author">作者: ${escapeHtml(diary.author || '匿名')}</span>
            </div>
        </div>
    `).join('');


/**
 * 页面加载时初始化日记功能
 */
document.addEventListener('DOMContentLoaded', async () => {
    // 获取并渲染日记列表
    const diaries = await fetchDiaries();
    renderDiaries(diaries);

    // 绑定日记提交表单事件
    const diaryForm = document.getElementById('diaryForm');
    if (diaryForm) {
        diaryForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const diary = {
                title: document.getElementById('title').value,
                content: document.getElementById('content').value,
                author: document.getElementById('author').value || '匿名'
            };

            // 简单验证
            if (!diary.title || !diary.content) {
                showError('标题和内容不能为空');
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
