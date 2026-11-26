import type { SheetName } from '../../types/database';

export class SheetsError extends Error {
  public readonly sheet?: string;
  public readonly action?: string;

  constructor(message: string, context?: { sheet?: string; action?: string }) {
    super(message);
    this.name = 'SheetsError';
    this.sheet = context?.sheet;
    this.action = context?.action;
  }
}

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class SheetsCache {
  private readonly store = new Map<string, CacheEntry<unknown>>();
  private readonly ttlMs: number;

  constructor(ttlMs = 60_000) {
    this.ttlMs = ttlMs;
  }

  public get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  public set<T>(key: string, data: T): void {
    this.store.set(key, { data, expiresAt: Date.now() + this.ttlMs });
  }

  public invalidate(sheet?: SheetName): void {
    if (!sheet) {
      this.store.clear();
      return;
    }
    const prefix = `${sheet}:`;
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) this.store.delete(key);
    }
  }
}
