'use client';

import { useCallback, ReactNode } from 'react';
import Button from '@/components/ui/Button';

interface YouTubeLoginButtonProps {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  redirectPath?: string;
  className?: string;
  children?: ReactNode;
}

export const YouTubeLoginButton = ({
  onSuccess,
  onError,
  redirectPath = '/dashboard/social-accounts',
  className,
  children,
}: YouTubeLoginButtonProps) => {
  const handleYouTubeLogin = useCallback((): void => {
    const clientId = process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_YOUTUBE_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      onError?.(new Error('YouTube configuration is missing'));
      return;
    }

    const state = btoa(JSON.stringify({ redirectPath }));

    const youtubeAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    youtubeAuthUrl.searchParams.append('client_id', clientId);
    youtubeAuthUrl.searchParams.append('redirect_uri', redirectUri);
    youtubeAuthUrl.searchParams.append('response_type', 'code');
    youtubeAuthUrl.searchParams.append('scope', 'https://www.googleapis.com/auth/youtube.readonly');
    youtubeAuthUrl.searchParams.append('state', state);
    youtubeAuthUrl.searchParams.append('access_type', 'offline');
    youtubeAuthUrl.searchParams.append('prompt', 'consent');

    window.location.href = youtubeAuthUrl.toString();
  }, [redirectPath, onError]);

  return (
    <Button
      onClick={handleYouTubeLogin}
      className={className}
      type="button"
    >
      {children}
    </Button>
  );
}; 