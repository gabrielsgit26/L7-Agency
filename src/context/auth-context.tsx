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
  const [user, setUser] =
    useState<User | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [role, setRole] =
    useState<UserRole>(null)

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          try {
            setLoading(true)

            // User logged in
            if (firebaseUser) {
              setUser(firebaseUser)

              // OPTIONAL:
              // Later you can fetch role
              // from Firestore here

              // Example:
              // const userDoc = await getDoc(...)
              // setRole(userDoc.data()?.role)

              // TEMP ROLE
              setRole('salesperson')
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