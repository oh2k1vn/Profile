import React, { useState, useEffect, useRef } from 'react';
import { X, ExternalLink, Play, Sparkles } from 'lucide-react';
import type { Project } from '../../types/project';
import { audioService } from '../../services/audioService';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [logs, setLogs] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([]);
  const [userChatInput, setUserChatInput] = useState('');
  const [previewColor, setPreviewColor] = useState('#38bdf8');

  useEffect(() => {
    audioService.playSuccess();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Particle Game loop (NeoForge Engine demo)
  useEffect(() => {
    if (project.simulationType !== 'particles' || !isPlayingDemo || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string }[] = [];

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 4 + 2,
        color: `hsl(${190 + Math.random() * 60}, 90%, 65%)`,
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 15, 26, 0.25)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 20;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      particles.forEach((p, idx) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < p.radius || p.x > canvas.width - p.radius) p.vx *= -1;
        if (p.y < p.radius || p.y > canvas.height - p.radius) p.vy *= -1;

        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${1 - dist / 80})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    const handleCanvasClick = (e: MouseEvent) => {
      audioService.playClick();
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        radius: Math.random() * 5 + 3,
        color: '#f43f5e',
      });
      if (particles.length > 80) particles.shift();
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [isPlayingDemo, project.simulationType]);

  // Network Simulation log generator
  useEffect(() => {
    if (project.simulationType !== 'network' || !isPlayingDemo) return;

    setLogs(['[Hệ thống] Đang khởi động trình xử lý Canvas Render...', '[Hệ thống] Đang phân tích tọa độ các nút liên kết (Nodes)...', '[Client] Tải bản vẽ sơ đồ thành công. Trạng thái: READY (60FPS)']);

    const logList = [
      'RENDER [Node_A] Đang định vị lại trên tọa độ (120, 340) -> Thành công (0.4ms)',
      'STATE [Zustand] Dispatched Action: UPDATE_NODE_CONNECTION_PATH',
      'VIEWPORT [Pan] Thay đổi dịch chuyển (x: -5, y: 12) -> Render lại (12/42 nodes visible)',
      'PERFORMANCE [Zoom] Hoàn thành phóng to thu nhỏ trong 1.2ms',
      'RENDER [Trash Collect] Đang xóa các node bị ẩn ngoài vùng nhìn -> Giải phóng 8 layers',
      '[Cảnh báo] Phát hiện tiến trình vẽ dài: 45ms. Đang kích hoạt giảm tải tốc độ khung hình...',
      'Khung hình canvas đã ổn định lại ở mức 60FPS. Buffer sync hoàn tất (READY)',
    ];

    const interval = setInterval(() => {
      const randomLog = logList[Math.floor(Math.random() * logList.length)];
      const timestamp = new Date().toLocaleTimeString('vi-VN');
      setLogs((prev) => [...prev.slice(-8), `[${timestamp}] ${randomLog}`]);
      audioService.playClick();
    }, 1800);

    return () => clearInterval(interval);
  }, [isPlayingDemo, project.simulationType]);

  // Chat Simulation auto replies
  useEffect(() => {
    if (project.simulationType !== 'chat' || !isPlayingDemo) return;
    
    setChatMessages([
      { sender: 'AI Bot', text: 'Xin chào! Chào mừng bạn đến với phòng chat mô phỏng RetroTerminal. Thử gửi một tin nhắn đi nhé!', time: '12:00:00 CH' }
    ]);
  }, [isPlayingDemo, project.simulationType]);

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userChatInput.trim()) return;

    audioService.playClick();
    const time = new Date().toLocaleTimeString('vi-VN');
    const newUserMsg = { sender: 'Bạn', text: userChatInput, time };
    setChatMessages(prev => [...prev, newUserMsg]);
    setUserChatInput('');

    setTimeout(() => {
      audioService.playSuccess();
      const botResponses = [
        "Đó quả là một ý kiến rất hay. Làm tôi nhớ lại những ngày dùng IRC ngày xưa!",
        "Đang mã hóa dòng truyền dữ liệu... Đã xoay vòng khóa bảo mật thành công.",
        "Hệ thống trực tuyến. Thời gian hoạt động hiện tại là 99.98%. Tôi có thể giúp gì thêm cho bạn?",
        "Đã nhận lệnh, nhưng đây chỉ là một client mô phỏng kênh chat IRC.",
      ];
      const botMsg = {
        sender: 'AI Bot',
        text: botResponses[Math.floor(Math.random() * botResponses.length)],
        time: new Date().toLocaleTimeString('vi-VN')
      };
      setChatMessages(prev => [...prev, botMsg]);
    }, 1000);
  };

  const handleClose = () => {
    audioService.playClick();
    onClose();
  };

  const getVietnameseCategory = (cat: string) => {
    if (cat === 'Game Engine') return 'Công Cụ Game';
    if (cat === 'Developer Tools') return 'Công Cụ Lập Trình';
    if (cat === 'Design System') return 'Hệ Thống Thiết Kế';
    if (cat === 'Messaging') return 'Ứng Dụng Nhắn Tin';
    return cat;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xl">
      <div className="relative w-full max-w-3xl liquid-glass rounded-3xl border border-white/20 shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* iOS Drag handle / Header */}
        <div className="flex flex-col items-center pt-3 pb-2 px-6 border-b border-white/10 bg-slate-900/40">
          <div className="w-12 h-1.5 rounded-full bg-white/25 mb-3" />
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
              <span className="text-xs uppercase tracking-wider text-sky-300 font-semibold">{getVietnameseCategory(project.category)}</span>
            </div>
            <button 
              onClick={handleClose}
              className="liquid-glass-pill p-1.5 text-slate-300 hover:text-white rounded-full cursor-pointer"
              aria-label="Đóng"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
          <div>
            <h2 className="text-2xl font-bold font-sans text-white flex items-center gap-2">
              {project.title}
              <Sparkles size={20} className="text-sky-400 animate-pulse" />
            </h2>
            <p className="mt-3 text-slate-300 text-sm leading-relaxed">{project.longDesc}</p>
          </div>

          {/* Tech stack */}
          <div>
            <h3 className="text-xs font-semibold uppercase text-sky-400 tracking-wider mb-3">Công Nghệ Sử Dụng</h3>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t, idx) => (
                <span 
                  key={idx} 
                  className="px-3 py-1 text-xs font-mono bg-white/5 border border-white/12 text-slate-200 rounded-full"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Simulation / Live Demo Container */}
          <div className="border border-white/15 rounded-2xl overflow-hidden bg-slate-950/60 shadow-inner">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10 bg-white/5">
              <div className="flex items-center space-x-2">
                <Play size={14} className="text-sky-400" />
                <span className="text-xs font-sans text-white font-medium">Trình Giả Lập Demo Tương Tác</span>
              </div>
              
              {!isPlayingDemo ? (
                <button 
                  onClick={() => {
                    audioService.playClick();
                    setIsPlayingDemo(true);
                  }}
                  className="liquid-glass-accent-btn px-4 py-1.5 text-xs font-semibold rounded-full cursor-pointer"
                >
                  Chạy Giả Lập
                </button>
              ) : (
                <button 
                  onClick={() => {
                    audioService.playClick();
                    setIsPlayingDemo(false);
                  }}
                  className="px-4 py-1.5 text-xs font-semibold bg-rose-500 hover:bg-rose-600 text-white rounded-full cursor-pointer transition-all border-none shadow-md shadow-rose-500/30"
                >
                  Dừng Giả Lập
                </button>
              )}
            </div>

            <div className="h-64 flex items-center justify-center p-4 relative">
              {!isPlayingDemo ? (
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center mx-auto text-sky-400 bg-white/5 shadow-md">
                    <Play size={20} />
                  </div>
                  <p className="text-xs font-sans text-slate-400">Nhấn nút "Chạy Giả Lập" để trải nghiệm trực tiếp bản thử nghiệm này.</p>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col">
                  {/* NEOFORGE PARTICLES */}
                  {project.simulationType === 'particles' && (
                    <div className="w-full h-full flex flex-col justify-between">
                      <canvas 
                        ref={canvasRef} 
                        width={600} 
                        height={200} 
                        className="w-full h-40 bg-slate-950 border border-white/15 rounded-xl cursor-crosshair block shadow-inner"
                      />
                      <p className="text-[11px] font-sans text-slate-400 mt-2 text-center">
                        Mô-đun hạt đang chạy. Hãy click chuột trực tiếp vào khung ở trên để tạo các tia năng lượng!
                      </p>
                    </div>
                  )}

                  {/* OPTIFLOW NETWORK GRPC LOGS */}
                  {project.simulationType === 'network' && (
                    <div className="w-full h-full flex flex-col justify-between bg-slate-950 p-3.5 font-mono text-xs border border-white/15 rounded-xl overflow-hidden shadow-inner">
                      <div className="flex-1 overflow-y-auto space-y-1 text-emerald-400">
                        {logs.map((log, idx) => (
                          <div key={idx} className="whitespace-pre-wrap leading-tight text-[11px]">{log}</div>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2 pt-2 border-t border-white/10 text-[10px] text-slate-400">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        <span>Đang truy xuất thông số kết xuất từ trình duyệt (Vite Dev Server)...</span>
                      </div>
                    </div>
                  )}

                  {/* CYBERFOREST DESIGN SYSTEM THEME SELECTOR */}
                  {project.simulationType === 'theme' && (
                    <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                      <div 
                        className="p-6 rounded-2xl border flex flex-col items-center space-y-2 transition-all duration-300 backdrop-blur-md"
                        style={{ 
                          backgroundColor: `${previewColor}15`, 
                          borderColor: previewColor,
                          boxShadow: `0 0 24px ${previewColor}35` 
                        }}
                      >
                        <h4 className="text-sm font-sans font-bold" style={{ color: previewColor }}>Xem Trước Mã Màu Accent</h4>
                        <p className="text-xs text-slate-200">Màu chủ đạo hiện tại: <code className="bg-slate-900/60 px-2 py-0.5 rounded-md font-mono text-[11px] border border-white/10">{previewColor}</code></p>
                        <button 
                          style={{ backgroundColor: previewColor }}
                          className="px-5 py-2 text-xs text-slate-950 font-bold rounded-full shadow cursor-pointer active:scale-95 transition-all border-none"
                          onClick={() => audioService.playClick()}
                        >
                          Nút Bấm Tương Tác
                        </button>
                      </div>

                      <div className="flex space-x-3">
                        {['#38bdf8', '#818cf8', '#34d399', '#f43f5e', '#fbbf24'].map((color) => (
                          <button
                            key={color}
                            onClick={() => {
                              audioService.playClick();
                              setPreviewColor(color);
                            }}
                            className="w-8 h-8 rounded-full border border-white/30 cursor-pointer hover:scale-110 active:scale-90 transition-all shadow-md"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* RETROTERMINAL CHAT CLIENT */}
                  {project.simulationType === 'chat' && (
                    <div className="w-full h-full flex flex-col bg-slate-950 border border-white/15 rounded-xl font-mono text-xs overflow-hidden shadow-inner">
                      <div className="flex-1 p-3 overflow-y-auto space-y-2">
                        {chatMessages.map((msg, idx) => (
                          <div key={idx} className="leading-tight text-[11px]">
                            <span className="text-slate-500">[{msg.time}]</span>{' '}
                            <span className={msg.sender === 'Bạn' ? 'text-sky-400 font-semibold' : 'text-purple-400 font-semibold'}>
                              &lt;{msg.sender}&gt;
                            </span>{' '}
                            <span className="text-slate-200">{msg.text}</span>
                          </div>
                        ))}
                      </div>
                      
                      <form onSubmit={handleSendChatMessage} className="flex border-t border-white/10 bg-slate-900/60">
                        <input
                          type="text"
                          value={userChatInput}
                          onChange={(e) => setUserChatInput(e.target.value)}
                          placeholder="Nhập nội dung tin nhắn..."
                          className="flex-1 bg-transparent px-3.5 py-2 text-xs font-mono text-white outline-none border-none"
                        />
                        <button 
                          type="submit"
                          className="px-4 py-2 bg-white/10 hover:bg-white/20 border-l border-white/10 text-xs font-mono text-sky-300 font-semibold cursor-pointer transition-colors"
                        >
                          Gửi
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end p-4 md:p-6 border-t border-white/10 bg-slate-900/40 space-x-3">
          <a 
            href={project.github} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={() => audioService.playClick()}
            className="liquid-glass-pill flex items-center space-x-2 px-5 py-2.5 text-slate-200 hover:text-white rounded-full text-xs font-semibold cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            <span>Mã Nguồn GitHub</span>
          </a>
          
          {project.demoUrl && (
            <a 
              href={project.demoUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => audioService.playClick()}
              className="liquid-glass-accent-btn flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
            >
              <ExternalLink size={15} />
              <span>Link Bản Demo</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
