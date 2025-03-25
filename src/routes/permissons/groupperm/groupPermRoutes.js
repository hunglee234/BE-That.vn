const express = require("express");
const router = express.Router();

const {
  createGrPerm,
  getAllGrPerm,
} = require("../../../controllers/groupperm/groupPermController");

router.post("/", createGrPerm);

router.get("/", getAllGrPerm);

module.exports = router;
