const express = require("express");
const router = express.Router();
const {
  createAccount,
  getFullAccount,
} = require("../../../controllers/admin/account/accountController");

router.post("/", createAccount);

router.get("/", getFullAccount);

module.exports = router;
