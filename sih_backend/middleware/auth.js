import { verifyToken } from '../utils/jwt.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed' });
  }
};