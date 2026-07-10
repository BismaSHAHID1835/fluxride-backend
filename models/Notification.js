
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Passenger",
      required: true,
    },

    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },

    // Booking reference
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },

    // Booking Details
    seats: {
      type: Number,
      default: 0,
    },

    bidAmount: {
      type: Number,
      default: 0,
    },

    totalPrice: {
      type: Number,
      default: 0,
    },

    title: {
      type: String,
      default: "",
    },

    message: {
      type: String,
      default: "",
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Notification",
  NotificationSchema
);