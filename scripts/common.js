// 全局背景壁纸加载
async function loadGlobalWallpaper() {
    try {
        const response = await fetch('http://www.98qy.com/sjbz/api.php');
        const wallpaperUrl = await response.text(); // 假设API返回纯文本URL
        document.body.style.backgroundImage = `url('${wallpaperUrl}')`;
    } catch (error) {
        console.error('加载全局壁纸失败:', error);
        document.body.style.backgroundImage = 'url(fallback-bg.jpg)'; // 使用备用背景
    }
}

// 页面加载时执行
window.addEventListener('load', () => {
    loadGlobalWallpaper();
    // 初始化透明度调节
    const opacityRange = document.getElementById('opacityRange');
    const toggleBtn = document.querySelector('.toggle-btn');
    const opacityControl = document.querySelector('.opacity-control');

    // 侧边栏切换功能
    if (toggleBtn && opacityControl) {
        toggleBtn.addEventListener('click', () => {
            opacityControl.classList.toggle('active');
        });
    }

    if (opacityRange) {
        const contentModules = document.querySelectorAll('.diary, .message-board, .daily-poem, .diary-container');
        // 初始设置透明度
        opacityRange.value = 0.8;
        contentModules.forEach(module => {
            module.style.background = `rgba(255, 255, 255, ${0.8})`;
        });
        // 滚动条变化事件
        opacityRange.addEventListener('input', (e) => {
            const opacity = e.target.value;
            contentModules.forEach(module => {
                module.style.background = `rgba(255, 255, 255, ${opacity})`;
            });
        });
    }
});
// 每小时刷新一次壁纸（可选）
setInterval(loadGlobalWallpaper, 3600000);