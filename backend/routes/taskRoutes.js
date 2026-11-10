import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { memoryStore, generateId, getTaskById } from '../config/store.js';

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  const userId = req.user.id || req.user._id;
  const tasks = memoryStore.tasks.filter((task) => (task.userId || task.ownerId) === userId);
  return res.json({ tasks });
});

router.post('/', requireAuth, (req, res) => {
  const userId = req.user.id || req.user._id;
  const { title, description = '', status = 'todo', priority = 'medium', dueDate, category = 'General', tags = [] } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: 'Task title is required.' });
  }

  const task = {
    id: generateId(),
    userId,
    title: title.trim(),
    description,
    status,
    priority,
    dueDate: dueDate || null,
    category,
    tags,
    archived: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memoryStore.tasks.push(task);
  return res.status(201).json({ task });
});

router.put('/:id', requireAuth, (req, res) => {
  const userId = req.user.id || req.user._id;
  const task = getTaskById(req.params.id);

  if (!task || (task.userId || task.ownerId) !== userId) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  const updates = { ...req.body, updatedAt: new Date().toISOString() };
  Object.assign(task, updates);

  return res.json({ task });
});

router.patch('/:id/status', requireAuth, (req, res) => {
  const userId = req.user.id || req.user._id;
  const task = getTaskById(req.params.id);

  if (!task || (task.userId || task.ownerId) !== userId) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  task.status = req.body.status || task.status;
  task.updatedAt = new Date().toISOString();
  return res.json({ task });
});

router.delete('/:id', requireAuth, (req, res) => {
  const userId = req.user.id || req.user._id;
  const index = memoryStore.tasks.findIndex((task) => (task.id || task._id) === req.params.id && (task.userId || task.ownerId) === userId);

  if (index === -1) {
    return res.status(404).json({ message: 'Task not found.' });
  }

  memoryStore.tasks.splice(index, 1);
  return res.json({ message: 'Task deleted successfully.' });
});

export default router;
