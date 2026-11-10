import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    avatar: { type: String, default: '' },
    googleId: { type: String, default: null },
    timezone: { type: String, default: 'UTC' },
    theme: { type: String, default: 'light' },
    bio: { type: String, default: '' },
    jobTitle: { type: String, default: '' },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
