import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe securely
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !endpointSecret) {
    return NextResponse.json(
      { error: 'Stripe webhook configuration missing' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Cryptographically verify the event originated strictly from Stripe
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;

    if (userId) {
      // Securely initialize Supabase admin client to bypass RLS policies
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''
      );

      // Successfully capture the payment and activate the user profile
      const { error } = await supabaseAdmin
        .from('profiles')
        .update({ subscription_status: 'active' })
        .eq('id', userId);

      if (error) {
        console.error('Failed to update user profile in Supabase:', error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }
      
      console.log(`User ${userId} successfully subscribed!`);
    }
  } else if (event.type === 'customer.subscription.deleted') {
   
    const subscription = event.data.object as Stripe.Subscription;
   
    console.log(`Subscription deleted: ${subscription.id}`);
  }

  return NextResponse.json({ received: true });
}
