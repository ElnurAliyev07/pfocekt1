import { PaginatedResponse } from "@/types/response.type";
import { Vacancy } from "@/types/vacancy.type";
import { get } from "@/utils/apiClient";

export const getVacancyService = async (
  page?: number,
  page_size?: number,
  searchQuery?: string,
  category?: number, 
  workspace?: number
) => {
  try {
    const response = await get<PaginatedResponse<Vacancy>>(
      "/api/vacancy/",
      {
        params: {
          page: page,
          search: searchQuery,
          page_size: page_size,
          category: category,
          workspace: workspace
        } as Record<string, string | number | string[] | number[]>
      }
    );
    console.log(response);
    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    console.error("Error fetching workspaces from API:", error);
    throw error; // Hata durumunda fırlat
  }
};





export const getVacancyDetailService = async (slug: string) => {
  try {
    const response = await get<Vacancy>(`/api/vacancy/${slug}/`);
    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    console.error("Error fetching workspaces from API:", error);
    throw error; // Hata durumunda fırlat
  }
};