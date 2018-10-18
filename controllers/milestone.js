const MilestoneTemplate = require("../models/MilestoneTemplate");
const Summary = require('../models/Summary');

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
	MilestoneTemplate.MilestoneTemplate.findOne({ms_id:milestoneId}, (err, milestone) => {
    if (err) {
      return next(err);
    }
		res.send(milestone);
  });
}

exports.getSummaries = (req,res,next)=>{
	let milestoneId = req.params.milestoneId;
	Summary.Summary.findOne({ms_id:milestoneId},(err,summaries) =>{
			if(err) {
				return next(err);
			}
      if(!summaries) {
        return req.status(404).send(`no summaries found for milestone: ${milestoneId}`)
      }
			res.send(summaries.summaries);
		})
}
