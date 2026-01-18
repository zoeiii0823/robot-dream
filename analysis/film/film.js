const playBtn = document.getElementById('playBtn');
const playbarBtn = document.getElementById('playbarBtn');
const playIcon = document.getElementById('playIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const songLabel = document.getElementById('songLabel');
const vinyl = document.getElementById('vinyl');
const bgm = document.getElementById('bgm');

let playing = false;
let trackIndex = 0;

const tracks = [
  { name: 'BGM 1', src: '../../assets/audio/bgm.mp3' },
  { name: 'BGM 2', src: '../../assets/audio/bgm2.mp3' },
  { name: 'BGM 3', src: '../../assets/audio/bgm3.mp3' },
  { name: 'BGM 4', src: '../../assets/audio/bgm4.mp3' }
];

function clampTrackIndex(i) {
  const len = tracks.length || 1;
  return ((i % len) + len) % len;
}

function updateSongLabel() {
  if (!songLabel) return;
  const t = tracks[trackIndex];
  songLabel.textContent = t && t.name ? t.name : '';
}

function tryAutoplayFromUserGesture() {
  if (!bgm) return;
  document.addEventListener('pointerdown', startPlay, { once: true, capture: true });
  document.addEventListener('keydown', startPlay, { once: true, capture: true });
}

function setPlaying(next) {
  playing = next;
  if (playing) {
    if (vinyl) vinyl.style.animation = 'spin 6s linear infinite';
    if (playIcon) playIcon.className = 'fa-solid fa-pause';
  } else {
    if (vinyl) vinyl.style.animation = 'none';
    if (playIcon) playIcon.className = 'fa-solid fa-play';
  }
}

function startPlay() {
  if (!bgm) return;
  bgm.muted = false;
  if (bgm.readyState === 0 && bgm.load) bgm.load();
  const p = bgm.play();
  if (p && p.then) {
    p.then(() => setPlaying(true)).catch(() => setPlaying(false));
  } else {
    setPlaying(true);
  }
}

function stopPlay() {
  if (bgm) bgm.pause();
  setPlaying(false);
}

function togglePlay() {
  if (playing) stopPlay();
  else startPlay();
}

function setTrack(nextIndex, autoPlay) {
  trackIndex = clampTrackIndex(nextIndex);
  updateSongLabel();

  if (!bgm) return;

  const t = tracks[trackIndex];
  if (!t || !t.src) return;

  bgm.pause();
  try { bgm.currentTime = 0; } catch (e) {}
  bgm.src = t.src;
  if (bgm.load) bgm.load();

  if (autoPlay) startPlay();
}

if (playBtn) {
  playBtn.addEventListener('click', togglePlay);
}

if (playbarBtn) {
  playbarBtn.addEventListener('click', togglePlay);
}

if (prevBtn) {
  prevBtn.addEventListener('click', function () {
    setTrack(trackIndex - 1, playing);
  });
}

if (nextBtn) {
  nextBtn.addEventListener('click', function () {
    setTrack(trackIndex + 1, playing);
  });
}

setPlaying(false);

if (bgm) {
  setTrack(0, false);
  tryAutoplayFromUserGesture();
}

/* 动态插入旋转动画 */
const style = document.createElement('style');
style.innerHTML = `@keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }`;
document.head.appendChild(style);
