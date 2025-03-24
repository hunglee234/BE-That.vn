const e = require("express");
const Permission = require("../../../models/role/Permission");

exports.createPermission = async (req, res) => {
  try {
    const { name, description } = req.body;

    const permission = new Permission({
      name,
      description,
    });

    await permission.save();
    return res.status(200).json({
      message: "Tạo permisson thành công",
      data: {
        permission: permission,
      },
    });
  } catch (error) {
    console.log("Lỗi khi tạo Permission", error.message);
    return res.status(500).json({
      message: "Có lỗi khi tạo role, vui lòng thử lại sau!",
    });
  }
};

exports.getAllPermission = async (req, res) => {
  try {
    const permissions = await Permission.find();
    return res.status(200).json({
      message: "Danh sách Permission",
      data: {
        permission: permissions,
      },
    });
  } catch (error) {
    console.log("Lỗi khi lấy danh sách Permission", error.message);
    return res.status(500).json({
      message: "Có lỗi khi tạo role, vui lòng thử lại sau!",
    });
  }
};
