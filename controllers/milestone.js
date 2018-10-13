const MilestoneTemplate = require("../models/milestone");

exports.getMilestones = (req, res, next) => {
  MilestoneTemplate.find({}, (err, milestones) => {
    if (err) {
      return next(err);
    }
    res.send({ milestones: milestones });
  });
};
