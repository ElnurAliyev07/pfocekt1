'use server'

import { getTokensMaxAges } from '@/utils/jwtUtils'
import { cookies } from 'next/headers'

/**
 * Server-side action to get access token from HTTP-only cookie
 * @returns Access token from the cookie if it exists
 */
export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("access")?.value
  return accessToken || null
}

/**
 * Server-side action to get refresh token from HTTP-only cookie
 * @returns Refresh token from the cookie if it exists
 */
export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get("refresh")?.value
  return refreshToken || null
}

/**
 * Server-side action to set token in HTTP-only cookie
 * @param tokenName Name of the token ("access" or "refresh")
 * @param tokenValue Token value to be stored
 */
export async function setTokenCookie(tokenName: string, tokenValue: string): Promise<void> {
  const cookieStore = await cookies()
  
  // Set the cookie options
  cookieStore.set(tokenName, tokenValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Secure in production
    sameSite: 'strict',
    path: '/',
    maxAge: tokenName === "access" ? 60 * 60 : 60 * 60 * 24 * 30 // 1 hour for access, 7 days for refresh
  })
}

export async function setTokens(accessToken: string, refreshToken: string, user: any): Promise<void> {
  const cookieStore = await cookies();
  const { accessMaxAge, refreshMaxAge } = getTokensMaxAges(accessToken, refreshToken);

  cookieStore.set("access", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: accessMaxAge,
    path: '/',
    sameSite: 'lax',
  });

  cookieStore.set("refresh", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: refreshMaxAge,
    path: '/',
    sameSite: 'lax',
  });

  cookieStore.set('user', JSON.stringify(user), {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    maxAge: accessMaxAge,
    path: '/',
    sameSite: 'lax',
  });
}

export async function clearTokens(): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.delete("access");
  cookieStore.delete("refresh");
  cookieStore.delete('user');
}
