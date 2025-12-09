import { query } from '../config/db';

export interface UpdateProfileDTO {
  userId: string;
  fullName?: string;
  phone?: string | null;
  avatarUrl?: string | null;
}

export const updateUserProfile = async (data: UpdateProfileDTO) => {
  const { userId, fullName, phone, avatarUrl } = data;

  // 1. Tạo câu query động
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  // Chỉ add vào câu query những field có gửi lên
  if (fullName !== undefined) {
    updates.push(`full_name = $${paramIndex++}`);
    values.push(fullName);
  }
  if (phone !== undefined) {
    updates.push(`phone = $${paramIndex++}`);
    values.push(phone);
  }
  if (avatarUrl !== undefined) {
    updates.push(`avatar_url = $${paramIndex++}`);
    values.push(avatarUrl);
  }

  // Luôn update field updated_at
  updates.push(`updated_at = NOW()`);

  // Nếu không có gì để update thì return luôn
  if (values.length === 0) {
    throw new Error('Không có dữ liệu nào thay đổi');
  }

  // Thêm ID vào cuối mảng values cho mệnh đề WHERE
  values.push(userId);

  const sql = `
    UPDATE users
    SET ${updates.join(', ')}
    WHERE id = $${paramIndex}
    RETURNING id, email, full_name, phone, avatar_url, role
  `;

  // 2. Thực thi query
  const result = await query(sql, values);

  if (result.rowCount === 0) {
    throw new Error('User không tồn tại');
  }

  return result.rows[0];
};

// Hàm lấy thông tin user (để load profile lúc vào trang)
export const getUserProfile = async (userId: string) => {
  const sql = 'SELECT id, email, full_name, phone, avatar_url, role FROM users WHERE id = $1';
  const result = await query(sql, [userId]);
  return result.rows[0];
};
