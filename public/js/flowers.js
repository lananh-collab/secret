/**
 * ============================================================
 *  FLOWERS.JS — Hoa rơi (DOM + CSS animation)
 * ============================================================
 * Cách dùng:
 *   App.Flowers.start(durationMs);
 *   App.Flowers.stop();
 * ============================================================
 */
window.App = window.App || {};

window.App.Flowers = (function () {
  var layer, spawnInterval, stopTimeout;
  var COLORS = ["#ff6fa3", "#ffd37a", "#f5f0ff", "#b48cff"];

  function start(durationMs) {
    layer = document.getElementById("flowers-layer");
    if (!layer) return;

    spawnInterval = setInterval(spawnFlower, 220);
    stopTimeout = setTimeout(stop, durationMs || 10000);
  }

  function spawnFlower() {
    var flower = document.createElement("div");
    flower.className = "flower";

    var left = Math.random() * 100;
    var size = 14 + Math.random() * 16;
    var duration = 5 + Math.random() * 4;
    var fallDrift = (Math.random() - 0.5) * 220;
    var spin = 240 + Math.random() * 400;
    var color = COLORS[Math.floor(Math.random() * COLORS.length)];

    flower.style.left = left + "vw";
    flower.style.setProperty("--flower-size", size + "px");
    flower.style.setProperty("--flower-color", color);
    flower.style.setProperty("--fall-drift", fallDrift + "px");
    flower.style.setProperty("--spin", spin + "deg");
    flower.style.animationDuration = duration + "s";

    layer.appendChild(flower);
    setTimeout(function () { flower.remove(); }, duration * 1000 + 200);
  }

  function stop() {
    clearInterval(spawnInterval);
    clearTimeout(stopTimeout);
  }

  return { start: start, stop: stop };
})();
