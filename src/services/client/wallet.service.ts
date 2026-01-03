import { PaginatedResponse } from "@/types/response.type";
import { Wallet } from "@/types/wallet.type";
import { get } from "@/utils/apiClient";


export const getWalletService = async (
  page?: number,
  page_size?: number,
  searchQuery?: string
) => {
  try {
    const response = await get<PaginatedResponse<Wallet>>(
      "/api/dashboard/wallet/",
      {
        params: {
          page: page,
          page_size: page_size,
          search: searchQuery,
        } as Record<string, string | string[] | number | number[]>
      }
    );
    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    console.error("Error fetching wallet from API:", error);
    throw error; // Hata durumunda fırlat
  }
};


