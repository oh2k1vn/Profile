import React, { useState, useEffect } from 'react';
import { Bot, MessageSquareCode, Sparkles } from 'lucide-react';
import { audioService } from '../utils/audio';

interface CompanionProps {
  glitchActive: boolean;
}

const RESPONSES = [
  "Xin chào bạn khách! Hãy thử gõ các câu lệnh vào ô Terminal CLI ở góc trái bên dưới xem nhé.",
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

  // Reaction to Glitch active state
  useEffect(() => {
    if (glitchActive) {
      setBubbleText("😱 LỖI HỆ THỐNG CỐT LÕI! KERNEL PANIC! ĐANG CHUYỂN HƯỚNG ĐIỆN ÁP HỆ THỐNG!");
      setShowBubble(true);
    } else {
      setBubbleText("Hệ thống đã phục hồi! Phù, suýt nữa thì toang. Đừng nghịch dại nữa nha.");
    }
  }, [glitchActive]);

  // Periodic random quotes when idle
  useEffect(() => {
    if (glitchActive) return;

    const interval = setInterval(() => {
      // Fade out bubble, change text, fade in
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

    // Default random quote on click
    const nextQuote = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
    setBubbleText(nextQuote);
    setShowBubble(true);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end pointer-events-none select-none font-mono">
      {/* Speech Bubble Dialog */}
      {showBubble && (
        <div className="mb-2.5 max-w-xs p-3 bg-dark-green border border-light-green/40 text-text-light rounded-xl shadow-2xl relative pointer-events-auto text-[11px] leading-relaxed transition-all duration-300 transform scale-100">
          <div className="flex items-center space-x-1 mb-1 border-b border-light-green/10 pb-1 text-[9px] text-heading-accent">
            <MessageSquareCode size={10} />
            <span>CODEY_v1.0.2</span>
          </div>
          <p>{bubbleText}</p>
          
          {/* Bubble tail indicator */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-dark-green border-r border-b border-light-green/40 rotate-45" />
        </div>
      )}

      {/* Companion Figure */}
      <div 
        onClick={handleCompanionClick}
        className={`pointer-events-auto cursor-pointer flex items-center justify-center p-3 rounded-full bg-light-green/20 border border-light-green/40 hover:bg-light-green/35 transition-all duration-300 shadow-lg ${
          isJumping ? 'animate-bounce scale-110 border-heading-accent' : 'animate-float'
        } ${glitchActive ? 'bg-red-950/40 border-red-500 animate-pulse' : ''}`}
      >
        <div className="relative">
          <Bot size={28} className={glitchActive ? 'text-red-500' : 'text-heading-primary'} />
          {clickCount >= 8 && (
            <span className="absolute -top-1.5 -right-1.5 text-heading-accent animate-pulse">
              <Sparkles size={12} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
