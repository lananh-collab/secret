/**
 * ============================================================
 *  STARFIELD.JS — Nền không gian (Three.js)
 * ============================================================
 * Tạo hàng nghìn hạt sao (không dùng ảnh, chỉ dùng hình học +
 * chấm điểm) trôi nhẹ nhàng, cùng một "dải ngân hà" xoay chậm
 * phía sau. Canvas này chạy liên tục xuyên suốt toàn bộ trải
 * nghiệm, không bị ẩn khi chuyển màn hình.
 * ============================================================
 */
window.App = window.App || {};

window.App.Starfield = (function () {
  var scene, camera, renderer;
  var starPoints, galaxyPoints;
  var clock;
  var mouseX = 0, mouseY = 0;
  var canvas;
  var rafId = null;

  function init(canvasEl) {
    canvas = canvasEl;
    clock = new THREE.Clock();

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090a24, 0.0009);

    camera = new THREE.PerspectiveCamera(
      65,
      window.innerWidth / window.innerHeight,
      1,
      3000
    );
    camera.position.z = 480;

    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    createStars();
    createGalaxy();

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);

    animate();
  }

  // Hàng nghìn hạt sao rải rác khắp không gian, kích thước và độ sáng ngẫu nhiên
  function createStars() {
    var count = 6000;
    var positions = new Float32Array(count * 3);
    var colors = new Float32Array(count * 3);
    var sizes = new Float32Array(count);

    var palette = [
      [0.96, 0.94, 1.0],   // trắng hơi tím
      [1.0, 0.83, 0.48],   // vàng nến
      [0.49, 0.91, 1.0],   // cyan
      [1.0, 0.44, 0.64]    // hồng nhạt
    ];

    for (var i = 0; i < count; i++) {
      var radius = 300 + Math.random() * 1400;
      var theta = Math.random() * Math.PI * 2;
      var phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      var c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c[0];
      colors[i * 3 + 1] = c[1];
      colors[i * 3 + 2] = c[2];

      sizes[i] = Math.random() * 2.2 + 0.4;
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    var material = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    starPoints = new THREE.Points(geometry, material);
    scene.add(starPoints);
  }

  // Dải ngân hà: các hạt xoắn ốc xoay chậm quanh tâm, tạo cảm giác thiên hà
  function createGalaxy() {
    var count = 4500;
    var positions = new Float32Array(count * 3);
    var colors = new Float32Array(count * 3);

    var colorInner = new THREE.Color(0xffd37a);
    var colorOuter = new THREE.Color(0x7d5cff);

    var branches = 4;
    var spin = 1.4;
    var radiusMax = 620;

    for (var i = 0; i < count; i++) {
      var radius = Math.random() * radiusMax;
      var branchAngle = ((i % branches) / branches) * Math.PI * 2;
      var spinAngle = radius * 0.01 * spin;

      var randX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 40;
      var randY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 18;
      var randZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 40;

      var x = Math.cos(branchAngle + spinAngle) * radius + randX;
      var y = randY;
      var z = Math.sin(branchAngle + spinAngle) * radius + randZ;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y - 80;
      positions[i * 3 + 2] = z - 400;

      var mixed = colorInner.clone().lerp(colorOuter, radius / radiusMax);
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    var material = new THREE.PointsMaterial({
      size: 3.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    galaxyPoints = new THREE.Points(geometry, material);
    scene.add(galaxyPoints);
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onMouseMove(e) {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }

  function animate() {
    rafId = requestAnimationFrame(animate);
    var elapsed = clock.getElapsedTime();

    starPoints.rotation.y = elapsed * 0.006;
    starPoints.rotation.x = elapsed * 0.002;

    galaxyPoints.rotation.y = elapsed * 0.03;

    // Camera trôi nhẹ theo chuột, tạo chiều sâu (parallax)
    camera.position.x += (mouseX * 60 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 40 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  return { init: init };
})();
