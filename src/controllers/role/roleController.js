const Role = require("../../models/role/Role");

exports.createRole = async (req, res) => {
  try {
    const { name, groupPermission } = req.body;

    const role = await new Role({
      name,
      groupPermission,
    }).save();

    const populatedRole = await Role.findById(role._id).populate({
      path: "groupPermission",
      select: "name permissions",
      populate: {
        path: "permissions",
        select: "name",
      },
    });

    return res.status(200).json({
      message: "Tạo role thành công",
      data: {
        role: populatedRole,
      },
    });
  } catch (error) {
    console.log("Lỗi khi tạo role", error.message);
    return res.status(500).json({
      message: "Có lỗi khi tạo role, vui lòng thử lại sau!",
    });
  }
};

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate({
      path: "groupPermission",
      select: "categoryName", // Chỉ lấy trường name và permissions từ groupPermission
      populate: {
        path: "permissions", // Tiếp tục populate đến permissions
        select: "name", // Chỉ lấy trường name của permissions
      },
    });
    return res.status(200).json({
      message: "Danh sách Role",
      data: {
        permission: roles,
      },
    });
  } catch (error) {
    console.log("Lỗi khi lấy danh sách Role", error.message);
    return res.status(500).json({
      message: "Có lỗi khi lấy danh sách role, vui lòng thử lại sau!",
    });
  }
};

exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id).populate({
      path: "groupPermission",
      select: "name permissions",
      populate: {
        path: "permissions",
        select: "name",
      },
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json(role);
  } catch (error) {
    console.log("Lỗi khi lấy Role", error.message);
    return res.status(500).json({
      message: "Có lỗi khi tạo role, vui lòng thử lại sau!",
    });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, groupPermission } = req.body;

    if (!Array.isArray(groupPermission)) {
      return res
        .status(400)
        .json({ error: "Danh sách permissions không hợp lệ" });
    }

    const role = await Role.findByIdAndUpdate(
      id,
      { groupPermission, name },
      { new: true }
    ).populate({
      path: "groupPermission",
      select: "name permissions",
      populate: {
        path: "permissions",
        select: "name",
      },
    });

    if (!role) {
      return res.status(404).json({ error: "Role không tồn tại" });
    }

    return res.status(200).json({
      message: "Cập nhật quyền cho vai trò thành công!",
      data: {
        role,
      },
    });
  } catch (error) {
    console.log("Lỗi khi lấy Role", error.message);
    return res.status(500).json({
      message: "Có lỗi khi tạo role, vui lòng thử lại sau!",
    });
  }
};
