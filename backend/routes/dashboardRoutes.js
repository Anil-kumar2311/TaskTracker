import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { memoryStore } from '../config/store.js';

const router = express.Router();

router.get('/', requireAuth, (req, res) => {
  const userId = req.user.id || req.user._id;
  const tasks = memoryStore.tasks.filter((task) => (task.userId || task.ownerId) === userId);
  const notes = memoryStore.notes.filter((note) => (note.userId || note.ownerId) === userId);
  const reminders = memoryStore.reminders.filter((reminder) => (reminder.userId || reminder.ownerId) === userId);

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((task) => task.status !== 'completed' && !task.archived).length;
  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  const pinnedNotes = notes.filter((note) => note.pinned && !note.archived);
  const upcomingReminders = reminders.filter((item) => !item.completed).slice(0, 5);
  const todayTasks = tasks.filter((task) => {
    if (!task.dueDate) return false;
    const deadline = new Date(task.dueDate);
    const now = new Date();
    return deadline.toDateString() === now.toDateString();
  });

  const productivityScore = Math.min(100, Math.round((completedTasks / Math.max(totalTasks, 1)) * 100 + 20));

  const summary = `You have ${pendingTasks} active tasks and ${completedTasks} completed tasks. Keep focus on the upcoming deadline work.`;

  return res.json({
    stats: {
      totalTasks,
      pendingTasks,
      completedTasks,
      pinnedNotes: pinnedNotes.length,
      upcomingReminders: upcomingReminders.length,
      todayTasks: todayTasks.length,
      productivityScore,
    },
    tasks: tasks.slice(0, 5),
    notes: pinnedNotes.slice(0, 4),
    reminders: upcomingReminders,
    summary,
  });
});

export default router;
