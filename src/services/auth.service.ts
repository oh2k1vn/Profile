import { query } from '../config/db';
import { UserLoginDTO, UserRegisterDTO } from '../controllers/auth.controller';
import { comparePassword, generateToken, hashPassword } from '../utils/auth.utils';

// --- SERVICE ĐĂNG KÝ ---
export const registerUser = async (data: UserRegisterDTO) => {
  const { email, password, fullName, phone } = data;

  // 1. Check xem email đã tồn tại chưa
  const checkUser = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (checkUser.rowCount && checkUser.rowCount > 0) {
    throw new Error('Email đã được sử dụng');
  }

  // 2. Hash password
  const hashedPassword = await hashPassword(password);

  // 3. Insert vào DB (Phone có thể null)
  const sql = `
    INSERT INTO users (email, password_hash, full_name, phone)
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, full_name, phone, role, created_at
  `;

  const result = await query(sql, [email, hashedPassword, fullName, phone || null]);
  const newUser = result.rows[0];

  // 4. Tạo token ngay sau khi đăng ký (để tự login luôn)
  const token = generateToken({ id: newUser.id, role: newUser.role });

  return { user: newUser, token };
};

// --- SERVICE ĐĂNG NHẬP ---
export const loginUser = async (data: UserLoginDTO) => {
  const { email, password } = data;

  // 1. Tìm user theo email
  const result = await query('SELECT * FROM users WHERE email = $1', [email]);
  const user = result.rows[0];

  if (!user) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }

  // 2. So sánh password
  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }

  // 3. Tạo token
  const token = generateToken({ id: user.id, role: user.role });

  // Xóa field password hash trước khi trả về frontend vì lý do bảo mật
  delete user.password_hash;

  return { user, token };
};
