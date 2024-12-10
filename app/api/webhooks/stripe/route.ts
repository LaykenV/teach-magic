// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { db } from '@/drizzle/db'
import { usersTable } from '@/drizzle/schema'
import { eq, sql } from 'drizzle-orm'
import cache from '@/lib/cache'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  const payload = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return new NextResponse('Missing Stripe signature or secret', { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    console.error('Error verifying Stripe webhook:', err)
    return new NextResponse('Webhook Error', { status: 400 })
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const session = event.data.object as Stripe.PaymentIntent
    console.log(session)
    const tokenCount = session.amount / 1000;
    console.log('adding', tokenCount, 'tokens')
    const userEmail = 'laykenv@gmail.com';
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, userEmail));
    // get tokenCount to add
    // add tokens to db based off email?
    await db
    .update(usersTable)
    .set({
      tokens: sql`${usersTable.tokens} + ${tokenCount}`,
    })
    .where(eq(usersTable.email, userEmail));  
    const userCacheKey = `user-${user.id}`;
    cache.del(userCacheKey);
}


  return new NextResponse('OK', { status: 200 })
}