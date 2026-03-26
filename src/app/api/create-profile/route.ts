import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { id, email, full_name } = await request.json();

    if (!id || !email) {
      return NextResponse.json({ error: 'Missing required user fields' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Server configuration missing' }, { status: 500 });
    }

    // Initialize Supabase with the Service Role Key to safely bypass RLS
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { error: insertError } = await supabaseAdmin
      .from('profiles')
      .upsert([{ 
        id, 
        email, 
        full_name,
        role: 'subscriber',
        subscription_status: 'inactive'
      }]);

    if (insertError) {
      console.error('Service Role Insert Error:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Profile created securely' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
