const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getFullEmployee,
} = require("../../../controllers/customer/customerController");

router.post("/create-employee", createEmployee);

router.get("/", getFullEmployee);

module.exports = router;
