document.addEventListener('click', (e) => {
  const rippleContainer = document.getElementById('rippleContainer');
  const ripple = document.createElement('div');
  ripple.classList.add('ripple');
  
  // 設置水波位置
  const size = 50; // 水波初始大小
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${e.clientX - size / 2}px`;
  ripple.style.top = `${e.clientY - size / 2}px`;
  
  // 添加到容器
  rippleContainer.appendChild(ripple);
  
  // 動畫結束後移除水波元素
  ripple.addEventListener('animationend', () => {
    ripple.remove();
  });
});