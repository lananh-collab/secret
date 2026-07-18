/**
 * ============================================================
 *  FILE CẤU HÌNH DUY NHẤT BẠN CẦN SỬA
 * ============================================================
 * Chỉ cần thay đổi các giá trị bên dưới, KHÔNG cần đụng vào
 * bất kỳ file code nào khác trong dự án.
 *
 *  - name        : Tên người được chúc mừng sinh nhật
 *  - message     : Lời chúc sẽ được hiệu ứng đánh máy hiển thị
 *  - musicFile   : Đường dẫn tới file nhạc nền (đặt file .mp3
 *                  của bạn vào thư mục public/assets/music/
 *                  rồi sửa tên file tại đây)
 *  - candleCount : Số lượng nến trên bánh sinh nhật (3 - 8)
 *  - accentColor : Màu chủ đạo cho hiệu ứng ánh sáng (mã HEX)
 * ============================================================
 */

module.exports = {
  name: "bạn Trang",

  message:
    "Chúc mừng sinh nhật bạn! 🎉 Chúc bạn luôn xinh đẹp, tự tin và tràn đầy năng lượng. " +
    "Mong mọi dự định trong năm mới đều thuận lợi, mọi ước mơ đều thành hiện thực. " +
    "Cảm ơn vì đã luôn là phiên bản tuyệt vời nhất của chính mình. Chúc bạn một tuổi mới thật rực rỡ! 🎂✨",

  musicFile: "/assets/music/background.mp3",

  candleCount: 6,

  accentColor: "#ffd37a"
};
