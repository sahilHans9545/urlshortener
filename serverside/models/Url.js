const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    realUrl: {
      type: String,
      required: true,
    },
    analytics: {
      visitHistory: [{ time: { type: Number } }],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", urlSchema);
