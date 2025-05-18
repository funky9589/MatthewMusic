// 初始化 AOS 動畫
AOS.init({ duration: 1000, once: true });

// 播放控制
document.addEventListener('DOMContentLoaded', () => {
  const playButton = document.getElementById('playButton');
  const bgAudio = document.getElementById('bgAudio');
  const waveContainer = document.querySelector('.wave-container');

  let isPlaying = false;

  playButton.addEventListener('click', () => {
    if (!isPlaying) {
      bgAudio.play();
      waveContainer.classList.remove('hidden');
      isPlaying = true;
      playButton.textContent = '⏸';
    } else {
      bgAudio.pause();
      waveContainer.classList.add('hidden');
      isPlaying = false;
      playButton.textContent = '▶';
    }
  });

  bgAudio.addEventListener('ended', () => {
    waveContainer.classList.add('hidden');
    playButton.textContent = '▶';
    isPlaying = false;
  });
});