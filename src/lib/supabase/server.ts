import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)
}

export async function createClient() {
  if (!isSupabaseConfigured()) {
    // Return a mock client that does nothing when Supabase is not configured
    return createMockClient()
  }

  const cookieStore = await cookies()

  return createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Ignore cookie errors in Server Components
        }
      },
    },
  })
}

export async function createAdminClient() {
  if (!isSupabaseConfigured()) {
    return createMockClient()
  }

  const cookieStore = await cookies()
  const key = SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY!

  return createServerClient(SUPABASE_URL!, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {}
      },
    },
  })
}

// Mock client returned when env vars are not set — prevents crashes
function createMockClient() {
  const noData = { data: null, error: new Error('Supabase not configured') }
  const noUser = { data: { user: null }, error: null }
  const noSession = { data: { session: null }, error: null }

  return {
    auth: {
      getUser: async () => noUser,
      getSession: async () => noSession,
      signInWithPassword: async () => noData,
      signUp: async () => noData,
      signOut: async () => noData,
      resetPasswordForEmail: async () => noData,
      signInWithOAuth: async () => noData,
      exchangeCodeForSession: async () => noData,
    },
    from: (_table: string) => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            eq: () => ({
              single: async () => noData,
              limit: () => ({ data: [], error: null }),
              order: () => ({ data: [], error: null }),
            }),
            single: async () => noData,
            limit: () => ({ data: [], error: null }),
            order: () => ({
              data: [],
              error: null,
              limit: () => ({ data: [], error: null }),
              ascending: () => ({ data: [], error: null }),
            }),
          }),
          single: async () => noData,
          order: () => ({
            data: [],
            error: null,
            limit: () => ({ data: [], error: null }),
          }),
          limit: () => ({ data: [], error: null }),
        }),
        order: () => ({
          data: [],
          error: null,
          limit: () => ({ data: [], error: null }),
        }),
        limit: () => ({ data: [], error: null }),
        single: async () => noData,
      }),
      insert: () => ({
        select: () => ({
          single: async () => noData,
        }),
        single: async () => noData,
      }),
      update: () => ({
        eq: () => ({
          eq: () => ({ data: null, error: null }),
          select: () => ({ single: async () => noData }),
          data: null,
          error: null,
        }),
        data: null,
        error: null,
      }),
      upsert: () => ({
        select: () => ({ single: async () => noData }),
        data: null,
        error: null,
      }),
      delete: () => ({
        eq: () => ({ data: null, error: null }),
        data: null,
        error: null,
      }),
    }),
  } as any
}
