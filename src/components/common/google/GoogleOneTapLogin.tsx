'use client'

import { useEffect } from "react";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id: {
          initialize: (options: {
            client_id: string;
            callback: (response: CredentialResponse) => void;
          }) => void;
          prompt: () => void;
        };
      };
    };
  }

  interface CredentialResponse {
    credential: string;
    select_by: string;
    clientId?: string;
  }
}

const GoogleOneTapLogin: React.FC = () => {
  useEffect(() => {
    if (window.google?.accounts?.id) {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "",
        callback: handleCredentialResponse,
      });
      console.log("salam")
      window.google.accounts.id.prompt(); // One Tap popup'ı gösterir
    }

  }, []);

  const handleCredentialResponse = (response: CredentialResponse) => {
    console.log("Encoded JWT ID token: " + response.credential);
    // JWT token'ı backend'e gönderip doğrulama yapabilirsiniz.
  };

  return null; // Bu bileşen görsel bir şey render etmez
};

export default GoogleOneTapLogin;
