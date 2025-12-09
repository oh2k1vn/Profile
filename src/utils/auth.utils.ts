import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
export const JWT_SECRET =
  process.env.JWT_SECRET ||
  '48bd532c694e86ea74901d71458d5f2ab4fdc2a48ab33ec695f53db30157309571ed49f84d86a729fa7e5217829310f57480c52d7bf8db38c6b60e2bbfe3dd3d';

// 1. Hash Password
export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

// 2. Compare Password (khi đăng nhập)
export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

// 3. Generate Token
export const generateToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }); // Token sống 7 ngày
};
