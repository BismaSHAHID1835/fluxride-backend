// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect("mongodb://127.0.0.1:27017/fluxride");

//     console.log("MongoDB Connected 🚀 (fluxride)");
//   } catch (err) {
//     console.log("MongoDB Connection Error ❌", err);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
  await mongoose.connect(
  "mongodb+srv://bismashahidcoding_db_user:FluxRide123@cluster0.kka2nwp.mongodb.net/fluxride?retryWrites=true&w=majority&appName=Cluster0"
);

    console.log("MongoDB Atlas Connected 🚀");
  } catch (err) {
    console.log("MongoDB Connection Error ❌", err);
    process.exit(1);
  }
};

module.exports = connectDB;