/* eslint-disable @typescript-eslint/no-unused-vars */
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
    const { userId } = getAuth(request);
    const { amt } = await request.json();
    console.log(amt);
  try {
    // Parse the request body if needed (for example, if you'd like to dynamically set product/price)
    // const { priceId } = await request.json();

    const price = amt === 15 ? 'price_1QWWADD5RAHwsfrKkzum8Nln' : 'price_1QWWAFD5RAHwsfrK62CyOB3A';
    if (userId === null) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: price,
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: { userId: userId },
      client_reference_id: userId,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?payment=success`,  // Ensure you have this URL set in .env
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pricing?payment=fail`,
    });

    return NextResponse.json({ sessionId: session.id });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating Stripe session:", error);
    return new NextResponse("Failed to create session", { status: 500 });
  }
}