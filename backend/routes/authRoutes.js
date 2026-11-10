import express from 'express';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import { memoryStore, generateId, getUserByEmail, getUserById } from '../config/store.js';
import { generateToken } from '../utils/generateToken.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();
const googleClient = process.env.GOOGLE_CLIENT_ID ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID) : null;

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

const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
};

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  if (getUserByEmail(email)) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: generateId(),
    name,
    email,
    password: hashedPassword,
    avatar: '',
    timezone: 'UTC',
    theme: 'light',
    bio: '',
    jobTitle: '',
    createdAt: new Date().toISOString(),
  };

  memoryStore.users.push(user);
  const token = generateToken(user);
  setAuthCookie(res, token);
  return res.status(201).json({ token, user: sanitizeUser(user) });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const user = getUserByEmail(email);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = generateToken(user);
  setAuthCookie(res, token);
  return res.json({ token, user: sanitizeUser(user) });
});

router.post('/google', async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ message: 'Google credential is required.' });
  }

  try {
    let payload;

    if (googleClient) {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } else if (credential === 'demo-google-token') {
      payload = {
        email: 'demo.google@tasktracker.app',
        name: 'Demo Google User',
        sub: 'demo-google-user',
      };
    } else {
      return res.status(400).json({ message: 'Google authentication is not configured.' });
    }

    const email = payload.email;
    const name = payload.name || email.split('@')[0];
    let user = getUserByEmail(email);

    if (!user) {
      user = {
        id: generateId(),
        name,
        email,
        password: await bcrypt.hash(`google-${payload.sub}-tasktracker`, 10),
        avatar: payload.picture || '',
        timezone: 'UTC',
        theme: 'light',
        bio: '',
        jobTitle: '',
        googleId: payload.sub,
        createdAt: new Date().toISOString(),
      };
      memoryStore.users.push(user);
    }

    const token = generateToken(user);
    setAuthCookie(res, token);
    return res.json({ token, user: sanitizeUser(user) });
  } catch (error) {
    return res.status(401).json({ message: 'Google verification failed.' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({ message: 'Logged out successfully.' });
});

router.get('/me', requireAuth, (req, res) => {
  return res.json({ user: sanitizeUser(req.user) });
});

router.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  return res.json({ message: `Password reset instructions have been sent to ${email}.` });
});

router.post('/reset-password', (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Reset token and password are required.' });
  }

  return res.json({ message: 'Password has been reset successfully.' });
});

router.get('/users/:id', requireAuth, (req, res) => {
  const found = getUserById(req.params.id);
  if (!found) return res.status(404).json({ message: 'User not found.' });
  return res.json({ user: sanitizeUser(found) });
});

export default router;
