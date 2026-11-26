import type { SheetName, SheetTabMeta, SheetsApiResponse } from '../../types/database';
import { SheetsCache, SheetsError } from './cache';

export interface SheetsClientConfig {
  webAppUrl?: string;
  cacheTtlMs?: number;
}

export interface ServerAuthSession {
  role: 'admin';
  permissions: string[];
  issuedAt: number;
  expiresAt: number;
}

/**
 * HTTP client for Google Apps Script Web App multi-tab database.
 */
export class SheetsClient {
  private readonly webAppUrl: string;
  private readonly cache: SheetsCache;
  private authToken: string | null = null;
  private onUnauthorizedCallback: (() => void) | null = null;

  constructor(config?: SheetsClientConfig) {
    this.webAppUrl = (config?.webAppUrl ?? import.meta.env.VITE_SHEETS_WEBAPP_URL ?? '').trim();
    this.cache = new SheetsCache(config?.cacheTtlMs);
  }

  public setOnUnauthorized(callback: (() => void) | null): void {
    this.onUnauthorizedCallback = callback;
  }

  public isConfigured(): boolean {
    return this.webAppUrl.length > 0 && !this.webAppUrl.includes('YOUR_DEPLOYMENT_ID');
  }

  public setAuthToken(token: string | null): void {
    this.authToken = token;
    if (!token) this.cache.invalidate();
  }

  public hasAuthToken(): boolean {
    return Boolean(this.authToken);
  }

  public invalidateCache(sheet?: SheetName): void {
    this.cache.invalidate(sheet);
  }

  public loginWithPasscode(passcode: string) {
    return this.postRequest<{ token: string; session: ServerAuthSession }>({
      action: 'auth_login',
      passcode,
    });
  }

  public verifyAuthToken(token: string) {
    return this.postRequest<{ session: ServerAuthSession }>({
      action: 'auth_verify',
      authToken: token,
    });
  }

  public getMeta(): Promise<SheetTabMeta[]> {
    return this.getRequest<SheetTabMeta[]>({ action: 'meta' });
  }

  public async list<T>(sheet: SheetName, options?: { bypassCache?: boolean }): Promise<T[]> {
    const cacheKey = `${sheet}:list`;
    if (!options?.bypassCache) {
      const cached = this.cache.get<T[]>(cacheKey);
      if (cached !== null) return cached;
    }
    const data = await this.getRequest<T[]>({ action: 'list', sheet });
    this.cache.set(cacheKey, data);
    return data;
  }

  public async getById<T>(sheet: SheetName, id: string, options?: { bypassCache?: boolean }): Promise<T> {
    const cacheKey = `${sheet}:get:${id}`;
    if (!options?.bypassCache) {
      const cached = this.cache.get<T>(cacheKey);
      if (cached !== null) return cached;
    }
    const data = await this.getRequest<T>({ action: 'get', sheet, id });
    this.cache.set(cacheKey, data);
    return data;
  }

  public async create<T>(sheet: SheetName, data: Partial<T>): Promise<T> {
    const created = await this.postRequest<T>({ action: 'create', sheet, data });
    this.cache.invalidate(sheet);
    return created;
  }

  public async update<T>(sheet: SheetName, id: string, data: Partial<T>): Promise<T> {
    const updated = await this.postRequest<T>({ action: 'update', sheet, id, data });
    this.cache.invalidate(sheet);
    return updated;
  }

  public async upsert<T>(sheet: SheetName, id: string, data: Partial<T>): Promise<T> {
    const record = await this.postRequest<T>({ action: 'upsert', sheet, id, data });
    this.cache.invalidate(sheet);
    return record;
  }

  public async remove(sheet: SheetName, id: string): Promise<{ id: string; deleted: boolean }> {
    const result = await this.postRequest<{ id: string; deleted: boolean }>({ action: 'delete', sheet, id });
    this.cache.invalidate(sheet);
    return result;
  }

  public ensureSheet(sheet: SheetName, headers?: readonly string[]) {
    return this.postRequest<{ sheet: string; ready: boolean }>({ action: 'ensure_sheet', sheet, headers });
  }

  public syncSchema(schemas: Record<string, readonly string[]>) {
    return this.postRequest<Array<{ sheet: string; ready: boolean; created: boolean; addedColumns: string[] }>>({
      action: 'sync_schema',
      schemas,
    });
  }

  private assertConfigured(action: string, sheet?: string): void {
    if (!this.isConfigured()) {
      throw new SheetsError('Chưa cấu hình VITE_SHEETS_WEBAPP_URL trong .env.', { action, sheet });
    }
  }

  private async getRequest<T>(params: Record<string, string>): Promise<T> {
    this.assertConfigured(params.action, params.sheet);
    const url = new URL(this.webAppUrl);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) url.searchParams.set(key, value);
    });
    if (this.authToken) url.searchParams.set('authToken', this.authToken);

    const response = await fetch(url.toString(), { method: 'GET' });
    return this.parseResponse<T>(response, params.action, params.sheet);
  }

  private async postRequest<T>(body: Record<string, unknown>): Promise<T> {
    const action = String(body.action ?? '');
    const sheet = typeof body.sheet === 'string' ? body.sheet : undefined;
    this.assertConfigured(action, sheet);

    const response = await fetch(this.webAppUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ ...body, authToken: body.authToken ?? this.authToken ?? undefined }),
    });
    return this.parseResponse<T>(response, action, sheet);
  }

  private async parseResponse<T>(response: Response, action?: string, sheet?: string): Promise<T> {
    if (!response.ok) {
      throw new SheetsError(`HTTP ${response.status} from Google Sheets Web App`, { action, sheet });
    }
    const json = (await response.json()) as SheetsApiResponse<T>;
    if (!json.ok) {
      const errorMsg = json.error || 'Unknown Google Sheets API error';
      if (errorMsg.toLowerCase().includes('unauthorized') && action !== 'auth_login') {
        this.onUnauthorizedCallback?.();
      }
      throw new SheetsError(errorMsg, { action, sheet });
    }
    return json.data as T;
  }
}

export const sheetsClient = new SheetsClient();
