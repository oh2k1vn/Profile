import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, Tags, CheckCircle2, AlertCircle } from 'lucide-react';
import { fetchBlogCategoryObjects, addBlogCategory, deleteBlogCategory } from '../../services/categoryService';
import type { BlogCategory } from '../../services/categoryService';
import { audioService } from '../../services/audioService';

export const CategoriesTab: React.FC = () => {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCatInput, setNewCatInput] = useState('');
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
    if (!newCatInput.trim()) return;

    setAdding(true);
    setError('');
    setSuccessMsg('');
    audioService.playClick();

    try {
      await addBlogCategory(newCatInput);
      audioService.playSuccess();
      setNewCatInput('');
      setSuccessMsg(`Đã thêm danh mục "${newCatInput.trim()}" thành công!`);
      setTimeout(() => setSuccessMsg(''), 3000);
      await loadCategories();
    } catch (err: any) {
      console.error('Error adding category:', err);
      audioService.playError();
      setError(err.message || 'Không thể thêm danh mục. Vui lòng thử lại.');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteCategory = async (cat: BlogCategory) => {
    if (!window.confirm(`Bạn có chắc muốn xoá danh mục "${cat.name}" khỏi Firestore?`)) return;

    audioService.playClick();
    try {
      await deleteBlogCategory(cat.id);
      audioService.playSuccess();
      setCategories(prev => prev.filter(c => c.id !== cat.id));
    } catch (err) {
      console.error('Error deleting category:', err);
      audioService.playError();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold font-sans text-white flex items-center gap-2">
            <Tags size={18} className="text-sky-400" />
            Quản Lý Danh Mục Bài Viết (Firestore)
          </h2>
          <p className="text-xs font-sans text-slate-400">
            Quản lý, thêm mới và xoá các danh mục phân loại bài viết blog.
          </p>
        </div>
      </div>

      {/* Add New Category Form */}
      <form onSubmit={handleAddCategory} className="liquid-glass rounded-3xl p-5 border border-white/12 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Thêm Danh Mục Mới</h3>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={newCatInput}
            onChange={e => setNewCatInput(e.target.value)}
            placeholder="Nhập tên danh mục mới (ví dụ: Artificial Intelligence, DevOps, Clean Code)..."
            className="glass-input flex-1 px-4 py-2.5 rounded-2xl text-xs text-white"
          />
          <button
            type="submit"
            disabled={adding || !newCatInput.trim()}
            className="liquid-glass-accent-btn px-6 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
          >
            {adding ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
            Thêm Danh Mục
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 p-3 rounded-2xl">
            <AlertCircle size={14} />
            {error}
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 text-emerald-400 text-xs bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-2xl">
            <CheckCircle2 size={14} />
            {successMsg}
          </div>
        )}
      </form>

      {/* Category List */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={32} className="text-sky-400 animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="liquid-glass rounded-3xl p-10 text-center text-slate-400 text-xs">
          Chưa có danh mục nào trên Firestore. Hãy thêm danh mục đầu tiên phía trên!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="liquid-glass rounded-2xl p-4 border border-white/12 flex items-center justify-between gap-3 group hover:border-sky-400/40 transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400 shrink-0">
                  <Tags size={14} />
                </div>
                <span className="text-xs font-bold text-white truncate">{cat.name}</span>
              </div>

              <button
                onClick={() => handleDeleteCategory(cat)}
                className="p-1.5 text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl cursor-pointer transition-all opacity-80 group-hover:opacity-100 shrink-0"
                title={`Xoá danh mục ${cat.name}`}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
