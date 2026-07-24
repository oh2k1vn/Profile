import { useState } from 'react';
import { X, Save, Tag, FileText, Type } from 'lucide-react';
import type { BlogEditorProps } from '../../types/blog';
import { createBlogPost } from '../../services/blogService';
import { audioService } from '../../services/audioService';

export function BlogEditor({ onClose, onSaved }: BlogEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags(prev => [...prev, tag]);
      setTagInput('');
      audioService.playClick();
    }
  };

  const removeTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
    audioService.playClick();
  };

  const handleKeyDownTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Tiêu đề không được để trống');
      return;
    }
    if (!content.trim()) {
      setError('Nội dung không được để trống');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await createBlogPost(title, content, tags);
      audioService.playSuccess();
      onSaved();
      onClose();
    } catch (err) {
      console.error('Error saving blog post:', err);
      setError('Lỗi khi lưu bài viết. Kiểm tra lại Firebase config.');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xl">
      <div className="liquid-glass border border-white/20 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-6 bg-slate-900/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-400/20 text-sky-400">
              <FileText size={18} />
            </div>
            <h2 className="text-lg font-bold font-sans text-white">Viết Bài Mới</h2>
          </div>
          <button
            onClick={() => { audioService.playClick(); onClose(); }}
            className="liquid-glass-pill p-1.5 text-slate-300 hover:text-white rounded-full cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-sans font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Type size={14} />
              Tiêu đề
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài viết..."
              className="glass-input w-full px-4 py-3 rounded-2xl text-sm font-sans placeholder:text-slate-500"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-xs font-sans font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={14} />
              Nội dung (Hỗ trợ Markdown)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Viết nội dung bài viết bằng Markdown...&#10;&#10;## Tiêu đề phụ&#10;**In đậm**, *in nghiêng*&#10;- Danh sách&#10;`code`"
              rows={12}
              className="glass-input w-full px-4 py-3 rounded-2xl text-sm font-mono placeholder:text-slate-500 resize-y leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-sans font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <Tag size={14} />
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDownTag}
                placeholder="Nhập tag rồi Enter..."
                className="glass-input flex-1 px-4 py-2.5 rounded-2xl text-sm font-sans placeholder:text-slate-500"
              />
              <button
                onClick={addTag}
                className="liquid-glass-pill px-5 py-2.5 rounded-2xl text-xs font-semibold text-slate-200 hover:text-white"
              >
                Thêm
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/15 border border-sky-400/25 rounded-full text-xs font-medium text-sky-300"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-rose-400 transition-colors cursor-pointer bg-transparent border-none text-sky-300 p-0"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 bg-rose-500/15 border border-rose-500/30 rounded-2xl text-xs font-sans text-rose-300">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-6 bg-slate-900/40 flex justify-end gap-3">
          <button
            onClick={() => { audioService.playClick(); onClose(); }}
            className="liquid-glass-pill px-5 py-2.5 rounded-2xl text-xs font-medium text-slate-300 hover:text-white"
          >
            Huỷ
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="liquid-glass-accent-btn px-6 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={14} />
            {saving ? 'Đang lưu...' : 'Lưu Bài Viết'}
          </button>
        </div>
      </div>
    </div>
  );
}
