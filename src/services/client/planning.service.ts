import {
  CreateBulkPlanning,
  CreatePlanning,
  CreatePlanningPlatform,
  CreatePlanningPost,
  Planning,
  PlanningPlatform,
  PlanningPost,
  PlanningPostType,
  PlanningPostStatus,
  EditBulkPlanning,
} from "@/types/planning.type";
import { PaginatedResponse } from "@/types/response.type";
import { get, post, del, patch, put } from "@/utils/apiClient";




export const getPlanningService = async (
  searchQuery: string,
  workspace_slug: string
) => {
  try {
    const response = await get<Planning[]>("/api/dashboard/plannings/", {
      params: {
        search: searchQuery,
        workspace_slug,
      }
    });

    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    console.error("Error fetching plannings from API:", error);
    throw error; // Hata durumunda fırlat
  }
};


export const getPlanningItemService = async (
  id: number
) => {
  try {
    const response = await get<Planning>(`/api/dashboard/plannings/${id}/`);
    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    console.error("Error fetching planning item from API:", error);
    throw error; // Hata durumunda fırlat
  }
};


export const createPlanningService = async (data: CreatePlanning) => {
  const endpoint = "/api/dashboard/plannings/";
  return post<Planning, CreatePlanning>(endpoint, data);
};


export const createPlanningPostService = async (data: CreatePlanningPost) => {
  const endpoint = "/api/dashboard/plannings/post/";
  return post<PlanningPost, CreatePlanningPost>(endpoint, data);
};



export const deletePlanningPostService = async (id: number) => {
  return del<void>(`/api/dashboard/plannings/posts/${id}/`);
};

export const getPlanningPostListService = async (
  searchQuery?: string,
  page?: number,
  pageSize?: number,
  date_from?: string,
  date_to?: string,
  workspace_id?: number,
  planning_id?: number
) => {
  try {
    const response = await get<PaginatedResponse<PlanningPost>>("/api/dashboard/plannings/posts/", {
      params: {
        search: searchQuery || "",
        page: page || 1,
        page_size: pageSize || 10,
        date_from: date_from || '',
        date_to: date_to || '',
        workspace_id: workspace_id || "",
        planning_id: planning_id || "",
      }
    });
    console.log(response)
    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    console.error("Error fetching plannings from API:", error);
    throw error; // Hata durumunda fırlat
  }
};



export const createPlanningPlatformService = async (data: CreatePlanningPlatform) => {
  const endpoint = "/api/dashboard/plannings/platform/";
  return post<PlanningPlatform, CreatePlanningPlatform>(endpoint, data);
};

export const deletePlanningPlatformService = async (id: number) => {
  return del<void>(`/api/dashboard/plannings/platform/${id}/`);
};



export const updatePlanningPlatformService = async (id:number, data: CreatePlanningPlatform) => {
  return patch<PlanningPlatform, CreatePlanningPlatform>(`/api/dashboard/plannings/platform/${id}/`, data);
};


export const getPlanningPostTypeService = async () => {
  try {
    const response = await get<PlanningPostType[]>(
      "/api/dashboard/plannings/post-types/"
    );
    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    console.error("Error fetching plannings from API:", error);
    throw error; // Hata durumunda fırlat
  }
};


export const getPlanningPostStatusService = async () => {
  try {
    const response = await get<PlanningPostStatus[]>(
      "/api/dashboard/plannings/post-statuses/"
    );
    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    console.error("Error fetching plannings from API:", error);
    throw error; // Hata durumunda fırlat
  }
};


export const createPlanningBulkService = async (data: CreateBulkPlanning) => {
  const endpoint = "/api/dashboard/plannings/bulk-create/";
  return post<CreateBulkPlanning, CreateBulkPlanning>(endpoint, data);
};

export const updatePlanningBulkService = async (id: number, data: EditBulkPlanning) => {
  const endpoint = `/api/dashboard/planning/bulk-edit/${id}/`;
  return put<EditBulkPlanning, EditBulkPlanning>(endpoint, data);
};

export const deletePlanningService = async (id: number) => {
  return del<void>(`/api/dashboard/plannings/${id}/`);
};


export const deletePlanningSoicalAccount = async (id: number) =>{
  const endpoint = `/api/dashboard/plannings/social-account/${id}/remove-planning/`;
  return post<{}, {}>(endpoint, {});
}