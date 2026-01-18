const mongoose = require("mongoose");
const workspaceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a username"],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true],
    },
    createdAt: {
      type: String,
      required: [true],
    },
    updatedAt: {
      type: String,
      required: [true],
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model("User", workspaceSchema);
