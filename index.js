require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Driver = require("./models/Driver");
const Passenger = require("./models/Passenger");
const Payment = require("./models/Payment");
const Message = require("./models/Message");
const Conversation = require("./models/Conversation");
const Ride = require("./models/Ride");
const Booking = require("./models/Booking");
const Notification = require("./models/Notification");
const conversationRoutes = require("./routes/conversationRoutes");
const connectDB = require("./config"); // ✅ DB from config.js
const app = express();
//======================================
//socket
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
//==================================
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
// Register routes 
app.use("/api", conversationRoutes);
connectDB();

//socket io
const onlineDrivers = {};
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("driverOnline", (driverId) => {
    onlineDrivers[driverId] = socket.id;
    console.log("Driver Online:", driverId);
  });

  socket.on("disconnect", () => {
    for (const driverId in onlineDrivers) {
      if (onlineDrivers[driverId] === socket.id) {
        delete onlineDrivers[driverId];
      }
    }
  });
});

// 📦 Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.post("/api/driver-signup",upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "cnicImage", maxCount: 1 },
    { name: "carImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        password,
        cnic,
        license,
        carName,
        carModel,
        plate,

        // ✅ PAYMENT FIELDS ADDED
        jazzCashNumber,
        easyPaisaNumber,
        bankAccount,
      } = req.body;

      const newDriver = new Driver({
        name,
        email,
        phone,
        password,
        cnic,
        license,
        carName,
        carModel,
        plate,

        // images
        profileImage: req.files?.profileImage?.[0]?.path || "",
        cnicImage: req.files?.cnicImage?.[0]?.path || "",
        carImage: req.files?.carImage?.[0]?.path || "",

        // ✅ PAYMENT DETAILS ADDED
        paymentDetails: {
          jazzCashNumber: jazzCashNumber || "",
          easyPaisaNumber: easyPaisaNumber || "",
          bankAccount: bankAccount || "",
        },
      });

      await newDriver.save();

      res.json({
        success: true,
        message: "Driver registered successfully 🚗",
        data: newDriver,
      });
    } catch (error) {
      console.log("ERROR:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

app.get("/api/driver/:id", async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.json({
        success: false,
        message: "Driver not found",
      });
    }

    res.json({
      success: true,
      driver,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.put("/api/driver/:id",upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "cnicImage", maxCount: 1 },
    { name: "carImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const driverId = req.params.id;

      const driver = await Driver.findById(driverId);

      if (!driver) {
        return res.json({
          success: false,
          message: "Driver not found",
        });
      }

      // update text fields
      const {
        name,
        email,
        phone,
        cnic,
        license,
        carName,
        carModel,
        plate,
        password,

        // ✅ PAYMENT FIELDS ADDED
        jazzCashNumber,
        easyPaisaNumber,
        bankAccount,
      } = req.body;

      driver.name = name || driver.name;
      driver.email = email || driver.email;
      driver.phone = phone || driver.phone;
      driver.cnic = cnic || driver.cnic;
      driver.license = license || driver.license;
      driver.carName = carName || driver.carName;
      driver.carModel = carModel || driver.carModel;
      driver.plate = plate || driver.plate;
      driver.password = password || driver.password;

      // update images if new uploaded
      if (req.files?.profileImage?.[0]) {
        driver.profileImage = req.files.profileImage[0].path;
      }

      if (req.files?.cnicImage?.[0]) {
        driver.cnicImage = req.files.cnicImage[0].path;
      }

      if (req.files?.carImage?.[0]) {
        driver.carImage = req.files.carImage[0].path;
      }

      // ✅ PAYMENT UPDATE LOGIC ADDED
      driver.paymentDetails = {
        jazzCashNumber: jazzCashNumber || driver.paymentDetails?.jazzCashNumber,
        easyPaisaNumber: easyPaisaNumber || driver.paymentDetails?.easyPaisaNumber,
        bankAccount: bankAccount || driver.paymentDetails?.bankAccount,
      };

      await driver.save();

      res.json({
        success: true,
        message: "Driver profile updated successfully 🚗",
        driver,
      });
    } catch (error) {
      console.log("UPDATE DRIVER ERROR:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);
app.delete("/api/drivers/:id", async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);

    if (!driver) {
      return res.json({
        success: false,
        message: "Driver not found",
      });
    }

    res.json({
      success: true,
      message: "Driver account deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
// passenger signup
app.post(
  "/api/passenger-signup",
  upload.fields([{ name: "profileImage", maxCount: 1 }]),
  async (req, res) => {
    try {
      const { name, email, contact ,password  } = req.body;

      const newPassenger = new Passenger({
        name,
        email,
        contact,
        password, 
        // ✅ SAME AS DRIVER (BEST WAY)
        profileImage: req.files?.profileImage?.[0]?.path || "",
      });

      await newPassenger.save();

      res.json({
        success: true,
        message: "Passenger registered successfully 🚗",
        data: newPassenger,
      });

    } catch (error) {
      console.log("ERROR:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);
// GET PASSENGER BY ID
app.get("/api/passenger/:id", async (req, res) => {
  try {
    const passenger = await Passenger.findById(req.params.id);

    if (!passenger) {
      return res.json({
        success: false,
        message: "Passenger not found",
      });
    }

    res.json({
      success: true,
      passenger,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
// UPDATE PASSENGER PROFILE
app.put("/api/passengers/:id",upload.fields([{ name: "profileImage", maxCount: 1 }]),
  async (req, res) => {
    try {
      const { name, email, contact } = req.body;

      const passenger = await Passenger.findById(req.params.id);

      if (!passenger) {
        return res.json({
          success: false,
          message: "Passenger not found",
        });
      }

      passenger.name = name;
      passenger.email = email;
      passenger.contact = contact;

      if (req.files?.profileImage?.[0]) {
        passenger.profileImage = req.files.profileImage[0].path;
      }

      await passenger.save();

      res.json({
        success: true,
        message: "Profile updated successfully",
        passenger,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);
// DELETE PASSENGER ACCOUNT
app.delete("/api/passengers/:id", async (req, res) => {
  try {
    const passenger = await Passenger.findByIdAndDelete(req.params.id);

    if (!passenger) {
      return res.json({
        success: false,
        message: "Passenger not found",
      });
    }

    res.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
// login 
app.post("/api/login", async (req, res) => {
  try {
    const { emailOrPhone, password, role } = req.body;

    // 🚗 DRIVER ONLY
    if (role === "driver") {
      const driver = await Driver.findOne({
        $or: [
          { email: emailOrPhone },
          { phone: emailOrPhone }
        ],
      });

      if (!driver) {
        return res.json({
          success: false,
          message: "Driver not found",
        });
      }

      if (driver.password !== password) {
        return res.json({
          success: false,
          message: "Incorrect password",
        });
      }

      return res.json({
        success: true,
        role: "driver",
        user: driver,
      });
    }

    // 👤 PASSENGER ONLY
    if (role === "passenger") {
      const passenger = await Passenger.findOne({
        $or: [
          { email: emailOrPhone },
          { contact: emailOrPhone }
        ],
      });

      if (!passenger) {
        return res.json({
          success: false,
          message: "Passenger not found",
        });
      }

      if (passenger.password !== password) {
        return res.json({
          success: false,
          message: "Incorrect password",
        });
      }

      return res.json({
        success: true,
        role: "passenger",
        user: passenger,
      });
    }

    return res.json({
      success: false,
      message: "Invalid role selected",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
// create rides post
app.post("/api/create-ride", async (req, res) => {
  try {
    const ride = new Ride(req.body);

    await ride.save();

    res.json({
      success: true,
      message: "Ride Created",
      ride,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
// get rides
app.get("/api/rides", async (req, res) => {
  try {
    const rides = await Ride.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      rides,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
//Book Ride API
app.post("/api/book-ride", async (req, res) => {
  try {
    const {
      rideId,
      driverId,
      passengerId,
      seats,
      totalPrice,
      bidAmount,
    } = req.body;

    const booking = new Booking({
      rideId,
      driverId,
      passengerId,
      seats,
      totalPrice,
      bidAmount,
      status: "pending",
    });

    await booking.save();
const socketId = onlineDrivers[driverId];

if (socketId) {
  io.to(socketId).emit("newBooking", {
    booking,
    message: "New booking request received",
  });
}
    res.json({
      success: true,
      message: "Booking request sent successfully",
      booking,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
//Driver Booking Requests
app.get("/api/driver-bookings/:driverId", async (req, res) => {
  try {
    const bookings = await Booking.find({
      driverId: req.params.driverId,
    })
      .populate("passengerId")
      .populate("rideId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
//Driver Accept Booking
app.put("/api/accept-booking/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: "accepted",
      },
      {
        returnDocument: "after",
      }
    );

    if (!booking) {
      return res.json({
        success: false,
        message: "Booking not found",
      });
    }

    // Create Notification
    await Notification.create({
      userId: booking.passengerId,
      driverId: booking.driverId,

      // Booking Details
      bookingId: booking._id,
      seats: booking.seats,
      bidAmount: booking.bidAmount,
      totalPrice: booking.totalPrice,

      title: "Ride Accepted",
      message:
        "✅ Your booking request has been accepted by the driver.",
    });

    res.json({
      success: true,
      message: "Booking accepted successfully",
      booking,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
//Driver Reject Booking
app.delete("/api/reject-booking/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.json({
        success: false,
        message: "Booking not found",
      });
    }

    // Send chat message
    const message = new Message({
      senderId: booking.driverId,
      receiverId: booking.passengerId,
      senderRole: "driver",
      text: "❌ Your booking request has been rejected by the driver.",
    });

    await message.save();

    // Create Notification
    await Notification.create({
      userId: booking.passengerId,
      driverId: booking.driverId,

      // Booking Details
      bookingId: booking._id,
      seats: booking.seats,
      bidAmount: booking.bidAmount,
      totalPrice: booking.totalPrice,

      title: "Ride Rejected",
      message:
        "❌ Sorry! Your booking request has been rejected by the driver.",
    });

    // Delete booking
  booking.status = "rejected";
await booking.save();

    res.json({
      success: true,
      message: "Booking rejected and deleted.",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
//Passenger should be able to check the status of their requests.
app.get("/api/passenger-bookings/:passengerId", async (req, res) => {
  try {
    const bookings = await Booking.find({
      passengerId: req.params.passengerId,
    })
      .populate("rideId")
      .populate("driverId")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
// Get rides created by a specific driver
app.get("/api/my-rides/:driverId", async (req, res) => {
  try {
    const rides = await Ride.find({
      driverId: req.params.driverId,
    }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      rides,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
// Update Ride
app.put("/api/update-ride/:id", async (req, res) => {
  try {
    const updatedRide = await Ride.findByIdAndUpdate(
      req.params.id,
      {
        from: req.body.from,
        to: req.body.to,
        date: req.body.date,
        time: req.body.time,
        price: req.body.price,
        seats: req.body.seats,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
      },
      {
        new: true,
      }
    );

    if (!updatedRide) {
      return res.json({
        success: false,
        message: "Ride not found",
      });
    }

    res.json({
      success: true,
      message: "Ride updated successfully",
      ride: updatedRide,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
// Delete Ride
app.delete("/api/delete-ride/:id", async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.json({
        success: false,
        message: "Ride not found",
      });
    }

    // Delete all bookings related to this ride
    await Booking.deleteMany({
      rideId: ride._id,
    });

    // Delete the ride
    await Ride.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Ride deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
// Get Passenger Notifications
app.get("/api/notifications/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.userId,
    })
      .populate(
        "driverId",
        "name phone profileImage carName carModel plate"
      )
      .populate({
        path: "bookingId",
        populate: {
          path: "rideId",
          select: "from to date time",
        },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      notifications,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
////get notification
app.get("/api/notifications/unread/:userId", async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.params.userId,
      read: false,
    });

    res.json({
      success: true,
      count,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
//bage minus
app.put("/api/notifications/read/:userId", async (req, res) => {
  try {
    await Notification.updateMany(
      {
        userId: req.params.userId,
        read: false,
      },
      {
        $set: {
          read: true,
        },
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
//delete notification
app.delete("/api/notifications/:id", async (req, res) => {
  try {
    console.log("DELETE HIT ID:", req.params.id); // 🔥 DEBUG

    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    await Notification.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (err) {
    console.log("DELETE ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
// 💳 UPDATE DRIVER PAYMENT DETAILS
app.put("/api/driver-payment/:id", async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.json({
        success: false,
        message: "Driver not found",
      });
    }

    const { jazzCashNumber, easyPaisaNumber, bankAccount } = req.body;

    driver.paymentDetails = {
      jazzCashNumber: jazzCashNumber || driver.paymentDetails?.jazzCashNumber,
      easyPaisaNumber: easyPaisaNumber || driver.paymentDetails?.easyPaisaNumber,
      bankAccount: bankAccount || driver.paymentDetails?.bankAccount,
    };

    await driver.save();

    res.json({
      success: true,
      message: "Payment details updated successfully",
      paymentDetails: driver.paymentDetails,
    });
  } catch (error) {
    console.log("PAYMENT UPDATE ERROR:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
//fetch
app.get("/api/driver-payment/:id", async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.json({
        success: false,
        message: "Driver not found",
      });
    }

    res.json({
      success: true,
      paymentDetails: driver.paymentDetails,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
// ================= DRIVER EARNINGS =================
app.post("/api/payment/confirm", async (req, res) => {
  try {
    const {
      bookingId,
      passengerId,
      driverId,
      rideId,
      seats,
      amount,
      paymentMethod,
      transactionId,
    } = req.body;

    // ============================
    // CHECK BOOKING
    // ============================
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.json({
        success: false,
        message: "Booking not found",
      });
    }

    // ============================
    // PREVENT DUPLICATE PAYMENT
    // ============================
    const alreadyPaid = await Payment.findOne({ bookingId });

    if (alreadyPaid) {
      return res.json({
        success: false,
        message: "Payment already completed.",
      });
    }

    // ============================
    // FIND RIDE
    // ============================
    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.json({
        success: false,
        message: "Ride not found",
      });
    }

    const availableSeats = Number(ride.seats);
    const bookedSeats = Number(seats);

    // Check available seats
    if (availableSeats < bookedSeats) {
      return res.json({
        success: false,
        message: `Only ${availableSeats} seat(s) available.`,
      });
    }

    // ============================
    // CREATE PAYMENT
    // ============================
    const payment = await Payment.create({
      bookingId,
      passengerId,
      driverId,
      rideId,
      seats: bookedSeats,
      amount: Number(amount),
      paymentMethod,
      transactionId,
      status: "Paid",
      rideStatus: "Upcoming",
    });

    // ============================
    // UPDATE BOOKING
    // ============================
    booking.paymentStatus = "Paid";
    booking.paymentMethod = paymentMethod;
    booking.transactionId = transactionId;
    booking.paymentId = payment._id;

    await booking.save();

    // ============================
    // UPDATE RIDE SEATS
    // ============================
    ride.seats = availableSeats - bookedSeats;

    if (ride.seats <= 0) {
      ride.seats = 0;
      ride.status = "Full";
    } else {
      ride.status = "Available";
    }

    await ride.save();

    // ============================
    // UPDATE DRIVER EARNINGS
    // ============================
    const driver = await Driver.findById(driverId);

    if (driver) {
      driver.totalEarnings =
        Number(driver.totalEarnings || 0) + Number(amount);

      await driver.save();
    }

    // ============================
    // GET PASSENGER
    // ============================
    const passenger = await Passenger.findById(passengerId);

    // ============================
    // CREATE NOTIFICATION
    // ============================
    await Notification.create({
      userId: driverId,
      driverId,
      bookingId,

      title: "Payment Received",

      message:
        `👤 Passenger: ${passenger?.name || "Unknown"}\n` +
        `📞 Phone: ${passenger?.contact || "N/A"}\n\n` +
        `📍 Ride: ${ride.from} → ${ride.to}\n` +
        `🪑 Seats Booked: ${bookedSeats}\n` +
        `🚘 Remaining Seats: ${ride.seats}\n` +
        `💰 Amount: Rs ${amount}\n` +
        `💳 Payment: ${paymentMethod}\n` +
        `🆔 Transaction: ${transactionId || "N/A"}`,

      read: false,
    });

    // ============================
    // SUCCESS
    // ============================
    res.json({
      success: true,
      message: "Payment Successful",
      payment,
      remainingSeats: ride.seats,
      rideStatus: ride.status,
    });

  } catch (error) {
    console.log("PAYMENT ERROR:", error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.get("/api/driver-earnings/:driverId", async (req, res) => {
  try {
    const { driverId } = req.params;

    const payments = await Payment.find({
      driverId,
      status: "Paid",
    })
      .populate("bookingId")
      .populate("rideId")
      .populate("passengerId", "name phone")
      .sort({ createdAt: -1 });

    const totalEarnings = payments.reduce(
      (sum, item) => sum + Number(item.amount),
      0
    );

    res.json({
      success: true,
      totalEarnings,
      totalTrips: payments.length,
      payments,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
//read notification 
app.put("/api/notifications/read/:userId", async (req, res) => {
  try {
    await Notification.updateMany(
      {
        userId: req.params.userId,
        read: false,
      },
      {
        $set: {
          read: true,
        },
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
// Delete Driver Notification
app.delete("/api/notifications/:id", async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    await Notification.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (err) {
    console.log("DELETE NOTIFICATION ERROR:", err);

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});
//dashboard
app.get("/api/driver-dashboard/:driverId", async (req, res) => {
  try {
    const { driverId } = req.params;

    const activeRides = await Ride.countDocuments({
      driverId,
      status: { $in: ["Available", "Full"] },
    });

    const pastRides = await Ride.countDocuments({
      driverId,
      status: "Completed",
    });

    const requestCount = await Booking.countDocuments({
      driverId,
      status: "pending",
    });

    res.json({
      success: true,
      activeRides,
      pastRides,
      requestCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});
// DRIVER EARNINGS API
app.get("/api/driver/:driverId/earnings", async (req, res) => {
  try {
    const { driverId } = req.params;

    const driver = await Driver.findById(driverId);

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    res.json({
      success: true,
      totalEarnings: driver.totalEarnings || 0,
    });
  } catch (error) {
    console.log("EARNING ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// DRIVER EARNINGS DETAILS
app.get("/api/driver/:driverId/earnings/details", async (req, res) => {
  try {
    const { driverId } = req.params;

    const payments = await Payment.find({
      driverId,
      status: "Paid",
    })
      .populate("rideId")
      .sort({ createdAt: -1 });

    let totalEarnings = 0;
    let totalSeats = 0;

    const rides = payments.map((payment) => {
      totalEarnings += Number(payment.amount || 0);
      totalSeats += Number(payment.seats || 0);

      return {
        _id: payment._id,

        from: payment.rideId?.from || "-",
        to: payment.rideId?.to || "-",

        date: payment.rideId?.date || "-",
        time: payment.rideId?.time || "-",

        seats: payment.seats,
        amount: payment.amount,

        paymentMethod: payment.paymentMethod,
        transactionId: payment.transactionId,

        status: payment.status,

        createdAt: payment.createdAt,
      };
    });

    res.json({
      success: true,
      totalEarnings,
      totalSeats,
      totalPaidRides: rides.length,
      rides,
    });
  } catch (error) {
    console.log("Driver Earnings Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
// ================= PASSENGER TRIP HISTORY =================
app.get("/api/passenger-trips/:passengerId", async (req, res) => {
  try {
    const payments = await Payment.find({
      passengerId: req.params.passengerId,
      status: "Paid",
    })
      .populate("driverId", "name phone profileImage")
      .populate("rideId", "from to date time")
      .sort({ createdAt: -1 });


    const trips = payments.map((payment) => {

      const rideDate = new Date(payment.rideId?.date);

      const today = new Date();

      const status =
        rideDate < today
          ? "Completed"
          : "Pending";


      return {
        _id: payment._id,

        driver: payment.driverId?.name || "Driver",

        driverImage:
          payment.driverId?.profileImage || "",

        from:
          payment.rideId?.from || "",

        to:
          payment.rideId?.to || "",

        date:
          payment.rideId?.date || "",

        time:
          payment.rideId?.time || "",

        seats:
          payment.seats,

        amount:
          payment.amount,

        paymentMethod:
          payment.paymentMethod,

        transactionId:
          payment.transactionId,

        status,
      };

    });


    res.json({
      success:true,
      trips,
    });


  } catch(error){

    console.log(
      "Passenger Trips Error:",
      error
    );

    res.status(500).json({
      success:false,
      error:error.message,
    });

  }
});

// server.listen(4500, () => {
//   console.log("Server running on port 4500 🚀");
// });

const PORT = process.env.PORT || 4500;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});