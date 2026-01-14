import Avis from '../models/Avis.js';
import Client from '../models/Client.js';
import Prestataire from '../models/Prestataire.js';

/* ======================
   ➕ CRÉER UN AVIS
====================== */
export const createAvis = async (req, res) => {
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

/* ======================
   ✏️ MODIFIER SON AVIS
====================== */
export const updateMyAvis = async (req, res) => {
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

/* ======================
   ❌ SUPPRIMER SON AVIS
====================== */
export const deleteMyAvis = async (req, res) => {
    try {
        const avis = await Avis.findById(req.params.id);

        if (!avis) {
            return res.status(404).json({ message: 'Avis introuvable' });
        }

        if (avis.auteur.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Accès refusé' });
        }

        await avis.deleteOne();
        res.json({ message: 'Avis supprimé' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

/* ======================
   🌍 CLIENT → voir avis visibles
====================== */
export const getAllVisibleAvis = async (req, res) => {
    const avis = await Avis.find({ visible: true })
        .populate('auteur', 'prenom')
        .populate('prestataire', 'nom prenom')
        .sort({ createdAt: -1 });

    res.json({ avis });
};

/* ======================
   🧑‍🔧 PRESTATAIRE → ses avis
====================== */
export const getAvisForPrestataire = async (req, res) => {
    const avis = await Avis.find({ prestataire: req.user.id })
        .populate('auteur', 'prenom')
        .sort({ createdAt: -1 });

    res.json({ avis });
};

/* ======================
   👑 MODÉRATION
====================== */

// masquer / afficher
export const toggleAvisVisibility = async (req, res) => {
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
export const adminDeleteAvis = async (req, res) => {
    await Avis.findByIdAndDelete(req.params.id);
    res.json({ message: 'Avis supprimé par admin' });
};
