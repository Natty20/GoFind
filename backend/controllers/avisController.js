const Avis = require("../models/Avis");
const Client = require("../models/Client");
const Prestataire = require("../models/Prestataire");

const createAvis = async (req, res) => {
    try {
        if (req.user.role !== 'client') {
            return res.status(403).json({
                message: 'Seuls les clients peuvent laisser un avis',
            });
        }

        const { prestataireId, note, commentaire } = req.body;

        const prestataire = await Prestataire.findById(prestataireId);
        if (!prestataire) {
            return res.status(404).json({ message: 'Prestataire introuvable' });
        }

        const avis = await Avis.create({
            auteur: req.user.id,
            prestataire: prestataireId,
            note,
            commentaire,
        });

        res.status(201).json({
            message: 'Avis créé avec succès',
            avis,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Erreur création avis',
            error: error.message,
        });
    }
};

const updateMyAvis = async (req, res) => {
    try {
        const avis = await Avis.findById(req.params.id);

        if (!avis) {
            return res.status(404).json({ message: 'Avis introuvable' });
        }

        if (avis.auteur.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Accès refusé' });
        }

        if (!avis.visible) {
            return res.status(403).json({
                message: 'Avis masqué, modification impossible',
            });
        }

        avis.note = req.body.note ?? avis.note;
        avis.commentaire = req.body.commentaire ?? avis.commentaire;

        await avis.save();

        res.json({
            message: 'Avis modifié avec succès',
            avis,
        });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const deleteMyAvis = async (req, res) => {
    try {
        const avis = await Avis.findById(req.params.id);

        if (!avis) {
            return res.status(404).json({ message: 'Avis introuvable' });
        }

        if (avis.auteur.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Accès refusé' });
        }

        await avis.deleteOne();
        res.json({ message: 'Avis supprimé avec success' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getAllVisibleAvis = async (req, res) => {
    if (req.user?.role === 'prestataire') {
        return res.status(403).json({
            message: "Les prestataires connectés ne peuvent pas consulter les avis publics",
        });
    }

    const avis = await Avis.find({ visible: true })
        .populate('auteur', 'nom prenom profilePicture')
        .populate('prestataire', 'nom prenom')
        .sort({ createdAt: -1 });

    res.json({ avis });
};

const getAvisForPrestataire = async (req, res) => {
    const avis = await Avis.find({ prestataire: req.user.id })
        .populate('auteur', 'nom prenom profilePicture')
        .sort({ createdAt: -1 });

    res.json({ avis });
};

// masquer / afficher
const toggleAvisVisibility = async (req, res) => {
    const avis = await Avis.findById(req.params.id);

    if (!avis) return res.status(404).json({ message: 'Avis introuvable' });

    if (
        req.user.role === 'prestataire' &&
        avis.prestataire.toString() !== req.user.id
    ) {
        return res.status(403).json({ message: 'Accès refusé' });
    }

    avis.visible = !avis.visible;
    await avis.save();

    res.json({ avis });
};

// admin delete
const adminDeleteAvis = async (req, res) => {
    await Avis.findByIdAndDelete(req.params.id);
    res.json({ message: 'Avis supprimé par admin' });
};

module.exports = {
    adminDeleteAvis,
    toggleAvisVisibility,
    getAvisForPrestataire,
    getAllVisibleAvis,
    deleteMyAvis,
    updateMyAvis,
    createAvis,
};
