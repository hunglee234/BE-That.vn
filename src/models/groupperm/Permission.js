const { group } = require("console");
const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  groupPermission: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "groupPerm",
    required: true,
  },
  description: String,
});

// Auto-push permission ID to groupPerm.permissions after saving
permissionSchema.post("save", async function (doc, next) {
  try {
    const GroupPerm = mongoose.model("groupPerm");
    await GroupPerm.findByIdAndUpdate(
      doc.groupPermission,
      { $addToSet: { permissions: doc._id } }, // tránh trùng lặp
      { new: true }
    );
    next();
  } catch (err) {
    next(err);
  }
});

// Auto-pull permission ID from groupPerm.permissions when deleted
permissionSchema.post("findOneAndDelete", async function (doc, next) {
  if (doc) {
    try {
      const GroupPerm = mongoose.model("groupPerm");
      await GroupPerm.findByIdAndUpdate(doc.groupPermission, {
        $pull: { permissions: doc._id },
      });
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model("Permission", permissionSchema);
