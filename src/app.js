require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const cors = require("cors");
const morgan = require("morgan");
const { authenticateToken, authorizeRole } = require("./middlewares/auth");

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
// Kết nối MongoDB
connectDB();
// Import routes
const authRoutes = require("./routes/auth/authRoutes");
const adminRoutes = require("./routes/admin/adminRoutes");

// Sử dụng routes
app.use("/auth", authRoutes);
// app.use("/", commonRoutes);

// router.use("/shared", authenticateToken, sharedRoutes);
app.use("/admin", authenticateToken, authorizeRole("Admin"), adminRoutes);
// app.use(
//   "/customer",
//   authenticateToken,
//   authorizeRole("Customer"),
//   customerRoutes
// );

module.exports = app;
