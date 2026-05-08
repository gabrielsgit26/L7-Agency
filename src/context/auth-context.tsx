// ============================================
// FILE: src/context/auth-context.tsx
// ============================================

'use client'

import {
  User,
  onAuthStateChanged,
} from 'firebase/auth'

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { auth } from '@/lib/firebase/client'
import { getUserProfile, getUserRole } from '@/services/auth.service'
import { usePathname, useRouter } from 'next/navigation'
import { profile } from 'console'
import path from 'path'

// ============================================
// Types
// ============================================

type UserRole =
  | 'admin'
  | 'salesperson'
  | null

interface AuthContextType {
  user: User | null
  loading: boolean
  role: UserRole
}

// ============================================
// Create Context
// ============================================

const AuthContext =
  createContext<AuthContextType>({
    user: null,
    loading: true,
    role: null,
  })

// ============================================
// Provider
// ============================================

export function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const pathnameref = useRef("");
  const [user, setUser] =
    useState<User | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [role, setRole] =
    useState<UserRole>(null)

  const router = useRouter()
  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          try {
            setLoading(true)
            // User logged in
            if (firebaseUser) {
              // TEMP ROLE
              getUserProfile(firebaseUser.uid).then((result) => {
                if (!result.success) {
                  console.error('Failed to fetch user profile:', result.message)
                  setRole(null)
                  return
                }
                setRole(result.data.role as UserRole);
                setUser(result.data);
                if (result.data.role === 'admin' && !pathnameref.current.includes('/dashboard')) {
                  router.push('/dashboard/admin')
                } else if (result.data.role === 'salesperson' && !pathnameref.current.includes('/dashboard')) {
                  router.push('/dashboard/salesperson')
                }
              }).catch((error) => {
                console.error('Error fetching user profile:', error)
                setRole(null)
                if (pathnameref.current.includes('/dashboard')) {
                  router.push('/');
                }
              })

            } else {
              // User logged out
              setUser(null)
              setRole(null)
              if (pathnameref.current.includes('/dashboard')) {
                router.push('/')
              }
            }
          } catch (error) {
            console.error(
              'Auth Context Error:',
              error
            )
          } finally {
            setLoading(false)
          }
        }
      )

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    pathnameref.current = pathname;
  }, [pathname])
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ============================================
// Custom Hook
// ============================================

export function useAuth() {
  return useContext(AuthContext)
}