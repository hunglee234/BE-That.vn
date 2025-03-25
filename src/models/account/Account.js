const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    fullname: { type: String, default: "" },
    username: { type: String, default: "", unique: true },
    password: {
      type: String,
      required: true,
    },
    gender: { type: String, enum: ["Nam", "Nữ", "Khác"], default: "Khác" },
    phone: { type: String, default: "" },
    email: {
      type: String,
      required: false,
      unique: true,
    },
    address: {
      province: { type: String, default: "" },
      city: { type: String, default: "" },
      district: { type: String, default: "" },
      detail: { type: String, default: "" },
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: false,
    },
    customPermissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: false,
    },
    status: {
      type: String,
      enum: ["Đang hoạt động", "Không hoạt động"],
      default: "Đang hoạt động",
    },
    token: {
      type: String,
      default: "",
    },
    resetCode: { type: String },
    resetCodeExpire: { type: Date },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Account", accountSchema);
