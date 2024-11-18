const { Class } = require("../Model/Class");
const { User } = require("../Model/User");
const GetCurrentTerm = require("./GetCurrentYearAndSemister");

const PromoteUser = async (user) => {
  const yearlevels = ["1", "2", "3", "4", "5"];
  const currentClass = Class.findById(user.Class);
  const department = currentClass.Department;
  const currentLevel = yearlevels.indexOf(currentClass.Level);
  const currentTerm = GetCurrentTerm();

  const NextClass = await Class.findOne({
    Department: department,
    Level: yearlevels[currentLevel + 1],
    Term: currentTerm._id,
  });

  if (NextClass) {
    user.Class = NextClass._id;
    await user.save();
  } else {
    console.log("User has graduated");
  }
};

module.exports = PromoteUser;
