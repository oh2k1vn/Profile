// src/server.ts
import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/db'; // Import hàm test connect

dotenv.config();

const PORT = process.env.PORT || 3000;

// Connect DB trước
connectDB().then(() => {
  // DB ok thì mới start server
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});
