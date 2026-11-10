import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { memoryStore, generateId, getReminderById } from '../config/store.js';

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  const userId = req.user.id || req.user._id;
  const reminders = memoryStore.reminders.filter((reminder) => (reminder.userId || reminder.ownerId) === userId);
  return res.json({ reminders });
});

router.post('/', requireAuth, (req, res) => {
  const userId = req.user.id || req.user._id;
  const {
    title,
    message = '',
    reminderAt,
    taskId = null,
    timezone = 'UTC',
    emailNotification = false,
    browserNotification = true,
  } = req.body;

  if (!title || !reminderAt) {
    return res.status(400).json({ message: 'Reminder title and date are required.' });
  }

  const reminder = {
    id: generateId(),
    userId,
    title,
    message,
    reminderAt,
    taskId,
    timezone,
    emailNotification,
    browserNotification,
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memoryStore.reminders.push(reminder);
  return res.status(201).json({ reminder });
});

router.put('/:id', requireAuth, (req, res) => {
  const userId = req.user.id || req.user._id;
  const reminder = getReminderById(req.params.id);

  if (!reminder || (reminder.userId || reminder.ownerId) !== userId) {
    return res.status(404).json({ message: 'Reminder not found.' });
  }

  Object.assign(reminder, req.body, { updatedAt: new Date().toISOString() });
  return res.json({ reminder });
});

router.delete('/:id', requireAuth, (req, res) => {
  const userId = req.user.id || req.user._id;
  const index = memoryStore.reminders.findIndex((reminder) => (reminder.id || reminder._id) === req.params.id && (reminder.userId || reminder.ownerId) === userId);

  if (index === -1) {
    return res.status(404).json({ message: 'Reminder not found.' });
  }

  memoryStore.reminders.splice(index, 1);
  return res.json({ message: 'Reminder deleted successfully.' });
});

export default router;
