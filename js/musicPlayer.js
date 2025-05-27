document.addEventListener('DOMContentLoaded', () => {
  const audioPlayer = document.getElementById('audioPlayer');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const stopBtn = document.getElementById('stopBtn');
  const progress = document.getElementById('progress');
  const progressBar = document.getElementById('progressBar');
  const trackSelect = document.getElementById('trackSelect');
  const currentTrack = document.getElementById('current-track');
  const portfolioSection = document.querySelector('.portfolio-section'); // 獲取 portfolio-section

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
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    progressBar.style.width = '0%';
    portfolioSection.classList.remove('playing'); // 初始暫停
  }

  // 播放/暫停
  playPauseBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
      audioPlayer.play().catch(error => {
        console.error('播放失敗:', error);
      });
      playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      portfolioSection.classList.add('playing'); // 播放時旋轉
    } else {
      audioPlayer.pause();
      playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      portfolioSection.classList.remove('playing'); // 暫停時停止
    }
  });

  // 停止
  stopBtn.addEventListener('click', () => {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    progressBar.style.width = '0%';
    portfolioSection.classList.remove('playing'); // 停止時暫停
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

  // 初始化第一首音樂
  updateTrack();
});