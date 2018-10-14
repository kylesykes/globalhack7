const MilestoneTemplate = require("../models/MilestoneTemplate");

exports.getMilestones = (req, res, next) => {
  MilestoneTemplate.MilestoneTemplate.find({}, (err, milestones) => {
    if (err) {
      return next(err);
    }
    res.send(milestones);
  });
};

exports.getMilestone = (req,res,next)=>{
	let milestoneId = req.params.milestoneId;
	MilestoneTemplate.MilestoneTemplate.find({ms_id:milestoneId}, (err, milestones) => {
    if (err) {
      return next(err);
    }
    res.send(milestones);
  });
}