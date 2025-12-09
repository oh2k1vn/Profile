import cors from 'cors';
import express from 'express';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import userRoutes from './routes/user.routes';

const allowedOrigins = ['http://localhost:3000', 'https://profile.oh2k1vn.workers.dev'];

const app = express();

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Cấu hình CORS cho Cloudflare Pages ở đây nếu cần
app.use(express.json());

// Routes
app.use('/api/profile', profileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// Route test health check (Quan trọng cho Render/Koyeb)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

export default app;
