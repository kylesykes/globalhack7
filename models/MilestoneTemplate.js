const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: String,
  isSupport: { type: Boolean, default: false }
});

const chatSchema = new mongoose.Schema({
  isResolved: { type: Boolean, default: false },
  messages: [messageSchema]
});

const milestoneSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    description: String,
    completed: { type: Boolean, default: false },
    in_progress: { type: Boolean, default: false },
    chat: chatSchema,
    muid: String,
    steps: [
      {
        name: String,
        description: String
      }
    ]
  },
  { timestamps: true }
);
const MilestoneTemplate = mongoose.model("milestones", milestoneSchema);

module.exports.milestoneSchema = milestoneSchema;
module.exports.MilestoneTemplate = MilestoneTemplate;
