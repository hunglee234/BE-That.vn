const express = require("express");
const router = express.Router();
const roleRoutes = require("../../routes/admin/role/roleRoutes");
const permissionRoutes = require("../../routes/admin/permission/permissonRoutes");

router.use("/role", roleRoutes);

router.use("/permission", permissionRoutes);

module.exports = router;
