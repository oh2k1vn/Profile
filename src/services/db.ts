import { createSheetRepository, sheetsClient } from '../lib/sheets';
import type {
  CategoryRecord,
  DebtRecord,
  GuestbookRecord,
  PostRecord,
  ProfileRecord,
  ProjectRecord,
  SkillRecord,
} from '../types/database';

/**
 * Central database repositories mapped 1:1 to Google Sheets tabs.
 * To add a new module later, define its type and export a new `createSheetRepository<MyType>('MyTab')`.
 */
export const db = {
  client: sheetsClient,
  profile: createSheetRepository<ProfileRecord>('Profile'),
  skills: createSheetRepository<SkillRecord>('Skills'),
  projects: createSheetRepository<ProjectRecord>('Projects'),
  posts: createSheetRepository<PostRecord>('Posts'),
  categories: createSheetRepository<CategoryRecord>('Categories'),
  guestbook: createSheetRepository<GuestbookRecord>('Guestbook'),
  debts: createSheetRepository<DebtRecord>('Debts'),
} as const;

export { createSheetRepository };
