export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

export async function POST() {
  // Stripe webhooks are not configured yet.
  return NextResponse.json({ received: true })
}
