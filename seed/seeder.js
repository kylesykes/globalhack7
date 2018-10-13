const mongoose = require("mongoose");
const fs = require("fs");
const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.load({ path: ".env.example" });

const mongo = process.env.MONGODB_URI;
console.log(mongo);

const users = JSON.parse(fs.readFileSync("seed/users.json", "utf8"));
mongoose
  .connect(mongo)
  .then(() => {
    for (let i = 0; i < users.length; i++) {
      User.User.create(users[i]).catch(err => {
        console.log(err);
      });
    }
  })
  .catch(err => {
    console.log(err);
    process.exit();
  });

mongoose.connection.on("error", err => {
  console.error(err);
  console.log(
    "%s MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});
