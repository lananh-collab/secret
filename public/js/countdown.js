/**
 * ============================================================
 *  COUNTDOWN.JS — Đếm ngược 3 → 2 → 1
 * ============================================================
 * Cách dùng:
 *   App.Countdown.run(function () { ... }); // callback khi xong
 * ============================================================
 */
window.App = window.App || {};

window.App.Countdown = (function () {
  function run(onDone) {
    var screen = document.getElementById("countdown-screen");
    var numberEl = document.getElementById("countdown-number");
    var count = 3;

    screen.classList.remove("hidden");
    numberEl.textContent = count;

    var interval = setInterval(function () {
      count--;

      // Áp lại animation "pop" bằng cách reset class
      numberEl.style.animation = "none";
      // Bắt trình duyệt reflow để animation chạy lại từ đầu
      void numberEl.offsetWidth;
      numberEl.style.animation = "";

      if (count > 0) {
        numberEl.textContent = count;
      } else {
        clearInterval(interval);
        screen.classList.add("hidden");
        if (typeof onDone === "function") onDone();
      }
    }, 900);
  }

  return { run: run };
})();
