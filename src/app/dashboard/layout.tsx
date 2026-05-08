// ============================================
// FILE: src/app/(dashboard)/layout.tsx
// ============================================

'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { Loader2 } from 'lucide-react'

import { useAuth } from '@/context/auth-context'

import { Sidebar } from '@/components/dashboard/sidebar'

import { Header } from '@/components/dashboard/header'

// ============================================
// Dashboard Layout
// ============================================

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const { user, loading } =
    useAuth()

  // ============================================
  // Route Protection
  // ============================================

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  // ============================================
  // Loading State
  // ============================================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="h-6 w-6 animate-spin" />

          <span className="text-lg">
            Loading dashboard...
          </span>
        </div>
      </div>
    )
  }

  // ============================================
  // Prevent Render Until Auth Ready
  // ============================================

  if (!user) {
    return null
  }

  // ============================================
  // Dashboard UI
  // ============================================

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        {/* SIDEBAR */}

        <Sidebar />

        {/* MAIN AREA */}

        <div className="flex flex-1 flex-col">
          {/* HEADER */}

          <Header />

          {/* PAGE CONTENT */}

          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}