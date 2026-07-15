/**
 * ============================================================
 *  BALLOONS.JS — Bong bóng bay lên (DOM + CSS animation)
 * ============================================================
 * Cách dùng:
 *   App.Balloons.start(durationMs);
 *   App.Balloons.stop();
 * ============================================================
 */
window.App = window.App || {};

window.App.Balloons = (function () {
  var layer, spawnInterval, stopTimeout;
  var COLORS = ["#ff6fa3", "#ffd37a", "#7de8ff", "#b48cff", "#ff9d4d"];

  function start(durationMs) {
    layer = document.getElementById("balloons-layer");
    if (!layer) return;

    spawnInterval = setInterval(spawnBalloon, 500);
    stopTimeout = setTimeout(stop, durationMs || 11000);
  }

  function spawnBalloon() {
    var balloon = document.createElement("div");
    balloon.className = "balloon";

    var left = 4 + Math.random() * 88;
    var width = 34 + Math.random() * 26;
    var duration = 10 + Math.random() * 6; // bay chậm và kéo dài 10-16 giây
    var sway = (Math.random() - 0.5) * 160;
    var tilt = (Math.random() - 0.5) * 24;
    var color = COLORS[Math.floor(Math.random() * COLORS.length)];

    balloon.style.left = left + "vw";
    balloon.style.setProperty("--balloon-w", width + "px");
    balloon.style.setProperty("--balloon-color", color);
    balloon.style.setProperty("--sway", sway + "px");
    balloon.style.setProperty("--tilt", tilt + "deg");
    balloon.style.animationDuration = duration + "s";

    layer.appendChild(balloon);
    setTimeout(function () { balloon.remove(); }, duration * 1000 + 200);
  }

  function stop() {
    clearInterval(spawnInterval);
    clearTimeout(stopTimeout);
  }

  return { start: start, stop: stop };
})();
