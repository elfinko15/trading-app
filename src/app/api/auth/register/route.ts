import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const fakeEmail = (username: string) =>
  `${username.toLowerCase().replace(/[^a-z0-9_]/g, '')}@trademaster.local`;

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: 'Benutzername und Passwort erforderlich.' }, { status: 400 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: 'Server nicht konfiguriert.' }, { status: 500 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  // Check username uniqueness
  const { data: existing } = await admin
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single();
  if (existing) {
    return NextResponse.json({ error: 'Dieser Benutzername ist bereits vergeben.' }, { status: 409 });
  }

  // Create user, auto-confirmed (no email verification needed)
  const { data, error } = await admin.auth.admin.createUser({
    email: fakeEmail(username),
    password,
    email_confirm: true,
    user_metadata: { username },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ userId: data.user.id });
}
