document.addEventListener("DOMContentLoaded", function () {
  const target = document.querySelector(".typewriter-text");
  const text = target.textContent;
  target.textContent = ""; // 先清空
  let index = 0;

  function type() {
    if (index < text.length) {
      target.textContent += text.charAt(index);
      index++;
      setTimeout(type, 60); // 控制打字速度 (ms)
    }
  }

  type();
});