import { useCallback, useEffect, useState } from 'react'

import { useRouter } from '@tanstack/react-router'
import type { User } from 'firebase/auth'
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth'

import { auth } from '../lib/firebase'
import type { AppUser } from '../types/auth'

function mapFirebaseUser(user: User): AppUser {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
  }
}

export function useFirebaseAuth() {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Theo dõi trạng thái đăng nhập
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(mapFirebaseUser(firebaseUser))
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Login Google
  const loginWithGoogle = useCallback(async () => {
    try {
      setError(null)
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)

      const firebaseUser = result.user
      const appUser = mapFirebaseUser(firebaseUser)
      setUser(appUser)

      return appUser
    } catch (err: any) {
      console.error('Login Google error:', err)
      setError(err.message || 'Login failed')
      throw err
    }
  }, [])

  // Logout
  const logout = useCallback(async () => {
    await signOut(auth)
    setUser(null)
  }, [])

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    loginWithGoogle,
    logout,
  }
}
