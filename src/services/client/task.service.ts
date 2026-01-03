import { PaginatedResponse } from "@/types/response.type";
import { ContentType, SocialMediaPlatform } from "@/types/social-media.type";
import { CreateTask, UpdateTask, Task } from "@/types/task.type";
import { del, get, post, put } from "@/utils/apiClient";


export const getTaskService = async (
  page: number,
  searchQuery: string,
  project_slug: string
) => {
  try {
    const response = await get<PaginatedResponse<Task>>(
      "/api/dashboard/tasks/",
      {
        params: {
          page: page,
          search: searchQuery,
          project_slug,
        },
      }
    );
    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    console.error("Error fetching workspaces from API:", error);
    throw error; // Hata durumunda fırlat
  }
};


export const createTaskService = async (data: CreateTask) => {
  const endpoint = "/api/dashboard/tasks/";
  return post<Task, CreateTask>(endpoint, data);
};

export const updateTaskService = async (pk: number, data: UpdateTask) => {
  const endpoint = `/api/dashboard/tasks/${pk}/`;
  return put<Task, UpdateTask>(endpoint, data);
};


export const deleteTaskService = async (id: number) => {
  try {
    // API isteği yapılıyor, void tipi kullanıldığı için veri beklenmiyor
    await del<void>(`/api/dashboard/tasks/${id}/`);
  } catch (error) {
    throw error; // Hata durumunu üst seviyeye iletmek isterseniz
  }
};


export const startTaskService = async (pk: number) => {
  const endpoint = `/api/dashboard/tasks/${pk}/start/`;
  return post<Task, {}>(endpoint, {});
};


interface CompleteTaskRequest {
  feedback_text: string;
  feedback_files: string[];
}

export const completeTaskService = async (pk: number, data: CompleteTaskRequest) => {
  const endpoint = `/api/dashboard/tasks/${pk}/complete/`;
  return put<Task, CompleteTaskRequest>(endpoint, data);
};


export interface CompleteSocialMediaTaskRequest {
  post: {
    content: string,
    joint_post: boolean,
    medias: {
      file: string
    }[],
    platform_schedules: {
      platform: SocialMediaPlatform,
      content_type: ContentType,
      content_override: string,
      medias: {
        file: string
      }[]
    }[]
  }
}

export const completeSocialMediaTaskService = async (pk: number, data: CompleteSocialMediaTaskRequest) => {
  const endpoint = `/api/dashboard/tasks/${pk}/social-media-complete/`;
  const response = await put<Task, CompleteSocialMediaTaskRequest>(endpoint, data);
  return response;
};




interface UpdateTaskResultRequest {
  feedback_text: string;
  feedback_files: string[];
}

export interface UpdateSocialMediaTaskRequest {
  post: {
    content: string,
    joint_post: boolean,
    medias: {
      file: string
    }[],
    platform_schedules: {
      platform: SocialMediaPlatform,
      content_type: ContentType,
      content_override: string,
      medias: {
        file: string
      }[]
    }[]
  }
}


export const updateSocialMediaTaskResultService = async (pk: number, data: UpdateSocialMediaTaskRequest) => {
  const endpoint = `/api/dashboard/tasks/${pk}/social-media-result-edit/`;
  return put<UpdateSocialMediaTaskRequest, UpdateSocialMediaTaskRequest>(endpoint, data);
};

export const updateTaskResultService = async (pk: number, data: UpdateTaskResultRequest) => {
  const endpoint = `/api/dashboard/tasks/${pk}/result-edit/`;
  return put<UpdateTaskResultRequest, UpdateTaskResultRequest>(endpoint, data);
};


export const acceptTaskService = async (pk: number) => {
  const endpoint = `/api/dashboard/tasks/${pk}/accept/`;
  return post<Task, {}>(endpoint, {});
};

export const cancelTaskService = async (pk: number) => {
  const endpoint = `/api/dashboard/tasks/${pk}/cancel/`;
  return post<Task, {}>(endpoint, {});
};
