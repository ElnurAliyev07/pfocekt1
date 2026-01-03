// app/auth/facebook/callback/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { showToast } from '@/utils/toastUtils';


interface StateData {
  redirectPath: string;
}

export default function ClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams.get('code');
  const state = searchParams.get('state');

  useEffect(() => {
    const handleCallback = async (): Promise<void> => {
      if (!code) {
        showToast('asd')
        router.push('/dashboard/social-accounts');
        return;
      }

      try {
        // const response = await api.post('/api/facebook/callback/', { code });

        // toast({
        //   title: 'Başarılı!',
        //   description: 'Facebook hesabınız başarıyla bağlandı.',
        // });

        let redirectPath = '/dashboard/social-accounts';

        if (state) {
          try {
            const stateData = JSON.parse(atob(state)) as StateData;
            if (stateData.redirectPath) {
              redirectPath = `${stateData.redirectPath}&code=${code}&show_instagram_callback_modal=true`;
            }
          } catch (error) {
            console.error('State parse error:', error);
          }
        }

        router.push(redirectPath);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
        
        showToast(
          'Hata!'
        );
        
        router.push('/dashboard/social-accounts');
      }
    };

    void handleCallback();
  }, [code, state, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Instagram Hesabı Qoşulur</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto" />
      </div>
    </div>
  );
}