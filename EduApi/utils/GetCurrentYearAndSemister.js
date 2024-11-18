const { SchoolYear } = require("../Model/SchoolYear");
const { Term } = require("../Model/Term");

const GetCurrentTerm = async () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentSchoolYear = await SchoolYear.findOne({
    StartDate: { $lte: new Date(currentYear, currentMonth, 1) },
    EndDate: { $gte: new Date(currentYear, currentMonth, 1) },
  });
  if (!currentSchoolYear) return null;
  const currentTerm = await Term.findOne({
    SchoolYear: currentSchoolYear._id,
    StartDate: { $lte: new Date(currentYear, currentMonth, 1) },
    EndDate: { $gte: new Date(currentYear, currentMonth, 1) },
  });
  return currentTerm;
};

module.exports = GetCurrentTerm;
