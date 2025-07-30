const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect("mongodb://mongo:27018/GF");
//     console.log("MongoDB connected yessirrr...");
//   } catch (err) {
//     console.error(err.message);
//     process.exit(1); // Arrêt du processus si la connexion échoue
//   }
// };

const uri =
  process.env.MONGO_URI ||
  "mongodb+srv://gihozo:GoFind2025@gofind.mqur3gf.mongodb.net/GF";

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected yessirrr...");
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Arrêt du processus si la connexion échoue
  }
};

module.exports = connectDB;
