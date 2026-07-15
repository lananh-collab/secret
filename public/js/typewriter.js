/**
 * ============================================================
 *  TYPEWRITER.JS — Hiệu ứng đánh máy chữ
 * ============================================================
 * Cách dùng:
 *   App.Typewriter.type(el, "Nội dung...", 35, function () { ... });
 * ============================================================
 */
window.App = window.App || {};

window.App.Typewriter = (function () {
  function type(el, text, speed, onDone) {
    if (!el) return;
    el.textContent = "";
    var i = 0;
    speed = speed || 35;

    function step() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(step, speed);
      } else if (typeof onDone === "function") {
        onDone();
      }
    }
    step();
  }

  return { type: type };
})();
