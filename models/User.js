const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const crypto = require("crypto");

const ObjectId = mongoose.Schema.Types.ObjectId;

const milestoneSchema = new mongoose.Schema({
  templateId: String,
  name: String,
  description: String,
  steps: [
    {
      name: String,
      description: String,
      in_progress: Boolean,
      complete: Boolean
    }
  ]
});

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
    mentors: [ObjectId],
    mentees: [ObjectId],
    milestones: [milestoneSchema]
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

module.exports.isMentee = user => {
  return user && user.mentors && user.mentors.length > 0;
};
module.exports.User = User;
