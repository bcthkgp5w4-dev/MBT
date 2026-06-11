import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Ensure profile exists — covers users created before the trigger was in place
  await supabase.from('profiles').upsert({
    id: user.id,
    email: user.email!,
    full_name: user.user_metadata?.full_name || user.email!.split('@')[0],
    role: user.user_metadata?.role || 'parent',
  }, { onConflict: 'id', ignoreDuplicates: true })

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={{
            name: profile?.full_name || user.email || 'User',
            email: user.email || '',
            avatar: profile?.avatar_url,
          }}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
