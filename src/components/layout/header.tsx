'use client'

import { Bell, Search, ChevronDown } from 'lucide-react'
import { getInitials } from '@/lib/utils'

interface HeaderProps {
  user?: { name: string; email: string; avatar?: string }
  title?: string
}

export function Header({ user, title }: HeaderProps) {
  return (
    <header className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {title && <h1 className="text-lg font-semibold text-gray-900">{title}</h1>}
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-lg hover:bg-gray-50 text-gray-500">
          <Bell className="w-5 h-5" />
        </button>
        {user && (
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 text-sm font-medium flex items-center justify-center">
              {getInitials(user.name)}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900 leading-none">{user.name}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
