const express = require("express");
const router = express.Router();

const {
  createRole,
  updateRole,
  getAllRoles,
  getRoleById,
} = require("../../../controllers/admin/role/roleController");

router.post("/", createRole);

router.get("/", getAllRoles);

router.get("/:id", getRoleById);

router.put("/:id", updateRole);

module.exports = router;
