import { AnimatePresence, motion } from 'framer-motion'
import { Send, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// Giả lập tin nhắn ban đầu
const initialMessages = [
  {
    id: 1,
    text: 'Xin chào! Mình là Bot hỗ trợ 🤖. Mình có thể giúp gì cho bạn hôm nay?',
    sender: 'bot',
  },
]

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Tự động cuộn xuống tin nhắn mới nhất
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isOpen])

  const handleSendMessage = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    // Thêm tin nhắn của user
    const newUserMsg = { id: Date.now(), text: inputValue, sender: 'user' }
    setMessages((prev) => [...prev, newUserMsg])
    setInputValue('')

    // Giả lập bot trả lời sau 1s
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: 'Cảm ơn bạn đã nhắn tin! Tính năng này đang được phát triển.',
          sender: 'bot',
        },
      ])
    }, 1000)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
      {/* --- CỬA SỔ CHAT --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="w-[350px] h-[450px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 flex items-center justify-between border-b border-yellow-200 dark:border-yellow-800/50">
              <div className="flex items-center gap-2">
                <div className="relative">
                  {/* Avatar nhỏ trên header */}
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-yellow-400">
                    <img
                      src="/apple-touch-icon.png" // ĐƯỜNG DẪN ẢNH CỦA BẠN
                      alt="Bot Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                    Dev Assistant
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body Tin nhắn */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950/50 scrollbar-thin scrollbar-thumb-gray-300">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 text-sm rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-sm border border-slate-100 dark:border-slate-700 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form
              onSubmit={handleSendMessage}
              className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              />
              <button
                type="submit"
                className="p-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-full transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!inputValue.trim()}
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- NÚT TOGGLE (HÌNH ROBOT) --- */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        // Hiệu ứng "thở" nhẹ khi chưa mở chat
        animate={!isOpen ? { y: [0, -5, 0] } : {}}
        transition={
          !isOpen ? { repeat: Infinity, duration: 2, ease: 'easeInOut' } : {}
        }
        className="relative group w-16 h-16 rounded-full shadow-2xl shadow-yellow-500/20 cursor-pointer focus:outline-none"
      >
        {/* Vòng tròn nền (Background Circle) */}
        <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-full border-2 border-yellow-400 overflow-hidden flex items-center justify-center">
          {isOpen ? (
            <X className="text-slate-600 dark:text-slate-300" size={32} />
          ) : (
            <img
              src="/apple-touch-icon.png" // ĐƯỜNG DẪN ẢNH CỦA BẠN
              alt="Chat Trigger"
              className="w-full h-full object-cover p-1" // p-1 để tạo khoảng hở nhỏ đẹp hơn
            />
          )}
        </div>

        {/* Badge thông báo (chấm đỏ) */}
        {!isOpen && (
          <span className="absolute top-0 right-0 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
          </span>
        )}
      </motion.button>
    </div>
  )
}
