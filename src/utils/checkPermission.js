const Account = require("../models/account/Account");

const checkPermission = async (userId, permissionName) => {
  const account = await Account.findById(userId)
    .populate({
      path: "role",
      populate: {
        path: "groupPermission",
        populate: { path: "permissions", select: "name" },
      },
    })
    .populate("customPermissions", "name");

  console.log("accounttttt", account);
  // Lấy tất cả Permission từ Group Permission của Role
  const rolePermissions =
    account.role.groupPermission?.flatMap(
      (group) => group.permissions?.map((perm) => perm.name) || []
    ) || [];

  console.log("quyền từ role", rolePermissions);
  // Lấy tất cả Permission riêng
  const customPermissions = account.customPermissions.map((perm) => perm.name);
  console.log("quyền từ custom permission", customPermissions);
  // Kiểm tra nếu quyền có trong Role hoặc Permission riêng
  return (
    rolePermissions.includes(permissionName) ||
    customPermissions.includes(permissionName)
  );
};

module.exports = checkPermission;
