// 创建樱花元素
function createSakura() {
    const sakura = document.createElement('span');
    sakura.className = 'sakura';
    sakura.textContent = '🌸';
    const size = Math.random() *17 +8 ; // 调整尺寸范围8-25px
    sakura.style.fontSize = `${size}px`;
    sakura.style.left = `${Math.random() * 100}vw`;
    sakura.style.animationDuration = `${Math.random() * 8 + 3}s`; // 调整动画时长范围
    document.querySelector('.sakura-container').appendChild(sakura);

    // 樱花消失后移除元素
    setTimeout(() => {
        sakura.remove();
    }, 12000); // 延长存在时间至12秒
}

// 定时创建樱花
setInterval(createSakura, 500); // 减少生成频率

// 页面加载完成后开始樱花雨
window.addEventListener('load', () => {
    createSakura();
});