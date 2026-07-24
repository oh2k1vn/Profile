import React, { useState, useEffect } from 'react';
import { Bot, MessageSquareCode, Sparkles } from 'lucide-react';
import { audioService } from '../../services/audioService';

interface CompanionProps {
  glitchActive: boolean;
}

const RESPONSES = [
  "Xin chào bạn khách! Hãy thử gõ các câu lệnh vào ô Terminal CLI xem nhé.",
  "Nếu mã nguồn biết nói, chắc chắn nó sẽ xin lập trình viên giảm bớt các vòng lặp lồng nhau.",
  "Click chuột vào thân máy của mình để làm mới bộ nhớ đệm hội thoại nhé!",
  "Gợi ý: Thử gõ câu lệnh 'sudo rm -rf /' trong dòng lệnh Retro CLI nếu bạn đủ can đảm...",
  "Hệ thống đang hoạt động bằng 100% năng lượng kỹ thuật số tái tạo sạch.",
  "Trang portfolio này hoàn toàn tương thích mọi kích thước. Thử co giãn trình duyệt xem!",
  "Một dòng lỗi (bug) trong code thực ra chỉ là một tính năng chưa được viết tài liệu của vũ trụ.",
];

export const Companion: React.FC<CompanionProps> = ({ glitchActive }) => {
  const [bubbleText, setBubbleText] = useState(RESPONSES[0]);
  const [showBubble, setShowBubble] = useState(true);
  const [clickCount, setClickCount] = useState(0);
  const [isJumping, setIsJumping] = useState(false);

  useEffect(() => {
    if (glitchActive) {
      setBubbleText("😱 LỖI HỆ THỐNG CỐT LÕI! KERNEL PANIC! ĐANG CHUYỂN HƯỚNG ĐIỆN ÁP HỆ THỐNG!");
      setShowBubble(true);
    } else {
      setBubbleText("Hệ thống đã phục hồi! Phù, suýt nữa thì toang. Đừng nghịch dại nữa nha.");
    }
  }, [glitchActive]);

  useEffect(() => {
    if (glitchActive) return;

    const interval = setInterval(() => {
      setShowBubble(false);
      setTimeout(() => {
        const nextQuote = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
        setBubbleText(nextQuote);
        setShowBubble(true);
      }, 500);
    }, 18000);

    return () => clearInterval(interval);
  }, [glitchActive]);

  const handleCompanionClick = () => {
    audioService.playClick();
    setIsJumping(true);
    setTimeout(() => setIsJumping(false), 500);

    const nextClicks = clickCount + 1;
    setClickCount(nextClicks);

    if (glitchActive) {
      setBubbleText("Hệ thống đang bị hỏng! Chạy đi, hãy tự cứu lấy mình!");
      return;
    }

    if (nextClicks > 12) {
      setBubbleText("⚠️ Lỗi: Quá tải số lần nhấn. Đừng chọc vào bảng mạch của mình nữa! 🤖");
      audioService.playError();
      return;
    }

    if (nextClicks === 8) {
      setBubbleText("Được rồi, bạn thực sự rất thích click vào mình đúng không? Tặng bạn ít hiệu ứng lấp lánh này! ✨");
      audioService.playSuccess();
      return;
    }

    const nextQuote = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
    setBubbleText(nextQuote);
    setShowBubble(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none select-none font-sans">
      {/* Speech Bubble Dialog */}
      {showBubble && (
        <div className="mb-3 max-w-xs p-3.5 liquid-glass border border-white/20 text-slate-100 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.4)] relative pointer-events-auto text-xs leading-relaxed transition-all duration-300">
          <div className="flex items-center space-x-1.5 mb-1.5 border-b border-white/10 pb-1 text-[10px] font-semibold text-sky-400">
            <MessageSquareCode size={12} />
            <span>CODEY_v1.0.2</span>
          </div>
          <p>{bubbleText}</p>
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-900/90 border-r border-b border-white/20 rotate-45 backdrop-blur-md" />
        </div>
      )}

      {/* Companion Figure */}
      <div 
        onClick={handleCompanionClick}
        className={`pointer-events-auto cursor-pointer flex items-center justify-center p-3.5 rounded-full liquid-glass-pill border border-white/20 transition-all duration-300 shadow-xl ${
          isJumping ? 'animate-bounce scale-110 border-sky-400' : 'animate-float'
        } ${glitchActive ? 'bg-rose-950/60 border-rose-500 animate-pulse' : ''}`}
      >
        <div className="relative">
          <Bot size={28} className={glitchActive ? 'text-rose-400' : 'text-sky-400'} />
          {clickCount >= 8 && (
            <span className="absolute -top-1.5 -right-1.5 text-purple-400 animate-pulse">
              <Sparkles size={14} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
