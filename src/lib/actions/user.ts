'use server'

import { User } from '@/types/auth.type';
import { cookies } from 'next/headers'

/**
 * Kullanıcı bilgisini HTTP-only olmayan cookie'ye kaydeden action
 * @param user User objesi (JSON-serializable)
 * @param maxAge Opsiyonel, cookie'nin ömrü (saniye cinsinden)
 */
export async function setUserCookie(user: User, maxAge: number = 60 * 60 * 24 * 30): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set('user', JSON.stringify(user), {
    secure: process.env.NODE_ENV === 'production',
    maxAge,
    path: '/',
    sameSite: 'lax',
  });
}
