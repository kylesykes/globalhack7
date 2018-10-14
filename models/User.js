const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const Goal = require("./Goal");

const userSchema = new mongoose.Schema(
  {
    username: String,
    phone: { type: String, unique: true },
    password: String,
    profile: {
      language: String,
      gender: String,
      age: Number,
      skills: [String]
    },
    hasMentor: { type: Boolean, default: false },
    goals: [Goal.goalSchema],
    summaries: [String]
  },
  { timestamps: true }
);

/**
 * Password hash middleware.
 */
userSchema.pre("save", function save(next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

const User = mongoose.model("User", userSchema);

module.exports.User = User;
module.exports.hasMentor = user => {
  return user.hasMentor;
};
