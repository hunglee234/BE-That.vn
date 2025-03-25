const mongoose = require("mongoose");

const ContractsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: false,
    },
  },
  { timestamps: true }
);
ContractsSchema.index({ name: "text" });
module.exports = mongoose.model("Contract", ContractsSchema);
