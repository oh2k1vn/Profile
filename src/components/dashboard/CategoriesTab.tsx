import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, Tags, CheckCircle2, AlertCircle, User as UserIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchBlogCategoryObjects, addBlogCategory, deleteBlogCategory } from '../../services/categoryService';
import type { BlogCategory } from '../../services/categoryService';
import { audioService } from '../../services/audioService';
import { useProfile } from '../../contexts/ProfileContext';
import { canManageResource } from '../../utils/authUtils';
import { ConfirmModal } from '../common/ConfirmModal';

interface CategoriesTabProps {
  isAdmin?: boolean;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({ isAdmin: propIsAdmin }) => {
  const { user, isAdmin: contextIsAdmin, profile } = useProfile();
  const isAdmin = propIsAdmin ?? contextIsAdmin;
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatInput, setNewCatInput] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [catToDelete, setCatToDelete] = useState<BlogCategory | null>(null);

  const canCreate = !!user;

  const loadCategories = async () => {
    try {
      const fetched = await fetchBlogCategoryObjects();
      setCategories(fetched);
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newCatInput.trim()) return;

    setAdding(true);
    setError('');
    setSuccessMsg('');
    audioService.playClick();

    try {
      const authorName = profile?.displayName || user.displayName || user.email?.split('@')[0] || 'Tác giả';
      await addBlogCategory(newCatInput, user.uid, authorName);
      audioService.playSuccess();
      const addedName = newCatInput.trim();
      setNewCatInput('');
      toast.success(`Đã thêm danh mục "${addedName}" thành công!`);
      setSuccessMsg(`Đã thêm danh mục "${addedName}" thành công!`);
      setTimeout(() => setSuccessMsg(''), 3000);
      await loadCategories();
    } catch (err: any) {
      console.error('Error adding category:', err);
      audioService.playError();
      const errMsg = err.message || 'Không thể thêm danh mục. Vui lòng thử lại.';
      toast.error(errMsg);
      setError(errMsg);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteCategory = async (cat: BlogCategory) => {
    if (!canManageResource(user, isAdmin, cat.authorId)) return;
    audioService.playClick();
    try {
      await deleteBlogCategory(cat.id);
      audioService.playSuccess();
      toast.success(`Đã xoá danh mục "${cat.name}"!`);
      setCategories(prev => prev.filter(c => c.id !== cat.id));
    } catch (err) {
      console.error('Error deleting category:', err);
      audioService.playError();
      toast.error(`Lỗi khi xoá danh mục "${cat.name}"!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Title */}
      <div className="border-b border-white/10 pb-4">
        <h2 className="text-base font-bold font-sans text-white">Quản Lý Danh Mục Blog</h2>
        <p className="text-xs font-sans text-slate-400">Thêm mới hoặc quản lý danh mục phân loại bài viết.</p>
      </div>

      {/* Inline Form Add Category */}
      {canCreate && (
        <form onSubmit={handleAddCategory} className="liquid-glass rounded-2xl p-4 sm:p-5 border border-white/12 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newCatInput}
              onChange={e => setNewCatInput(e.target.value)}
              placeholder="Nhập tên danh mục mới (VD: Mobile App, AI & ML...)"
              className="glass-input flex-1 px-4 py-2.5 rounded-xl text-xs text-white"
            />
            <button
              type="submit"
              disabled={adding}
              className="liquid-glass-accent-btn px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shrink-0 justify-center disabled:opacity-50"
            >
              {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
              Thêm Danh Mục
            </button>
          </div>

          {error && (
            <p className="text-xs text-rose-400 flex items-center gap-1.5 pt-1">
              <AlertCircle size={13} /> {error}
            </p>
          )}

          {successMsg && (
            <p className="text-xs text-emerald-300 flex items-center gap-1.5 pt-1">
              <CheckCircle2 size={13} /> {successMsg}
            </p>
          )}
        </form>
      )}

      {/* Category List */}
      {loading ? (
        <div className="py-12 text-center space-y-3">
          <Loader2 size={32} className="mx-auto text-sky-400 animate-spin" />
          <p className="text-xs text-slate-400 font-sans">Đang tải danh mục bài viết...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="py-12 text-center liquid-glass rounded-2xl p-6 border border-white/10 space-y-2">
          <Tags size={36} className="mx-auto text-slate-500 opacity-60" />
          <p className="text-sm font-semibold text-slate-300">Chưa có danh mục nào</p>
          <p className="text-xs text-slate-400">Hãy thêm danh mục mới bằng ô phía trên.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map(cat => {
            const canManage = canManageResource(user, isAdmin, cat.authorId);

            return (
              <div
                key={cat.id}
                className="liquid-glass p-3.5 rounded-2xl border border-white/10 flex items-center justify-between gap-3 group hover:border-white/20 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400 shrink-0">
                    <Tags size={14} />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-white truncate">{cat.name}</span>
                    {cat.authorName && (
                      <span className="text-[9px] text-slate-400 flex items-center gap-1">
                        <UserIcon size={9} className="text-sky-400" />
                        {cat.authorName}
                      </span>
                    )}
                  </div>
                </div>

                {canManage && (
                  <button
                    onClick={() => { audioService.playClick(); setCatToDelete(cat); }}
                    className="p-1.5 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl cursor-pointer transition-all opacity-80 group-hover:opacity-100 shrink-0"
                    title={`Xoá danh mục ${cat.name}`}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmModal
        isOpen={!!catToDelete}
        onClose={() => setCatToDelete(null)}
        onConfirm={async () => {
          if (catToDelete) {
            await handleDeleteCategory(catToDelete);
            setCatToDelete(null);
          }
        }}
        title="Xác Nhận Xoá Danh Mục"
        message={
          <>
            Bạn có chắc chắn muốn xoá danh mục <strong className="text-white font-semibold">"{catToDelete?.name}"</strong> không? Hành động này không thể hoàn tác.
          </>
        }
      />
    </div>
  );
};
