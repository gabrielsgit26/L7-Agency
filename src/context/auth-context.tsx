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
              console.log('User logged in:', firebaseUser)
              getUserProfile(firebaseUser.uid).then((result) => {
                if (!result.success) {
                  console.error('Failed to fetch user profile:', result.message)
                  setRole(null)
                  return
                }
                setRole(result.data.role as UserRole);
                console.log('User profile:', result.data)

                setUser(result.data);
              }).catch((error) => {
                console.error('Error fetching user profile:', error)
                setRole(null)
              })

            } else {
              // User logged out
              setUser(null)
              setRole(null)
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
    if (loading) return // Wait until loading is false
    if (role === 'admin' && !pathname.includes('/dashboard')) {
      router.push('/dashboard/admin')
    } else if (role === 'salesperson' && !pathname.includes('/dashboard')) {
      router.push('/dashboard/salesperson')
    }
  }, [user, role, loading])

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