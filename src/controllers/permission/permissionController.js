const express = require("express");
const Permission = require("../../models/groupperm/Permission");

exports.createPermission = async (req, res) => {
  try {
    const { name, description, groupPermission } = req.body;

    const permission = new Permission({
      name,
      description,
      groupPermission,
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

exports.deletePermisson = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPermisson = await Permission.findByIdAndDelete(id);

    // Kiểm tra nếu không tìm thấy danh mục
    if (!deletedPermisson) {
      return res.status(404).json({ error: "Category not found" });
    }

    // Trả về phản hồi thành công
    res.status(200).json({
      message: "Permisson deleted successfully",
      data: deletedPermisson,
    });
  } catch (error) {
    console.log("Lỗi khi xóa Permission", error.message);
    return res.status(500).json({
      message: "Có lỗi khi xóa Permission, vui lòng thử lại sau!",
    });
  }
};
