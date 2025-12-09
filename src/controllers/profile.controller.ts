import { NextFunction, Request, Response } from 'express';
import * as profileService from '../services/profile.service';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await profileService.getProfileData();
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error); // Chuyền lỗi xuống middleware xử lý lỗi
  }
};
