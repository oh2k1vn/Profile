import React, { useState, useEffect, useRef } from 'react';
import { audioService } from '../../services/audioService';

interface TerminalProps {
  onTriggerGlitch: () => void;
}

interface LogLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success';
}

export const Terminal: React.FC<TerminalProps> = ({ onTriggerGlitch }) => {
  const [history, setHistory] = useState<LogLine[]>([
    { text: 'HỆ THỐNG DÒNG LỆNH TƯƠNG TÁC v1.0.0', type: 'success' },
    { text: 'Gõ lệnh "help" để hiển thị danh sách các câu lệnh có sẵn.', type: 'output' },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    focusInput();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      
      const newIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIdx);
      setInputVal(commandHistory[newIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length === 0 || historyIndex === -1) return;
      
      if (historyIndex === commandHistory.length - 1) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        const newIdx = historyIndex + 1;
        setHistoryIndex(newIdx);
        setInputVal(commandHistory[newIdx]);
      }
    }
  };

  const executeCommand = () => {
    const trimmedInput = inputVal.trim();
    if (!trimmedInput) return;

    audioService.playClick();
    
    const newLines: LogLine[] = [{ text: `$ ${trimmedInput}`, type: 'input' }];
    const cmdParts = trimmedInput.toLowerCase().split(' ');
    const cmd = cmdParts[0];

    setCommandHistory((prev) => [...prev, trimmedInput]);
    setHistoryIndex(-1);
    setInputVal('');

    switch (cmd) {
      case 'help':
        newLines.push(
          { text: 'Danh sách các lệnh khả dụng:', type: 'success' },
          { text: '  about        - Xem thông tin giới thiệu và định hướng lập trình', type: 'output' },
          { text: '  skills       - Hiển thị danh sách kỹ năng chuyên môn kỹ thuật', type: 'output' },
          { text: '  projects     - Hiển thị tóm tắt các dự án nổi bật của mình', type: 'output' },
          { text: '  clear        - Xóa toàn bộ nội dung dòng lệnh hiện tại', type: 'output' },
          { text: '  date         - Hiển thị ngày giờ hệ thống hiện tại', type: 'output' },
          { text: '  cat          - Đọc nội dung tệp tin (Ví dụ: cat secret.txt)', type: 'output' },
          { text: '  sudo rm -rf / - CẢNH BÁO: Lệnh xóa phân vùng hệ thống gốc (nguy hiểm)', type: 'error' }
        );
        break;

      case 'clear':
        setHistory([
          { text: 'HỆ THỐNG DÒNG LỆNH TƯƠNG TÁC v1.0.0', type: 'success' },
          { text: 'Gõ lệnh "help" để hiển thị danh sách các câu lệnh có sẵn.', type: 'output' },
        ]);
        break;

      case 'date':
        newLines.push({ text: `Ngày và giờ hiện tại: ${new Date().toLocaleString('vi-VN')}`, type: 'output' });
        break;

      case 'about':
        newLines.push(
          { text: 'HỌ TÊN: Nguyễn Minh Hiếu (Middle Frontend & Mobile Developer)', type: 'success' },
          { text: 'SỨ MỆNH: Phát triển web app, mobile app Flutter và hệ sinh thái Zalo Mini App.', type: 'output' },
          { text: 'ĐỊA CHỈ: Cựu sinh viên Đại học Văn Lang (Khóa K25)', type: 'output' },
          { text: 'TRẠNG THÁI: Hơn 4 năm kinh nghiệm thực chiến (từ Intern lên Middle)', type: 'output' }
        );
        break;

      case 'skills':
        newLines.push(
          { text: 'ĐANG LIỆT KÊ BỘ KỸ NĂNG CỦA MINH HIẾU...', type: 'success' },
          { text: '  - Mobile: Flutter (Dart) / Zalo Mini App SDK [Thành thạo]', type: 'output' },
          { text: '  - Web Frameworks: ReactJS / Next.js / Vuejs / Nuxtjs [Thành thạo]', type: 'output' },
          { text: '  - UI & Styling: Figma UI UX / CSS / TailwindCSS / Bootstrap [Thành thạo]', type: 'output' },
          { text: '  - Công cụ & Build: Git Version Control / Vite / Webpack / Chrome DevTools [Khá]', type: 'output' }
        );
        break;

      case 'projects':
        newLines.push(
          { text: 'DANH SÁCH SẢN PHẨM TRUY XUẤT THÀNH CÔNG:', type: 'success' },
          { text: '  1. Zalo Mini App    - Ứng dụng e-commerce tích hợp trên Zalo ecosystem', type: 'output' },
          { text: '  2. NeoForge App     - Ứng dụng di động quản lý đa nền tảng bằng Flutter', type: 'output' },
          { text: '  3. CyberForest UI   - Cổng thông tin doanh nghiệp mượt mà bằng NuxtJS & Bootstrap', type: 'output' },
          { text: '  4. OptiFlow Board   - Sơ đồ tương tác kéo thả canvas hiệu năng bằng ReactJS', type: 'output' }
        );
        break;

      case 'cat':
        const file = cmdParts[1];
        if (file === 'secret.txt') {
          newLines.push(
            { text: 'Đang giải mã secret.txt...', type: 'success' },
            { text: '"Lập trình không chỉ là gõ code, đó là cách chúng ta xây dựng thế giới bằng logic. Tái bút: Nếu bạn chưa thử click vào con robot đang bay lơ lửng bên góc phải, bạn đang bỏ lỡ các phản ứng thú vị đấy!"', type: 'output' }
          );
        } else if (!file) {
          newLines.push({ text: 'Lỗi: Vui lòng chỉ định tệp tin cần đọc. Ví dụ: cat secret.txt', type: 'error' });
        } else {
          newLines.push({ text: `Lỗi: Không tìm thấy tệp tin: "${file}"`, type: 'error' });
        }
        break;

      case 'sudo':
        const action = cmdParts.slice(1).join(' ');
        if (action === 'rm -rf /') {
          newLines.push(
            { text: 'CẢNH BÁO: ĐANG TIẾN HÀNH XÓA THƯ MỤC GỐC!', type: 'error' },
            { text: 'PHÁT HIỆN LỖI TOÀN BỘ HỆ THỐNG... DÒNG LỆNH BỊ HỎNG...', type: 'error' }
          );
          onTriggerGlitch();
        } else {
          newLines.push({ text: 'Quyền truy cập bị từ chối: Người dùng không nằm trong danh sách sudoers.', type: 'error' });
        }
        break;

      default:
        newLines.push({ text: `Không tìm thấy câu lệnh: "${cmd}". Gõ "help" để xem danh sách câu lệnh.`, type: 'error' });
        break;
    }

    setHistory((prev) => [...prev, ...newLines]);
  };

  return (
    <div 
      onClick={focusInput}
      className="relative flex flex-col h-96 w-full liquid-glass rounded-3xl overflow-hidden cursor-text p-5 font-mono text-sm leading-relaxed select-text shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/20"
    >
      {/* iOS Header window controls */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3 text-slate-400 text-xs select-none">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
          <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
          <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          <span className="pl-3 font-semibold text-slate-200">Terminal.app — zsh</span>
        </div>
        <span className="text-[11px] font-mono text-sky-400 bg-sky-500/10 border border-sky-400/20 px-2 py-0.5 rounded-full">iOS Glass CLI</span>
      </div>

      {/* Terminal logs list */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto space-y-1.5 mb-2 pr-2 scrollbar-none">
        {history.map((line, idx) => {
          let colorClass = 'text-slate-300';
          if (line.type === 'input') colorClass = 'text-sky-300 font-bold';
          if (line.type === 'success') colorClass = 'text-emerald-400 font-medium';
          if (line.type === 'error') colorClass = 'text-rose-400 font-bold';
          
          return (
            <div key={idx} className={`${colorClass} whitespace-pre-wrap leading-tight`}>
              {line.text}
            </div>
          );
        })}
      </div>

      {/* Interactive prompt line */}
      <div className="flex items-center space-x-2 border-t border-white/10 pt-3 text-sky-400">
        <span className="font-bold text-sky-400">$</span>
        <div className="flex-1 relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-white outline-none border-none font-mono text-sm caret-transparent select-text z-20"
          />
          <div 
            className="absolute bg-sky-400 w-2 h-4 pointer-events-none animate-caret z-10 rounded-sm shadow-[0_0_8px_#38bdf8]"
            style={{
              left: `${inputVal.length * 8.4}px`,
              maxWidth: '100%'
            }}
          />
        </div>
      </div>
    </div>
  );
};
