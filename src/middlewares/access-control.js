const checkPermission = require("../utils/checkPermission");

const checkPermissionMiddleware = (permissionName) => {
  return async (req, res, next) => {
    try {
      console.log("b");
      const userId = req.user.id;
      if (!userId) {
        return res.status(401).json({ message: "Khách hàng chưa đăng nhập" });
      }

      const hasPermission = await checkPermission(userId, permissionName);
      console.log(permissionName);
      if (!hasPermission) {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền thực hiện hành động này" });
      }

      next(); // Cho phép tiếp tục request nếu có quyền
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
};

module.exports = checkPermissionMiddleware;
