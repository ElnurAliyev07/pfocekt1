"use client";

import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

interface UseLogout {
    logout: (redirectPath?: string) => Promise<void>;
}

export default function useLogout(): UseLogout {
    const router = useRouter();
    const { setTokens } = useAuth();

    const logout = async (redirectPath: string = "/login") => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                router.push(redirectPath); // Redirect to login page on success
            } else {
                const errorData = await response.json();
                console.error("Logout failed:", errorData.error || "Unknown error");
            }
            setTokens(null, null);
        } catch (error) {
            console.error("An error occurred during logout:", error);
        }
    };

    return { logout };
}
