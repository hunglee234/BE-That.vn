const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Kết nối MongoDB thành công"))
  .catch((err) => console.error("Lỗi kết nối MongoDB:", err));

// Import routes
const authRoutes = require("./routes/auth/authRoutes");
// const userRoutes = require("./routes/userRoutes");

// Sử dụng routes
app.use("/", authRoutes);
// app.use("/api/users", userRoutes);

module.exports = app;
