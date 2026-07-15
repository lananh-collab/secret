# 🎂 Trang Web Chúc Mừng Sinh Nhật

Trang web sinh nhật động, đầy đủ hiệu ứng: nền không gian ngân hà (Three.js),
pháo hoa nhiều kiểu, bánh sinh nhật 3D có nến để thổi, trái tim bay, bong
bóng, hoa rơi, bó hoa xuất hiện ở cuối, hiệu ứng ánh sáng bloom/glow, và
lời chúc hiệu ứng đánh máy — chạy trên Node.js + Express.

## 📁 Cấu trúc dự án

```
birthday-project/
├── server.js                 # Server Express (phục vụ trang + API config)
├── package.json
├── config/
│   └── config.js              # ⭐ FILE DUY NHẤT BẠN CẦN SỬA
└── public/
    ├── index.html              # Cấu trúc trang, các "màn hình"
    ├── css/
    │   ├── main.css             # Design tokens, layout, giao diện
    │   └── animations.css       # Toàn bộ keyframes hiệu ứng
    ├── js/
    │   ├── config-loader.js     # Lấy cấu hình từ API /api/config
    │   ├── starfield.js         # Nền sao + dải ngân hà (Three.js)
    │   ├── cake.js               # Bánh sinh nhật 3D + nến (Three.js)
    │   ├── fireworks.js          # Pháo hoa nhiều kiểu (Canvas 2D)
    │   ├── hearts.js             # Trái tim bay (DOM/CSS)
    │   ├── balloons.js           # Bong bóng bay lên (DOM/CSS)
    │   ├── flowers.js            # Hoa rơi (DOM/CSS)
    │   ├── bouquet.js            # Bó hoa màn hình kết (SVG)
    │   ├── countdown.js          # Đếm ngược 3-2-1
    │   ├── typewriter.js         # Hiệu ứng đánh máy chữ
    │   ├── welcome.js            # Màn hình chào mừng
    │   ├── audio.js              # Nhạc nền + nút bật/tắt
    │   └── script.js             # 🎬 Nhạc trưởng điều phối toàn bộ
    └── assets/
        └── music/                 # Đặt file .mp3 nhạc nền vào đây
```

## 🚀 Cách chạy dự án

**Yêu cầu:** đã cài [Node.js](https://nodejs.org) (bản 16 trở lên).

```bash
# 1. Cài các gói cần thiết
npm install

# 2. Chạy server
npm start
```

Sau đó mở trình duyệt tại: **http://localhost:3000**

## ✏️ Cách tuỳ chỉnh (chỉ cần 2 bước)

### Bước 1 — Sửa nội dung

Mở file `config/config.js` và sửa 3 giá trị:

```js
module.exports = {
  name: "Tên người được chúc",
  message: "Lời chúc của bạn...",
  musicFile: "/assets/music/background.mp3",
  candleCount: 5,          // số nến trên bánh (3-8)
  accentColor: "#ffd37a"
};
```

### Bước 2 — Thêm nhạc nền

Copy file nhạc `.mp3` của bạn vào `public/assets/music/`, đặt tên là
`background.mp3` (hoặc đổi đường dẫn `musicFile` ở trên cho khớp tên file).

**Không cần sửa bất kỳ file HTML/CSS/JS nào khác.**

## 🎮 Trải nghiệm người dùng

1. Màn hình chào mừng hiện tên người được chúc → bấm **"Bắt đầu"**
2. Đếm ngược 3 → 2 → 1
3. Bánh sinh nhật 3D hiện ra — **chạm/click vào từng ngọn nến** để thổi tắt
4. Khi tắt hết nến: lời chúc được đánh máy dần, đồng thời pháo hoa, trái
   tim, bong bóng, hoa rơi cùng bừng lên
5. Màn hình kết: bó hoa xuất hiện cùng lời chúc đầy đủ, có nút **"Xem lại
   từ đầu"**

## 🛠️ Công nghệ sử dụng

- **Backend:** Node.js + Express (phục vụ file tĩnh + API cấu hình)
- **Three.js r128:** nền sao/ngân hà và bánh sinh nhật 3D
- **Canvas 2D:** hệ thống pháo hoa (object pooling để tối ưu hiệu năng)
- **DOM + CSS animation:** trái tim, bong bóng, hoa rơi, bó hoa
- **Vanilla JS (IIFE / window-global pattern):** mỗi hiệu ứng là một module
  độc lập gắn vào `window.App`, dễ đọc, dễ mở rộng, không cần build tool

## 📱 Responsive

Giao diện được tối ưu cho cả máy tính và điện thoại: kích thước chữ, vị
trí bánh kem, mật độ hiệu ứng đều tự co giãn theo kích thước màn hình.
Trang cũng tôn trọng tuỳ chọn "giảm chuyển động" (`prefers-reduced-motion`)
của hệ điều hành.

## ❓ Xử lý sự cố thường gặp

- **Không nghe thấy nhạc:** một số trình duyệt chặn tự phát nhạc — hãy
  bấm vào nút loa 🔊 ở góc dưới bên phải màn hình.
- **Bánh kem/nền sao không hiện:** kiểm tra Console (F12) xem trình duyệt
  có tải được thư viện Three.js từ CDN không (cần có kết nối Internet).
- **Đổi cổng chạy server:** đặt biến môi trường `PORT`, ví dụ
  `PORT=8080 npm start`.
