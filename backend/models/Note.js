import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'Untitled note' },
    content: { type: String, default: '' },
    color: {
      type: String,
      enum: ['#FFF3B0', '#FFD6E0', '#D6E8FF', '#D9F7E8', '#E9DDFF'],
      default: '#FFF3B0',
    },
    pinned: { type: Boolean, default: false },
    completed: { type: Boolean, default: false },
    archived: { type: Boolean, default: false },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);
