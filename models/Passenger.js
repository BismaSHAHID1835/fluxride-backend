const mongoose = require("mongoose");

const PassengerSchema = new mongoose.Schema({
  name: String,
  contact: String,
  email: String,
  profileImage: String,
  password: String,
});

module.exports = mongoose.model("Passenger", PassengerSchema);