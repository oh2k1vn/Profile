import React, { useState, useRef } from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Code,
  SquareCode,
  Link,
  List,
  Quote,
  Table,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  label?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  rows = 12,
  placeholder = 'Viết nội dung bằng cú pháp Markdown...',
  required = false,
  label = 'Nội dung bài viết (Markdown)',
}) => {
  const [showMdGuide, setShowMdGuide] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to insert Markdown syntax at cursor position
  const insertMarkdown = (prefix: string, suffix: string = '', defaultPlaceholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultPlaceholder;
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 0);
  };

  return (
    <div className="space-y-2">
      {/* Header Label & Cheat-sheet Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>

        <button
          type="button"
          onClick={() => setShowMdGuide(!showMdGuide)}
          className="text-[11px] text-purple-300 hover:text-purple-200 flex items-center gap-1 cursor-pointer bg-purple-500/10 border border-purple-400/20 px-2.5 py-1 rounded-lg self-start sm:self-auto transition-all"
        >
          <HelpCircle size={13} />
          {showMdGuide ? 'Ẩn Hướng Dẫn Cú Pháp' : '💡 Gợi Ý & Cú Pháp Markdown'}
          {showMdGuide ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* Collapsible Markdown Cheat-sheet Guide */}
      {showMdGuide && (
        <div className="liquid-glass rounded-2xl p-4 border border-purple-400/30 bg-purple-950/20 text-xs text-slate-300 space-y-2 animate-fade-in">
          <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
            📌 Hướng dẫn nhanh cho người mới viết Markdown:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="bg-slate-900/60 p-2 rounded-xl border border-white/10">
              <span className="text-sky-300"># Tiêu đề lớn H1</span> → Tiêu đề chính bài
            </div>
            <div className="bg-slate-900/60 p-2 rounded-xl border border-white/10">
              <span className="text-sky-300">## Tiêu đề H2</span> → Tiêu đề mục nhỏ
            </div>
            <div className="bg-slate-900/60 p-2 rounded-xl border border-white/10">
              <span className="text-purple-300">**In đậm**</span> hoặc <span className="text-purple-300">*In nghiêng*</span>
            </div>
            <div className="bg-slate-900/60 p-2 rounded-xl border border-white/10">
              <span className="text-emerald-300">```javascript ... ```</span> → Khối Code
            </div>
            <div className="bg-slate-900/60 p-2 rounded-xl border border-white/10">
              <span className="text-amber-300">[Tên Link](https://...)</span> → Chèn Link
            </div>
            <div className="bg-slate-900/60 p-2 rounded-xl border border-white/10">
              <span className="text-rose-300">- Mục danh sách</span> → Danh sách gạch đầu dòng
            </div>
          </div>
        </div>
      )}

      {/* Interactive Formatting Toolbar */}
      <div className="flex items-center gap-1 flex-wrap p-1.5 rounded-2xl bg-slate-900/70 border border-white/12 backdrop-blur-md">
        <button
          type="button"
          onClick={() => insertMarkdown('# ', '', 'Tiêu đề H1')}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
          title="Tiêu đề H1 (#)"
        >
          <Heading1 size={15} />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('## ', '', 'Tiêu đề H2')}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
          title="Tiêu đề H2 (##)"
        >
          <Heading2 size={15} />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('### ', '', 'Tiêu đề H3')}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
          title="Tiêu đề H3 (###)"
        >
          <Heading3 size={15} />
        </button>

        <div className="w-px h-4 bg-white/15 mx-1" />

        <button
          type="button"
          onClick={() => insertMarkdown('**', '**', 'văn bản in đậm')}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-all"
          title="In đậm (**text**)"
        >
          <Bold size={15} />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('*', '*', 'văn bản in nghiêng')}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-all"
          title="In nghiêng (*text*)"
        >
          <Italic size={15} />
        </button>

        <div className="w-px h-4 bg-white/15 mx-1" />

        <button
          type="button"
          onClick={() => insertMarkdown('`', '`', 'code_inline')}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-all"
          title="Code Inline (`code`)"
        >
          <Code size={15} />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('```javascript\n', '\n```', '// Nhập code tại đây')}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-all"
          title="Khối Code (```code```)"
        >
          <SquareCode size={15} />
        </button>

        <div className="w-px h-4 bg-white/15 mx-1" />

        <button
          type="button"
          onClick={() => insertMarkdown('[', '](https://example.com)', 'Tên đường dẫn')}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-all"
          title="Chèn Link ([Link](url))"
        >
          <Link size={15} />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('- ', '', 'Mục 1')}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-all"
          title="Danh sách gạch đầu dòng (-)"
        >
          <List size={15} />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('> ', '', 'Lời trích dẫn đặc biệt')}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-all"
          title="Trích dẫn (>)"
        >
          <Quote size={15} />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('| Cột 1 | Cột 2 |\n| --- | --- |\n| Giá trị 1 | Giá trị 2 |\n', '', '')}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer transition-all"
          title="Tạo bảng Markdown"
        >
          <Table size={15} />
        </button>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        rows={rows}
        required={required}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="glass-input w-full px-4 py-3 rounded-2xl text-xs text-white font-mono leading-relaxed"
      />
    </div>
  );
};
