const express = require('express');
const router = express.Router();
const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

router.get('/', async (req, res) => {
    try {
        const q = req.query.q;
        if (!q || q.length < 2) {
            return res.json({ features: [] });
        }

        const response = await fetch(
            `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(
                q
            )}&type=municipality&limit=6`
        );

        const data = await response.json();
        res.json(data);
    } catch (err) {
        console.error('Erreur API villes', err);
        res.status(500).json({ message: 'Erreur villes' });
    }
});

module.exports = router;
