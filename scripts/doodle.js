document.addEventListener('DOMContentLoaded', function() {
  // 获取画布和工具元素
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const brushBtn = document.getElementById('brushBtn');
  const eraserBtn = document.getElementById('eraserBtn');
  const stickerBtn = document.getElementById('stickerBtn');
  const textBtn = document.getElementById('textBtn');
  const colorOptions = document.querySelectorAll('.color-option');
  const brushSizeSelect = document.getElementById('brushSize');
  const clearBtn = document.getElementById('clearBtn');
  const saveBtn = document.getElementById('saveBtn');
  const shareBtn = document.getElementById('shareBtn');
  const stickerPanel = document.getElementById('stickerPanel');
  const stickers = document.querySelectorAll('.sticker');

  // 设置画布尺寸（考虑高DPI屏幕）
  function setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  setupCanvas();
  window.addEventListener('resize', setupCanvas);

  // 初始化变量
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let currentTool = 'brush';
  let currentColor = '#ff69b4';
  let currentSize = 5;
  let currentSticker = null;
  let stickersOnCanvas = [];

  // 工具切换
  function switchTool(tool) {
    currentTool = tool;
    // 重置所有按钮样式
    [brushBtn, eraserBtn, stickerBtn, textBtn].forEach(btn => btn.classList.remove('active'));
    // 设置当前按钮样式
    if (tool === 'brush') brushBtn.classList.add('active');
    else if (tool === 'eraser') eraserBtn.classList.add('active');
    else if (tool === 'sticker') {
      stickerBtn.classList.add('active');
      stickerPanel.style.display = 'flex';
    } else if (tool === 'text') textBtn.classList.add('active');

    // 隐藏贴纸面板（如果不是贴纸工具）
    if (tool !== 'sticker') {
      stickerPanel.style.display = 'none';
      currentSticker = null;
    }
  }

  // 事件监听：工具切换
  brushBtn.addEventListener('click', () => switchTool('brush'));
  eraserBtn.addEventListener('click', () => switchTool('eraser'));
  stickerBtn.addEventListener('click', () => switchTool('sticker'));
  textBtn.addEventListener('click', () => switchTool('text'));

  // 事件监听：选择颜色
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      colorOptions.forEach(opt => opt.classList.remove('active'));
      this.classList.add('active');
      currentColor = this.style.backgroundColor;
    });
  });

  // 事件监听：调整画笔大小
  brushSizeSelect.addEventListener('change', function() {
    currentSize = parseInt(this.value);
  });

  // 开始绘制
  function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
  }

  // 绘制中
  function draw(e) {
    if (!isDrawing) return;

    if (currentTool === 'brush') {
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = currentSize;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      [lastX, lastY] = [e.offsetX, e.offsetY];
    } else if (currentTool === 'eraser') {
      ctx.strokeStyle = '#fffaf0'; // 画布背景色
      ctx.lineWidth = currentSize * 2;
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      [lastX, lastY] = [e.offsetX, e.offsetY];
    } else if (currentTool === 'sticker' && currentSticker) {
      // 贴纸逻辑将在后面实现
    }
  }

  // 停止绘制
  function stopDrawing() {
    isDrawing = false;
  }

  // 事件监听：绘制
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);

  // 选择贴纸
  stickers.forEach(sticker => {
    sticker.addEventListener('click', function() {
      currentSticker = this.src;
      canvas.style.cursor = 'crosshair';
    });
  });

  // 在画布上添加贴纸
  canvas.addEventListener('click', function(e) {
    if (currentTool === 'sticker' && currentSticker) {
      const stickerImg = new Image();
      stickerImg.src = currentSticker;
      stickerImg.onload = function() {
        // 在点击位置绘制贴纸
        const stickerSize = 50;
        ctx.drawImage(
          stickerImg,
          e.offsetX - stickerSize / 2,
          e.offsetY - stickerSize / 2,
          stickerSize,
          stickerSize
        );
        // 记录贴纸信息（用于后续操作）
        stickersOnCanvas.push({
          src: currentSticker,
          x: e.offsetX - stickerSize / 2,
          y: e.offsetY - stickerSize / 2,
          size: stickerSize
        });
      };
    } else if (currentTool === 'text') {
      const text = prompt('请输入文字:');
      if (text) {
        ctx.font = '20px Arial, sans-serif';
        ctx.fillStyle = currentColor;
        ctx.fillText(text, e.offsetX, e.offsetY);
      }
      switchTool('brush'); // 输入文字后切换回画笔
    }
  });

  // 清空画布
  clearBtn.addEventListener('click', function() {
    if (confirm('确定要清空画布吗？')) {
      ctx.fillStyle = '#fffaf0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      stickersOnCanvas = [];
    }
  });

  // 保存作品
  saveBtn.addEventListener('click', function() {
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'my-doodle.png';
    link.href = dataURL;
    link.click();
  });

  // 分享到留言板
  shareBtn.addEventListener('click', function() {
    const dataURL = canvas.toDataURL('image/png');
    // 将图片数据转换为Base64字符串
    const base64Image = dataURL.split(',')[1];

    // 调用API分享到留言板
    fetch('/api/message/create.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: '晓琪',
        content: '我在涂鸦板上创作了一幅作品！',
        image: base64Image
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('服务器响应错误: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      alert('分享成功！您的作品已发布到留言板。');
    })
    .catch(error => {
      console.error('分享失败:', error);
      alert('分享失败: ' + error.message);
    });
  });

  // 初始化画布背景
  ctx.fillStyle = '#fffaf0';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});