// src/context/AuthContext.tsx
import Cookies from 'js-cookie'
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

// Tên key lưu trong cookie
const TOKEN_KEY = 'access_token'

interface AuthContextType {
  isAuthenticated: boolean
  token: string | null
  login: (token: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // 1. Khởi tạo state trực tiếp từ Cookie để tránh "Flash of Unauthenticated Content"
  const [token, setToken] = useState<string | null>(() => {
    return Cookies.get(TOKEN_KEY) || null
  })

  // Tính toán isAuthenticated dựa trên sự tồn tại của token
  const isAuthenticated = !!token

  const login = (newToken: string) => {
    // 2. Lưu vào Cookie (có thể config thêm expires: 7 ngày, secure: true...)
    Cookies.set(TOKEN_KEY, newToken, { expires: 7 })
    setToken(newToken)
  }

  const logout = () => {
    // 3. Xóa Cookie và reset state
    Cookies.remove(TOKEN_KEY)
    setToken(null)
  }

  // useMemo để tối ưu performance, tránh re-render không cần thiết
  const value = useMemo(
    () => ({
      isAuthenticated,
      token,
      login,
      logout,
    }),
    [isAuthenticated, token],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook để sử dụng auth ở mọi nơi
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
