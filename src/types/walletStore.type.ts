import { Wallet } from "./wallet.type";

export type WalletStore = {
    wallets: Wallet[];
    page: number;
    searchQuery: string;
    setWallets: (wallets: Wallet[]) => void;
    fetchWorkspaces: (reset?: boolean) => Promise<void>;
    setSearchQuery: (query: string) => void;

}