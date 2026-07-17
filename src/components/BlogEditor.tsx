import { useState } from 'react';
import { X, Save, Tag, FileText, Type } from 'lucide-react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { audioService } from '../utils/audio';

interface BlogEditorProps {
  onClose: () => void;
  onSaved: () => void;
}

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
      await addDoc(collection(db, 'blog_posts'), {
        title: title.trim(),
        content: content.trim(),
        tags,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="glass-panel border border-light-green/30 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-light-green/15 p-5">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-heading-primary" />
            <h2 className="text-lg font-bold font-mono text-heading-primary">Viết Bài Mới</h2>
          </div>
          <button
            onClick={() => { audioService.playClick(); onClose(); }}
            className="p-1.5 rounded-lg hover:bg-light-green/15 text-text-green hover:text-text-light transition-colors cursor-pointer bg-transparent border-none"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-text-green uppercase tracking-wider flex items-center gap-1.5">
              <Type size={12} className="text-heading-accent" />
              Tiêu đề
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề bài viết..."
              className="w-full px-4 py-3 bg-black/40 border border-light-green/20 rounded-lg text-sm font-mono text-text-light placeholder:text-text-green/40 focus:outline-none focus:border-heading-primary/60 transition-colors"
            />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-text-green uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={12} className="text-heading-accent" />
              Nội dung (Hỗ trợ Markdown)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Viết nội dung bài viết bằng Markdown...&#10;&#10;## Tiêu đề phụ&#10;**In đậm**, *in nghiêng*&#10;- Danh sách&#10;`code`"
              rows={14}
              className="w-full px-4 py-3 bg-black/40 border border-light-green/20 rounded-lg text-sm font-mono text-text-light placeholder:text-text-green/40 focus:outline-none focus:border-heading-primary/60 transition-colors resize-y leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-text-green uppercase tracking-wider flex items-center gap-1.5">
              <Tag size={12} className="text-heading-accent" />
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDownTag}
                placeholder="Nhập tag rồi Enter..."
                className="flex-1 px-4 py-2.5 bg-black/40 border border-light-green/20 rounded-lg text-sm font-mono text-text-light placeholder:text-text-green/40 focus:outline-none focus:border-heading-primary/60 transition-colors"
              />
              <button
                onClick={addTag}
                className="px-4 py-2.5 bg-light-green/15 border border-light-green/25 rounded-lg text-xs font-mono text-text-light hover:bg-light-green/25 transition-colors cursor-pointer"
              >
                Thêm
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-heading-primary/15 border border-heading-primary/30 rounded-full text-[11px] font-mono text-heading-accent"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-400 transition-colors cursor-pointer bg-transparent border-none text-heading-accent p-0"
                    >
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-2.5 bg-red-500/10 border border-red-500/30 rounded-lg text-xs font-mono text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-light-green/15 p-5 flex justify-end gap-3">
          <button
            onClick={() => { audioService.playClick(); onClose(); }}
            className="px-5 py-2.5 border border-light-green/25 rounded-lg text-xs font-mono text-text-green hover:text-text-light hover:border-light-green/50 transition-all cursor-pointer bg-transparent"
          >
            Huỷ
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-heading-primary hover:bg-heading-accent text-dark-green rounded-lg text-xs font-mono font-bold flex items-center gap-2 cursor-pointer transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-none"
          >
            <Save size={14} />
            {saving ? 'Đang lưu...' : 'Lưu Bài Viết'}
          </button>
        </div>
      </div>
    </div>
  );
}
