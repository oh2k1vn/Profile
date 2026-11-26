/**
 * Base record shape shared by every Google Sheets tab.
 */
export interface SheetRecord {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Built-in module tab names, extensible with any future tab name.
 */
export type SheetName =
  | 'Profile'
  | 'Skills'
  | 'Projects'
  | 'Posts'
  | 'Categories'
  | 'Guestbook'
  | 'Debts'
  | (string & {});

export interface ProfileRecord extends SheetRecord {
  fullName: string;
  title: string;
  bio: string;
  avatarUrl: string;
  email: string;
  github: string;
  location: string;
  availableForHire: boolean;
}

export interface SkillRecord extends SheetRecord {
  name: string;
  category: string;
  level: number;
  icon?: string;
  order: number;
}

export interface ProjectRecord extends SheetRecord {
  title: string;
  slug: string;
  summary: string;
  description: string;
  thumbnail: string;
  techStack: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
  order: number;
}

export interface PostRecord extends SheetRecord {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  categoryId: string;
  tags: string[];
  published: boolean;
  publishedAt?: string;
}

export interface CategoryRecord extends SheetRecord {
  name: string;
  slug: string;
  description?: string;
  color?: string;
}

export interface GuestbookRecord extends SheetRecord {
  author: string;
  message: string;
  emoji?: string;
  website?: string;
  approved: boolean;
}

export type DebtCategory =
  | 'credit_card'
  | 'installment'
  | 'personal_loan'
  | 'paylater_wallet';

export type DebtStatus = 'active' | 'paid' | 'overdue';

export interface DebtRecord extends SheetRecord {
  title: string;
  category: DebtCategory;
  lender: string;
  principalAmount?: number;
  totalAmount: number;
  paidAmount: number;
  monthlyPayment: number;
  interestRate: number;
  rolloverFeeRate?: number;
  currentTerm?: number;
  totalTerms?: number;
  dueDay: number;
  startDate: string;
  dueDate: string;
  status: DebtStatus;
  notes: string;
}

export interface SheetTabMeta {
  name: string;
  rowCount: number;
  headers: string[];
}

export interface SheetsApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

/**
 * Registry of default headers per module tab.
 * Used when ensuring/initializing new tabs from the app or scripts.
 */
export const SHEETS_SCHEMA: Record<string, readonly string[]> = {
  Profile: ['id', 'fullName', 'title', 'bio', 'avatarUrl', 'email', 'github', 'location', 'availableForHire', 'updatedAt'],
  Skills: ['id', 'name', 'category', 'level', 'icon', 'order', 'createdAt', 'updatedAt'],
  Projects: ['id', 'title', 'slug', 'summary', 'description', 'thumbnail', 'techStack', 'liveUrl', 'repoUrl', 'featured', 'order', 'createdAt', 'updatedAt'],
  Posts: ['id', 'title', 'slug', 'excerpt', 'content', 'coverImage', 'categoryId', 'tags', 'published', 'publishedAt', 'createdAt', 'updatedAt'],
  Categories: ['id', 'name', 'slug', 'description', 'color', 'createdAt', 'updatedAt'],
  Guestbook: ['id', 'author', 'message', 'emoji', 'website', 'approved', 'createdAt', 'updatedAt'],
  Debts: ['id', 'title', 'category', 'lender', 'principalAmount', 'totalAmount', 'paidAmount', 'monthlyPayment', 'interestRate', 'rolloverFeeRate', 'currentTerm', 'totalTerms', 'dueDay', 'startDate', 'dueDate', 'status', 'notes', 'createdAt', 'updatedAt'],
};
