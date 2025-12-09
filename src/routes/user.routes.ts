import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

// Áp dụng middleware xác thực cho tất cả các route bên dưới
router.use(authenticateToken);

// GET /api/user/profile -> Lấy thông tin
router.get('/profile', userController.getProfile as any);

// PUT /api/user/profile -> Cập nhật thông tin
router.put('/profile', userController.updateProfile as any);

export default router;
