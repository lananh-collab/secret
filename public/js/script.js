/**
 * ============================================================
 *  SCRIPT.JS — Nhạc trưởng điều phối toàn bộ trải nghiệm
 * ============================================================
 * Trình tự:
 *   1. Tải cấu hình (tên, lời chúc, nhạc, số nến...)
 *   2. Khởi động nền Three.js (chạy xuyên suốt)
 *   3. Hiện màn hình chào mừng -> bấm "Bắt đầu"
 *   4. Đếm ngược 3-2-1
 *   5. Hiện bánh sinh nhật 3D -> chạm từng nến để thổi tắt
 *   6. Khi tắt hết nến: đánh máy lời chúc + pháo hoa + trái tim +
 *      bong bóng + hoa rơi
 *   7. Màn hình kết: bó hoa xuất hiện cùng lời chúc đầy đủ
 * ============================================================
 */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    window.App.ConfigLoader.load().then(function (config) {
      bootExperience(config);
    });
  });

  function bootExperience(config) {
    // 1) Nền không gian sao - chạy liên tục từ đầu tới cuối
    window.App.Starfield.init(document.getElementById("starfield-canvas"));

    // 2) Chuẩn bị pháo hoa và nhạc nền (chưa phát)
    window.App.Fireworks.init(document.getElementById("fireworks-canvas"));
    window.App.Audio.setup(config.musicFile);

    // 3) Màn hình chào mừng
    window.App.Welcome.show(config.name, function () {
      window.App.Audio.play();

      // 4) Đếm ngược
      window.App.Countdown.run(function () {
        startCakeScene(config);
      });
    });

    // Nút xem lại ở màn hình kết -> tải lại trang để chạy lại từ đầu
    document.getElementById("replay-button").addEventListener("click", function () {
      window.location.reload();
    });
  }

  function startCakeScene(config) {
    var mainScene = document.getElementById("main-scene");
    mainScene.classList.remove("hidden");

    window.App.Cake.init(
      document.getElementById("cake-container"),
      config.candleCount,
      function onAllCandlesBlown() {
        celebrate(config, mainScene);
      }
    );
  }

  function celebrate(config, mainScene) {
    var hint = document.getElementById("hint-text");
    var typewriterEl = document.getElementById("typewriter-text");

    hint.style.opacity = "0";

    window.App.Typewriter.type(typewriterEl, config.message, 32);

    // Bắt đầu toàn bộ hiệu ứng ăn mừng cùng lúc
    window.App.Fireworks.launchShow(9000);
    window.App.Hearts.start(9500);
    window.App.Balloons.start(11000);
    window.App.Flowers.start(10000);

    // Sau khi hiệu ứng lắng xuống, chuyển sang màn hình kết với bó hoa
    setTimeout(function () {
      mainScene.classList.add("hidden");
      window.App.Bouquet.show(config.name, config.message);
    }, 11500);
  }
})();
