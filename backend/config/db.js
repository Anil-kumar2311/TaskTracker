import mongoose from 'mongoose';

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log('MongoDB URI not provided. Using in-memory demo store.');
    return false;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection failed. Falling back to in-memory store.', error.message);
    return false;
  }
}
