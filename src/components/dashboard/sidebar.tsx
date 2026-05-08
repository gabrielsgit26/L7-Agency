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
  Menu,
} from 'lucide-react'

import { cn } from '@/lib/utils'

import { logoutUser } from '@/services/auth.service'

import { useAuth } from '@/context/auth-context'

import { Button } from '@/components/ui/button'

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

import { toast } from 'sonner'

// ============================================
// Navigation Items
// ============================================

const adminItems = [
  {
    title: 'Dashboard',
    href: '/dashboard/admin',
    icon: LayoutDashboard,
    active: true,
  },

  {
    title: 'Leads',
    href: '/dashboard/leads',
    icon: Users,
    active: true,
  },

  {
    title: 'Contracts',
    href: '/dashboard/contracts',
    icon: FileText,
    active: false,
  },

  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    active: false,
  },

  {
    title: 'Users',
    href: '/dashboard/users',
    icon: ShieldCheck,
    active: true,

  },

  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    active: false,
  },
]

const salespersonItems = [
  {
    title: 'Dashboard',
    href: '/dashboard/salesperson',
    icon: LayoutDashboard,
    active: true,

  },

  {
    title: 'My Leads',
    href: '/dashboard/leads',
    icon: Users,
    active: true,

  },

  {
    title: 'Contracts',
    href: '/dashboard/contracts',
    icon: FileText,
    active: false,
  },

  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    active: false,
  },
]

// ============================================
// Sidebar Content Component
// ============================================

type SidebarContentProps = {
  pathname: string

  navigationItems: {
    title: string
    href: string
    icon: any
    active: boolean
  }[]

  role?: string

  handleLogout: () => void
}

function SidebarContent({
  pathname,
  navigationItems,
  role,
  handleLogout,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* LOGO */}

      <div className="h-16 border-b flex items-center px-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">
            L7
          </div>

          <div>
            <h2 className="font-bold text-lg">
              L7 Agency
            </h2>

            <p className="text-xs text-slate-500 capitalize">
              {role || 'user'}
            </p>
          </div>
        </div>
      </div>

      {/* NAVIGATION */}

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navigationItems.map(
          (item) => {
            const Icon = item.icon

            const active =
              pathname === item.href
            if (!item.active) {
              return (
                <div
                  key={item.href}
                  onClick={() => {
                    toast.info(
                      'This feature is coming soon!'
                    )
                  }}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all text-slate-700 hover:bg-slate-100 cursor-not-allowed opacity-50'
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />

                  <span>{item.title}</span>
                </div>)
            }

            return (
              <Link
                key={item.href}
                href={item.href}

                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all',

                  active
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-700 hover:bg-slate-100'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />

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
          <LogOut className="h-4 w-4 shrink-0" />

          Logout
        </Button>
      </div>
    </div>
  )
}

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

      window.location.href =
        '/'
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

    <aside className="hidden md:flex w-72 h-dvh border-r bg-white flex-col sticky top-0">
      <SidebarContent
        pathname={pathname}
        navigationItems={
          navigationItems
        }
        role={role || 'salesperson'}
        handleLogout={
          handleLogout
        }
      />
    </aside>
  )
}



export function MobileSidebar() {
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

      window.location.href =
        '/'
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
    <Sheet>
      <SheetTrigger className="md:hidden">
        <Menu className="h-6 w-6" />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-72 p-0"
      >
        <SidebarContent
          pathname={pathname}
          navigationItems={
            navigationItems
          }
          role={role || 'salesperson'}
          handleLogout={
            handleLogout
          }
        />
      </SheetContent>
    </Sheet>
  )
}