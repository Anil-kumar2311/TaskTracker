import jwt from 'jsonwebtoken';

export function generateToken(user) {
  return jwt.sign(
    { id: user.id || user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET || 'tasktracker-dev-secret',
    { expiresIn: '7d' }
  );
}
