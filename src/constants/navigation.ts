export interface NavItem {
  label: string;
  path: string;
  elementId?: string;
  isExternal?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Giới thiệu', path: '/', elementId: 'about' },
  { label: 'Kỹ năng', path: '/', elementId: 'skills' },
  { label: 'Dự án', path: '/', elementId: 'projects' },
  { label: 'Blog', path: '/blog' },
  { label: 'Trải nghiệm', path: '/playground' },
];
