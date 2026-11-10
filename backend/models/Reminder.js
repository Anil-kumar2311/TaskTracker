import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, default: '' },
    reminderAt: { type: Date, required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null },
    timezone: { type: String, default: 'UTC' },
    emailNotification: { type: Boolean, default: false },
    browserNotification: { type: Boolean, default: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Reminder = mongoose.models.Reminder || mongoose.model('Reminder', reminderSchema);
