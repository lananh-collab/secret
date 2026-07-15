/**
 * ============================================================
 *  BOUQUET.JS — Bó hoa xuất hiện ở màn hình kết
 * ============================================================
 * Vẽ một bó hoa bằng SVG thuần (không dùng ảnh) và hiển thị
 * màn hình kết thúc cùng lời chúc.
 *
 * Cách dùng:
 *   App.Bouquet.show(name, message);
 * ============================================================
 */
window.App = window.App || {};

window.App.Bouquet = (function () {
  function buildSVG() {
    var petalColors = ["#ff6fa3", "#ffd37a", "#b48cff", "#7de8ff"];
    var flowers = [];
    var positions = [
      { x: 110, y: 70, r: 26 }, { x: 70, y: 95, r: 22 }, { x: 150, y: 95, r: 22 },
      { x: 90, y: 130, r: 20 }, { x: 130, y: 130, r: 20 }, { x: 110, y: 108, r: 24 }
    ];

    positions.forEach(function (pos, idx) {
      var color = petalColors[idx % petalColors.length];
      var petals = "";
      for (var i = 0; i < 6; i++) {
        var angle = (i / 6) * Math.PI * 2;
        var px = pos.x + Math.cos(angle) * pos.r * 0.55;
        var py = pos.y + Math.sin(angle) * pos.r * 0.55;
        petals += '<ellipse cx="' + px + '" cy="' + py + '" rx="' + (pos.r * 0.42) +
          '" ry="' + (pos.r * 0.62) + '" fill="' + color + '" opacity="0.92" ' +
          'transform="rotate(' + (i * 60) + ' ' + px + ' ' + py + ')"/>';
      }
      petals += '<circle cx="' + pos.x + '" cy="' + pos.y + '" r="' + (pos.r * 0.32) +
        '" fill="#ffe9b8"/>';
      flowers.push(petals);
    });

    var stems =
      '<path d="M110,150 L100,230" stroke="#7fae6e" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M110,150 L120,235" stroke="#6f9e5f" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M110,150 L110,240" stroke="#89bb77" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M110,225 C60,235 45,215 40,195" stroke="#89bb77" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M110,225 C160,235 175,215 180,195" stroke="#7fae6e" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M95,245 L125,245 L135,270 L85,270 Z" fill="#e7cba3"/>';

    return (
      '<svg viewBox="0 0 220 280" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">' +
      stems +
      flowers.join("") +
      "</svg>"
    );
  }

function show(name, message) {
  var screen = document.getElementById("bouquet-screen");
  var graphic = document.getElementById("bouquet-graphic");
  var nameEl = document.getElementById("bouquet-name");
  var messageEl = document.getElementById("bouquet-message");

  graphic.innerHTML = '<img src="/assets/images/hoa.jpg" alt="Chúc mừng sinh nhật" class="bouquet-image" />';
  nameEl.textContent = name || "bạn";
  messageEl.textContent = message || "";

  screen.classList.remove("hidden");
}
  function hide() {
    document.getElementById("bouquet-screen").classList.add("hidden");
  }

  return { show: show, hide: hide };
})();
