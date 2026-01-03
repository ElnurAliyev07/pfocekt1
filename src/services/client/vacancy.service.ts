import { PaginatedResponse } from "@/types/response.type";
import { Vacancy, VacancyCategory, WorkMode, WorkScheduler } from "@/types/vacancy.type";
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
        } as Record<string, string | string[] | number | number[]>
      }
    );
    console.log(response);
    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    console.error("Error fetching workspaces from API:", error);
    throw error; // Hata durumunda fırlat
  }
};


export const getVacancyCategoryService = async () => {
  try {
    const response = await get<VacancyCategory[]>(`/api/vacancy/categories/`);
    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    console.error("Error fetching workspaces from API:", error);
    throw error; // Hata durumunda fırlat
  }
};

export const getWorkModeService = async () => {
  try {
     const response = await get<WorkMode[]>(`/api/vacancy/work-modes/`);
    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    console.error("Error fetching workspaces from API:", error);
    throw error; // Hata durumunda fırlat
  }
};

export const getWorkSchedulerService = async () => {
  try {
    const response = await get<WorkScheduler[]>(`/api/vacancy/work-schedulers/`);
    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    console.error("Error fetching workspaces from API:", error);
    throw error; // Hata durumunda fırlat
  }
};  

