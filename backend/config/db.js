const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://mongo:27018/GoFind");
    console.log("MongoDB pour GoFind connected");
  } catch (err) {
    console.error("MongoDB connection error : ", err.message);
    process.exit(1); // Arrêt du processus si la connexion échoue
  }
};

module.exports = connectDB;
