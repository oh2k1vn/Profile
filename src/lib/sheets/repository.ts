import type { SheetName, SheetRecord } from '../../types/database';
import { SHEETS_SCHEMA } from '../../types/database';
import { sheetsClient, type SheetsClient } from './client';

export interface SheetRepository<T extends SheetRecord> {
  readonly sheetName: SheetName;
  list(options?: { bypassCache?: boolean }): Promise<T[]>;
  getById(id: string, options?: { bypassCache?: boolean }): Promise<T>;
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<T>;
  update(id: string, data: Partial<Omit<T, 'id'>>): Promise<T>;
  upsert(id: string, data: Partial<Omit<T, 'id'>>): Promise<T>;
  remove(id: string): Promise<{ id: string; deleted: boolean }>;
  ensureTab(headers?: readonly string[]): Promise<{ sheet: string; ready: boolean }>;
  invalidate(): void;
}

/**
 * Factory creating a strongly-typed CRUD repository bound to a specific Google Sheets tab.
 * Adding a new module only requires defining its interface and calling `createSheetRepository`.
 */
export function createSheetRepository<T extends SheetRecord>(
  sheetName: SheetName,
  client: SheetsClient = sheetsClient,
): SheetRepository<T> {
  return {
    sheetName,
    list: (options) => client.list<T>(sheetName, options),
    getById: (id, options) => client.getById<T>(sheetName, id, options),
    create: (data) => client.create<T>(sheetName, data as Partial<T>),
    update: (id, data) => client.update<T>(sheetName, id, data as Partial<T>),
    upsert: (id, data) => client.upsert<T>(sheetName, id, data as Partial<T>),
    remove: (id) => client.remove(sheetName, id),
    ensureTab: (headers) => client.ensureSheet(sheetName, headers ?? SHEETS_SCHEMA[sheetName]),
    invalidate: () => client.invalidateCache(sheetName),
  };
}
