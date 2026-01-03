'use server';

import { cookies } from 'next/headers';
import { User } from '@/types/auth.type';


interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}


export async function loginAction(formData: LoginRequest) {
  try {
    // API'ya istek gönder
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Giriş başarısız oldu' };
    }

    const data = await response.json();
    const { access, refresh, user } = data;

    
    // HTTP-only cookie olarak access token ayarla
    const cookieStore = await cookies();
    cookieStore.set("access", access, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 15, 
      path: '/',
      sameSite: 'lax',
    });

    // HTTP-only cookie olarak refresh token ayarla
    cookieStore.set("refresh", refresh, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      sameSite: 'lax',
    });

    // User bilgilerini normale cookie olarak ayarla (hassas bilgiler olmadan)
    cookieStore.set('user', JSON.stringify(user), {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      sameSite: 'lax',
    });

    // Sayfaları yenile
    
    return { success: true, user, access, refresh };
  } catch (error: any) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: error.message || 'Bir hata oluştu. Lütfen tekrar deneyin.' 
    };
  }
}

export async function logoutAction() {
  try {
    // Cookie'leri temizle
    const cookieStore = await cookies();
    cookieStore.delete("access");
    cookieStore.delete("refresh");
    cookieStore.delete('user');

    // Sayfaları yenile
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Çıkış yapılırken bir hata oluştu' };
  }
}

export async function getUserAction() {
  try {
    const cookieStore = await cookies();
    const userInfoCookie = cookieStore.get('user_info');
    
    if (!userInfoCookie?.value) {
      return { success: false, error: 'Kullanıcı oturumu bulunamadı' };
    }
    
    const userInfo = JSON.parse(userInfoCookie.value);
    
    // Eğer gerekirse access token ile API'dan kullanıcı bilgilerini al
    // const accessToken = cookieStore.get("access")?.value;
    // if (accessToken) {
    //   // API'ya istek gönder ve güncel kullanıcı bilgilerini al
    // }
    
    return { success: true, user: userInfo };
  } catch (error: any) {
    console.error('Get user error:', error);
    return { success: false, error: error.message || 'Kullanıcı bilgileri alınamadı' };
  }
}

export async function refreshTokenAction() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh")?.value;
    
    if (!refreshToken) {
      return { success: false, error: 'Yenileme tokeni bulunamadı' };
    }
    
    // API'ya refresh token isteği gönder
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    
    if (!response.ok) {
      console.log("slam")
      // Token yenileme başarısız oldu, oturumu temizle
      cookieStore.delete("access");
      cookieStore.delete("refresh");
      cookieStore.delete('user');
      
      return { success: false, error: 'Oturum süresi doldu, lütfen tekrar giriş yapın' };
    }
    
    const data = await response.json();


    
    // Yeni access token'ı ayarla
    cookieStore.set("access", data.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 15,
      path: '/',
      sameSite: 'lax',
    });
    cookieStore.set("refresh", data.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      sameSite: 'lax',
    });

    cookieStore.set('user', JSON.stringify(data.user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
      sameSite: 'lax',
    });
    
    return { success: true };
  } catch (error: any) {
    console.error('Refresh token error:', error);
    return { success: false, error: error.message || 'Token yenilenirken bir hata oluştu' };
  }
} 