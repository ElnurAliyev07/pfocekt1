'use client';

import React, { useEffect, useState } from "react";
import Loading from "./components/Loading";

const OAuthCallback: React.FC = () => {
    const [error, setError] = useState<string | null>(null);

    const handleAuthentication = async (accessToken: string , nextPage: string | null) => {
        try {
            const authResponse = await fetch("/api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: accessToken }),
            });

            if (authResponse.ok) {
                window.location.href = nextPage || "/dashboard";
            } else {
                const errorData = await authResponse.json();
                setError(errorData.message || "Authentication failed");
            }
        } catch (err) {
            console.error("Error during authentication", err);
            setError("An unexpected error occurred");
        }
    };

    useEffect(() => {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.replace("#", ""));
        const accessToken = params.get("access_token");
        const state = params.get("state");
        let nextPage: string | null = null;
        if (state) {
            try {
                const parsedState = JSON.parse(decodeURIComponent(state));
                nextPage = parsedState.next || null;
            } catch (err) {
                console.error("Error parsing state", err);
            }
        }
        if (accessToken) {
            handleAuthentication(accessToken, nextPage);
        } else {
            console.error("Access token not found");
            setError("Access token not found in the URL");
        }
    }, []);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-red-500 font-bold">Error: {error}</p>
                <p className="text-gray-600">Please try again or contact support.</p>
            </div>
        );
    }

    return <Loading />;
};

export default OAuthCallback;
