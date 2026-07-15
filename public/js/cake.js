/**
 * ============================================================
 *  CAKE.JS — Bánh sinh nhật 3D (Three.js)
 * ============================================================
 * Vẽ một chiếc bánh kem 3 tầng cùng các ngọn nến có lửa (đèn
 * phát sáng + sprite lửa). Người dùng chạm/click vào từng ngọn
 * nến để "thổi tắt" — lửa tắt dần và một chùm khói nhẹ bay lên.
 * Khi tất cả nến đã tắt, gọi callback onAllCandlesBlown().
 *
 * Cách dùng:
 *   App.Cake.init(containerEl, candleCount, function () {
 *     // tất cả nến đã được thổi tắt
 *   });
 * ============================================================
 */
window.App = window.App || {};

window.App.Cake = (function () {
  var scene, camera, renderer, container;
  var candles = []; // { flameMesh, light, blown, smokeParticles }
  var raycaster, pointer;
  var onAllBlown;
  var remaining = 0;
  var clock;
  var rafId = null;
  var cakeAssembly = null; // dữ liệu tween "các hạt bay vào gộp thành hình bánh"

  function init(containerEl, candleCount, onAllBlownCallback) {
    container = containerEl;
    onAllBlown = onAllBlownCallback;
    candles = [];
    clock = new THREE.Clock();

    var width = container.clientWidth;
    var height = container.clientHeight;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 11);
    camera.lookAt(0, 1.6, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // Ánh sáng môi trường dịu + ánh sáng ấm từ trên xuống
    scene.add(new THREE.AmbientLight(0x8a7bff, 0.55));
    var keyLight = new THREE.PointLight(0xffe1a8, 1.1, 30);
    keyLight.position.set(2, 8, 6);
    scene.add(keyLight);

    buildCake(candleCount || 6);
    scheduleAutoBlow();   // <-- thêm dòng này

    window.addEventListener("resize", onResize);

    animate();
  }

  function buildCake(candleCount) {
    var cakeGroup = new THREE.Group();
    // Màu từng tầng (hồng phấn -> vàng kem -> kem nhạt) + màu viền kem trắng
    var layerColors = [
      new THREE.Color(0x66FFFF),
      new THREE.Color(0xffd9a0),
      new THREE.Color(0xfff2cf)
    ];
    var frostingColor = new THREE.Color(0xffffff);

    var layerRadii = [3.1, 2.35, 1.6];
    var layerHeights = [1.0, 0.9, 0.8];

    var particlesPerSide = 950; // hạt phủ quanh mặt bên mỗi tầng
    var particlesPerRim = 220;  // hạt viền kem chảy ở mép mỗi tầng
    var particlesTopDisc = 550; // hạt phủ kín mặt trên cùng

    var targetPositions = [];
    var colors = [];
    var y = 0;

    for (var i = 0; i < 3; i++) {
      var radius = layerRadii[i];
      var h = layerHeights[i];
      var baseY = y;
      var color = layerColors[i];

      // Hạt bao quanh mặt bên hình trụ -> tạo khối bánh chỉ từ các chấm sáng
      for (var s = 0; s < particlesPerSide; s++) {
        var angle = Math.random() * Math.PI * 2;
        var hh = Math.random() * h;
        var r = radius + (Math.random() - 0.5) * 0.1;
        targetPositions.push(Math.cos(angle) * r, baseY + hh, Math.sin(angle) * r);
        colors.push(color.r, color.g, color.b);
      }

      // Vòng hạt trắng sáng ở mép trên mỗi tầng, mô phỏng viền kem chảy
      for (var ri = 0; ri < particlesPerRim; ri++) {
        var rimAngle = Math.random() * Math.PI * 2;
        var rimR = radius * (0.97 + Math.random() * 0.08);
        targetPositions.push(
          Math.cos(rimAngle) * rimR,
          baseY + h + (Math.random() - 0.5) * 0.06,
          Math.sin(rimAngle) * rimR
        );
        colors.push(frostingColor.r, frostingColor.g, frostingColor.b);
      }

      y += h;
    }

    // Mặt trên cùng: đĩa hạt kín để trông giống mặt bánh hoàn chỉnh
    var topRadius = layerRadii[2];
    for (var t = 0; t < particlesTopDisc; t++) {
      var ang = Math.random() * Math.PI * 2;
      var rr = Math.sqrt(Math.random()) * topRadius * 0.92;
      targetPositions.push(Math.cos(ang) * rr, y + Math.random() * 0.03, Math.sin(ang) * rr);
      colors.push(layerColors[2].r, layerColors[2].g, layerColors[2].b);
    }

    var totalCount = targetPositions.length / 3;

    // Vị trí khởi đầu: các hạt tản mát ngẫu nhiên quanh khu vực bánh,
    // giống như những ngôi sao nền sẽ "bay vào" và gộp lại thành hình bánh
    var startPositions = [];
    for (var p = 0; p < totalCount; p++) {
      var theta = Math.random() * Math.PI * 2;
      var phi = Math.acos(Math.random() * 2 - 1);
      var dist = 6 + Math.random() * 11;
      startPositions.push(
        Math.sin(phi) * Math.cos(theta) * dist,
        Math.random() * 9 - 1,
        Math.sin(phi) * Math.sin(theta) * dist - 2
      );
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(startPositions), 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(new Float32Array(colors), 3));

    var material = new THREE.PointsMaterial({
      size: 0.11,
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    var cakeParticles = new THREE.Points(geometry, material);
    cakeGroup.add(cakeParticles);
    cakeGroup.position.y = -1.3;
    scene.add(cakeGroup);

    // Lưu dữ liệu để tween "các hạt gộp lại thành hình" trong animate()
    cakeAssembly = {
      points: cakeParticles,
      material: material,
      start: startPositions,
      target: targetPositions,
      count: totalCount,
      startTime: clock.getElapsedTime(),
      duration: 1.8,
      done: false
    };

    // Đặt các cây nến trên vòng tròn ở mặt trên cùng
    var topY = y - 1.3 + 0.05;
    var ringRadius = 1.05;

    for (var c = 0; c < candleCount; c++) {
      var angle = (c / candleCount) * Math.PI * 2;
      var cx = Math.cos(angle) * ringRadius;
      var cz = Math.sin(angle) * ringRadius;

      var candleGroup = new THREE.Group();

      var stick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.6, 12),
        new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.4 })
      );
      stick.position.y = topY + 0.3;
      candleGroup.add(stick);

      var flame = new THREE.Mesh(
        new THREE.ConeGeometry(0.09, 0.26, 10),
        new THREE.MeshBasicMaterial({ color: 0xffd37a })
      );
      flame.position.y = topY + 0.72;
      candleGroup.add(flame);

      var flameLight = new THREE.PointLight(0xffb257, 0.55, 2.5);
      flameLight.position.copy(flame.position);
      candleGroup.add(flameLight);

      candleGroup.position.set(cx, 0, cz);
      scene.add(candleGroup);

      candles.push({
        group: candleGroup,
        flame: flame,
        light: flameLight,
        blown: false,
        smokeParticles: null,
        smokeAge: 0
      });
    }

    remaining = candles.length;
    window.App.__cakeGroup = cakeGroup; // dùng để rung nhẹ khi cần
  }
  // Tự động thổi tắt từng ngọn nến lần lượt, không cần người dùng bấm
  function scheduleAutoBlow() {
  setTimeout(function () {
    candles.forEach(function (candle, index) {
      setTimeout(function () {
        if (!candle.blown) blowCandle(candle);
      }, index * 350); // mỗi nến tắt cách nhau 0.35s cho đẹp mắt
    });
  }, 2200); // đợi 2.2s sau khi bánh hiện ra rồi mới bắt đầu thổi
}
  function blowCandle(candle) {
    candle.blown = true;
    remaining--;

    spawnSmoke(candle);

    // Hiệu ứng tắt lửa: thu nhỏ dần rồi ẩn
    var duration = 260;
    var start = performance.now();
    var startScale = candle.flame.scale.x;

    function shrink(now) {
      var t = Math.min(1, (now - start) / duration);
      var s = startScale * (1 - t);
      candle.flame.scale.set(s, s, s);
      candle.light.intensity = 0.55 * (1 - t);
      if (t < 1) {
        requestAnimationFrame(shrink);
      } else {
        candle.flame.visible = false;
        candle.light.visible = false;
      }
    }
    requestAnimationFrame(shrink);

    container.classList.add("candle-blown-pulse");
    setTimeout(function () { container.classList.remove("candle-blown-pulse"); }, 500);

    if (remaining <= 0 && typeof onAllBlown === "function") {
      setTimeout(onAllBlown, 700);
    }
  }

  // Khói: cụm điểm nhỏ bay lên và mờ dần từ vị trí ngọn nến
  function spawnSmoke(candle) {
    var count = 26;
    var positions = new Float32Array(count * 3);
    var basePos = candle.flame.getWorldPosition(new THREE.Vector3());

    for (var i = 0; i < count; i++) {
      positions[i * 3] = basePos.x + (Math.random() - 0.5) * 0.05;
      positions[i * 3 + 1] = basePos.y;
      positions[i * 3 + 2] = basePos.z + (Math.random() - 0.5) * 0.05;
    }

    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    var material = new THREE.PointsMaterial({
      color: 0xcfc9e0,
      size: 0.16,
      transparent: true,
      opacity: 0.55,
      depthWrite: false
    });

    var points = new THREE.Points(geometry, material);
    scene.add(points);

    candle.smokeParticles = points;
    candle.smokeAge = 0;
    candle.smokeVelocities = [];
    for (var v = 0; v < count; v++) {
      candle.smokeVelocities.push({
        x: (Math.random() - 0.5) * 0.004,
        y: 0.012 + Math.random() * 0.01,
        z: (Math.random() - 0.5) * 0.004
      });
    }
  }

  function updateSmoke(delta) {
    candles.forEach(function (candle) {
      if (!candle.smokeParticles) return;
      candle.smokeAge += delta;

      var posAttr = candle.smokeParticles.geometry.attributes.position;
      for (var i = 0; i < posAttr.count; i++) {
        var vel = candle.smokeVelocities[i];
        posAttr.array[i * 3] += vel.x;
        posAttr.array[i * 3 + 1] += vel.y;
        posAttr.array[i * 3 + 2] += vel.z;
      }
      posAttr.needsUpdate = true;

      candle.smokeParticles.material.opacity = Math.max(0, 0.55 - candle.smokeAge * 0.25);

      if (candle.smokeAge > 2.2) {
        scene.remove(candle.smokeParticles);
        candle.smokeParticles.geometry.dispose();
        candle.smokeParticles.material.dispose();
        candle.smokeParticles = null;
      }
    });
  }

  // Cho các hạt bay từ vị trí tản mát vào đúng vị trí tạo hình bánh,
  // sau khi gộp xong thì để hạt lấp lánh nhẹ bằng cách đổi kích thước điểm
  function updateCakeAssembly(elapsed) {
    if (!cakeAssembly) return;

    if (!cakeAssembly.done) {
      var t = Math.min(1, (elapsed - cakeAssembly.startTime) / cakeAssembly.duration);
      var eased = 1 - Math.pow(1 - t, 3); // ease-out cubic: chậm dần khi gộp lại
      var posAttr = cakeAssembly.points.geometry.attributes.position;
      var start = cakeAssembly.start;
      var target = cakeAssembly.target;

      for (var i = 0; i < cakeAssembly.count; i++) {
        var ix = i * 3;
        posAttr.array[ix] = start[ix] + (target[ix] - start[ix]) * eased;
        posAttr.array[ix + 1] = start[ix + 1] + (target[ix + 1] - start[ix + 1]) * eased;
        posAttr.array[ix + 2] = start[ix + 2] + (target[ix + 2] - start[ix + 2]) * eased;
      }
      posAttr.needsUpdate = true;

      if (t >= 1) cakeAssembly.done = true;
    } else {
      // Lấp lánh nhẹ nhàng sau khi đã gộp thành hình hoàn chỉnh
      cakeAssembly.material.size = 0.11 + Math.sin(elapsed * 2) * 0.015;
    }
  }

  function onResize() {
    if (!container) return;
    var width = container.clientWidth;
    var height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function animate() {
    rafId = requestAnimationFrame(animate);
    var delta = clock.getDelta();
    var elapsed = clock.getElapsedTime();

    updateCakeAssembly(elapsed);

    // Lửa lung linh nhẹ
    candles.forEach(function (candle) {
      if (!candle.blown) {
        var flicker = 1 + Math.sin(elapsed * 12 + candle.group.id) * 0.08;
        candle.flame.scale.set(flicker, flicker, flicker);
        candle.light.intensity = 0.5 + Math.sin(elapsed * 10 + candle.group.id) * 0.08;
      }
    });

    updateSmoke(delta);

    if (window.App.__cakeGroup) {
      window.App.__cakeGroup.rotation.y = Math.sin(elapsed * 0.25) * 0.08;
    }

    renderer.render(scene, camera);
  }

  function destroy() {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener("resize", onResize);
  }

  return { init: init, destroy: destroy };
})();
