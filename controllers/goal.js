const Goal = require("../models/Goal");

exports.getGoals = (req, res, next) => {
  Goal.GoalTemplate.find({}, (err, goals) => {
    if (err) {
      return next(err);
    }
    res.send({ goals: goals });
  });
};

exports.getGoal = (req, res, next) => {
  let goalId = req.params.goalId;

  Goal.GoalTemplate.findOne({ g_id: goalId }, (err, goal) => {
    if (err) {
      return next(err);
    }
    res.send({ goal: goal });
  });
};
