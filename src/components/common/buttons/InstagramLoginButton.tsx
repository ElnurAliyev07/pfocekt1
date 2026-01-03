// app/components/InstagramLoginButton.tsx
"use client";

import { useCallback, ReactNode } from "react";
import Button from "@/components/ui/Button";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface InstagramLoginButtonProps {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  redirectUrl?: string;
  className?: string;
  children?: ReactNode;
}

export const InstagramLoginButton = ({
  onSuccess,
  onError,
  redirectUrl = "dashboard/social-accounts",
  className,
  children,
}: InstagramLoginButtonProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updatedParams = new URLSearchParams(searchParams.toString());
  updatedParams.delete('code');

  const fullPath = updatedParams.toString()
    ? `${pathname}?${updatedParams.toString()}`
    : pathname;

  const redirectPath = redirectUrl ? fullPath : redirectUrl;

  const handleInstagramLogin = useCallback((): void => {
    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    const redirectUri = process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI;

    if (!appId || !redirectUri) {
      onError?.(new Error("Facebook configuration is missing"));
      return;
    }

    const state = btoa(JSON.stringify({ redirectPath }));

    const facebookAuthUrl = new URL("https://www.facebook.com/v23.0/dialog/oauth");
    facebookAuthUrl.searchParams.append("client_id", appId);
    facebookAuthUrl.searchParams.append("redirect_uri", redirectUri);
    facebookAuthUrl.searchParams.append(
      "scope",
      [
        "pages_show_list",
        "pages_read_engagement",
        "pages_manage_posts",
        "instagram_basic",
        "instagram_content_publish",
        "instagram_manage_insights",
        "instagram_manage_comments",
        "business_management",
        "ads_management",
        "pages_manage_metadata",
        "pages_read_user_content",
        "public_profile",
        "email",
      ].join(",")
    );
    facebookAuthUrl.searchParams.append("state", state);
    router.push(facebookAuthUrl.toString());
  }, [redirectPath, onError]);

  return (
    <Button
      onClick={handleInstagramLogin}
      className={`bg-[#1877F2] hover:bg-[#1877F2]/90 text-white ${className ?? ""}`}
      type="button"
    >
      {children ?? (
        <>
          <FaInstagram className="mr-2 h-4 w-4" />
          Instagram
        </>
      )}
    </Button>
  );
};
