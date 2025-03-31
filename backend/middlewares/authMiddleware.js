const jwt = require("jsonwebtoken");
// verification pour voir si l'utilisateur est connecté
const authenticateUser = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Accès refusé pas de token fourni" });
    }
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Token invalide ou expiré." });
    }
};

// Vérifier si l'utilisateur est: administrateur, client ou prestataire
const authorizeAdmin = (req, res, next) => {
    if(!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Action bloqué, vous n'êtes pas admin"});
    }
    next();
};
const authorizeClient = (req, res, next) => {
    if(!req.user || req.user.role !== "client") {
        return res.status(403).json({ message: "Acces interdit, réservé aux clients"});
    }
    next();
};
const authorizePrestataire = (req, res, next) => {
    if(!req.user || req.user.role !== "prestataire") {
        return res.status(403).json({ message: "Accès interdit, réservé aux prestataires"})
    }
    next();
}
module.exports = { 
    authenticateUser, 
    authorizeAdmin, 
    authorizeClient, 
    authorizePrestataire 
};