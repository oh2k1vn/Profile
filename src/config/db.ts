// src/config/db.ts
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

// Kiểm tra xem đã có biến môi trường chưa
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing in .env file');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // CẤU HÌNH QUAN TRỌNG CHO NEON
  ssl: {
    // Neon dùng SSL chứng thực, tùy chọn này giúp bỏ qua lỗi self-signed certificate
    // (Thường cần thiết khi chạy dev hoặc một số môi trường deploy)
    rejectUnauthorized: false,
  },
  // Tối ưu pool size (số lượng kết nối duy trì)
  // Với gói Free của Neon & Render, đừng để quá cao (mặc định là 10)
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 20000,
});

// Hàm wrapper để log query (tùy chọn, giúp debug tốt hơn)
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;

  // Chỉ log khi ở môi trường dev
  if (process.env.NODE_ENV !== 'production') {
    console.log('Executed query', { text, duration, rows: res.rowCount });
  }

  return res;
};

// Hàm kiểm tra kết nối khi khởi động server
export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to Neon Database successfully!');
    client.release(); // Trả kết nối về pool ngay lập tức
  } catch (err) {
    console.error('❌ Could not connect to Neon Database:', err);
    process.exit(1); // Dừng app nếu không connect được DB
  }
};
