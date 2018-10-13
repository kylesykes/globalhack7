const mongoose = require("mongoose");

const milestoneTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    description: String,
    steps: [
      {
        name: String,
        description: String
      }
    ]
  },
  { timestamps: true }
);

const MilestoneTemplate = mongoose.model(
  "MilestoneTemplate",
  milestoneTemplateSchema
);

module.exports = MilestoneTemplate;
