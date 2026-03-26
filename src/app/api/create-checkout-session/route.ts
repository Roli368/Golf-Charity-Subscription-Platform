import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const { plan, userId } = await req.json();
    
    // If user hasn't put their Stripe Secret key in .env.local yet, error out to trigger Sandbox!
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "No Stripe Secret Key found" }, { status: 400 });
    }

    // Initialize Stripe securely on the server
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16' as any,
    });

    const price = plan === 'monthly' ? 2000 : 20000; // $20.00 or $200.00 in cents

    // Create exactly what Stripe expects
    const session = await stripe.checkout.sessions.create({
      // By explicitly omitting payment_method_types, it defers to your Stripe Dashboard which automatically allows Apple Pay, Google Pay, Cards, Link, etc!
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Golf Platform - ${plan === 'monthly' ? 'Monthly' : 'Yearly'} Subscription`,
              description: 'Unlimited tracking, automatic charity deployment, and draw entries.',
            },
            unit_amount: price,
            recurring: {
              interval: plan === 'monthly' ? 'month' : 'year',
            }
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      // Base URL fallback logic guarantees safe local testing
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/onboarding/subscribe?payment=cancelled`,
      client_reference_id: userId, // Used to associate the payment with the user locally in the webhook later
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
