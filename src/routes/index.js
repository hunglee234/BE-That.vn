const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRole } = require("../middlewares/auth");

// Import routes
const authRoutes = require("../routes/auth/authRoutes");
const adminRoutes = require("../routes/admin/adminRoutes");
const customerRoutes = require("../routes/customer/customerRoutes");

// Sử dụng routes
router.use("/auth", authRoutes);
// app.use("/", commonRoutes);

// Accounts và Admin truy cập api /shared để dùng chung
// router.use("/shared", authenticateToken, sharedRoutes);
router.use("/admin", authenticateToken, authorizeRole("Admin"), adminRoutes);
router.use("/c", authenticateToken, customerRoutes);

module.exports = router;
