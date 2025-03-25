const Account = require("../../models/account/Account");
const Role = require("../../models/role/Role");

exports.createEmployee = async (req, res) => {
  try {
    const {
      fullname,
      username,
      password,
      gender,
      phone,
      email,
      role: roleName,
      permission,
    } = req.body;

    const userId = req.user.id;
    const account = await Account.findById(userId);
    if (!account) {
      return res.status(404).json({ error: "Tài khoản không tồn tại" });
    }

    const roleExists = await Role.findOne({ name: roleName });
    if (!roleExists) {
      return res.status(404).json({ error: "Role không tồn tại." });
    }

    const usernameExists = await Account.findOne({ username });
    if (!usernameExists) {
      return res.status(400).json({ error: "Username đã tồn tại" });
    }

    const phoneExists = await Account.findOne({ phone });
    if (!phoneExists) {
      return res.status(400).json({ error: "Số điện thoại đã tồn tại" });
    }

    const emaileExists = await Account.findOne({ email });
    if (!emaileExists) {
      return res.status(400).json({ error: "Số điện thoại đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo tài khoản mới trong collection Account
    const newAccount = await new Account({
      fullname,
      gender,
      email,
      password: hashedPassword,
      username,
      permission,
      role: roleExists._id,
      createdBy: account._id,
    }).save();

    const savedAccount = await Account.findById(newAccount._id).populate(
      "createdBy",
      "fullname"
    );

    const responseData = {
      id: savedAccount._id,
      fullname: savedAccount.fullname,
      gender: savedAccount.gender,
      username: savedAccount.username,
      permission: savedAccount.permission,
      role: savedAccount.role,
      createdBy: savedAccount.createdBy,
    };

    res.status(201).json({
      message: "Tài khoản đã được tạo thành công",
      data: responseData,
    });
  } catch (error) {
    console.log("Lỗi khi tạo nhân viên", error.message);
    return res.status(500).json({
      message: "Có lỗi khi tạo nhân viên, vui lòng thử lại sau!",
    });
  }
};

exports.getFullEmployee = async (req, res) => {
  try {
    const userId = req.user.id;
    // Lấy thông tin tài khoản của người dùng hiện tại
    const currentUser = await Account.findById(userId).populate("role");

    if (!currentUser) {
      return res.status(404).json({ message: "Tài khoản không tồn tại." });
    }

    let employeelist = await Account.find({
      createdBy: currentUser._id,
    }).populate("createdBy", "fullname");

    if (!employeelist || employeelist.length === 0) {
      return res.status(202).json({
        message: "Không có nhân viên nào được tìm thấy",
        data: "",
      });
    }

    res.status(200).json({
      message: "Danh sách nhân viên",
      total: employeelist.length,
      data: employeelist,
    });
  } catch (error) {
    console.log("Lỗi khi lấy danh sách nhân viên", error.message);
    return res.status(500).json({
      message: "Có lỗi khi tạo role, vui lòng thử lại sau!",
    });
  }
};
