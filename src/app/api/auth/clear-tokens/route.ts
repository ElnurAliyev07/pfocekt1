// app/api/auth/clear-tokens/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();

  cookieStore.delete("access");
  cookieStore.delete("refresh");
  cookieStore.delete('user');

  return NextResponse.json({ message: 'Tokens cleared' });
}
