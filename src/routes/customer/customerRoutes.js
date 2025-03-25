const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRole } = require("../../middlewares/auth");

const managerRoutes = require("../customer/manager/managerRoutes");
const employeeRoutes = require("../customer/employee/employeeRoutes");

router.use(
  "/manager",
  authenticateToken,
  authorizeRole("Manager"),
  managerRoutes
);

router.use("/employee", authorizeRole("Admin"), employeeRoutes);

module.exports = router;
