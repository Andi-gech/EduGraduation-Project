const mongoose = require('mongoose');

const MealTimesSchema = new mongoose.Schema({
  breakfastStart: {
    type: String,
    required: true,
    match: /^([0-1]\d|2[0-3]):([0-5]\d)$/, 
  },
  breakfastEnd: {
    type: String,
    required: true,
    match: /^([0-1]\d|2[0-3]):([0-5]\d)$/,
  },
  lunchStart: {
    type: String,
    required: true,
    match: /^([0-1]\d|2[0-3]):([0-5]\d)$/,
  },
  lunchEnd: {
    type: String,
    required: true,
    match: /^([0-1]\d|2[0-3]):([0-5]\d)$/,
  },
  dinnerStart: {
    type: String,
    required: true,
    match: /^([0-1]\d|2[0-3]):([0-5]\d)$/,
  },
  dinnerEnd: {
    type: String,
    required: true,
    match: /^([0-1]\d|2[0-3]):([0-5]\d)$/,
  },
});

const MealTimes = mongoose.model('MealTimes', MealTimesSchema);
module.exports = { MealTimes };
