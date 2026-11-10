import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { memoryStore, getUserById } from '../config/store.js';

const router = express.Router();

const sanitizeUser = (user) => ({
  id: user.id || user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar || '',
  timezone: user.timezone || 'UTC',
  theme: user.theme || 'light',
  bio: user.bio || '',
  jobTitle: user.jobTitle || '',
  createdAt: user.createdAt || new Date().toISOString(),
});

router.get('/profile', requireAuth, (req, res) => {
  return res.json({ user: sanitizeUser(req.user) });
});

router.put('/profile', requireAuth, (req, res) => {
  const user = getUserById(req.user.id || req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  Object.assign(user, req.body, { updatedAt: new Date().toISOString() });
  return res.json({ user: sanitizeUser(user) });
});

router.get('/settings', requireAuth, (req, res) => {
  const user = getUserById(req.user.id || req.user._id);
  return res.json({ settings: { theme: user?.theme || 'light', timezone: user?.timezone || 'UTC' } });
});

router.put('/settings', requireAuth, (req, res) => {
  const user = getUserById(req.user.id || req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found.' });

  if (req.body.theme) user.theme = req.body.theme;
  if (req.body.timezone) user.timezone = req.body.timezone;
  if (req.body.emailNotifications !== undefined) user.emailNotifications = req.body.emailNotifications;

  return res.json({ settings: { theme: user.theme, timezone: user.timezone } });
});

export default router;
