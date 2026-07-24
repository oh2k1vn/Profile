import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';

import type { BlogPost, CreateBlogInput } from '../../types/blog';
import { slugify } from '../../services/blogService';
import { fetchBlogCategories } from '../../services/categoryService';
import { MarkdownEditor } from '../common/MarkdownEditor';

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
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  const [summary, setSummary] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [published, setPublished] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch Firestore categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      const fetched = await fetchBlogCategories();
      setCategories(fetched);
      if (fetched.length > 0 && !initialData) {
        setCategory(fetched[0]);
      }
    };
    loadCategories();
  }, [initialData]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setSlug(initialData.slug || slugify(initialData.title || ''));
      setCategory(initialData.category || '');
      setSummary(initialData.summary || '');
      setCoverImage(initialData.coverImage || '');
      setContent(initialData.content || '');
      setTags(initialData.tags ? initialData.tags.join(', ') : '');
      setPublished(initialData.published ?? true);
      setIsCustomCategory(false);
    } else {
      setTitle('');
      setSlug('');
      setSummary('');
      setCoverImage('');
      setContent('');
      setTags('');
      setPublished(true);
      setIsCustomCategory(false);
    }
  }, [initialData]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initialData) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving || !title.trim() || !content.trim()) return;
    setSaving(true);

    const finalCategory = isCustomCategory ? customCategoryInput.trim() : category;

    try {
      const tagsArray = tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      await onSave({
        title: title.trim(),
        slug: slug.trim() || slugify(title),
        category: finalCategory || '',
        summary: summary.trim(),
        coverImage: coverImage.trim(),
        content: content.trim(),
        tags: tagsArray,
        published,
      });

      if (!initialData) {
        setTitle('');
        setSlug('');
        setSummary('');
        setCoverImage('');
        setContent('');
        setTags('');
        setPublished(true);
        setIsCustomCategory(false);
        setCustomCategoryInput('');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">Tiêu đề bài viết *</label>
        <input
          type="text"
          required
          value={title}
          onChange={e => handleTitleChange(e.target.value)}
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
            value={slug}
            onChange={e => setSlug(e.target.value)}
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
              onClick={() => setIsCustomCategory(!isCustomCategory)}
              className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {isCustomCategory ? 'Chọn danh mục có sẵn' : '+ Thêm danh mục mới'}
            </button>
          </div>

          {isCustomCategory ? (
            <input
              type="text"
              required
              value={customCategoryInput}
              onChange={e => setCustomCategoryInput(e.target.value)}
              placeholder="Nhập tên danh mục mới (ví dụ: AI & Machine Learning)..."
              className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
            />
          ) : (
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white bg-slate-900"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
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
          value={summary}
          onChange={e => setSummary(e.target.value)}
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
            value={coverImage}
            onChange={e => setCoverImage(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Tags (Phân cách bằng dấu phẩy)</label>
          <input
            type="text"
            value={tags}
            onChange={e => setTags(e.target.value)}
            placeholder="React, TypeScript, Tailwind"
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs text-white"
          />
        </div>
      </div>

      {/* Standalone Reusable Common Markdown Editor Component */}
      <MarkdownEditor
        value={content}
        onChange={setContent}
        rows={12}
        required
        label="Nội dung bài viết (Markdown)"
        placeholder="Viết nội dung bài viết bằng cú pháp Markdown... (Sử dụng thanh công cụ phía trên để chèn nhanh định dạng)"
      />

      {/* Published Toggle */}
      <div className="flex items-center space-x-2 pt-1">
        <input
          type="checkbox"
          id="published-toggle"
          checked={published}
          onChange={e => setPublished(e.target.checked)}
          className="w-4 h-4 rounded border-white/20 bg-slate-900 text-sky-400 focus:ring-sky-400/20 cursor-pointer"
        />
        <label htmlFor="published-toggle" className="text-xs text-slate-300 cursor-pointer select-none">
          Xuất bản bài viết ngay lập tức (Public)
        </label>
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
            disabled={saving}
            className="liquid-glass-accent-btn px-6 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {initialData ? 'Lưu Thay Đổi' : 'Đăng Bài Viết'}
          </button>
        </div>
      )}
    </form>
  );
};
