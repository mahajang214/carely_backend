const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminModal"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("CategoryModal", categorySchema);
