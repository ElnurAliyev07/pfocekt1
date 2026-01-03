import { setItemLocalStorage } from '@/utils/localstorage';
import { create } from 'zustand';

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const useThemeStore = create<ThemeState>((set) => ({
  isDarkMode: false, // Default to light mode on server
  toggleTheme: () => set((state) => {
    const newTheme = !state.isDarkMode;
    setItemLocalStorage("theme", newTheme);  // Save to localStorage
    return { isDarkMode: newTheme };
  }),
}));

// Client-side effect to sync theme with localStorage
if (typeof window !== "undefined") {
  const storedTheme = localStorage.getItem("theme");
  useThemeStore.setState({
    isDarkMode: storedTheme === "true", // Set from localStorage on client
  });
}

export default useThemeStore;
