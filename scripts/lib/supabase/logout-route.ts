import { NextResponse } from 'next/server';

import { createClient } from '@l/supabase/server';

// Creating a handler to a GET request to route /auth/confirm
export async function GET() {
  const supabase = createClient();

  await supabase.auth.signOut();

  return NextResponse.redirect('/');
}
