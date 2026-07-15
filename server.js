/**
 * ============================================================
 *  SERVER.JS — Node.js + Express
 * ============================================================
 * Nhiệm vụ:
 *  1. Phục vụ toàn bộ file tĩnh trong thư mục /public
 *     (HTML, CSS, JS, nhạc, ảnh...)
 *  2. Cung cấp API /api/config để phía client lấy tên,
 *     lời chúc, đường dẫn nhạc... từ file config/config.js
 *     -> Người dùng chỉ cần sửa 1 file config.js duy nhất,
 *        không cần đụng vào code giao diện.
 * ============================================================
 */

const express = require("express");
const path = require("path");
const config = require("./config/config");

const app = express();
const PORT = process.env.PORT || 3000;

// Phục vụ toàn bộ thư mục public dưới dạng file tĩnh
app.use(express.static(path.join(__dirname, "public")));

// API trả về cấu hình cho frontend (tên, lời chúc, nhạc, số nến, màu chủ đạo)
app.get("/api/config", (req, res) => {
  res.json({
    name: config.name,
    message: config.message,
    musicFile: config.musicFile,
    candleCount: config.candleCount,
    accentColor: config.accentColor
  });
});

// Mọi route không khớp -> trả về trang chính (hỗ trợ refresh trang)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log("========================================");
  console.log(`  Trang sinh nhật đang chạy tại:`);
  console.log(`  http://localhost:${PORT}`);
  console.log("========================================");
});
