import jwt from 'jsonwebtoken';
import User from '../models/Client';

const optionalAuthenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        req.user = null;
        return next();
    }

    try {
        const secret = process.env.JWT_SECRET || 'gofind';
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, secret);

        const user = await User.findById(decoded.id).select('role');
        req.user = user || null;

        next();
    } catch (err) {
        req.user = null;
        next();
    }
};

export default optionalAuthenticateUser;
