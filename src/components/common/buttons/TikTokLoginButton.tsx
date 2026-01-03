'use client';

import { useCallback, ReactNode } from 'react';
import Button from '@/components/ui/Button';

interface TikTokLoginButtonProps {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  redirectPath?: string;
  className?: string;
  children?: ReactNode;
}

export const TikTokLoginButton = ({
  onSuccess,
  onError,
  redirectPath = '/dashboard/social-accounts',
  className,
  children,
}: TikTokLoginButtonProps) => {
  const handleTikTokLogin = useCallback((): void => {
    const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY;
    const redirectUri = process.env.NEXT_PUBLIC_TIKTOK_REDIRECT_URI;

    if (!clientKey || !redirectUri) {
      onError?.(new Error('TikTok configuration is missing'));
      return;
    }

    const state = btoa(JSON.stringify({ redirectPath }));

    const tiktokAuthUrl = new URL('https://www.tiktok.com/auth/authorize/');
    tiktokAuthUrl.searchParams.append('client_key', clientKey);
    tiktokAuthUrl.searchParams.append('scope', 'user.info.basic,video.list');
    tiktokAuthUrl.searchParams.append('response_type', 'code');
    tiktokAuthUrl.searchParams.append('redirect_uri', redirectUri);
    tiktokAuthUrl.searchParams.append('state', state);

    window.location.href = tiktokAuthUrl.toString();
  }, [redirectPath, onError]);

  return (
    <Button
      onClick={handleTikTokLogin}
      className={className}
      type="button"
    >
      {children}
    </Button>
  );
}; 