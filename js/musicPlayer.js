document.addEventListener('DOMContentLoaded', () => {
  const audioPlayer = document.getElementById('audioPlayer');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const stopBtn = document.getElementById('stopBtn');
  const progress = document.getElementById('progress');
  const progressBar = document.getElementById('progressBar');
  const trackSelect = document.getElementById('trackSelect');
  const currentTrack = document.getElementById('current-track');
  const volumeSlider = document.getElementById('volumeSlider');

  // 音樂列表
  const tracks = [
    { src: 'assets/music/Silent Horror.mp3', name: 'Silent Horror' },
    { src: 'assets/music/East War.mp3', name: 'East War' },
    { src: 'assets/music/Abodami.mp3', name: 'Abodami' },
    { src: 'assets/music/Electronic water.mp3', name: 'Electronic water' },
    { src: 'assets/music/Mr. 10.mp3', name: 'Mr. 10' },
    { src: 'assets/music/Space Act.mp3', name: 'Space Act' },
    { src: 'assets/music/Winter_s Moon.mp3', name: "Winter's Moon" },
  ];

  // 動態生成選項
  tracks.forEach(track => {
    const option = document.createElement('option');
    option.value = track.src;
    option.setAttribute('data-name', track.name);
    option.textContent = track.name;
    trackSelect.appendChild(option);
  });

  // 初始化播放器
  function updateTrack() {
    const selectedOption = trackSelect.options[trackSelect.selectedIndex];
    audioPlayer.src = selectedOption.value;
    currentTrack.textContent = selectedOption.getAttribute('data-name');
    audioPlayer.load();
    playPauseBtn.textContent = 'Play';
    progressBar.style.width = '0%';
    audioPlayer.volume = volumeSlider.value; // 初始化音量
  }

  // 播放/暫停
  playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
      audioPlayer.play().catch(error => {
        console.error('播放失敗:', error);
      });
      playPauseBtn.textContent = 'Pause';
    } else {
      audioPlayer.pause();
      playPauseBtn.textContent = 'Play';
    }
  });

  // 停止
  stopBtn.addEventListener('click', () => {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    playPauseBtn.textContent = 'Play';
    progressBar.style.width = '0%';
  });

  // 更新進度條
  audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
      const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }
  });

  // 點擊進度條跳轉
  progress.addEventListener('click', (e) => {
    const rect = progress.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percent = clickX / width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
  });

  // 選擇音樂
  trackSelect.addEventListener('change', updateTrack);

  // 音量控制
  volumeSlider.addEventListener('input', () => {
    const volume = parseFloat(volumeSlider.value);
    audioPlayer.volume = volume;
    console.log('音量已調整至:', volume); // 調試用
  });

  // 確保音量滑塊變化時也能觸發更新
  volumeSlider.addEventListener('change', () => {
    const volume = parseFloat(volumeSlider.value);
    audioPlayer.volume = volume;
  });

  // 初始化第一首音樂
  updateTrack();
});