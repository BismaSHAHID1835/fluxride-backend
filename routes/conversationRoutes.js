// // const express = require("express");
// // const router = express.Router();

// // const Conversation = require("../models/Conversation");
// // const Message = require("../models/Message");

// // // =========================================
// // // Create Conversation
// // router.post("/conversations", async (req, res) => {
// //   try {
// //     const {
// //       passengerId,
// //       driverId,
// //     } = req.body;

// //     let conversation = await Conversation.findOne({
// //       passengerId,
// //       driverId,
// //     });

// //     if (conversation) {
// //       return res.json({
// //         success: true,
// //         conversation,
// //       });
// //     }

// //     conversation = await Conversation.create({
// //       passengerId,
// //       driverId,
// //     });

// //     res.json({
// //       success: true,
// //       conversation,
// //     });

// //   } catch (err) {
// //     console.log(err);

// //     res.status(500).json({
// //       success: false,
// //       message: "Server Error",
// //     });
// //   }
// // });
// // // Passenger Conversation List
// // router.get("/passenger-conversations/:passengerId",
// //   async (req, res) => {

// //     try {

// //       const conversations =
// //         await Conversation.find({
// //           passengerId: req.params.passengerId,
// //         })
// //           .populate("driverId")
// //           .sort({ updatedAt: -1 });

// //       res.json({
// //         success: true,
// //         conversations,
// //       });

// //     } catch (err) {

// //       console.log(err);

// //       res.status(500).json({
// //         success: false,
// //       });

// //     }

// //   }
// // );
// // // driver Conversation List
// // router.get("/driver-conversations/:driverId",
// //   async (req, res) => {

// //     try {

// //       const conversations =
// //         await Conversation.find({
// //           driverId: req.params.driverId,
// //         })
// //           .populate("passengerId")
// //           .sort({ updatedAt: -1 });

// //       res.json({
// //         success: true,
// //         conversations,
// //       });

// //     } catch (err) {

// //       console.log(err);

// //       res.status(500).json({
// //         success: false,
// //       });

// //     }

// //   }
// // );
// // //send message
// // router.post("/messages", async (req, res) => {
// //   try {
// //     const {
// //       conversationId,
// //       senderId,
// //       senderType,
// //       receiverId,
// //       receiverType,
// //       message,
// //     } = req.body;

// //     const newMessage = await Message.create({
// //       conversationId,
// //       senderId,
// //       senderType,
// //       receiverId,
// //       receiverType,
// //       message,
// //     });

// //     const updateData = {
// //       lastMessage: message,
// //       lastMessageTime: new Date(),
// //     };

// //     if (receiverType === "driver") {
// //       updateData.$inc = {
// //         unreadDriver: 1,
// //       };
// //     } else {
// //       updateData.$inc = {
// //         unreadPassenger: 1,
// //       };
// //     }

// //     await Conversation.findByIdAndUpdate(
// //       conversationId,
// //       updateData
// //     );

// //     res.json({
// //       success: true,
// //       message: newMessage,
// //     });
// //   } catch (err) {
// //     console.log(err);

// //     res.status(500).json({
// //       success: false,
// //       message: "Server Error",
// //     });
// //   }
// // });
// // //get message
// // router.get("/messages/:conversationId", async (req, res) => {
// //   try {
// //     const messages = await Message.find({
// //       conversationId: req.params.conversationId,
// //     }).sort({
// //       createdAt: 1,
// //     });

// //     res.json({
// //       success: true,
// //       messages,
// //     });
// //   } catch (err) {
// //     console.log(err);

// //     res.status(500).json({
// //       success: false,
// //     });
// //   }
// // });
// // //mark conversation read
// // router.put("/conversations/read", async (req, res) => {
// //   try {
// //     const {
// //       conversationId,
// //       userType,
// //     } = req.body;

// //     if (userType === "driver") {
// //       await Conversation.findByIdAndUpdate(
// //         conversationId,
// //         {
// //           unreadDriver: 0,
// //         }
// //       );
// //     } else {
// //       await Conversation.findByIdAndUpdate(
// //         conversationId,
// //         {
// //           unreadPassenger: 0,
// //         }
// //       );
// //     }

// //     res.json({
// //       success: true,
// //     });
// //   } catch (err) {
// //     console.log(err);

// //     res.status(500).json({
// //       success: false,
// //     });
// //   }
// // });
// // //. Delete Conversation
// // router.delete("/conversations/:conversationId", async (req, res) => {
// //   try {
// //     await Message.deleteMany({
// //       conversationId: req.params.conversationId,
// //     });

// //     await Conversation.findByIdAndDelete(
// //       req.params.conversationId
// //     );

// //     res.json({
// //       success: true,
// //       message: "Conversation deleted",
// //     });
// //   } catch (err) {
// //     console.log(err);

// //     res.status(500).json({
// //       success: false,
// //     });
// //   }
// // });

// const express = require("express");
// const router = express.Router();
// const Driver = require("../models/Driver");
// const Passenger = require("../models/Passenger");

// const Conversation = require("../models/Conversation");

// // =========================================
// // Create Conversation
// router.post("/conversations", async (req, res) => {
//   try {
//     const {
//       passengerId,
//       driverId,
//     } = req.body;

//     let conversation = await Conversation.findOne({
//       passengerId,
//       driverId,
//     });

//     if (conversation) {
//       return res.json({
//         success: true,
//         conversation,
//       });
//     }

//     const passenger = await Passenger.findById(passengerId);
// const driver = await Driver.findById(driverId);

//     conversation = await Conversation.create({
//   passengerId,
//   passengerName: passenger.name,

//   driverId,
//   driverName: driver.name,
// });

//     res.json({
//       success: true,
//       conversation,
//     });

//   } catch (err) {
//     console.log(err);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// });
// // Passenger Conversation List
// router.get("/passenger-conversations/:passengerId",
//   async (req, res) => {

//     try {

//       const conversations =
//         await Conversation.find({
//           passengerId: req.params.passengerId,
//         })
//           .populate("driverId")
//           .sort({ updatedAt: -1 });

//       res.json({
//         success: true,
//         conversations,
//       });

//     } catch (err) {

//       console.log(err);

//       res.status(500).json({
//         success: false,
//       });

//     }

//   }
// );
// // driver Conversation List
// router.get("/driver-conversations/:driverId",
//   async (req, res) => {

//     try {

//       const conversations =
//         await Conversation.find({
//           driverId: req.params.driverId,
//         })
//           .populate("passengerId")
//           .sort({ updatedAt: -1 });

//       res.json({
//         success: true,
//         conversations,
//       });

//     } catch (err) {

//       console.log(err);

//       res.status(500).json({
//         success: false,
//       });

//     }

//   }
// );
// //send message
// router.post("/messages", async (req, res) => {
//   try {
//     const {
//       conversationId,
//       senderId,
//       senderType,
//       receiverId,
//       receiverType,
//       message,
//     } = req.body;

//     const msg = {
//       senderId,
//       senderType,
//       receiverId,
//       receiverType,
//       message,
//       isRead: false,
//       createdAt: new Date(),
//     };

//     const updateData = {
//       $push: {
//         messages: msg,
//       },

//       $set: {
//         lastMessage: message,
//         lastMessageTime: new Date(),
//       },
//     };

//     if (receiverType === "driver") {
//       updateData.$inc = {
//         unreadDriver: 1,
//       };
//     } else {
//       updateData.$inc = {
//         unreadPassenger: 1,
//       };
//     }

//     const conversation =
//       await Conversation.findByIdAndUpdate(
//         conversationId,
//         updateData,
//         { new: true }
//       );

//     res.json({
//       success: true,
//       conversation,
//     });
//   } catch (err) {
//     console.log(err);

//     res.status(500).json({
//       success: false,
//     });
//   }
// });
// //get message
// router.get("/messages/:conversationId", async (req, res) => {
//   try {
//     const conversation =
//       await Conversation.findById(
//         req.params.conversationId
//       );

//     res.json({
//       success: true,
//       messages: conversation.messages,
//     });
//   } catch (err) {
//     console.log(err);

//     res.status(500).json({
//       success: false,
//     });
//   }
// });
// //mark conversation read
// router.put("/conversations/read", async (req, res) => {
//   try {
//     const {
//       conversationId,
//       userType,
//     } = req.body;

//     if (userType === "driver") {
//       await Conversation.findByIdAndUpdate(
//         conversationId,
//         {
//           unreadDriver: 0,
//         }
//       );
//     } else {
//       await Conversation.findByIdAndUpdate(
//         conversationId,
//         {
//           unreadPassenger: 0,
//         }
//       );
//     }

//     res.json({
//       success: true,
//     });
//   } catch (err) {
//     console.log(err);

//     res.status(500).json({
//       success: false,
//     });
//   }
// });
// //Delete Conversation
// router.delete("/messages/:conversationId/:messageId", async (req, res) => {
//   try {
//     const { conversationId, messageId } = req.params;

//     const conversation = await Conversation.findById(conversationId);

//     if (!conversation) {
//       return res.status(404).json({
//         success: false,
//         message: "Conversation not found",
//       });
//     }

//     conversation.messages = conversation.messages.filter(
//       (msg) => msg._id.toString() !== messageId
//     );

//     if (conversation.messages.length > 0) {
//       const last =
//         conversation.messages[
//           conversation.messages.length - 1
//         ];

//       conversation.lastMessage = last.message;
//       conversation.lastMessageTime = last.createdAt;
//     } else {
//       conversation.lastMessage = "";
//       conversation.lastMessageTime = null;
//     }

//     await conversation.save();

//     res.json({
//       success: true,
//       message: "Message deleted",
//     });
//   } catch (err) {
//     console.log(err);

//     res.status(500).json({
//       success: false,
//       message: "Server Error",
//     });
//   }
// });
// //delete entire chat
// router.delete("/conversations/:conversationId", async (req, res) => {
//   try {
//     await Conversation.findByIdAndDelete(
//       req.params.conversationId
//     );

//     res.json({
//       success: true,
//       message: "Conversation deleted",
//     });
//   } catch (err) {
//     console.log(err);

//     res.status(500).json({
//       success: false,
//     });
//   }
// });


const express = require("express");
const router = express.Router();

const Driver = require("../models/Driver");
const Passenger = require("../models/Passenger");
const Conversation = require("../models/Conversation");

// =========================================
// Create Conversation
// =========================================
router.post("/conversations", async (req, res) => {
  try {
    const { passengerId, driverId } = req.body;

    let conversation = await Conversation.findOne({
      passengerId,
      driverId,
    });

    // Conversation already exists
    if (conversation) {
      // Restore if either side previously deleted it
      conversation.deletedForPassenger = false;
      conversation.deletedForDriver = false;

      await conversation.save();

      return res.json({
        success: true,
        conversation,
      });
    }

    const passenger = await Passenger.findById(passengerId);
    const driver = await Driver.findById(driverId);

    if (!passenger || !driver) {
      return res.status(404).json({
        success: false,
        message: "Passenger or Driver not found",
      });
    }

    conversation = await Conversation.create({
      passengerId,
      passengerName: passenger.name,

      driverId,
      driverName: driver.name,

      lastMessage: "",
      lastMessageTime: null,

      unreadDriver: 0,
      unreadPassenger: 0,

      deletedForPassenger: false,
      deletedForDriver: false,

      messages: [],
    });

    res.json({
      success: true,
      conversation,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});

// =========================================
// Passenger Conversation List
// =========================================
router.get("/passenger-conversations/:passengerId",
  async (req, res) => {
    try {

      const conversations = await Conversation.find({
        passengerId: req.params.passengerId,
        deletedForPassenger: false,
      })
        .populate("driverId")
        .sort({
          updatedAt: -1,
        });

      res.json({
        success: true,
        conversations,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false,
      });

    }
  }
);

// =========================================
// Driver Conversation List
// =========================================
router.get("/driver-conversations/:driverId",
  async (req, res) => {
    try {

      const conversations = await Conversation.find({
        driverId: req.params.driverId,
        deletedForDriver: false,
      })
        .populate("passengerId")
        .sort({
          updatedAt: -1,
        });

      res.json({
        success: true,
        conversations,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        success: false,
      });

    }
  }
);
// =========================================
// Send Message
// =========================================
router.post("/messages", async (req, res) => {
  try {
    const {
      conversationId,
      senderId,
      senderType,
      receiverId,
      receiverType,
      senderName = "",
      receiverName = "",
      message,
    } = req.body;

    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const msg = {
      senderId,
      senderType,
      receiverId,
      receiverType,
      senderName,
      receiverName,
      message,
      isRead: false,
      deletedForPassenger: false,
      deletedForDriver: false,
      createdAt: new Date(),
    };

    conversation.messages.push(msg);

    conversation.lastMessage = message;
    conversation.lastMessageTime = new Date();

    // Restore conversation if either user deleted it
    conversation.deletedForPassenger = false;
    conversation.deletedForDriver = false;

    if (receiverType === "driver") {
      conversation.unreadDriver += 1;
    } else {
      conversation.unreadPassenger += 1;
    }

    await conversation.save();

    res.json({
      success: true,
      conversation,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


// =========================================
// Get Messages
// =========================================
router.get("/messages/:conversationId", async (req, res) => {
  try {
    const { userType } = req.query;

    if (!userType) {
      return res.status(400).json({
        success: false,
        message: "userType is required",
      });
    }

    const conversation = await Conversation.findById(
      req.params.conversationId
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    let messages = conversation.messages;

    if (userType === "driver") {
      messages = messages.filter(
        (msg) => !msg.deletedForDriver
      );
    } else {
      messages = messages.filter(
        (msg) => !msg.deletedForPassenger
      );
    }

    res.json({
      success: true,
      messages,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


// =========================================
// Mark Conversation Read
// =========================================
router.put("/conversations/read", async (req, res) => {
  try {
    const { conversationId, userType } = req.body;

    const conversation = await Conversation.findById(
      conversationId
    );

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    if (userType === "driver") {
      conversation.unreadDriver = 0;
    } else {
      conversation.unreadPassenger = 0;
    }

    await conversation.save();

    res.json({
      success: true,
      message: "Conversation marked as read",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}); 
// =========================================
// Delete Message For Me
// =========================================
router.put("/messages/:conversationId/:messageId/delete-for-me",
  async (req, res) => {
    try {
      const { conversationId, messageId } = req.params;
      const { userType } = req.body;

      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      const msg = conversation.messages.id(messageId);

      if (!msg) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      if (userType === "driver") {
        msg.deletedForDriver = true;
      } else {
        msg.deletedForPassenger = true;
      }

      await conversation.save();

      res.json({
        success: true,
        message: "Message deleted for me",
      });

    } catch (err) {
      console.log(err);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

// =========================================
// Delete Message For Everyone
// (Only Sender Can Delete)
// =========================================
router.delete("/messages/:conversationId/:messageId/everyone",
  async (req, res) => {
    try {
      const { conversationId, messageId } = req.params;
      const { senderId } = req.body;

      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      const msg = conversation.messages.id(messageId);

      if (!msg) {
        return res.status(404).json({
          success: false,
          message: "Message not found",
        });
      }

      // Only sender can delete for everyone
      if (msg.senderId.toString() !== senderId) {
        return res.status(403).json({
          success: false,
          message: "You can delete only your own message.",
        });
      }

      conversation.messages.pull(messageId);

      // Update last message
      if (conversation.messages.length > 0) {
        const last =
          conversation.messages[
            conversation.messages.length - 1
          ];

        conversation.lastMessage = last.message;
        conversation.lastMessageTime = last.createdAt;
      } else {
        conversation.lastMessage = "";
        conversation.lastMessageTime = null;
      }

      await conversation.save();

      res.json({
        success: true,
        message: "Message deleted for everyone",
      });

    } catch (err) {
      console.log(err);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

// =========================================
// Delete Conversation For Me
// =========================================
router.put("/conversations/:conversationId/delete-for-me",
  async (req, res) => {
    try {
      const { conversationId } = req.params;
      const { userType } = req.body;

      const conversation = await Conversation.findById(conversationId);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      if (userType === "driver") {
        conversation.deletedForDriver = true;
      } else {
        conversation.deletedForPassenger = true;
      }

      await conversation.save();

      res.json({
        success: true,
        message: "Conversation deleted for me",
      });

    } catch (err) {
      console.log(err);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

// =========================================
// Delete Conversation For Everyone
// (Optional - Admin Only)
// =========================================
router.delete("/conversations/:conversationId/everyone",
  async (req, res) => {
    try {
      const conversation = await Conversation.findById(
        req.params.conversationId
      );

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }

      await Conversation.findByIdAndDelete(
        req.params.conversationId
      );

      res.json({
        success: true,
        message: "Conversation deleted for everyone",
      });

    } catch (err) {
      console.log(err);

      res.status(500).json({
        success: false,
        message: "Server Error",
      });
    }
  }
);

module.exports = router;