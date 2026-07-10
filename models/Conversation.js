
// const mongoose = require("mongoose");

// const MessageSchema = new mongoose.Schema(
//   {
//     senderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//     },

//     senderType: {
//       type: String,
//       enum: ["driver", "passenger"],
//       required: true,
//     },

//     receiverId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//     },

//     receiverType: {
//       type: String,
//       enum: ["driver", "passenger"],
//       required: true,
//     },

//     message: {
//       type: String,
//       required: true,
//     },

//     isRead: {
//       type: Boolean,
//       default: false,
//     },

//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },

// //     senderName: {
// //   type: String,
// //   required: true,
// // },

// // receiverName: {
// //   type: String,
// //   required: true,
// // },
// senderName: {
//   type: String,
//   default: "",
// },

// receiverName: {
//   type: String,
//   default: "",
// },
//   },
//   { _id: true }
  
// );

// const ConversationSchema = new mongoose.Schema(
//   {
//     passengerId: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "Passenger",
//   required: true,
// },

// passengerName: {
//   type: String,
//   required: true,
// },

//    driverId: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: "Driver",
//   required: true,
// },

// driverName: {
//   type: String,
//   required: true,
// },
// deletedForPassenger: {
//   type: Boolean,
//   default: false,
// },

// deletedForDriver: {
//   type: Boolean,
//   default: false,
// },

// deletedForEveryone: {
//   type: Boolean,
//   default: false,
// },

//     lastMessage: {
//       type: String,
//       default: "",
//     },

//     lastMessageTime: {
//       type: Date,
//     },

//     unreadDriver: {
//       type: Number,
//       default: 0,
//     },

//     unreadPassenger: {
//       type: Number,
//       default: 0,
//     },

//     messages: [MessageSchema],
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model(
//   "Conversation",
//   ConversationSchema
// );

const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    senderType: {
      type: String,
      enum: ["driver", "passenger"],
      required: true,
    },

    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    receiverType: {
      type: String,
      enum: ["driver", "passenger"],
      required: true,
    },

    senderName: {
      type: String,
      default: "",
    },

    receiverName: {
      type: String,
      default: "",
    },

    message: {
      type: String,
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    // Hide only for passenger
    deletedForPassenger: {
      type: Boolean,
      default: false,
    },

    // Hide only for driver
    deletedForDriver: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const ConversationSchema = new mongoose.Schema(
  {
    passengerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Passenger",
      required: true,
    },

    passengerName: {
      type: String,
      required: true,
    },

    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      required: true,
    },

    driverName: {
      type: String,
      required: true,
    },

    // Hide entire conversation only for passenger
    deletedForPassenger: {
      type: Boolean,
      default: false,
    },

    // Hide entire conversation only for driver
    deletedForDriver: {
      type: Boolean,
      default: false,
    },

    lastMessage: {
      type: String,
      default: "",
    },

    lastMessageTime: {
      type: Date,
      default: null,
    },

    unreadDriver: {
      type: Number,
      default: 0,
    },

    unreadPassenger: {
      type: Number,
      default: 0,
    },

    messages: {
      type: [MessageSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Conversation",
  ConversationSchema
);