'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Brain, LayoutDashboard, Users, ClipboardList, Target, Calendar,
  BookOpen, BarChart2, AlertTriangle, Map, Apple, Moon, GraduationCap,
  Library, Stethoscope, FileText, Settings, ShieldCheck, MessageSquare, LogOut
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/children', icon: Users, label: 'Children' },
  { href: '/screening', icon: ClipboardList, label: 'Screening' },
  { href: '/assessment', icon: ShieldCheck, label: 'Assessment' },
  { href: '/goals', icon: Target, label: 'Goals' },
  { href: '/therapy', icon: Calendar, label: 'Therapy Plans' },
  { href: '/coach', icon: MessageSquare, label: 'AI Coach' },
  { href: '/journal', icon: BookOpen, label: 'Journal' },
  { href: '/behavior', icon: AlertTriangle, label: 'Behavior' },
  { href: '/progress', icon: BarChart2, label: 'Progress' },
  { href: '/roadmap', icon: Map, label: 'Roadmap' },
  { href: '/diet', icon: Apple, label: 'Diet' },
  { href: '/sleep', icon: Moon, label: 'Sleep' },
  { href: '/training', icon: GraduationCap, label: 'Training' },
  { href: '/knowledge', icon: Library, label: 'Knowledge' },
  { href: '/marketplace', icon: Stethoscope, label: 'Find Therapists' },
  { href: '/passport', icon: FileText, label: 'Autism Passport' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-gray-900">MBT</span>
            <p className="text-xs text-gray-400 leading-none">Mind, Behavior & Therapy</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon className={cn('w-4 h-4 shrink-0', active ? 'text-blue-600' : 'text-gray-400')} />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 w-full"
        >
          <LogOut className="w-4 h-4 text-gray-400" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
