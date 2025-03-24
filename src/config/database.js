const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Kết nối MongoDB thành công");

    // Xử lý sự kiện khi server tắt
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🛑 Đã ngắt kết nối MongoDB");
      process.exit(0);
    });
  } catch (err) {
    console.error("❌ Lỗi kết nối MongoDB:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
