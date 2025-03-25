const groupPerm = require("../../models/groupperm/GroupPerm");
const Account = require("../../models/account/Account");
exports.createGrPerm = async (req, res) => {
  try {
    const { categoryName, description } = req.body;
    const userId = req.user.id;

    const account = await Account.findById(userId);
    if (!account) {
      return res.status(404).json({
        error: "Không tìm thấy tài khoản yêu cầu",
      });
    }

    const newGrPerm = await new groupPerm({
      categoryName,
      description,
      createdBy: account._id,
    }).save();

    const savedGrPerm = await groupPerm
      .findById(newGrPerm._id)
      .populate("createdBy", "fullname");

    res.status(201).json({
      message: "Nhóm quyền đã được tạo thành công",
      data: savedGrPerm,
    });
  } catch (error) {
    console.log("Lỗi khi tạo Group Permission", error.message);
    return res.status(500).json({
      message: "Có lỗi khi tạo Group Permission, vui lòng thử lại sau!",
    });
  }
};

exports.getAllGrPerm = async (req, res) => {
  try {
    const groupPerms = await groupPerm.find().populate("permissions", "name");
    if (!groupPerms) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy danh sách nhóm quyền", data: "" });
    }

    res.status(202).json({
      message: "Danh sách nhóm quyền",
      data: groupPerms,
    });
  } catch (error) {
    console.log("Lỗi khi lấy danh sách Group Permission", error.message);
    return res.status(500).json({
      message:
        "Có lỗi khi lấy danh sách Group Permission, vui lòng thử lại sau!",
    });
  }
};
