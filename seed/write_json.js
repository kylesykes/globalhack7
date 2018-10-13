const mongoose = require("mongoose");
const faker = require("faker");
const fs = require("fs");
const User = require("../models/User");
const mocks = require("./mocks");

const localMongo = "mongodb://localhost:27017/practice";

let mentees = [mocks.mockUser];

//Randomly create 10 pairings of mentee and mentor
for (let i = 0; i < 9; i++) {
  let mentee = {
    ...mocks.mockUser,
    phone: faker.phone.phoneNumber(),
    username: faker.internet.userName()
  };
  mentees.push(mentee);
}

let finalMentees = [];
let finalMentors = [];
mongoose.connect(localMongo).then(() => {
  for (let j = 0; j < mentees.length; j++) {
    const mentee = mentees[j];
    User.create(mentee)
      .then(savedMentee => {
        const mentor = {
          ...mocks.mockUser,
          mentees: [savedMentee._id],
          milestones: [],
          phone: faker.phone.phoneNumber(),
          username: faker.internet.userName()
        };
        User.create(mentor)
          .then(savedMentor => {
            const toUpdateMentee = {
              ...mocks.mockUser,
              mentors: [savedMentor._id]
            };
            finalMentees.push(toUpdateMentee);
            finalMentors.push(savedMentor);

            User.updateOne(
              { username: savedMentee.username },
              { mentors: [savedMentor._id] },
              (err, res) => {
                if (err) {
                  console.error(err);
                }
                fs.writeFileSync(
                  "seed/seeds.json",
                  JSON.stringify(finalMentees.concat(finalMentors))
                );
              }
            );
          })
          .catch(err => {
            console.error(err);
            process.exit();
          });
      })
      .catch(err => {
        console.error(err);
        process.exit();
      });
  }
});

mongoose.connection.on("error", err => {
  console.error(err);
  console.log(
    "%s MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});
