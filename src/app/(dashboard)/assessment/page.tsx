import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Plus, ClipboardCheck, Brain, TrendingUp } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function AssessmentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: children }, { data: assessments }] = await Promise.all([
    supabase.from('children').select('id, name, date_of_birth').eq('profile_id', user.id),
    supabase
      .from('functional_assessments')
      .select('id, child_id, overall_level, prioritized_domains, created_at')
      .eq('profile_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  const assessmentsByChild = Object.fromEntries(
    (children || []).map(c => [c.id, (assessments || []).filter(a => a.child_id === c.id)])
  )

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Developmental Assessment</h1>
        <p className="text-gray-500 mt-1">Find out where your child is today and what to teach next</p>
      </div>

      {/* How it works */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: ClipboardCheck, title: '64 Questions', desc: 'Across 8 developmental domains — takes 15–20 minutes', color: 'bg-blue-50 text-blue-600' },
          { icon: Brain, title: 'AI Analysis', desc: 'Generates strengths, skill gaps, and priority areas instantly', color: 'bg-purple-50 text-purple-600' },
          { icon: TrendingUp, title: 'Full Plan', desc: 'SMART goals, therapy plan, daily schedule, and activities', color: 'bg-green-50 text-green-600' },
        ].map(item => (
          <div key={item.title} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {!children || children.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="text-5xl mb-4">👶</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Create a child profile first</h2>
          <p className="text-gray-500 text-sm mb-6">You need to add your child before starting an assessment.</p>
          <Link href="/children/new" className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700">
            <Plus className="w-4 h-4" /> Add Child Profile
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {(children || []).map(child => {
            const childAssessments = assessmentsByChild[child.id] || []
            const latest = childAssessments[0]
            return (
              <div key={child.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {child.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{child.name}</h3>
                      {latest ? (
                        <p className="text-xs text-gray-500">
                          Last assessed: {formatDate(latest.created_at)} · Overall: {latest.overall_level}%
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400">No assessment yet</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {latest && (
                      <Link
                        href={`/assessment/${child.id}/results?assessmentId=${latest.id}`}
                        className="text-sm font-medium text-blue-600 hover:underline"
                      >
                        View Results
                      </Link>
                    )}
                    <Link
                      href={`/assessment/${child.id}`}
                      className="flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700"
                    >
                      {latest ? 'Reassess' : 'Start Assessment'}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {latest && (
                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${latest.overall_level}%` }} />
                      </div>
                      <span className="text-xs font-medium text-gray-600 w-10 text-right">{latest.overall_level}%</span>
                    </div>
                    {latest.prioritized_domains && (
                      <p className="text-xs text-gray-500">
                        Top focus areas: {(latest.prioritized_domains as string[]).slice(0, 3).join(' → ')}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
