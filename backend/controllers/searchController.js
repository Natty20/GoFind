const Prestataire = require('../models/Prestataire');
const Prestation = require('../models/Prestation');
const SousPrestation = require('../models/SousPrestation');

// GET /api/search/autocomplete?query=xxx
const autocomplete = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query || query.trim() === '') return res.json({ results: [] });

        const regex = new RegExp(query, 'i'); // insensible à la casse

        // Prestataires
        const prestataires = await Prestataire.find({ nom: regex })
            .limit(5)
            .select('_id nom');

        // Prestations
        const prestations = await Prestation.find({ nom: regex })
            .limit(5)
            .select('_id nom');

        // Sous-prestations
        const sousPrestations = await SousPrestation.find({ nom: regex })
            .limit(5)
            .select('_id nom');

        // Ville (depuis Prestataire)
        const villes = await Prestataire.find({ address: regex })
            .limit(5)
            .select('address')
            .lean();

        // Fusionner les résultats
        const results = [
            ...prestataires.map((p) => ({ ...p.toObject(), type: 'prestataire' })),
            ...prestations.map((p) => ({ ...p.toObject(), type: 'prestation' })),
            ...sousPrestations.map((sp) => ({ ...sp.toObject(), type: 'sousprestation' })),
            ...villes.map((v) => ({ _id: v._id, nom: v.address, type: 'ville' })),
        ];

        res.json({ results });
    } catch (err) {
        console.error('Erreur autocomplete:', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = { autocomplete };
