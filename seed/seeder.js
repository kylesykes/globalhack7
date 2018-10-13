const mongoose = require("mongoose");
const User = require("../models/User");
const Messages = require("../models/Messages");
const MilestoneTemplates = require("../MilestoneTemplates");

let mileStoneObject = {
  templateId: "5",
  name: "Drivesr License",
  description: "To the DMV and get a drivers license",
  steps: []
};

let userObject = {
  username: "farrellw",
  phone: "5632107275",
  mentors: [],
  mentees: [],
  milestones: [mileStoneObject],
  profile: {}
};

let myUser = new User(userObject);

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);
const localMongo = "mongodb://localhost:27017/practice";
console.log("MONGODBURL", localMongo);
mongoose.connect(localMongo);
mongoose.connection.on("error", err => {
  console.error(err);
  console.log(
    "%s MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});
