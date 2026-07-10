const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,

  cnic: String,
  license: String,

  carName: String,
  carModel: String,
  plate: String,

  profileImage: String,
  cnicImage: String,
  carImage: String,

  paymentDetails: {
  jazzCashNumber: {
    type: String,
    default: "",
  },
  easyPaisaNumber: {
    type: String,
    default: "",
  },
  bankAccount: {
    type: String,
    default: "",
  },
},
totalEarnings: {
  type: Number,
  default: 0,
},
});

module.exports = mongoose.model("Driver", driverSchema);