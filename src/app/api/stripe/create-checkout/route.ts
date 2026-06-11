export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const PRICE_IDS: Record<string, string> = {
  basic: process.env.STRIPE_BASIC_PRICE_ID || '',
  pro: process.env.STRIPE_PRO_PRICE_ID || '',
  clinic: process.env.STRIPE_CLINIC_PRICE_ID || '',
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { tier } = await req.json()
  const priceId = PRICE_IDS[tier]
  if (!priceId) return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

  const { data: profile } = await supabase.from('profiles').select('stripe_customer_id, email, full_name').eq('id', user.id).single()

  let customerId = profile?.stripe_customer_id

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email || user.email,
      name: profile?.full_name,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id
    await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    subscription_data: {
      trial_period_days: 14,
      metadata: { supabase_user_id: user.id },
    },
  })

  return NextResponse.json({ url: session.url })
}
