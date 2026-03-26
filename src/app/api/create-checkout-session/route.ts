import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const { plan, userId } = await req.json();
    
   
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "No Stripe Secret Key found" }, { status: 400 });
    }

   
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16' as any,
    });

    const price = plan === 'monthly' ? 2000 : 20000; // 

    const session = await stripe.checkout.sessions.create({
      
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
     
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://golf-charity-subscription-platform-smoky-six.vercel.app/'}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://golf-charity-subscription-platform-smoky-six.vercel.app/'}/onboarding/subscribe?payment=cancelled`,
      client_reference_id: userId, 
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
