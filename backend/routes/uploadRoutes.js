const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const cloudinary = require("../config/cloudinary");

router.post("/image", upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Aucune image envoyée" });
        }

        const result = await cloudinary.uploader.upload_stream(
            { folder: "gofind" },
            (error, result) => {
                if (error) {
                    return res.status(500).json({ error: error.message });
                }
                return res.json({ url: result.secure_url });
            }
        );

        result.end(req.file.buffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur upload image" });
    }
});

module.exports = router;
