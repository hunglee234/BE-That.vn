const express = require("express");
const router = express.Router();

const {
  createPermission,
  getAllPermission,
  deletePermisson,
} = require("../../../controllers/permission/permissionController");

router.post("/", createPermission);

router.get("/", getAllPermission);

router.delete("/:id", deletePermisson);

module.exports = router;
