import { useState, type FormEvent } from 'react';
import { Check, Copy, Eye, EyeOff, KeyRound, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { generateSalt, hashPasscode } from '../lib/auth/crypto';
import { audioService } from '../services/audioService';

export default function AuthPage() {
  const { isBackendConfigured, isPasscodeConfigured, login } = useAuth();

  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hash generator state when VITE_AUTH_SALT / VITE_AUTH_PASSCODE_HASH are empty
  const [setupPasscode, setSetupPasscode] = useState('');
  const [generatedEnv, setGeneratedEnv] = useState<{ salt: string; hash: string } | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!passcode.trim() || !isBackendConfigured) return;

    audioService.playClick();
    setSubmitting(true);
    setError(null);

    try {
      const result = await login(passcode);
      if (result.ok) {
        audioService.playSuccess();
        setPasscode('');
      } else {
        audioService.playError();
        setError(result.error ?? 'Xác thực thất bại.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGenerateHash(e: FormEvent) {
    e.preventDefault();
    if (setupPasscode.trim().length < 6) {
      audioService.playError();
      setError('Mã truy cập tối thiểu 6 ký tự.');
      return;
    }

    audioService.playClick();
    setError(null);
    const salt = generateSalt(16);
    const hash = await hashPasscode(setupPasscode, salt);
    setGeneratedEnv({ salt, hash });
    setSetupPasscode('');
    audioService.playSuccess();
  }

  async function handleCopyEnv() {
    if (!generatedEnv) return;
    const text = `VITE_AUTH_SALT=${generatedEnv.salt}\nVITE_AUTH_PASSCODE_HASH=${generatedEnv.hash}`;
    await navigator.clipboard.writeText(text);
    audioService.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07090e] text-slate-100 px-4 py-8 flex items-center justify-center">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-gradient-to-br from-sky-500/20 via-blue-600/15 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-600/15 to-transparent blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-teal-500/15 via-sky-600/10 to-transparent blur-3xl" />
      </div>

      <main className="relative z-10 w-full max-w-sm liquid-glass rounded-3xl p-6 space-y-5">
        <header className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl liquid-glass-pill flex items-center justify-center text-sky-400 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">
              {isPasscodeConfigured ? 'Xác Thực Truy Cập' : 'Tạo Mã Hóa Bảo Mật'}
            </h1>
            <p className="text-xs text-slate-400">PBKDF2-SHA256 • HMAC-SHA256</p>
          </div>
        </header>

        {!isPasscodeConfigured ? (
          <section className="space-y-3">
            <p className="text-xs text-amber-300">
              <code className="text-white">VITE_AUTH_SALT</code> và <code className="text-white">VITE_AUTH_PASSCODE_HASH</code> đang trống. Nhập mã để tạo chuỗi mã hóa:
            </p>

            <form onSubmit={handleGenerateHash} className="space-y-2.5">
              <input
                type="password"
                value={setupPasscode}
                onChange={(e) => setSetupPasscode(e.target.value)}
                placeholder="Mã mới (tối thiểu 6 ký tự)"
                autoComplete="off"
                className="glass-input w-full rounded-2xl px-4 py-2.5 text-sm placeholder:text-slate-500"
                autoFocus
              />
              {error && (
                <p className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2 text-xs text-rose-300">
                  {error}
                </p>
              )}
              <button
                type="submit"
                className="liquid-glass-accent-btn w-full rounded-full py-2.5 text-sm font-medium text-white cursor-pointer"
              >
                Tạo mã hóa
              </button>
            </form>

            {generatedEnv && (
              <div className="liquid-glass-pill rounded-2xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-400">Dán vào .env rồi reload:</span>
                  <button
                    type="button"
                    onClick={handleCopyEnv}
                    className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Đã copy' : 'Copy'}
                  </button>
                </div>
                <pre className="text-[11px] text-slate-300 bg-slate-950/60 rounded-xl p-2.5 overflow-x-auto select-all">
{`VITE_AUTH_SALT=${generatedEnv.salt}
VITE_AUTH_PASSCODE_HASH=${generatedEnv.hash}`}
                </pre>
              </div>
            )}
          </section>
        ) : !isBackendConfigured ? (
          <p className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-300">
            Chưa cấu hình <code className="text-white">VITE_SHEETS_WEBAPP_URL</code> trong <code className="text-white">.env</code>.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="relative">
              <input
                id="passcode-input"
                type={showPasscode ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Nhập mã truy cập..."
                autoComplete="off"
                spellCheck={false}
                disabled={submitting}
                className="glass-input w-full rounded-2xl pl-4 pr-10 py-2.5 text-sm placeholder:text-slate-500 disabled:opacity-50"
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  audioService.playClick();
                  setShowPasscode((prev) => !prev);
                }}
                aria-label={showPasscode ? 'Ẩn mã' : 'Hiện mã'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition cursor-pointer"
              >
                {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-3.5 py-2 text-xs text-rose-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !passcode.trim()}
              className="liquid-glass-accent-btn w-full rounded-full py-2.5 text-sm font-medium text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              {submitting ? 'Đang xác thực...' : 'Mở khóa'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
