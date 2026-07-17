import React, { useState, useEffect, useRef } from 'react';
import { X, ExternalLink, Play, Sparkles } from 'lucide-react';
import { audioService } from '../utils/audio';

export interface Project {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  longDesc: string;
  tech: string[];
  github: string;
  demoUrl?: string;
  simulationType: 'particles' | 'network' | 'theme' | 'chat';
}

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Network Simulation logs
  const [logs, setLogs] = useState<string[]>([]);
  
  // Chat Simulation messages
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([]);
  const [userChatInput, setUserChatInput] = useState('');

  // CyberForest Theme Color preview
  const [previewColor, setPreviewColor] = useState('#38b000');

  useEffect(() => {
    // Play modal open sound
    audioService.playSuccess();
    
    // Disable body scroll when modal is open
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

    // Initialize particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 4 + 2,
        color: `hsl(${100 + Math.random() * 40}, 80%, 50%)`,
      });
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 15, 10, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(56, 176, 0, 0.05)';
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

      // Draw particles
      particles.forEach((p, idx) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset

        // Update positions
        p.x += p.vx;
        p.y += p.vy;

        // Bounce walls
        if (p.x < p.radius || p.x > canvas.width - p.radius) p.vx *= -1;
        if (p.y < p.radius || p.y > canvas.height - p.radius) p.vy *= -1;

        // Draw connections
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 176, 0, ${1 - dist / 80})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    // Canvas click to add particle
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
        color: '#ff0055',
      });
      if (particles.length > 80) particles.shift(); // limit
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [isPlayingDemo, project.simulationType]);

  // Network Simulation log generator (OptiFlow Board demo)
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

  // Chat Simulation auto replies (RetroTerminal Chat)
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

    // Generate bot response after a short delay
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

  // Helper translate categories
  const getVietnameseCategory = (cat: string) => {
    if (cat === 'Game Engine') return 'Công Cụ Game';
    if (cat === 'Developer Tools') return 'Công Cụ Lập Trình';
    if (cat === 'Design System') return 'Hệ Thống Thiết Kế';
    if (cat === 'Messaging') return 'Ứng Dụng Nhắn Tin';
    return cat;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl glass-panel glow-border rounded-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-light-green/20 bg-dark-green/60">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-heading-primary animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-text-green font-mono">{getVietnameseCategory(project.category)}</span>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 text-text-green hover:text-heading-primary transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div>
            <h2 className="text-2xl font-bold font-mono text-heading-primary glow-text flex items-center gap-2">
              {project.title}
              <Sparkles size={18} className="text-heading-accent animate-pulse" />
            </h2>
            <p className="mt-3 text-text-green text-sm leading-relaxed">{project.longDesc}</p>
          </div>

          {/* Tech stack */}
          <div>
            <h3 className="text-xs font-mono uppercase text-heading-accent tracking-widest mb-2">Công Nghệ Sử Dụng</h3>
            <div className="flex flex-wrap gap-2">
              {project.tech.map((t, idx) => (
                <span 
                  key={idx} 
                  className="px-2.5 py-1 text-xs font-mono bg-light-green/30 border border-light-green/50 text-text-light rounded-md"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Simulation / Live Demo Container */}
          <div className="border border-light-green/30 rounded-lg overflow-hidden bg-black/40">
            <div className="flex items-center justify-between px-4 py-2 border-b border-light-green/30 bg-light-green/10">
              <div className="flex items-center space-x-2">
                <Play size={14} className="text-heading-accent" />
                <span className="text-xs font-mono text-text-light">Trình Giả Lập Demo Tương Tác</span>
              </div>
              
              {!isPlayingDemo ? (
                <button 
                  onClick={() => {
                    audioService.playClick();
                    setIsPlayingDemo(true);
                  }}
                  className="px-3 py-1 text-xs font-mono bg-heading-primary hover:bg-heading-accent text-dark-green font-semibold rounded cursor-pointer transition-all duration-200"
                >
                  Chạy Giả Lập
                </button>
              ) : (
                <button 
                  onClick={() => {
                    audioService.playClick();
                    setIsPlayingDemo(false);
                  }}
                  className="px-3 py-1 text-xs font-mono bg-red-600 hover:bg-red-500 text-white rounded cursor-pointer transition-all duration-200"
                >
                  Dừng Giả Lập
                </button>
              )}
            </div>

            <div className="h-64 flex items-center justify-center p-4 relative">
              {!isPlayingDemo ? (
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full border border-light-green/30 flex items-center justify-center mx-auto text-heading-accent bg-light-green/5">
                    <Play size={20} />
                  </div>
                  <p className="text-xs font-mono text-text-green">Nhấn nút "Chạy Giả Lập" để trải nghiệm trực tiếp bản thử nghiệm này.</p>
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
                        className="w-full h-40 bg-[#0a0f0a] border border-light-green/20 rounded cursor-crosshair block"
                      />
                      <p className="text-[10px] font-mono text-text-green mt-1 text-center">
                        Mô-đun hạt đang chạy. Hãy click chuột trực tiếp vào khung đen ở trên để tạo các tia năng lượng màu hồng!
                      </p>
                    </div>
                  )}

                  {/* OPTIFLOW NETWORK GRPC LOGS */}
                  {project.simulationType === 'network' && (
                    <div className="w-full h-full flex flex-col justify-between bg-black p-3 font-mono text-xs border border-light-green/20 rounded overflow-hidden">
                      <div className="flex-1 overflow-y-auto space-y-1 text-green-400">
                        {logs.map((log, idx) => (
                          <div key={idx} className="whitespace-pre-wrap leading-tight text-[11px]">{log}</div>
                        ))}
                      </div>
                      <div className="flex items-center space-x-2 pt-2 border-t border-light-green/10 text-[10px] text-text-green">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                        <span>Đang truy xuất thông số kết xuất từ trình duyệt (Vite Dev Server)...</span>
                      </div>
                    </div>
                  )}

                  {/* CYBERFOREST DESIGN SYSTEM THEME SELECTOR */}
                  {project.simulationType === 'theme' && (
                    <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                      <div 
                        className="p-6 rounded-lg border flex flex-col items-center space-y-2 transition-all duration-300"
                        style={{ 
                          backgroundColor: `${previewColor}15`, 
                          borderColor: previewColor,
                          boxShadow: `0 0 20px ${previewColor}30` 
                        }}
                      >
                        <h4 className="text-sm font-mono font-bold" style={{ color: previewColor }}>Xem Trước Mã Màu Accent</h4>
                        <p className="text-xs text-text-light">Màu chủ đạo hiện tại: <code className="bg-black/30 px-1 py-0.5 rounded font-mono text-[11px]">{previewColor}</code></p>
                        <button 
                          style={{ backgroundColor: previewColor }}
                          className="px-4 py-1.5 text-xs text-black font-semibold rounded shadow cursor-pointer active:scale-95 transition-all"
                          onClick={() => audioService.playClick()}
                        >
                          Nút Bấm Tương Tác
                        </button>
                      </div>

                      <div className="flex space-x-3">
                        {['#38b000', '#70e000', '#00b4d8', '#ff0055', '#ffb703'].map((color) => (
                          <button
                            key={color}
                            onClick={() => {
                              audioService.playClick();
                              setPreviewColor(color);
                            }}
                            className="w-8 h-8 rounded-full border border-white/20 cursor-pointer hover:scale-110 active:scale-90 transition-all"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* RETROTERMINAL CHAT CLIENT */}
                  {project.simulationType === 'chat' && (
                    <div className="w-full h-full flex flex-col bg-black border border-light-green/20 rounded font-mono text-xs overflow-hidden">
                      <div className="flex-1 p-3 overflow-y-auto space-y-2">
                        {chatMessages.map((msg, idx) => (
                          <div key={idx} className="leading-tight text-[11px]">
                            <span className="text-text-green">[{msg.time}]</span>{' '}
                            <span className={msg.sender === 'Bạn' ? 'text-heading-accent' : 'text-blue-400'}>
                              &lt;{msg.sender}&gt;
                            </span>{' '}
                            <span className="text-text-light">{msg.text}</span>
                          </div>
                        ))}
                      </div>
                      
                      <form onSubmit={handleSendChatMessage} className="flex border-t border-light-green/20 bg-dark-green/60">
                        <input
                          type="text"
                          value={userChatInput}
                          onChange={(e) => setUserChatInput(e.target.value)}
                          placeholder="Nhập nội dung tin nhắn..."
                          className="flex-1 bg-transparent px-3 py-2 text-xs font-mono text-text-light outline-none border-none"
                        />
                        <button 
                          type="submit"
                          className="px-4 py-2 bg-light-green/20 hover:bg-light-green/40 border-l border-light-green/20 text-xs font-mono text-heading-primary cursor-pointer transition-colors"
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
        <div className="flex items-center justify-end p-4 border-t border-light-green/20 bg-dark-green/60 space-x-3">
          <a 
            href={project.github} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={() => audioService.playClick()}
            className="flex items-center space-x-2 px-4 py-2 border border-light-green/30 hover:border-light-green/70 bg-light-green/10 text-text-light rounded-lg text-sm font-mono cursor-pointer transition-all duration-200"
          >
            <svg className="w-4 h-4 fill-current animate-pulse" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
              className="flex items-center space-x-2 px-4 py-2 bg-heading-primary hover:bg-heading-accent text-dark-green rounded-lg text-sm font-bold cursor-pointer transition-all duration-200"
            >
              <ExternalLink size={16} />
              <span>Link Bản Demo</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
