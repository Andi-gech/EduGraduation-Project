const { MealTimes } = require("../Model/MealTimes");

 const parseTime = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
 
 const isTimeInRange = (current, start, end) => {
    if (start <= end) {
      return current >= start && current < end;
    } else {
      return current >= start || current < end;
    }
  };

 const getCurrentTimeOfDay = async () => {
    try {
      const mealTimes = await MealTimes.findOne();
      if (!mealTimes) {
        throw new Error("Meal times not configured.");
      }
  
      const currentDate = new Date();
      const currentUTCMinutes = currentDate.getUTCHours() * 60 + currentDate.getUTCMinutes();
  
      const breakfastStart = parseTime(mealTimes.breakfastStart);
      const breakfastEnd = parseTime(mealTimes.breakfastEnd);
      const lunchStart = parseTime(mealTimes.lunchStart);
      const lunchEnd = parseTime(mealTimes.lunchEnd);
      const dinnerStart = parseTime(mealTimes.dinnerStart);
      const dinnerEnd = parseTime(mealTimes.dinnerEnd);
  
      if (isTimeInRange(currentUTCMinutes, breakfastStart, breakfastEnd)) {
        return "Breakfast";
      }
      if (isTimeInRange(currentUTCMinutes, lunchStart, lunchEnd)) {
        return "Lunch";
      }
      if (isTimeInRange(currentUTCMinutes, dinnerStart, dinnerEnd)) {
        return "Dinner";
      }
  
      return null;
    } catch (error) {
      console.error(error);
      throw new Error("Error retrieving meal times.");
    }
  };
  
module.exports = {
    getCurrentTimeOfDay,
    parseTime,
    isTimeInRange
  };