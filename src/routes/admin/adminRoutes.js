const express = require("express");
const router = express.Router();
const roleRoutes = require("../../routes/admin/role/roleRoutes");
const permissionsRoutes = require("../permissons/permissonsRoutes");
const accountRoutes = require("../../routes/admin/account/accountRoutes");

router.use("/role", roleRoutes);

router.use("/permissions", permissionsRoutes);

router.use("/account", accountRoutes);

module.exports = router;
