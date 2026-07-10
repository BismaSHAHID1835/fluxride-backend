// const mongoose = require("mongoose");

// const rideSchema = new mongoose.Schema(
//   {
//     driverId: String,
//     driverName: String,
//     driverImage: String,

//     from: String,
//     to: String,

//     date: String,
//     time: String,

//     price: String,
//     seats: String,

//     latitude: Number,
//     longitude: Number,
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Ride", rideSchema);
const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema(
  {
    driverId: String,
    driverName: String,
    driverImage: String,

    from: String,
    to: String,

    date: String,
    time: String,

    price: {
      type: Number,
      required: true,
    },

    seats: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Available", "Full", "Completed"],
      default: "Available",
    },

    latitude: Number,
    longitude: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ride", rideSchema);