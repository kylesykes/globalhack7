const mongoose = require("mongoose");

function MilestoneBaseSchema() {
  Schema.apply(this, arguments);

  this.add(
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
}
util.inherits(BaseSchema, Schema);

const milestoneTemplateSchema = new MilestoneBaseSchema();

const MilestoneTemplate = mongoose.model(
  "MilestoneTemplate",
  milestoneTemplateSchema
);

module.exports.MilestoneBaseSchema = MilestoneBaseSchema;
module.exports.MilestoneTemplate = MilestoneTemplate;
