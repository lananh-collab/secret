/**
 * ============================================================
 *  CONFIG-LOADER.JS
 * ============================================================
 * Lấy dữ liệu cấu hình (tên, lời chúc, nhạc, số nến, màu chủ đạo)
 * từ API "/api/config" do server.js cung cấp.
 *
 * Cách dùng ở các module khác:
 *    App.ConfigLoader.load().then(function (config) { ... });
 * ============================================================
 */
window.App = window.App || {};

window.App.ConfigLoader = (function () {
  var cachedConfig = null;

  // Cấu hình mặc định — dùng khi không gọi được API (vd. mở file trực tiếp)
  var fallbackConfig = {
    name: "Bạn",
    message: "Chúc mừng sinh nhật! Chúc bạn một năm mới thật nhiều niềm vui và hạnh phúc.",
    musicFile: "/assets/music/background.mp3",
    candleCount: 5,
    accentColor: "#ffd37a"
  };

  function load() {
    if (cachedConfig) {
      return Promise.resolve(cachedConfig);
    }

    return fetch("/api/config")
      .then(function (res) {
        if (!res.ok) throw new Error("Không thể tải cấu hình");
        return res.json();
      })
      .then(function (data) {
        cachedConfig = Object.assign({}, fallbackConfig, data);
        return cachedConfig;
      })
      .catch(function (err) {
        console.warn("[ConfigLoader] Dùng cấu hình mặc định:", err.message);
        cachedConfig = fallbackConfig;
        return cachedConfig;
      });
  }

  return { load: load };
})();
