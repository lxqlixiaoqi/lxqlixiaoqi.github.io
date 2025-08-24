// UA检测并应用对应布局
function detectDeviceAndApplyLayout() {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const html = document.documentElement;
  
  if (isMobile) {
    html.classList.add('mobile-layout');
    html.classList.remove('desktop-layout');
  } else {
    html.classList.add('desktop-layout');
    html.classList.remove('mobile-layout');
  }
}

detectDeviceAndApplyLayout();

// 窗口大小改变时重新检测
window.addEventListener('resize', detectDeviceAndApplyLayout);