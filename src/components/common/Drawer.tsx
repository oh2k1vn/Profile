import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { audioService } from '../../services/audioService';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  footer,
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        audioService.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    audioService.playClick();
    onClose();
  };

  const drawerContent = (
    <div className="fixed inset-0 z-99999 flex justify-end">
      {/* Backdrop overlay floating above all navbar, header & footer elements */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity animate-fade-in z-99999"
      />

      {/* Drawer Container Panel */}
      <aside className="relative z-100000 w-full max-w-5xl h-full liquid-glass border-l border-white/20 shadow-2xl flex flex-col overflow-hidden animate-slide-in-right">
        {/* iOS Drag handle indicator */}
        <div className="w-12 h-1.5 rounded-full bg-white/25 mx-auto mt-3 sm:hidden" />

        {/* 1. HEADER LAYOUT */}
        <header className="px-6 py-4 border-b border-white/12 flex items-center justify-between shrink-0 bg-slate-900/40 backdrop-blur-md">
          <div>
            <h2 className="text-base font-bold font-sans text-white tracking-wide">{title}</h2>
            {subtitle && <p className="text-xs font-sans text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Đóng cửa sổ"
          >
            <X size={18} />
          </button>
        </header>

        {/* 2. CONTENT LAYOUT */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 scrollbar-none">
          {children}
        </main>

        {/* 3. FOOTER LAYOUT */}
        {footer && (
          <footer className="px-6 py-4 border-t border-white/12 shrink-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-end gap-3">
            {footer}
          </footer>
        )}
      </aside>
    </div>
  );

  return createPortal(drawerContent, document.body);
};
