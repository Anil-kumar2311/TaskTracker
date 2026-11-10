import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { memoryStore, generateId, getNoteById } from '../config/store.js';

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  const userId = req.user.id || req.user._id;
  const notes = memoryStore.notes.filter((note) => (note.userId || note.ownerId) === userId);
  return res.json({ notes });
});

router.post('/', requireAuth, (req, res) => {
  const userId = req.user.id || req.user._id;
  const {
    title = 'Untitled note',
    content = '',
    color = '#FFF3B0',
    pinned = false,
    completed = false,
    archived = false,
  } = req.body;

  const note = {
    id: generateId(),
    userId,
    title,
    content,
    color,
    pinned,
    completed,
    archived,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  memoryStore.notes.push(note);
  return res.status(201).json({ note });
});

router.put('/:id', requireAuth, (req, res) => {
  const userId = req.user.id || req.user._id;
  const note = getNoteById(req.params.id);

  if (!note || (note.userId || note.ownerId) !== userId) {
    return res.status(404).json({ message: 'Note not found.' });
  }

  Object.assign(note, req.body, { updatedAt: new Date().toISOString() });
  return res.json({ note });
});

router.delete('/:id', requireAuth, (req, res) => {
  const userId = req.user.id || req.user._id;
  const index = memoryStore.notes.findIndex((note) => (note.id || note._id) === req.params.id && (note.userId || note.ownerId) === userId);

  if (index === -1) {
    return res.status(404).json({ message: 'Note not found.' });
  }

  memoryStore.notes.splice(index, 1);
  return res.json({ message: 'Note deleted successfully.' });
});

export default router;
