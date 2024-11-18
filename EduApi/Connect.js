const mongoose = require("mongoose");

const connect = () => {
  return mongoose.connect(
    "mongodb+srv://andualem:1q2w3e4r5t@eduhub.son94.mongodb.net/?retryWrites=true&w=majority&appName=eduhub"
  );
};
module.exports = connect;
