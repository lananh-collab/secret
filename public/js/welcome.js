/**
 * ============================================================
 *  WELCOME.JS — Màn hình chào mừng
 * ============================================================
 * Cách dùng:
 *   App.Welcome.show(name, function () { ... }); // callback khi bấm "Bắt đầu"
 * ============================================================
 */
window.App = window.App || {};

window.App.Welcome = (function () {
  function show(name, onStart) {
    var screen = document.getElementById("welcome-screen");
    var nameEl = document.getElementById("welcome-name");
    var button = document.getElementById("start-button");

    nameEl.textContent = name || "bạn";

    function handleClick() {
      button.removeEventListener("click", handleClick);
      screen.classList.add("hidden");
      if (typeof onStart === "function") onStart();
    }

    button.addEventListener("click", handleClick);
  }

  return { show: show };
})();
