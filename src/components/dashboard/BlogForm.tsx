import React from 'react';
import { Save, Loader2, Globe, Lock } from 'lucide-react';
import type { BlogPost, CreateBlogInput } from '../../types/blog';
import { MarkdownEditor } from '../common/MarkdownEditor';
import { useBlogForm } from '../../hooks/dashboard/useBlogForm';

interface BlogFormProps {
  formId?: string;
  initialData?: BlogPost | null;
  onSave: (input: CreateBlogInput) => Promise<void>;
  onCancel: () => void;
  renderFooter?: boolean;
}

export const BlogForm: React.FC<BlogFormProps> = ({
  formId,
  initialData,
  onSave,
  onCancel,
  renderFooter = false,
}) => {
  const { state, actions } = useBlogForm({ initialData, onSave });

  return (
    <form id={formId} onSubmit={actions.handleSubmit} className="space-y-5">
      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">Tiêu đề bài viết *</label>
        <input
          type="text"
          required
          value={state.title}
          onChange={(e) => actions.setTitle(e.target.value)}
          placeholder="Nhập tiêu đề bài viết..."
          className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
        />
      </div>

      {/* Slug & Category (Firestore Dynamic) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Đường dẫn SEO (Slug)</label>
          <input
            type="text"
            value={state.slug}
            onChange={(e) => actions.setSlug(e.target.value)}
            placeholder="tiet-kiem-thoi-gian-build-react"
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-slate-300 font-mono"
          />
        </div>

        {/* Dynamic Firestore Category Select */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">Danh mục bài viết</label>
            <button
              type="button"
              onClick={() => actions.setIsCustomCategory(!state.isCustomCategory)}
              className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {state.isCustomCategory ? 'Chọn danh mục có sẵn' : '+ Thêm danh mục mới'}
            </button>
          </div>

          {state.isCustomCategory ? (
            <input
              type="text"
              required
              value={state.customCategoryInput}
              onChange={(e) => actions.setCustomCategoryInput(e.target.value)}
              placeholder="Nhập tên danh mục mới (ví dụ: AI & Machine Learning)..."
              className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            />
          ) : (
            <select
              value={state.category}
              onChange={(e) => actions.setCategory(e.target.value)}
              className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white bg-slate-900"
            >
              {state.categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">Tóm tắt ngắn (Excerpt)</label>
        <textarea
          rows={2}
          value={state.summary}
          onChange={(e) => actions.setSummary(e.target.value)}
          placeholder="Mô tả tóm tắt nội dung bài viết hiển thị ở danh sách bài viết..."
          className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white resize-none"
        />
      </div>

      {/* Cover Image & Tags */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Ảnh bìa URL (Cover Image)</label>
          <input
            type="text"
            value={state.coverImage}
            onChange={(e) => actions.setCoverImage(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Tags (Phân cách bằng dấu phẩy)</label>
          <input
            type="text"
            value={state.tags}
            onChange={(e) => actions.setTags(e.target.value)}
            placeholder="React, TypeScript, Tailwind"
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
          />
        </div>
      </div>

      {/* Standalone Reusable Common Markdown Editor Component */}
      <MarkdownEditor
        value={state.content}
        onChange={actions.setContent}
        rows={12}
        required
        label="Nội dung bài viết (Markdown)"
        placeholder="Viết nội dung bài viết bằng cú pháp Markdown... (Sử dụng thanh công cụ phía trên để chèn nhanh định dạng)"
      />

      {/* Published Toggle Card (iOS Liquid Glass Toggle) */}
      <div
        onClick={() => actions.setPublished(!state.published)}
        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${
          state.published
            ? 'bg-sky-500/10 border-sky-400/30 shadow-lg shadow-sky-500/5'
            : 'bg-slate-900/50 border-white/12 hover:border-white/20'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`p-2.5 rounded-xl border transition-colors ${
              state.published
                ? 'bg-sky-500/20 text-sky-400 border-sky-400/30'
                : 'bg-slate-800 text-slate-400 border-white/10'
            }`}
          >
            {state.published ? <Globe size={18} /> : <Lock size={18} />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-white">Trạng thái xuất bản bài viết</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border ${
                  state.published
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    : 'bg-slate-800 text-slate-400 border-white/10'
                }`}
              >
                {state.published ? 'Public (Công Khai)' : 'Draft (Bản Nháp)'}
              </span>
            </div>
            <p className="text-[11px] font-sans text-slate-400 mt-0.5">
              {state.published
                ? 'Bài viết sẽ hiển thị công khai trên website cho độc giả.'
                : 'Bài viết ở trạng thái bản nháp và chỉ hiển thị trong Dashboard.'}
            </p>
          </div>
        </div>

        {/* iOS Toggle Switch */}
        <button
          type="button"
          role="switch"
          aria-checked={state.published}
          onClick={(e) => {
            e.stopPropagation();
            actions.setPublished(!state.published);
          }}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            state.published ? 'bg-sky-500 shadow-[0_0_12px_rgba(56,189,248,0.4)]' : 'bg-slate-800'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
              state.published ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {renderFooter && (
        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onCancel}
            className="liquid-glass-pill px-5 py-2.5 rounded-2xl text-xs font-medium text-slate-300 hover:text-white cursor-pointer"
          >
            Huỷ
          </button>
          <button
            type="submit"
            disabled={state.saving}
            className="liquid-glass-accent-btn px-6 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {state.saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {initialData ? 'Lưu Thay Đổi' : 'Đăng Bài Viết'}
          </button>
        </div>
      )}
    </form>
  );
};
