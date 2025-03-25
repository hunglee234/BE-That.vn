const express = require("express");
const router = express.Router();
// const { authenticateToken } = require("../../../middlewares/auth");
const checkPermission = require("../../../middlewares/access-control");

const {
  createContract,
} = require("../../../controllers/customer/employeeController");

router.post("/contract", checkPermission("create_contract"), createContract);

module.exports = router;
