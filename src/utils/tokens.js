import jwt from 'jsonwebtoken';
import 'dotenv/config';
const SECRET_KEY = process.env.JWT_SECRET;

function generateToken(user) {
    const payload = { id: user.id, email: user.email };
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
}

function verifyToken(token) {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null;
    }
}

export { generateToken, verifyToken };
