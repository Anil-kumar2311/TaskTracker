import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    status: {
      type: String,
      enum: ['todo', 'in_progress', 'completed'],
      default: 'todo',
    },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    dueDate: { type: Date, default: null },
    category: { type: String, default: 'General' },
    tags: [{ type: String }],
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);
