import jwt from 'jsonwebtoken';
import Client from '../models/Client.js';
import Admin from '../models/Admin.js';
import Prestataire from '../models/Prestataire.js';

const optionalAuthenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // 🟢 Visiteur non connecté
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        req.user = null;
        return next();
    }

    try {
        const token = authHeader.split(' ')[1];
        const secret = process.env.JWT_SECRET || 'gofind';
        const decoded = jwt.verify(token, secret);

        let user = null;
        let type = null;

        // 🔍 Recherche dans chaque collection
        user = await Client.findById(decoded.id).select('role');
        if (user) type = 'client';

        if (!user) {
            user = await Admin.findById(decoded.id).select('role');
            if (user) type = 'admin';
        }

        if (!user) {
            user = await Prestataire.findById(decoded.id).select('role');
            if (user) type = 'prestataire';
        }

        if (!user) {
            req.user = null;
            return next();
        }

        req.user = {
            id: user._id,
            role: user.role,
            type, // client | admin | prestataire
        };

        next();
    } catch (error) {
        req.user = null;
        next();
    }
};

export default optionalAuthenticateUser;
