export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createAdminClient()

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string
      const tier = getTierFromPriceId(subscription.items.data[0]?.price.id)

      await supabase
        .from('profiles')
        .update({
          subscription_tier: tier,
          subscription_status: subscription.status,
          stripe_subscription_id: subscription.id,
        })
        .eq('stripe_customer_id', customerId)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string

      await supabase
        .from('profiles')
        .update({ subscription_tier: 'free', subscription_status: 'canceled' })
        .eq('stripe_customer_id', customerId)
      break
    }
  }

  return NextResponse.json({ received: true })
}

function getTierFromPriceId(priceId: string): string {
  const tierMap: Record<string, string> = {
    [process.env.STRIPE_BASIC_PRICE_ID || '']: 'basic',
    [process.env.STRIPE_PRO_PRICE_ID || '']: 'pro',
    [process.env.STRIPE_CLINIC_PRICE_ID || '']: 'clinic',
  }
  return tierMap[priceId] || 'free'
}
