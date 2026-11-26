import { Database, Wallet, type LucideIcon } from 'lucide-react';
import type { ModulePermission } from '../contexts/AuthContext';

export interface ModuleRouteDef {
  id: string;
  path: string;
  permission: ModulePermission;
  title: string;
  description: string;
  icon: LucideIcon;
  accentClass: string;
}

export const WORKSPACE_MODULES: readonly ModuleRouteDef[] = [
  {
    id: 'finance',
    path: '/finance',
    permission: 'finance',
    title: 'Tài chính',
    description: 'Thống kê, theo dõi danh mục và kế hoạch thanh toán định kỳ.',
    icon: Wallet,
    accentClass: 'text-sky-400 bg-sky-500/15 border-sky-400/30',
  },
  {
    id: 'database',
    path: '/database',
    permission: 'database',
    title: 'Cơ sở dữ liệu',
    description: 'Kiểm tra kết nối & đồng bộ cấu trúc Google Sheets tự động.',
    icon: Database,
    accentClass: 'text-indigo-400 bg-indigo-500/15 border-indigo-400/30',
  },
];
