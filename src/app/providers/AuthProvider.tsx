import React, { createContext, useContext } from 'react'

import { useFirebaseAuth } from '@/shared/hooks/useFirebaseAuth'
import type { AppUser } from '@/shared/types/auth'

interface AuthContextValue {
  user: AppUser | null
  loading: boolean
  isAuthenticated: boolean
  loginWithGoogle: () => Promise<AppUser>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useFirebaseAuth()

  return (
    <AuthContext.Provider value={auth as AuthContextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
