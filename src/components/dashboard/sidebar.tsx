// ============================================
// FILE: src/components/dashboard/sidebar.tsx
// ============================================

'use client'

import Link from 'next/link'

import { usePathname } from 'next/navigation'

import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ShieldCheck,
} from 'lucide-react'

import { cn } from '@/lib/utils'

import { logoutUser } from '@/services/auth.service'

import { useAuth } from '@/context/auth-context'

import { Button } from '@/components/ui/button'

import { toast } from 'sonner'

// ============================================
// Navigation Items
// ============================================

const adminItems = [
  {
    title: 'Dashboard',
    href: '/dashboard/admin',
    icon: LayoutDashboard,
  },

  {
    title: 'Leads',
    href: '/dashboard/leads',
    icon: Users,
  },

  {
    title: 'Contracts',
    href: '/dashboard/contracts',
    icon: FileText,
  },

  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },

  {
    title: 'Users',
    href: '/dashboard/users',
    icon: ShieldCheck,
  },

  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

const salespersonItems = [
  {
    title: 'Dashboard',
    href: '/dashboard/salesperson',
    icon: LayoutDashboard,
  },

  {
    title: 'My Leads',
    href: '/dashboard/leads',
    icon: Users,
  },

  {
    title: 'Contracts',
    href: '/dashboard/contracts',
    icon: FileText,
  },

  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

// ============================================
// Sidebar Component
// ============================================

export function Sidebar() {
  const pathname = usePathname()

  const { role } = useAuth()

  // ============================================
  // Select Menu Based On Role
  // ============================================

  const navigationItems =
    role === 'admin'
      ? adminItems
      : salespersonItems

  // ============================================
  // Logout Handler
  // ============================================

  async function handleLogout() {
    const response =
      await logoutUser()

    if (response.success) {
      toast.success(
        'Logged out successfully'
      )

      window.location.href = '/login'
    } else {
      toast.error(
        response.message ||
          'Logout failed'
      )
    }
  }

  // ============================================
  // UI
  // ============================================

  return (
    <aside className="hidden md:flex w-72 min-h-screen border-r bg-white flex-col">
      {/* LOGO */}

      <div className="h-16 border-b flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
            C
          </div>

          <div>
            <h2 className="font-bold text-lg">
              CRM System
            </h2>

            <p className="text-xs text-slate-500 capitalize">
              {role || 'user'}
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}

      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map(
          (item) => {
            const Icon = item.icon

            const active =
              pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',

                  active
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                <Icon className="h-5 w-5" />

                <span>{item.title}</span>
              </Link>
            )
          }
        )}
      </nav>

      {/* FOOTER */}

      <div className="border-t p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 rounded-xl"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />

          Logout
        </Button>
      </div>
    </aside>
  )
}