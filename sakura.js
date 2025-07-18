// 创建蘑菇元素
function createMushroom() {
    const mushroom = document.createElement('div');
    mushroom.className = 'mushroom';
    mushroom.style.background = `url(icon.png) no-repeat center`; // 使用目录中的icon.png作为蘑菇图片
    mushroom.style.backgroundSize = 'contain'; // 保持图片比例避免变形
    const size = Math.random() *17 +8 ; // 调整尺寸范围8-25px
    mushroom.style.width = `${size}px`;
    mushroom.style.height = `${size}px`;
    mushroom.style.left = `${Math.random() * 100}vw`;
    mushroom.style.animationDuration = `${Math.random() * 8 + 3}s`; // 调整动画时长范围
    document.querySelector('.sakura-fall').appendChild(mushroom);

    // 蘑菇消失后移除元素
    setTimeout(() => {
        mushroom.remove();
    }, 12000); // 延长存在时间至12秒
}

// 定时创建蘑菇
setInterval(createMushroom, 150); // 调整生成频率

// 页面加载完成后开始蘑菇雨
window.addEventListener('load', () => {
    // 添加节流控制
    let isCreating = false;
    setInterval(() => {
        if(!isCreating) {
            isCreating = true;
            createMushroom();
            setTimeout(() => isCreating = false, 1000);
        }
    }, 800);
    
    // 移动端减少花瓣数量
    if(window.innerWidth <= 768) {
        document.styleSheets[0].insertRule('.mushroom { filter: drop-shadow(0 0 3px #ff9eb5); }', 0);
    }
});