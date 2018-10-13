const mongoose = require("mongoose"),
  extend = require("mongoose-schema-extend");
const util = require("util");
var Schema = mongoose.Schema;

const milestoneTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    description: String,
    steps: {
      name: String,
      description: String
    }
  },
  { timestamps: true }
);

const MilestoneTemplate = mongoose.model(
  "MilestoneTemplate",
  milestoneTemplateSchema
);

module.exports.MilestoneBaseSchema = MilestoneBaseSchema;
module.exports.MilestoneTemplate = MilestoneTemplate;
