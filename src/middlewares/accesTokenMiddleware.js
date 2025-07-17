import { verifyToken } from '../utils/tokens.js';

function accessTokenMiddleware(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(403).json({ error: 'Token inválido' });
    }

    req.user = decoded; // Attach user info to request object
    next();
}

export default accessTokenMiddleware;