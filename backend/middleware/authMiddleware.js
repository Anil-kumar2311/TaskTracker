import jwt from 'jsonwebtoken';
import { memoryStore, getUserById } from '../config/store.js';

export function requireAuth(req, res, next) {
  const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'tasktracker-dev-secret');
    const user = getUserById(payload.id) || memoryStore.users.find((item) => item.email === payload.email);

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}
