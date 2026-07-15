/**
 * ============================================================
 *  AUDIO.JS — Nhạc nền
 * ============================================================
 * Trình duyệt chặn tự động phát nhạc khi chưa có tương tác của
 * người dùng, vì vậy nhạc được phát ngay sau khi người dùng
 * bấm nút "Bắt đầu" (đã là một cú click) và tăng dần âm lượng.
 *
 * Cách dùng:
 *   App.Audio.setup(musicFileUrl);
 *   App.Audio.play();
 * ============================================================
 */
window.App = window.App || {};

window.App.Audio = (function () {
  var audioEl, toggleBtn;
  var targetVolume = 0.55;
  var isMuted = false;

  function setup(musicFileUrl) {
    audioEl = document.getElementById("bg-music");
    toggleBtn = document.getElementById("music-toggle");
    audioEl.src = musicFileUrl;
    audioEl.volume = 0;

    toggleBtn.addEventListener("click", toggleMute);
  }

  function play() {
    if (!audioEl) return;
    audioEl
      .play()
      .then(function () {
        fadeIn();
        toggleBtn.classList.remove("hidden");
      })
      .catch(function () {
        // Trình duyệt vẫn chặn -> hiện nút để người dùng tự bật nhạc
        toggleBtn.classList.remove("hidden");
        toggleBtn.textContent = "🔈";
      });
  }

  function fadeIn() {
    var step = 0.04;
    var interval = setInterval(function () {
      if (audioEl.volume < targetVolume - step) {
        audioEl.volume += step;
      } else {
        audioEl.volume = targetVolume;
        clearInterval(interval);
      }
    }, 120);
  }

  function toggleMute() {
    if (!audioEl) return;
    isMuted = !isMuted;

    if (isMuted) {
      audioEl.volume = 0;
      toggleBtn.textContent = "🔇";
    } else {
      if (audioEl.paused) {
        audioEl.play().catch(function () {});
      }
      audioEl.volume = targetVolume;
      toggleBtn.textContent = "🔊";
    }
  }

  return { setup: setup, play: play };
})();
