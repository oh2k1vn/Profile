/**
 * Google Apps Script — Multi-Tab Database & Zero-Trust Auth Backend
 * ------------------------------------------------------------------
 * - Không lưu mật khẩu dạng đọc được (dùng Salted Iterated SHA-256).
 * - Không lộ secret hay hash ra Frontend (.env chỉ cần URL Web App).
 * - Xác thực phiên bằng HMAC-SHA256 Token có thời hạn (exp) + chống brute-force.
 */

const SCRIPT_PROPS = PropertiesService.getScriptProperties();
const SCRIPT_CACHE = CacheService.getScriptCache();

// Các tab cho phép đọc công khai (không cần đăng nhập) - hiện để trống để khóa toàn bộ
const PUBLIC_READ_SHEETS = [];

// Các tab cho phép ghi công khai (ví dụ Guestbook sau này) - hiện để trống để khóa toàn bộ
const PUBLIC_WRITE_SHEETS = [];

const HASH_ITERATIONS = 10000;
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 giờ
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 60;

const ALL_PERMISSIONS = [
  'dashboard',
  'profile',
  'skills',
  'projects',
  'posts',
  'categories',
  'guestbook',
  'database',
  'finance',
];

const DEFAULT_SCHEMA = {
  Profile: ['id', 'fullName', 'title', 'bio', 'avatarUrl', 'email', 'github', 'location', 'availableForHire', 'updatedAt'],
  Skills: ['id', 'name', 'category', 'level', 'icon', 'order', 'createdAt', 'updatedAt'],
  Projects: ['id', 'title', 'slug', 'summary', 'description', 'thumbnail', 'techStack', 'liveUrl', 'repoUrl', 'featured', 'order', 'createdAt', 'updatedAt'],
  Posts: ['id', 'title', 'slug', 'excerpt', 'content', 'coverImage', 'categoryId', 'tags', 'published', 'publishedAt', 'createdAt', 'updatedAt'],
  Categories: ['id', 'name', 'slug', 'description', 'color', 'createdAt', 'updatedAt'],
  Guestbook: ['id', 'author', 'message', 'emoji', 'website', 'approved', 'createdAt', 'updatedAt'],
  Debts: ['id', 'title', 'category', 'lender', 'principalAmount', 'totalAmount', 'paidAmount', 'monthlyPayment', 'interestRate', 'rolloverFeeRate', 'currentTerm', 'totalTerms', 'dueDay', 'startDate', 'dueDate', 'status', 'notes', 'createdAt', 'updatedAt'],
};

/**
 * Chạy hàm này 1 lần trong Apps Script Editor để khởi tạo các tab Database.
 */
function setupDatabaseSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const created = [];

  Object.keys(DEFAULT_SCHEMA).forEach((sheetName) => {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      const headers = DEFAULT_SCHEMA[sheetName];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#0f172a').setFontColor('#f8fafc');
      sheet.setFrozenRows(1);
      created.push(sheetName);
    }
  });

  return { ok: true, created };
}

/**
 * Chạy hàm này 1 lần trong Apps Script Editor để thiết lập mã truy cập đã mã hóa.
 * Ví dụ: sửa 'THAY_MA_BI_MAT_CUA_BAN' rồi nhấn Run, sau đó xóa chuỗi vừa nhập khỏi code.
 */
function setupAuthPasscode(rawPasscode) {
  const code = rawPasscode || 'THAY_MA_BI_MAT_CUA_BAN';
  if (code === 'THAY_MA_BI_MAT_CUA_BAN' || String(code).length < 6) {
    throw new Error('Vui lòng truyền mã bí mật ít nhất 6 ký tự vào setupAuthPasscode("...")');
  }

  const salt = Utilities.getUuid().replace(/-/g, '');
  const hash = computeSaltedHash(String(code), salt);
  const signingSecret = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');

  SCRIPT_PROPS.setProperties({
    AUTH_SALT: salt,
    AUTH_PASSCODE_HASH: hash,
    SESSION_SIGNING_SECRET: signingSecret,
  });

  return { ok: true, message: 'Đã mã hóa và lưu thông tin xác thực an toàn vào ScriptProperties.' };
}

/**
 * GET handler:
 * Mọi thao tác đọc tab bảo vệ hoặc meta đều yêu cầu authToken hợp lệ.
 */
function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = params.action || 'list';
    const token = params.authToken || '';

    if (action === 'meta') {
      const session = verifyAuthToken(token);
      if (!session) {
        return jsonResponse({ ok: false, error: 'Unauthorized: invalid or expired session' });
      }
      return jsonResponse({ ok: true, data: getSpreadsheetMeta() });
    }

    const sheetName = params.sheet;
    if (!sheetName) {
      return jsonResponse({ ok: false, error: 'Missing required parameter: sheet' });
    }

    if (PUBLIC_READ_SHEETS.indexOf(sheetName) === -1) {
      const session = verifyAuthToken(token);
      if (!session) {
        return jsonResponse({ ok: false, error: 'Unauthorized: invalid or expired session' });
      }
    }

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      return jsonResponse({ ok: false, error: `Sheet "${sheetName}" not found` });
    }

    const rows = readSheetAsObjects(sheet);

    if (action === 'get') {
      const id = params.id;
      if (!id) {
        return jsonResponse({ ok: false, error: 'Missing required parameter: id' });
      }
      const found = rows.find((row) => String(row.id) === String(id));
      if (!found) {
        return jsonResponse({ ok: false, error: `Record "${id}" not found in "${sheetName}"` });
      }
      return jsonResponse({ ok: true, data: found });
    }

    return jsonResponse({ ok: true, data: rows });
  } catch (err) {
    return jsonResponse({ ok: false, error: err && err.message ? err.message : String(err) });
  }
}

/**
 * POST handler:
 * - auth_login: xác thực mã bí mật trên server và cấp HMAC token
 * - auth_verify: kiểm tra HMAC token còn hợp lệ không
 * - create / update / upsert / delete / ensure_sheet: yêu cầu authToken hợp lệ
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const rawBody = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    const payload = JSON.parse(rawBody);
    const action = payload.action;

    if (!action) {
      return jsonResponse({ ok: false, error: 'Missing required field: action' });
    }

    if (action === 'auth_login') {
      return jsonResponse(handleAuthLogin(payload.passcode));
    }

    if (action === 'auth_verify') {
      const session = verifyAuthToken(payload.authToken || '');
      if (!session) {
        return jsonResponse({ ok: false, error: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' });
      }
      return jsonResponse({ ok: true, data: { session } });
    }

    if (action === 'sync_schema') {
      const session = verifyAuthToken(payload.authToken || '');
      if (!session) {
        return jsonResponse({ ok: false, error: 'Unauthorized: invalid or expired session' });
      }
      const schemas = payload.schemas || DEFAULT_SCHEMA;
      return jsonResponse({ ok: true, data: syncAllSchemas(SpreadsheetApp.getActiveSpreadsheet(), schemas) });
    }

    const sheetName = payload.sheet;
    if (!sheetName) {
      return jsonResponse({ ok: false, error: 'Missing required field: sheet' });
    }

    const isPublicCreate = action === 'create' && PUBLIC_WRITE_SHEETS.indexOf(sheetName) !== -1;
    if (!isPublicCreate) {
      const session = verifyAuthToken(payload.authToken || '');
      if (!session) {
        return jsonResponse({ ok: false, error: 'Unauthorized: invalid or expired session' });
      }
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (action === 'ensure_sheet') {
      const headers = Array.isArray(payload.headers) && payload.headers.length > 0
        ? payload.headers
        : (DEFAULT_SCHEMA[sheetName] || ['id', 'createdAt', 'updatedAt']);
      const result = ensureSheetWithHeaders(ss, sheetName, headers);
      return jsonResponse({ ok: true, data: result });
    }

    let sheet = ss.getSheetByName(sheetName);
    if (!sheet && DEFAULT_SCHEMA[sheetName]) {
      ensureSheetWithHeaders(ss, sheetName, DEFAULT_SCHEMA[sheetName]);
      sheet = ss.getSheetByName(sheetName);
    }
    if (!sheet) {
      return jsonResponse({ ok: false, error: `Sheet "${sheetName}" not found` });
    }

    if (action === 'create') {
      return jsonResponse({ ok: true, data: createRecord(sheet, payload.data || {}) });
    }

    if (action === 'update') {
      const id = payload.id || (payload.data && payload.data.id);
      if (!id) return jsonResponse({ ok: false, error: 'Missing required field: id' });
      return jsonResponse({ ok: true, data: updateRecord(sheet, id, payload.data || {}) });
    }

    if (action === 'upsert') {
      const id = payload.id || (payload.data && payload.data.id);
      if (!id) return jsonResponse({ ok: false, error: 'Missing required field: id' });
      const existingIndex = findRowIndexById(sheet, id);
      const record = existingIndex > 0
        ? updateRecord(sheet, id, payload.data || {})
        : createRecord(sheet, Object.assign({}, payload.data || {}, { id }));
      return jsonResponse({ ok: true, data: record });
    }

    if (action === 'delete') {
      const id = payload.id;
      if (!id) return jsonResponse({ ok: false, error: 'Missing required field: id' });
      deleteRecord(sheet, id);
      return jsonResponse({ ok: true, data: { id, deleted: true } });
    }

    return jsonResponse({ ok: false, error: `Unsupported action: ${action}` });
  } catch (err) {
    return jsonResponse({ ok: false, error: err && err.message ? err.message : String(err) });
  } finally {
    lock.releaseLock();
  }
}

/* -------------------- Security & Auth Helpers -------------------- */

function handleAuthLogin(passcode) {
  const lockUntilStr = SCRIPT_CACHE.get('auth_lock_until');
  const now = Date.now();
  if (lockUntilStr && Number(lockUntilStr) > now) {
    const remainSec = Math.ceil((Number(lockUntilStr) - now) / 1000);
    return { ok: false, error: `Hệ thống đang tạm khóa. Thử lại sau ${remainSec}s.` };
  }

  const salt = SCRIPT_PROPS.getProperty('AUTH_SALT');
  const expectedHash = SCRIPT_PROPS.getProperty('AUTH_PASSCODE_HASH');
  const signingSecret = SCRIPT_PROPS.getProperty('SESSION_SIGNING_SECRET');

  if (!salt || !expectedHash || !signingSecret) {
    return { ok: false, error: 'Server chưa chạy setupAuthPasscode() trong Apps Script.' };
  }

  if (!passcode || typeof passcode !== 'string') {
    return { ok: false, error: 'Vui lòng nhập mã truy cập.' };
  }

  const computedHash = computeSaltedHash(passcode, salt);
  if (!constantTimeEqual(computedHash, expectedHash)) {
    const attempts = Number(SCRIPT_CACHE.get('auth_fail_count') || '0') + 1;
    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      SCRIPT_CACHE.put('auth_lock_until', String(now + LOCKOUT_SECONDS * 1000), LOCKOUT_SECONDS);
      SCRIPT_CACHE.remove('auth_fail_count');
      return { ok: false, error: `Nhập sai quá ${MAX_LOGIN_ATTEMPTS} lần. Tạm khóa ${LOCKOUT_SECONDS}s.` };
    }
    SCRIPT_CACHE.put('auth_fail_count', String(attempts), LOCKOUT_SECONDS * 5);
    return { ok: false, error: `Mã truy cập không chính xác (còn ${MAX_LOGIN_ATTEMPTS - attempts} lần thử).` };
  }

  SCRIPT_CACHE.remove('auth_fail_count');
  SCRIPT_CACHE.remove('auth_lock_until');

  const session = {
    role: 'admin',
    permissions: ALL_PERMISSIONS,
    issuedAt: now,
    expiresAt: now + TOKEN_TTL_MS,
  };

  const token = signSessionToken(session, signingSecret);
  return { ok: true, data: { token, session } };
}

function computeSaltedHash(passcode, salt) {
  let digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, `${salt}:${passcode}`);
  for (let i = 1; i < HASH_ITERATIONS; i++) {
    digest = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, digest);
  }
  return bytesToHex(digest);
}

function signSessionToken(session, secret) {
  const payloadB64 = Utilities.base64EncodeWebSafe(JSON.stringify(session));
  const sigBytes = Utilities.computeHmacSha256Signature(payloadB64, secret);
  const sigHex = bytesToHex(sigBytes);
  return `${payloadB64}.${sigHex}`;
}

function verifyAuthToken(token) {
  try {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const payloadB64 = parts[0];
    const providedSig = parts[1];
    const secret = SCRIPT_PROPS.getProperty('SESSION_SIGNING_SECRET');
    if (!secret) return null;

    const expectedSig = bytesToHex(Utilities.computeHmacSha256Signature(payloadB64, secret));
    if (!constantTimeEqual(providedSig, expectedSig)) return null;

    const jsonStr = Utilities.newBlob(Utilities.base64DecodeWebSafe(payloadB64)).getDataAsString('UTF-8');
    const session = JSON.parse(jsonStr);
    if (!session || typeof session.expiresAt !== 'number' || session.expiresAt <= Date.now()) {
      return null;
    }
    return session;
  } catch (_) {
    return null;
  }
}

function constantTimeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function bytesToHex(bytes) {
  return bytes
    .map((b) => ('0' + (b & 0xff).toString(16)).slice(-2))
    .join('');
}

/* -------------------- Sheet CRUD Helpers -------------------- */

function ensureSheetWithHeaders(ss, sheetName, headers) {
  let sheet = ss.getSheetByName(sheetName);
  let created = false;
  const addedColumns = [];

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#0f172a').setFontColor('#f8fafc');
    sheet.setFrozenRows(1);
    created = true;
  } else {
    const existing = getHeaders(sheet);
    const missing = headers.filter((h) => existing.indexOf(h) === -1);
    if (missing.length > 0) {
      const startCol = existing.length + 1;
      sheet.getRange(1, startCol, 1, missing.length).setValues([missing]);
      sheet.getRange(1, startCol, 1, missing.length).setFontWeight('bold').setBackground('#0f172a').setFontColor('#f8fafc');
      missing.forEach((m) => addedColumns.push(m));
    }
  }

  return { sheet: sheetName, ready: true, created, addedColumns };
}

function syncAllSchemas(ss, schemas) {
  const results = [];
  Object.keys(schemas).forEach((name) => {
    const headers = schemas[name];
    if (Array.isArray(headers) && headers.length > 0) {
      results.push(ensureSheetWithHeaders(ss, name, headers));
    }
  });
  return results;
}

function getSpreadsheetMeta() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheets().map((sheet) => {
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    const headers = lastCol > 0 && lastRow > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
    return {
      name: sheet.getName(),
      rowCount: Math.max(0, lastRow - 1),
      headers: headers.filter((h) => h !== ''),
    };
  });
}

function getHeaders(sheet) {
  const lastCol = sheet.getLastColumn();
  if (lastCol === 0 || sheet.getLastRow() === 0) return [];
  return sheet.getRange(1, 1, 1, lastCol).getValues()[0].map((h) => String(h).trim());
}

function readSheetAsObjects(sheet) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2 || lastCol === 0) return [];

  const values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
  const headers = values[0].map((h) => String(h).trim());
  const records = [];

  for (let r = 1; r < values.length; r++) {
    const row = values[r];
    const isEmpty = row.every((cell) => cell === '' || cell === null || cell === undefined);
    if (isEmpty) continue;

    const obj = {};
    for (let c = 0; c < headers.length; c++) {
      const key = headers[c];
      if (!key) continue;
      obj[key] = deserializeCell(row[c]);
    }
    records.push(obj);
  }
  return records;
}

function findRowIndexById(sheet, id) {
  const headers = getHeaders(sheet);
  const idCol = headers.indexOf('id') + 1;
  if (idCol <= 0 || sheet.getLastRow() < 2) return -1;

  const ids = sheet.getRange(2, idCol, sheet.getLastRow() - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) {
      return i + 2;
    }
  }
  return -1;
}

function createRecord(sheet, data) {
  const headers = getHeaders(sheet);
  if (headers.length === 0) throw new Error('Sheet has no header row');

  const now = new Date().toISOString();
  const record = Object.assign({}, data);
  if (!record.id) record.id = Utilities.getUuid();
  if (headers.indexOf('createdAt') !== -1 && !record.createdAt) record.createdAt = now;
  if (headers.indexOf('updatedAt') !== -1) record.updatedAt = now;

  const rowValues = headers.map((h) => serializeCell(record[h]));
  sheet.appendRow(rowValues);
  return record;
}

function updateRecord(sheet, id, data) {
  const rowIndex = findRowIndexById(sheet, id);
  if (rowIndex < 0) throw new Error(`Record "${id}" not found`);

  const headers = getHeaders(sheet);
  const currentValues = sheet.getRange(rowIndex, 1, 1, headers.length).getValues()[0];
  const currentObj = {};
  headers.forEach((h, idx) => {
    currentObj[h] = deserializeCell(currentValues[idx]);
  });

  const now = new Date().toISOString();
  const merged = Object.assign({}, currentObj, data, { id: currentObj.id });
  if (headers.indexOf('updatedAt') !== -1) merged.updatedAt = now;

  const nextValues = headers.map((h) => serializeCell(merged[h]));
  sheet.getRange(rowIndex, 1, 1, headers.length).setValues([nextValues]);
  return merged;
}

function deleteRecord(sheet, id) {
  const rowIndex = findRowIndexById(sheet, id);
  if (rowIndex < 0) throw new Error(`Record "${id}" not found`);
  sheet.deleteRow(rowIndex);
}

function serializeCell(value) {
  if (value === undefined || value === null) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return value;
}

function deserializeCell(value) {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
      try {
        return JSON.parse(trimmed);
      } catch (_) {
        return value;
      }
    }
  }
  return value;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
