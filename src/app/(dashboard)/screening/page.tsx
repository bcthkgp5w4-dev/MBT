import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'

const SCREENINGS = [
  {
    id: 'mchat_r',
    title: 'M-CHAT-R',
    subtitle: 'Modified Checklist for Autism in Toddlers',
    description: 'Validated screening tool for autism risk in children 16-30 months.',
    duration: '5-10 min',
    questions: 20,
    ageRange: '16-30 months',
    evidence: 'Gold standard autism screening tool',
    color: 'bg-blue-50 border-blue-100',
    iconColor: 'text-blue-600',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'developmental',
    title: 'Developmental Assessment',
    subtitle: 'Comprehensive Development Questionnaire',
    description: 'Broad assessment of developmental milestones across all domains.',
    duration: '15-20 min',
    questions: 40,
    ageRange: '0-6 years',
    evidence: 'Evidence-based developmental checklist',
    color: 'bg-purple-50 border-purple-100',
    iconColor: 'text-purple-600',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'sensory',
    title: 'Sensory Profile',
    subtitle: 'Sensory Processing Assessment',
    description: 'Identify sensory processing patterns and needs across all sensory domains.',
    duration: '10-15 min',
    questions: 30,
    ageRange: 'All ages',
    evidence: 'Based on Sensory Integration Theory',
    color: 'bg-green-50 border-green-100',
    iconColor: 'text-green-600',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    id: 'communication',
    title: 'Communication Assessment',
    subtitle: 'Language & Communication Evaluation',
    description: 'Evaluate expressive and receptive communication skills and identify gaps.',
    duration: '10-15 min',
    questions: 25,
    ageRange: '0-8 years',
    evidence: 'Based on ASHA guidelines',
    color: 'bg-orange-50 border-orange-100',
    iconColor: 'text-orange-600',
    badgeColor: 'bg-orange-100 text-orange-700',
  },
]

export default async function ScreeningPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: children } = await supabase.from('children').select('id, name').eq('profile_id', user.id).eq('is_active', true)
  const { data: results } = await supabase.from('screening_results').select('*').eq('profile_id', user.id).order('created_at', { ascending: false })

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Screening Center</h1>
        <p className="text-gray-500 mt-1">Evidence-based screenings to understand your child&apos;s developmental profile</p>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-800">
          <strong>Important:</strong> These screenings identify areas of concern and are not diagnostic tools.
          Results should always be reviewed by a qualified healthcare professional.
        </p>
      </div>

      {(!children || children.length === 0) && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <p className="text-gray-600 text-sm">Please <Link href="/children/new" className="text-blue-600 font-medium">create a child profile</Link> first to begin screening.</p>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {SCREENINGS.map((screening) => {
          const childResults = results?.filter(r => r.screening_type === screening.id) || []
          const lastResult = childResults[0]

          return (
            <div key={screening.id} className={`rounded-2xl border ${screening.color} p-6`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{screening.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{screening.subtitle}</p>
                </div>
                {lastResult && (
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                    lastResult.risk_level === 'low' ? 'bg-green-100 text-green-700' :
                    lastResult.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {lastResult.risk_level} risk
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-4">{screening.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{screening.duration}</span>
                <span>{screening.questions} questions</span>
                <span>{screening.ageRange}</span>
              </div>
              {lastResult && (
                <p className="text-xs text-gray-500 mb-3">
                  Last completed: {formatDate(lastResult.completed_at)}
                </p>
              )}
              {children && children.length > 0 && (
                <Link
                  href={`/screening/${screening.id}`}
                  className={`flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-colors ${
                    lastResult
                      ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {lastResult ? 'Retake Screening' : 'Start Screening'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          )
        })}
      </div>

      {/* Past results */}
      {results && results.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Screening History</h2>
          <div className="space-y-3">
            {results.slice(0, 10).map((result) => (
              <Link
                key={result.id}
                href={`/screening/results/${result.id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">{result.screening_type?.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-gray-400">{formatDate(result.completed_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {result.risk_level && (
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                      result.risk_level === 'low' ? 'bg-green-100 text-green-700' :
                      result.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {result.risk_level} risk
                    </span>
                  )}
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
