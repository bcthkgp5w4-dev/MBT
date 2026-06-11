import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Users, BookOpen, BarChart2, Settings, Activity } from 'lucide-react'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const [
    { count: userCount },
    { count: childCount },
    { count: goalCount },
    { count: journalCount },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('children').select('*', { count: 'exact', head: true }),
    supabase.from('goals').select('*', { count: 'exact', head: true }),
    supabase.from('journal_entries').select('*', { count: 'exact', head: true }),
  ])

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-500 mt-1">Platform management and analytics</p>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Users', value: userCount || 0, icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Children Profiles', value: childCount || 0, icon: Activity, color: 'text-green-600 bg-green-50' },
          { label: 'Goals Created', value: goalCount || 0, icon: BarChart2, color: 'text-purple-600 bg-purple-50' },
          { label: 'Journal Entries', value: journalCount || 0, icon: BookOpen, color: 'text-orange-600 bg-orange-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Admin sections */}
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { title: 'User Management', desc: 'View, manage, and moderate user accounts', href: '/admin/users', icon: Users },
          { title: 'Content Management', desc: 'Manage articles, activities, and courses', href: '/admin/content', icon: BookOpen },
          { title: 'Analytics', desc: 'Platform usage metrics and insights', href: '/admin/analytics', icon: BarChart2 },
          { title: 'System Settings', desc: 'Platform configuration and feature flags', href: '/admin/settings', icon: Settings },
        ].map((section) => (
          <a key={section.title} href={section.href} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-sm transition-shadow group">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-4">
              <section.icon className="w-5 h-5 text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{section.title}</h3>
            <p className="text-sm text-gray-500">{section.desc}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
