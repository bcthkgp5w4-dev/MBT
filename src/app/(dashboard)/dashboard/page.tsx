import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, ArrowRight, Brain, Target, BookOpen, BarChart2, AlertCircle } from 'lucide-react'
import { formatDate, getChildAge } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: children }, { data: goals }, { data: journalEntries }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase.from('children').select('*').eq('profile_id', user.id).eq('is_active', true).order('created_at'),
    supabase.from('goals').select('*').eq('profile_id', user.id).eq('status', 'active').limit(5),
    supabase.from('journal_entries').select('id, created_at, mood').eq('profile_id', user.id).order('created_at', { ascending: false }).limit(7),
  ])

  const firstName = profile?.full_name?.split(' ')[0] || 'there'
  const activeGoalsCount = goals?.length || 0
  const journalStreak = journalEntries?.length || 0

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good morning, {firstName} 👋</h1>
          <p className="text-gray-500 mt-1">{formatDate(new Date().toISOString())}</p>
        </div>
        {children && children.length > 0 && (
          <Link
            href="/children/new"
            className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Child
          </Link>
        )}
      </div>

      {/* No children state */}
      {(!children || children.length === 0) && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">👦</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to MBT!</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Start by creating a profile for your child. This helps us personalize everything for your family.
          </p>
          <Link
            href="/children/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Child Profile
          </Link>
        </div>
      )}

      {/* Children cards */}
      {children && children.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {children.map((child) => (
            <Link
              key={child.id}
              href={`/children/${child.id}`}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold text-lg flex items-center justify-center">
                  {child.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{child.name}</h3>
                  <p className="text-sm text-gray-500">{getChildAge(child.date_of_birth)}</p>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Communication: <span className="text-gray-700 font-medium capitalize">{child.communication_level?.replace(/_/g, ' ')}</span></p>
                <p className="text-xs text-gray-500">Status: <span className="text-gray-700 font-medium capitalize">{child.diagnosis_status?.replace(/_/g, ' ')}</span></p>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400">View profile</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </Link>
          ))}
          <Link
            href="/children/new"
            className="bg-gray-50 rounded-2xl border border-dashed border-gray-200 p-6 flex flex-col items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <Plus className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-500">Add Child</span>
          </Link>
        </div>
      )}

      {/* Quick Stats */}
      {children && children.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Active Goals', value: activeGoalsCount, icon: Target, color: 'text-blue-600 bg-blue-50', href: '/goals' },
            { label: 'Journal Streak', value: `${journalStreak} days`, icon: BookOpen, color: 'text-green-600 bg-green-50', href: '/journal' },
            { label: 'Children', value: children.length, icon: Brain, color: 'text-purple-600 bg-purple-50', href: '/children' },
            { label: 'Progress Reports', value: 'View', icon: BarChart2, color: 'text-orange-600 bg-orange-50', href: '/progress' },
          ].map((stat) => (
            <Link key={stat.label} href={stat.href} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {children && children.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              Active Goals
            </h3>
            {goals && goals.length > 0 ? (
              <div className="space-y-3">
                {goals.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{goal.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${goal.progress_percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{goal.progress_percentage}%</span>
                      </div>
                    </div>
                  </div>
                ))}
                <Link href="/goals" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                  View all goals <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500 mb-2">No active goals yet</p>
                <Link href="/goals/new" className="text-sm text-blue-600 hover:underline">Create your first goal</Link>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-600" />
              AI Coach
            </h3>
            <p className="text-sm text-gray-500 mb-4">Get personalized autism support and guidance from our AI coach.</p>
            <Link
              href="/coach"
              className="w-full bg-purple-600 text-white text-sm font-medium py-2.5 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
            >
              <Brain className="w-4 h-4" />
              Chat with AI Coach
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { label: 'Log Journal Entry', href: '/journal/new', emoji: '📝' },
                { label: 'Record Behavior', href: '/behavior/new', emoji: '📊' },
                { label: 'Start Screening', href: '/screening', emoji: '🔍' },
                { label: 'View Daily Plan', href: '/therapy', emoji: '📅' },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <span>{action.emoji}</span>
                  <span className="text-gray-700">{action.label}</span>
                  <ArrowRight className="w-3 h-3 text-gray-400 ml-auto" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
        <p className="text-xs text-amber-700">
          <strong>Note:</strong> MBT is not a substitute for professional diagnosis, treatment, or medical advice.
          Always consult qualified healthcare professionals for your child's care.
        </p>
      </div>
    </div>
  )
}
