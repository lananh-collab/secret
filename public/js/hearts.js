/**
 * ============================================================
 *  HEARTS.JS — Trái tim bay (DOM + CSS animation)
 * ============================================================
 * Cách dùng:
 *   App.Hearts.start(durationMs);
 *   App.Hearts.stop();
 * ============================================================
 */
window.App = window.App || {};

window.App.Hearts = (function () {
  var layer, spawnInterval, stopTimeout;

  function start(durationMs) {
    layer = document.getElementById("hearts-layer");
    if (!layer) return;

    spawnInterval = setInterval(spawnHeart, 260);
    stopTimeout = setTimeout(stop, durationMs || 9000);
  }

  function spawnHeart() {
    var heart = document.createElement("div");
    heart.className = "heart";

    var left = 5 + Math.random() * 90;
    var size = 16 + Math.random() * 22;
    var duration = 4.5 + Math.random() * 3;
    var drift = (Math.random() - 0.5) * 220;
    var rot = (Math.random() - 0.5) * 50;

    heart.style.left = left + "vw";
    heart.style.setProperty("--heart-size", size + "px");
    heart.style.setProperty("--drift", drift + "px");
    heart.style.setProperty("--rot", rot + "deg");
    heart.style.animationDuration = duration + "s";

    layer.appendChild(heart);
    setTimeout(function () { heart.remove(); }, duration * 1000 + 200);
  }

  function stop() {
    clearInterval(spawnInterval);
    clearTimeout(stopTimeout);
  }

  return { start: start, stop: stop };
})();
