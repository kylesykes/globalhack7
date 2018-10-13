let stepOne = {
  name: "Step One",
  description: "The First Step",
  in_progress: true,
  complete: false
};

let stepTwo = {
  name: "Step Two",
  description: "The Second Step",
  in_progress: false,
  complete: false
};

let stepThree = {
  name: "Step Three",
  description: "The Third Step",
  in_progress: false,
  complete: false
};

const mileStoneObject = {
  templateId: "5",
  name: "Drivers License",
  description: "To the DMV and get a drivers license",
  steps: [stepOne, stepTwo, stepThree]
};

let userObject = {
  username: "farrellw",
  phone: "5632107275",
  mentors: [],
  mentees: [],
  milestones: [mileStoneObject],
  profile: {
    language: "Spanish",
    gender: "0",
    age: "35",
    skills: ["Carpentry", "Construction"]
  }
};

module.exports.mockUser = userObject;
