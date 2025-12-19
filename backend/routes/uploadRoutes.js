const express = require("express");
const router = express.Router();

const upload = require("../middlewares/uploads");
const cloudinary = require("../config/cloudinary");

router.post("/image", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Aucune image envoyée" });
        }

        console.log("Cloudinary config:", {
            cloud: process.env.CLOUDINARY_CLOUD_NAME,
            key: process.env.CLOUDINARY_API_KEY ? "OK" : "MISSING",
            secret: process.env.CLOUDINARY_API_SECRET ? "OK" : "MISSING",
        });

        const stream = cloudinary.uploader.upload_stream(
            { folder: "gofind" },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary error:", error);
                    return res.status(500).json({ error: error.message });
                }

                return res.status(200).json({ url: result.secure_url });
            }
        );

        stream.end(req.file.buffer);
    } catch (err) {
        console.error("Upload error:", err);
        res.status(500).json({ message: "Erreur upload image" });
    }
});

module.exports = router;
