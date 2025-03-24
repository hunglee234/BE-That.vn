const express = require("express");
const router = express.Router();

const {
  createPermission,
  getAllPermission,
} = require("../../../controllers/admin/permission/permissionController");

router.post("/", createPermission);

router.get("/", getAllPermission);

module.exports = router;
