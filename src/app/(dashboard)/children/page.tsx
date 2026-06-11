import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, ArrowRight } from 'lucide-react'
import { getChildAge, formatDate } from '@/lib/utils'

export default async function ChildrenPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: children } = await supabase
    .from('children')
    .select('*')
    .eq('profile_id', user.id)
    .eq('is_active', true)
    .order('created_at')

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Children</h1>
          <p className="text-gray-500 mt-1">Manage profiles for your children</p>
        </div>
        <Link
          href="/children/new"
          className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Child
        </Link>
      </div>

      {(!children || children.length === 0) ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">👦</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No children yet</h2>
          <p className="text-gray-500 mb-6">Create a profile for your child to get personalized support.</p>
          <Link
            href="/children/new"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700"
          >
            <Plus className="w-5 h-5" />
            Create Child Profile
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {children.map((child) => (
            <Link
              key={child.id}
              href={`/children/${child.id}`}
              className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white font-bold text-xl flex items-center justify-center">
                  {child.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{child.name}</h3>
                  <p className="text-sm text-gray-500">{getChildAge(child.date_of_birth)} old</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400 text-xs">Communication</p>
                  <p className="font-medium text-gray-700 capitalize">{child.communication_level?.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Diagnosis</p>
                  <p className="font-medium text-gray-700 capitalize">{child.diagnosis_status?.replace(/_/g, ' ')}</p>
                </div>
                {child.interests?.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-gray-400 text-xs">Interests</p>
                    <p className="font-medium text-gray-700">{child.interests.slice(0, 3).join(', ')}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-xs text-gray-400">Added {formatDate(child.created_at)}</span>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
