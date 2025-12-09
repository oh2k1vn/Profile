import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/auth.middleware';
import * as userService from '../services/user.service';

const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;

const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Tên phải từ 2 ký tự trở lên').optional(),
  phone: z
    .string()
    .regex(phoneRegex, 'Số điện thoại không hợp lệ (Phải là số di động VN 10 số)')
    .optional()
    .nullable(),
  avatarUrl: z.string().url('URL ảnh không hợp lệ').optional().nullable(),
});

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = await userService.getUserProfile(userId);

    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const validatedData = updateProfileSchema.strict().parse(req.body);

    if (Object.keys(validatedData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Bạn phải gửi ít nhất một thông tin để cập nhật (fullName, phone, hoặc avatarUrl)',
      });
    }

    const updatedUser = await userService.updateUserProfile({
      userId,
      ...validatedData,
    });

    res.json({
      success: true,
      message: 'Cập nhật hồ sơ thành công',
      data: updatedUser,
    });
  } catch (error: any) {
    // Xử lý lỗi
    // Nếu là lỗi Zod (validate sai format)
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: error.issues[0].message,
      });
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi cập nhật hồ sơ',
    });
  }
};
