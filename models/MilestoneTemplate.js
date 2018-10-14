const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    description: String,
    complete: { type: Boolean, default: false },
    in_progress: { type: Boolean, default: false },
    steps: [
      {
        name: String,
        description: String
      }
    ]
  },
  { timestamps: true }
);
const MilestoneTemplate = mongoose.model("MilestoneTemplate", milestoneSchema);

module.exports.milestoneSchema = milestoneSchema;
module.exports.MilestoneTemplate = MilestoneTemplate;
