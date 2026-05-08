'use client'

import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  Settings,
} from 'lucide-react'

const items = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Leads',
    href: '/dashboard/leads',
    icon: Users,
  },
  {
    label: 'Contracts',
    href: '/dashboard/contracts',
    icon: FileText,
  },
  {
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  return (
    <aside className="hidden md:flex w-72 border-r bg-white min-h-screen flex-col">
      <div className="h-16 flex items-center px-6 border-b">
        <h1 className="font-bold text-xl">
          CRM System
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-100 transition"
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}