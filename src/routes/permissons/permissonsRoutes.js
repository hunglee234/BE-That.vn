const express = require("express");
const router = express.Router();
const groupPermRoutes = require("../permissons/groupperm/groupPermRoutes");
const permissionsRoutes = require("../permissons/permission/permissonRoutes");

router.use("/gpm", groupPermRoutes);

router.use("/pm", permissionsRoutes);

module.exports = router;
