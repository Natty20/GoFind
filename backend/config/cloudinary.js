const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "de1gtpqkk",
    api_key: process.env.CLOUDINARY_API_KEY || "146316795737211",
    api_secret: process.env.CLOUDINARY_API_SECRET || "YyqrESOAMUzD0IPdKV3qC9lNAxM",
});

module.exports = cloudinary;
