const mongoose = require("mongoose");
const MilestoneTemplate = require("./MilestoneTemplate");

const goalSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    description: String,
    milestones: [MilestoneTemplate.milestoneSchema],
    completed: { type: Boolean, default: false },
    g_id: String
  },
  { timestamps: true }
);

const GoalTemplate = mongoose.model("goals_with_milestones", goalSchema);

module.exports.goalSchema = goalSchema;
module.exports.GoalTemplate = GoalTemplate;
