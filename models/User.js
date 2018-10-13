const mongoose = require('mongoose');

const ObjectId = mongoose.Schema.Types.ObjectId;

const milestoneSchema = new mongoose.Schema({
  templateId: String,
  name: String,
  description: String,
  steps: [{
    name: String,
    description: String,
    in_progress: Boolean,
    complete: Boolean
  }]
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  phone: String,

  profile: {
    language: String,
    gender: String,
    age: Number,
    skills: [String]
  },
  mentors: [ObjectId],
  mentees: [ObjectId],
  milestones: [milestoneSchema]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
