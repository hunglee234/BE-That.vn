const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Account = require("../../models/account/Account");
require("dotenv").config();
const { sendMail } = require("../../controllers/email/emailController");
const crypto = require("crypto");

exports.register = async (req, res) => {
  const { fullname, username, password, gender, phone, email } = req.body;

  try {
    // Kiểm tra các trường bắt buộc
    if (!fullname || !username || !password || !phone || !email) {
      return res.status(400).json({
        message:
          "Full name, username, phone, email and password are required for individual registration",
      });
    }
    const existingEmail = await Account.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    const existingPhone = await Account.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        message: "Phone number already exists",
      });
    }
    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo tài khoản cá nhân
    const newAccount = new Account({
      fullname,
      username,
      password: hashedPassword,
      gender,
      phone,
      email,
    });

    const savedAccount = await newAccount.save();
    return res.status(201).json({
      message: "Chúc mừng bạn đăng ký thành công",
      Account: savedAccount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const account = await Account.findOne({ username });
    if (!account) {
      return res.status(404).json({
        message: "Account not found.",
      });
    }

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, account.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: account._id, username },
      process.env.SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    account.token = token;
    await account.save();
    return res.json({
      message: "Đăng nhập thành công",
      token,
      account: {
        id: account._id,
        fullName: account.fullName,
        username: account.username,
        phone: account.phone || null,
        email: account.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.forgotpassword = async (req, res) => {
  const { email } = req.body;
  try {
    const account = await Account.findOne({
      email,
    });
    if (!account) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    account.resetCode = hashedOtp;
    account.resetCodeExpire = Date.now() + 10 * 60 * 1000;
    await account.save();

    // Gửi email chứa OTP
    const emailSubject = "Mã xác thực quên mật khẩu";
    const emailText = `Mã xác thực của bạn là: ${otp}`;
    try {
      await sendMail(account.email, emailSubject, emailText);
      res.json({ message: "Mã xác thực đã được gửi đến email." });
    } catch (error) {
      console.error("Lỗi gửi email:", error);
      res.status(500).json({ message: "Lỗi khi gửi email, vui lòng thử lại!" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Xác nhận mã code
exports.verifycode = async (req, res) => {
  const { email, code } = req.body;
  try {
    const account = await Account.findOne({ email });

    if (!account)
      return res.status(400).json({ message: "Email không tồn tại!" });

    // Mã hóa mã code người dùng nhập vào để kiểm tra
    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

    if (
      account.resetCode !== hashedCode ||
      account.resetCodeExpire < Date.now()
    ) {
      return res
        .status(400)
        .json({ message: "Mã xác thực không hợp lệ hoặc đã hết hạn!" });
    }

    // Tạo token cho bước đặt lại mật khẩu
    const token = jwt.sign(
      { id: account._id, resetCode: account.resetCode },
      process.env.SECRET_KEY,
      {
        expiresIn: "15m",
      }
    );

    res.json({ message: "Xác thực thành công!", token });
  } catch (error) {
    console.error("Lỗi xử lý xác thực mã:", error);
    res
      .status(500)
      .json({ message: "Đã có lỗi xảy ra, vui lòng thử lại sau!" });
  }
};

exports.resetpassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded || !decoded.id || !decoded.resetCode) {
      return res.status(400).json({ message: "Token không hợp lệ!" });
    }
    const account = await Account.findById(decoded.id);
    if (!account) {
      return res.status(400).json({
        message: "Người dùng không tồn tại",
      });
    }

    // So sánh `resetCode` trong token với database
    if (account.resetCode !== decoded.resetCode) {
      return res.status(400).json({ message: "Mã xác thực không hợp lệ!" });
    }

    // Kiểm tra thời gian hết hạn của mã reset
    if (account.resetCodeExpire && account.resetCodeExpire < Date.now()) {
      return res.status(400).json({ message: "Mã đặt lại đã hết hạn!" });
    }
    // Cập nhật mật khẩu mới
    account.password = await bcrypt.hash(newPassword, 10);
    account.resetCode = undefined;
    account.resetCodeExpire = undefined;
    await account.save();

    res.json({
      message: "Mật khẩu đã được cập nhật!",
      account: {
        username: account.username || null,
      },
    });
  } catch (error) {
    console.error("Lỗi khi reset mật khẩu:", error);
    res
      .status(500)
      .json({ message: "Đã có lỗi xảy ra, vui lòng thử lại sau!" });
  }
};

exports.changepassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  try {
    const account = await Account.findOne({ email });
    if (!account) {
      return res.status(400).json({ mesage: "Người dùng không tồn tại" });
    }

    // Kiểm tra mật khẩu cũ
    const isMatch = await bcrypt.compare(oldPassword, account.password);
    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu cũ không chính xác" });

    // Mã hóa mật khẩu mới và cập nhật
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    account.password = hashedPassword;
    await account.save();

    res.json({ message: "Thay đổi mật khẩu thành công" });
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu", error);
    res
      .status(500)
      .json({ message: "Đã có lỗi xảy ra, vui lòng thử lại sau!" });
  }
};
