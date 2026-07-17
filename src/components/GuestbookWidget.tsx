import React, { useState, useEffect } from 'react';
import { BookOpen, Send, Trash2 } from 'lucide-react';
import { audioService } from '../utils/audio';

interface Message {
  id: string;
  name: string;
  emoji: string;
  text: string;
  timestamp: string;
}

const DEFAULT_MESSAGES: Message[] = [
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💻');
  
  const emojis = ['💻', '☕', '🚀', '😎', '👾', '🔥', '🎉'];

  useEffect(() => {
    // Load messages from localStorage
    const saved = localStorage.getItem('profile_guestbook_messages');
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch (e) {
        setMessages(DEFAULT_MESSAGES);
      }
    } else {
      setMessages(DEFAULT_MESSAGES);
      localStorage.setItem('profile_guestbook_messages', JSON.stringify(DEFAULT_MESSAGES));
    }
  }, []);

  const saveMessages = (newMsgs: Message[]) => {
    setMessages(newMsgs);
    localStorage.setItem('profile_guestbook_messages', JSON.stringify(newMsgs));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    audioService.playSuccess();
    const timestamp = new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
    const newMsg: Message = {
      id: Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      emoji: selectedEmoji,
      text: text.trim(),
      timestamp,
    };

    const updated = [newMsg, ...messages];
    saveMessages(updated);
    
    // Reset inputs
    setName('');
    setText('');
  };

  const handleDelete = (id: string) => {
    audioService.playError();
    const updated = messages.filter((m) => m.id !== id);
    saveMessages(updated);
  };

  return (
    <div className="glass-panel border border-light-green/20 rounded-xl p-6 hover:border-light-green/45 transition-all duration-300">
      
      {/* Header section with description */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-light-green/10 pb-4 gap-2">
        <div>
          <h3 className="text-lg font-mono font-bold text-heading-primary flex items-center gap-2">
            <BookOpen size={20} className="text-heading-primary" />
            Sổ Lưu Bút Tương Tác
          </h3>
          <p className="text-xs text-text-green font-mono mt-1">
            Để lại chữ ký, chia sẻ tâm trạng hiện tại và ghim lời nhắn ngắn lên bảng tin lưu bút của mình.
          </p>
        </div>
        <span className="text-xs font-mono text-text-green bg-light-green/20 px-2 py-1 rounded shrink-0 self-start sm:self-center">
          Bộ Nhớ Trình Duyệt
        </span>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
        
        {/* Form Column - Left (4 Cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-4 space-y-4 bg-black/20 p-5 border border-light-green/10 rounded-lg">
          <div>
            <label className="block text-[10px] font-mono uppercase text-text-green mb-1">Tên Của Bạn</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              onClick={() => audioService.playClick()}
              placeholder="Ví dụ: Hacker Mèo"
              className="w-full px-3 py-2 bg-black/40 border border-light-green/20 rounded-lg text-xs font-mono text-text-light outline-none focus:border-heading-primary"
            />
          </div>
          
          <div>
            <label className="block text-[10px] font-mono uppercase text-text-green mb-1">Emoji Tâm Trạng</label>
            <div className="flex space-x-1 justify-between py-0.5">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    audioService.playClick();
                    setSelectedEmoji(emoji);
                  }}
                  className={`w-7.5 h-7.5 flex items-center justify-center rounded-md border text-sm transition-all cursor-pointer ${
                    selectedEmoji === emoji
                      ? 'bg-heading-primary border-heading-primary scale-110 shadow-lg'
                      : 'bg-black/30 border-light-green/10 hover:border-light-green/45'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-text-green mb-1">Nội Dung Lời Nhắn</label>
            <textarea
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              onClick={() => audioService.playClick()}
              placeholder="Viết lời nhắn để ghim lên bảng..."
              rows={3}
              maxLength={160}
              className="w-full px-3 py-2 bg-black/40 border border-light-green/20 rounded-lg text-xs font-mono text-text-light outline-none focus:border-heading-primary resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-light-green/20 hover:bg-light-green/40 border border-light-green/30 hover:border-light-green/60 text-heading-primary font-mono text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
          >
            <Send size={12} />
            Ghim Lời Nhắn
          </button>
        </form>

        {/* Board Cards Grid Column - Right (8 Cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex justify-between items-center text-[10px] font-mono uppercase text-text-green mb-1">
            <span>Lời nhắn đã ghim ({messages.length})</span>
            <span className="animate-pulse text-heading-accent">Bảng tin trực tiếp</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-none">
            {messages.length === 0 ? (
              <div className="sm:col-span-2 text-center py-16 text-xs font-mono text-text-green border border-dashed border-light-green/15 rounded-lg bg-black/10">
                Chưa có lời nhắn nào trên bảng. Hãy là người đầu tiên để lại lưu bút nhé!
              </div>
            ) : (
              messages.map((msg) => (
                <div 
                  key={msg.id}
                  className="p-4 bg-[#142014]/30 border border-light-green/15 rounded-lg flex flex-col justify-between hover:border-light-green/30 transition-all hover:bg-[#142014]/50 relative group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{msg.emoji}</span>
                      <span className="font-bold text-xs text-text-light font-mono truncate max-w-[120px]">{msg.name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                      <span className="text-[9px] text-text-green font-mono">{msg.timestamp.split(' ')[0]}</span>
                      <button 
                        onClick={() => handleDelete(msg.id)}
                        className="text-text-green hover:text-red-500 transition-colors p-0.5 cursor-pointer ml-1"
                        title="Xóa lời nhắn này"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>

                  <p className="text-text-green leading-relaxed text-[11px] font-mono break-words border-t border-light-green/5 pt-2 mt-1">
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
