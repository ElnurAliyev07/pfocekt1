import { Document } from "@/types/document.type";
import { PaginatedResponse } from "@/types/response.type";
import { get } from "@/utils/apiClient";


export const getDocumentsService = async (
  page?: number,
  page_size?: number,
  searchQuery?: string,    
  type?: string 
) => {
  try {
    const response = await  get<PaginatedResponse<Document>>(
      "/api/files/",
      {
        params: {
            page: page,
            page_size: page_size,
            search: searchQuery,
            type: type
        } as Record<string, string | string[] | number | number[]> | undefined
      }
    );
    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    console.error("Error fetching wallet from API:", error);
    throw error; // Hata durumunda fırlat
  }
};


