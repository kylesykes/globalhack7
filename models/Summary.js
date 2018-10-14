const mongoose = require('mongoose')

const summarySchema = new mongoose.Schema(
	{
		ms_id: String,
		summaries: [String]
	},
);
const Summary = mongoose.model("milestone_summaries",summarySchema);

module.exports.summarySchema = summarySchema;
module.exports.Summary=Summary;