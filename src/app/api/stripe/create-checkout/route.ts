export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function POST() {
  // Stripe is not configured yet.
  // When ready, add STRIPE_SECRET_KEY and implement billing here.
  return NextResponse.json(
    { error: 'Payments are not enabled yet. Contact support to upgrade.' },
    { status: 503 }
  )
}
