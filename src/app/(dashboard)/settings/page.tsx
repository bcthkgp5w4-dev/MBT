import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Shield, CreditCard, Bell, User } from 'lucide-react'
import { SUBSCRIPTION_TIERS } from '@/lib/constants'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const currentTier = profile?.subscription_tier || 'free'
  const tierInfo = SUBSCRIPTION_TIERS[currentTier as keyof typeof SUBSCRIPTION_TIERS]

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and preferences</p>
      </div>

      <div className="space-y-4">
        {/* Profile */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            Profile
          </h2>
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
              <input defaultValue={profile?.full_name} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
              <input defaultValue={user.email} disabled className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Role</label>
              <span className="text-sm font-medium text-gray-700 capitalize">{profile?.role}</span>
            </div>
            <button className="w-fit bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">
              Save Changes
            </button>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600" />
            Subscription
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <div>
              <p className="font-semibold text-gray-900 capitalize">{currentTier} Plan</p>
              <p className="text-sm text-gray-500">{profile?.subscription_status}</p>
            </div>
            <span className="ml-auto bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full capitalize">{currentTier}</span>
          </div>
          <div className="space-y-1 mb-4">
            {tierInfo?.features.map((feature: string, i: number) => (
              <p key={i} className="text-sm text-gray-600">✓ {feature}</p>
            ))}
          </div>
          {currentTier !== 'pro' && (
            <a href="/pricing" className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700">
              Upgrade Plan
            </a>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            Notifications
          </h2>
          <div className="space-y-3">
            {[
              { label: 'Daily therapy reminders', desc: 'Get reminded to complete daily activities' },
              { label: 'Weekly progress reports', desc: 'Receive weekly summaries of your child\'s progress' },
              { label: 'Journal reminders', desc: 'Remind me to write in the daily journal' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600" />
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600" />
            Security & Privacy
          </h2>
          <div className="space-y-3">
            <button className="text-sm text-blue-600 hover:underline">Change Password</button>
            <br />
            <button className="text-sm text-blue-600 hover:underline">Download My Data</button>
            <br />
            <button className="text-sm text-red-500 hover:underline">Delete Account</button>
          </div>
          <div className="mt-4 bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500">
              Your data is encrypted and stored securely. We never sell your personal information.
              MBT complies with GDPR and COPPA requirements. See our <a href="/privacy" className="text-blue-600">Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
