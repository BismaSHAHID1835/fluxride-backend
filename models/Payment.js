// const mongoose = require("mongoose");

// const PaymentSchema = new mongoose.Schema(
//   {
//     bookingId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Booking",
//       required: true,
//     },

//     rideId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Ride",
//       required: true,
//     },

//     passengerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Passenger",
//       required: true,
//     },

//     driverId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Driver",
//       required: true,
//     },

//     seats: {
//       type: Number,
//       default: 1,
//     },

//     amount: {
//       type: Number,
//       required: true,
//     },

//     paymentMethod: {
//       type: String,
//       enum: ["Cash", "JazzCash", "EasyPaisa", "Bank"],
//       default: "Cash",
//     },

//     transactionId: {
//       type: String,
//       default: "",
//     },

//     status: {
//       type: String,
//       enum: ["Pending", "Paid"],
//       default: "Paid",
//     },

//     rideStatus: {
//       type: String,
//       enum: ["Upcoming", "Completed"],
//       default: "Upcoming",
//     },

//     paymentDate: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("Payment", PaymentSchema);

const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {

    // Booking reference
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },


    // Ride reference
    rideId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      required: true,
    },


    // Passenger who paid
    passengerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Passenger",
      required: true,
    },


    // Driver who receives payment
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },


    // Number of seats booked
    seats: {
      type: Number,
      default: 1,
    },


    // Payment amount
    amount: {
      type: Number,
      required: true,
    },


    // Payment method selected by passenger
    paymentMethod: {
      type: String,
      enum: [
        "Cash",
        "JazzCash",
        "EasyPaisa",
        "Bank"
      ],
      default: "Cash",
    },


    // Online payment transaction id
    transactionId: {
      type: String,
      default: "",
    },


    // Payment status
    status: {
      type: String,
      enum: [
        "Pending",
        "Paid"
      ],
      default: "Paid",
    },


    // Ride status for passenger history
    rideStatus: {
      type: String,
      enum: [
        "Upcoming",
        "Completed"
      ],
      default: "Upcoming",
    },


    // Payment created date
    paymentDate: {
      type: Date,
      default: Date.now,
    },


  },
  {
    timestamps: true,
  }
);


// Faster passenger trip search
PaymentSchema.index({
  passengerId: 1,
  status: 1,
});


// Faster driver earnings search
PaymentSchema.index({
  driverId: 1,
  status: 1,
});


module.exports = mongoose.model(
  "Payment",
  PaymentSchema
);