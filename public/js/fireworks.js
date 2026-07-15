/**
 * ============================================================
 *  FIREWORKS.JS — Pháo hoa (Canvas 2D)
 * ============================================================
 * Hệ thống pháo hoa với 3 kiểu nổ khác nhau: "peony" (nổ tròn
 * đều), "willow" (rơi chậm như liễu rủ), "ring" (vòng tròn).
 * Tối ưu hiệu năng bằng cách tái sử dụng mảng particle (object
 * pooling) thay vì tạo/hủy liên tục, và giới hạn số particle
 * tối đa trên màn hình.
 *
 * Cách dùng:
 *   App.Fireworks.init(canvasEl);
 *   App.Fireworks.launchShow(8000); // bắn liên tục trong 8s
 *   App.Fireworks.stop();
 * ============================================================
 */
window.App = window.App || {};

window.App.Fireworks = (function () {
  var canvas, ctx;
  var width, height;
  var particles = [];
  var MAX_PARTICLES = 900;
  var rafId = null;
  var showTimer = null;
  var launchInterval = null;
  var running = false;

  var COLORS = ["#ffd37a", "#ff6fa3", "#7de8ff", "#b48cff", "#ffffff", "#ff9d4d"];

  function init(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext("2d");
    resize();
    window.addEventListener("resize", resize);
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function randomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  function makeParticle(x, y, angle, speed, color, style, life) {
    return {
      x: x, y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: color,
      life: life,
      age: 0,
      style: style,
      size: style === "willow" ? 2.4 : 2
    };
  }

  // Bắn một quả pháo hoa từ đáy màn hình lên điểm nổ (x, targetY)
  function launchRocket() {
    if (particles.length > MAX_PARTICLES) return;

    var x = width * (0.15 + Math.random() * 0.7);
    var targetY = height * (0.18 + Math.random() * 0.32);
    var color = randomColor();
    var styleRoll = Math.random();
    var style = styleRoll < 0.4 ? "peony" : styleRoll < 0.7 ? "ring" : "willow";

    var rocket = {
      x: x, y: height,
      targetY: targetY,
      vy: -(9 + Math.random() * 3),
      isRocket: true,
      color: color,
      style: style,
      trail: []
    };
    particles.push(rocket);
  }

  function explode(rocket) {
    var count = rocket.style === "willow" ? 70 : rocket.style === "ring" ? 60 : 90;
    var baseSpeed = rocket.style === "willow" ? 2.6 : rocket.style === "ring" ? 3.4 : 4.2;
    var life = rocket.style === "willow" ? 130 : 85;

    for (var i = 0; i < count; i++) {
      var angle;
      if (rocket.style === "ring") {
        angle = (i / count) * Math.PI * 2;
      } else {
        angle = Math.random() * Math.PI * 2;
      }
      var speed = baseSpeed * (0.5 + Math.random() * 0.6);
      var color = Math.random() < 0.25 ? randomColor() : rocket.color;
      particles.push(makeParticle(rocket.x, rocket.y, angle, speed, color, rocket.style, life));
    }
  }

  function update() {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(9, 10, 36, 0.22)";
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];

      if (p.isRocket) {
        p.y += p.vy;
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 6) p.trail.shift();

        drawRocketTrail(p);

        if (p.y <= p.targetY) {
          explode(p);
          particles.splice(i, 1);
        }
        continue;
      }

      p.age++;
      p.x += p.vx;
      p.y += p.vy;

      if (p.style === "willow") {
        p.vy += 0.05; // rơi chậm, có trọng lực nhẹ, tạo dáng liễu rủ
        p.vx *= 0.99;
      } else {
        p.vy += 0.035;
        p.vx *= 0.985;
        p.vy *= 0.985;
      }

      var lifeRatio = 1 - p.age / p.life;
      if (lifeRatio <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.beginPath();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, lifeRatio);
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawRocketTrail(rocket) {
    ctx.beginPath();
    ctx.strokeStyle = rocket.color;
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = 2;
    for (var i = 0; i < rocket.trail.length; i++) {
      var pt = rocket.trail[i];
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else ctx.lineTo(pt.x, pt.y);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function loop() {
    rafId = requestAnimationFrame(loop);
    update();
  }

  function launchShow(durationMs) {
    if (running) return;
    running = true;
    canvas.classList.remove("hidden");
    loop();

    launchInterval = setInterval(function () {
      launchRocket();
      if (Math.random() < 0.3) launchRocket();
    }, 420);

    showTimer = setTimeout(function () {
      clearInterval(launchInterval);
      // Để các particle còn lại tự tắt rồi mới dừng vòng lặp vẽ
      setTimeout(stopLoopOnly, 2500);
    }, durationMs || 8000);
  }

  function stopLoopOnly() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    running = false;
  }

  function stop() {
    clearInterval(launchInterval);
    clearTimeout(showTimer);
    stopLoopOnly();
    particles = [];
    ctx && ctx.clearRect(0, 0, width, height);
  }

  return { init: init, launchShow: launchShow, stop: stop };
})();
