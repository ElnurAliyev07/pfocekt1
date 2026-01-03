"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Google from "../icons/Google";

const GoogleLoginButton: React.FC = () => {
  return (
    <Suspense 
      fallback={
        <button 
          disabled 
          className="w-full h-full flex items-center justify-center text-gray-500"
          aria-label="Google ilə daxil olma yüklənir"
        >
          <Google className="opacity-50" />
        </button>
      }
    >
      <GoogleLoginButtonContent />
    </Suspense>
  );
};

const GoogleLoginButtonContent: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const params = useSearchParams();

  const handleLogin = () => {
    try {
      setIsLoading(true);
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
      const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || "";
      const scope = "email profile";
      const responseType = "token";
      const nextUrl = params.get("next") || "/dashboard";

      // Validate required parameters
      if (!clientId || !redirectUri) {
        console.error("Missing required Google OAuth configuration");
        setIsLoading(false);
        return;
      }

      const state = JSON.stringify({ next: nextUrl });

      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&state=${encodeURIComponent(state)}`;
      
      window.location.href = googleAuthUrl;
    } catch (error) {
      console.error("Google auth error:", error);
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLogin} 
      disabled={isLoading}
      aria-label="Google ilə daxil olun"
      title="Google ilə daxil olun"
      className={`w-full h-full flex items-center justify-center transition-all duration-300 ${isLoading ? 'cursor-not-allowed' : 'hover:scale-105'}`}
      type="button"
    >
      <Google className={`w-5 h-5 sm:w-6 sm:h-6 ${isLoading ? "opacity-50" : ""}`} />
      <span className="sr-only">Google ilə daxil olun</span>
    </button>
  );
};

export default GoogleLoginButton;