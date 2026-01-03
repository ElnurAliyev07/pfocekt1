"use client";

import useThemeStore from "@/store/themeStore";
import { useEffect, useState } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { isDarkMode } = useThemeStore();
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // Ensure the theme is applied after the first render (hydration)
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (!isHydrated) return; // Don't apply theme before hydration

        // if (isDarkMode) {
        //     document.documentElement.classList.add('dark');
        // } else {
        //     document.documentElement.classList.remove('dark');
        // }
    }, [isDarkMode, isHydrated]);

    return <>{children}</>;
}
