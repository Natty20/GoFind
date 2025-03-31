const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://mongo:27018/GF');
;
        console.log('MongoDB connected yessirrr...');
    } catch (err) {
        console.error(err.message);
        process.exit(1); // Arrêt du processus si la connexion échoue
    }
};

module.exports = connectDB;
