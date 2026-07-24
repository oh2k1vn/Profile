import React, { useState, useEffect } from 'react';
import { BookOpen, Send, Trash2 } from 'lucide-react';
import type { GuestbookMessage } from '../../types/guestbook';
import { audioService } from '../../services/audioService';

const DEFAULT_MESSAGES: GuestbookMessage[] = [
  {
    id: 'seed-1',
    name: 'Linus Torvalds',
    emoji: '💻',
    text: 'Nói suông không có giá trị đâu. Hãy cho tôi xem code! Mà này, giao diện dòng lệnh retro chạy khá mượt đấy.',
    timestamp: '17/07/2026 10:20',
  },
  {
    id: 'seed-2',
    name: 'Ada Lovelace',
    emoji: '✨',
    text: 'Một phong cách thiết kế giao diện rất riêng biệt. Vẻ đẹp toán học thực sự được phản chiếu qua hệ thống CSS này.',
    timestamp: '17/07/2026 11:45',
  },
  {
    id: 'seed-3',
    name: 'Git Bot',
    emoji: '🤖',
    text: 'TRIỂN KHAI THÀNH CÔNG! Đã lưu trữ portfolio này vào cache cục bộ. Trạng thái lượng cà phê đang ở mức tối ưu.',
    timestamp: '17/07/2026 14:10',
  },
];

export const GuestbookWidget: React.FC = () => {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💻');

  const emojis = ['💻', '☕', '🚀', '😎', '👾', '🔥', '🎉'];

  useEffect(() => {
    const saved = localStorage.getItem('profile_guestbook_messages');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        setMessages(DEFAULT_MESSAGES);
      }
    } else {
      setMessages(DEFAULT_MESSAGES);
      localStorage.setItem('profile_guestbook_messages', JSON.stringify(DEFAULT_MESSAGES));
    }
  }, []);

  const saveMessages = (newMsgs: GuestbookMessage[]) => {
    setMessages(newMsgs);
    localStorage.setItem('profile_guestbook_messages', JSON.stringify(newMsgs));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    audioService.playSuccess();
    const timestamp = new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
    const newMsg: GuestbookMessage = {
      id: Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      emoji: selectedEmoji,
      text: text.trim(),
      timestamp,
    };

    const updated = [newMsg, ...messages];
    saveMessages(updated);

    setName('');
    setText('');
  };

  const handleDelete = (id: string) => {
    audioService.playError();
    const updated = messages.filter((m) => m.id !== id);
    saveMessages(updated);
  };

  return (
    <div className="liquid-glass rounded-3xl p-6 sm:p-8 border border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.35)]">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4 gap-2">
        <div>
          <h3 className="text-lg font-sans font-bold text-white flex items-center gap-2">
            <BookOpen size={20} className="text-sky-400" />
            Sổ Lưu Bút Tương Tác
          </h3>
          <p className="text-xs text-slate-300 font-sans mt-1">
            Để lại chữ ký, chia sẻ tâm trạng hiện tại và ghim lời nhắn ngắn lên bảng tin lưu bút của mình.
          </p>
        </div>
        <span className="text-xs font-mono text-sky-300 bg-sky-500/10 border border-sky-400/20 px-3 py-1 rounded-full shrink-0 self-start sm:self-center">
          Bộ Nhớ Trình Duyệt
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">

        {/* Form Column - Left */}
        <form onSubmit={handleSubmit} className="lg:col-span-4 space-y-4 bg-slate-900/40 p-5 border border-white/10 rounded-2xl backdrop-blur-md">
          <div>
            <label className="block text-[11px] font-sans font-semibold uppercase text-sky-400 mb-1.5">Tên Của Bạn</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              onClick={() => audioService.playClick()}
              placeholder="Ví dụ: Hacker Mèo"
              className="glass-input w-full px-3.5 py-2.5 rounded-2xl text-xs font-sans placeholder:text-slate-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-sans font-semibold uppercase text-sky-400 mb-1.5">Emoji Tâm Trạng</label>
            <div className="flex space-x-1 justify-between py-0.5">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    audioService.playClick();
                    setSelectedEmoji(emoji);
                  }}
                  className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all cursor-pointer border ${selectedEmoji === emoji
                    ? 'bg-sky-400 border-sky-300 text-slate-950 scale-110 shadow-[0_0_12px_#38bdf8]'
                    : 'bg-white/5 border-white/10 hover:border-white/30 text-slate-200'
                    }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-sans font-semibold uppercase text-sky-400 mb-1.5">Nội Dung Lời Nhắn</label>
            <textarea
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              onClick={() => audioService.playClick()}
              placeholder="Viết lời nhắn để ghim lên bảng..."
              rows={3}
              maxLength={160}
              className="glass-input w-full px-3.5 py-2.5 rounded-2xl text-xs font-sans placeholder:text-slate-500 resize-none"
            />
          </div>

          <button
            type="submit"
            className="liquid-glass-accent-btn w-full py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Send size={13} />
            Ghim Lời Nhắn
          </button>
        </form>

        {/* Board Cards Grid Column - Right */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex justify-between items-center text-xs font-sans text-slate-400 mb-1">
            <span>Lời nhắn đã ghim ({messages.length})</span>
            <span className="animate-pulse text-sky-400 font-medium">Bảng tin trực tiếp</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-95 overflow-y-auto pr-2 scrollbar-none">
            {messages.length === 0 ? (
              <div className="sm:col-span-2 text-center py-16 text-xs font-sans text-slate-400 border border-dashed border-white/15 rounded-2xl bg-white/5">
                Chưa có lời nhắn nào trên bảng. Hãy là người đầu tiên để lại lưu bút nhé!
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className="liquid-glass-card p-4 rounded-2xl border border-white/12 flex flex-col justify-between hover:border-sky-400/40 transition-all relative group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{msg.emoji}</span>
                      <span className="font-bold text-xs text-white font-sans truncate max-w-30">{msg.name}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] text-slate-400 font-sans">{msg.timestamp.split(' ')[0]}</span>
                      <button
                        onClick={() => handleDelete(msg.id)}
                        className="text-slate-400 hover:text-rose-400 transition-colors p-0.5 cursor-pointer ml-1"
                        title="Xóa lời nhắn này"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <p className="text-slate-300 leading-relaxed text-xs font-sans wrap-break-word border-t border-white/5 pt-2 mt-1">
                    {msg.text}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
