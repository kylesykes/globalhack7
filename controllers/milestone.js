const MilestoneTemplate = require("../models/MilestoneTemplate");

exports.getMilestones = (req, res, next) => {
  MilestoneTemplate.MilestoneTemplate.find({}, (err, milestones) => {
    if (err) {
      return next(err);
    }
    res.send(milestones);
  });
};
