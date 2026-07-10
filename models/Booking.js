// const mongoose = require("mongoose");

// const bookingSchema = new mongoose.Schema(
//   {
//     rideId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Ride",
//     },

//     driverId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Driver",
//     },

//     passengerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Passenger",
//     },

//     seats: Number,

//     totalPrice: Number,

//     status: {
//       type: String,
//       default: "pending", // pending, accepted, rejected
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Booking", bookingSchema);

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    rideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
    },

    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },

    passengerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Passenger",
      required: true,
    },

    // Number of seats requested
    seats: {
      type: Number,
      required: true,
      default: 1,
    },

    // Ride price according to driver's ride
    totalPrice: {
      type: Number,
      required: true,
    },

    // Passenger's offered price (Bid)
    bidAmount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);