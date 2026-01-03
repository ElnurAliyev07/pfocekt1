import { getWalletService } from "@/services/client/wallet.service";
import { WalletStore } from "@/types/walletStore.type";
import { create } from "zustand";

const useWalletStore = create<WalletStore>((set, get) => ({
    wallets: [],
    page: 1,
    searchQuery: "",
    setWallets: (wallets) => set({ wallets }),
   
    fetchWorkspaces: async (reset = false) => {
        const { page, searchQuery, wallets } = get();
        try {
          const currentPage = reset ? 1 : page; // Reset varsa ilk sayfa
          const response = await getWalletService(currentPage, 10, searchQuery); // API'den veriyi çek
    
          set({
            wallets: reset
              ? response.data.results
              : [...wallets, ...response.data.results],
            page: currentPage, // Reset varsa ikinci sayfa olarak başla
          });
        } catch (error) {
          console.error("Error fetching workspaces:", error);
        }
      },
    setSearchQuery: (query) => {
      set({ searchQuery: query, page: 1 });
    },
}))

export default useWalletStore;
