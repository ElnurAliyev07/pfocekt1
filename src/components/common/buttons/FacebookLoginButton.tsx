'use client';

import { useCallback, ReactNode } from 'react';
import Button from '@/components/ui/Button';

interface FacebookLoginButtonProps {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  redirectPath?: string;
  className?: string;
  children?: ReactNode;
}

export const FacebookLoginButton = ({
  onSuccess,
  onError,
  redirectPath = '/dashboard/social-accounts',
  className,
  children,
}: FacebookLoginButtonProps) => {
  const handleFacebookLogin = useCallback((): void => {
    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    const redirectUri = process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI;

    if (!appId || !redirectUri) {
      onError?.(new Error('Facebook configuration is missing'));
      return;
    }

    const state = btoa(JSON.stringify({ redirectPath }));

    const facebookAuthUrl = new URL('https://www.facebook.com/v19.0/dialog/oauth');
    facebookAuthUrl.searchParams.append('client_id', appId);
    facebookAuthUrl.searchParams.append('redirect_uri', redirectUri);
    facebookAuthUrl.searchParams.append('scope', 'pages_show_list,pages_read_engagement,pages_manage_posts,pages_manage_metadata');
    facebookAuthUrl.searchParams.append('state', state);

    window.location.href = facebookAuthUrl.toString();
  }, [redirectPath, onError]);

  return (
    <Button
      onClick={handleFacebookLogin}
      className={className}
      type="button"
    >
      {children}
    </Button>
  );
};