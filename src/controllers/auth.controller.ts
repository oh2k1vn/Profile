import { Request, Response } from 'express';
import { z } from 'zod';
import * as authService from '../services/auth.service';

// --- VALIDATION SCHEMA (ZOD) ---
const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
  fullName: z.string().min(2, 'Tên quá ngắn'),
  phone: z.string().optional().nullable(), // Nullable & Optional
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Xuất type để dùng bên Service (Clean Code)
export type UserRegisterDTO = z.infer<typeof registerSchema>;
export type UserLoginDTO = z.infer<typeof loginSchema>;

// --- HANDLERS ---

export const register = async (req: Request, res: Response) => {
  try {
    // 1. Validate Input
    const validatedData = registerSchema.parse(req.body);

    // 2. Gọi Service
    const result = await authService.registerUser(validatedData);

    // 3. Trả về Response
    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      data: result,
    });
  } catch (error: any) {
    // Xử lý lỗi Zod hoặc lỗi logic
    res.status(400).json({
      success: false,
      message: error.errors ? error.errors[0].message : error.message, // Lấy msg lỗi đầu tiên
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.loginUser(validatedData);

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({
      // 401 Unauthorized
      success: false,
      message: error.message || 'Đăng nhập thất bại',
    });
  }
};
