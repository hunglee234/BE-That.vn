const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotpassword,
  verifycode,
  resetpassword,
  changepassword,
} = require("../../controllers/auth/authController");

// Đăng ký này để test DB thôi ( trong thực tế không dùng)
router.post("/register", register);

// Đăng nhập
router.post("/login", login);

// Quên mật khẩu
router.post("/forgot-password", forgotpassword);

// Xác nhận mã code
router.post("/verify-code", verifycode);

// reset password
router.post("/reset-password", resetpassword);
// Change password
router.post("/change-password", changepassword);

module.exports = router;
