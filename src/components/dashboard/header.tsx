// ============================================
// FILE: src/components/dashboard/header.tsx
// ============================================

'use client'

import { useState } from 'react'

import {
  Bell,
  Menu,
  Search,
} from 'lucide-react'

import { useAuth } from '@/context/auth-context'

import { Button } from '@/components/ui/button'

import { Input } from '@/components/ui/input'

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'

import { Sidebar } from './sidebar'

// ============================================
// Header Component
// ============================================

export function Header() {
  const { user, role } =
    useAuth()

  const [notifications] =
    useState(3)

  // ============================================
  // UI
  // ============================================

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      {/* LEFT SECTION */}

      <div className="flex items-center gap-3">
        {/* MOBILE SIDEBAR */}

        <Sheet>
          <SheetTrigger>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="p-0 w-72"
          >
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* SEARCH */}

        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            placeholder="Search leads, contracts..."
            className="pl-10 w-[320px] rounded-xl"
          />
        </div>
      </div>

      {/* RIGHT SECTION */}

      <div className="flex items-center gap-4">
        {/* NOTIFICATIONS */}

        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full"
        >
          <Bell className="h-5 w-5" />

          {notifications > 0 && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          )}
        </Button>

        {/* USER INFO */}

        <div className="hidden sm:flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium leading-none">
              {user?.email}
            </p>

            <p className="text-xs text-slate-500 capitalize mt-1">
              {role || 'user'}
            </p>
          </div>

          {/* AVATAR */}

          <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold uppercase">
            {user?.email?.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  )
}