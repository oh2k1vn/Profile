import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30 selection:text-blue-100">
      {/* Subtle Background - removed heavy blobs */}
      <div className="fixed inset-0 z-0 bg-linear-to-b from-slate-900 to-slate-950 pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-6 md:py-8 flex flex-col min-h-screen">
        <main className="flex-1 flex flex-col pt-20">{children}</main>

        <footer className="mt-8 text-center text-slate-600 text-xs py-4">
          <p>© 2026 VocabMaster</p>
        </footer>
      </div>
    </div>
  );
}
