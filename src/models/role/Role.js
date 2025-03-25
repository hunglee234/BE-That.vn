const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  groupPermission: [{ type: mongoose.Schema.Types.ObjectId, ref: "groupPerm" }],
});

module.exports = mongoose.model("Role", roleSchema);
