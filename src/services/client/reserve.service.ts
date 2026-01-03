import { Reserve } from "@/types/reserve.type";
import { ContentType, SocialMediaPlatform, } from "@/types/social-media.type";
import { get, post, del, patch, put } from "@/utils/apiClient";

export const getReserveService = async (
  planning_post: number
) => {
  try {
    const response = await get<Reserve []>(
      "/api/reserves/",
      {
        params: {
          planning_post: planning_post
        }
      }
    );
    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    console.error("Error fetching reserves from API:", error);
    throw error; // Hata durumunda fırlat
  }
};


export interface ReservePostCreateRequest {
  planning_post: number;
  content: string;
  medias: {
    file: string;
  }[];
  platform_schedules: {
    content_override: string;
    platform: SocialMediaPlatform;
    content_type: ContentType;
    scheduled_date: string;
    medias: {
      file: string;
    }[];
    first_comment?: string;
    hashtags?: {
      name: string;
    }[];
    mentioned_users?: {
      username: string;
    }[];
    retry_count?: number;
    error_message?: string;
    publishing_task_id?: string;
    title?: string;
    description?: string;
    tags_input?: string;
    category?: string;
    music?: string;
    effects?: string;
    cover_image?: string;
    thumbnail?: string;
    duration?: number;
    aspect_ratio?: string;
    slides_count?: number;
    location?: string;
    link?: string;
  }[];
  scheduled_date: string;
  joint_post: boolean;
}

export const createReservePostService = async (data: ReservePostCreateRequest ) => {
  const endpoint = "/api/reserves/";
  return post<Reserve, ReservePostCreateRequest>(endpoint, data);
};

export const updateReservePostService = async (id: number, data: ReservePostCreateRequest ) => {
  const endpoint = `/api/reserves/${id}/`;
  return put<Reserve, ReservePostCreateRequest>(endpoint, data);
};


interface ReservePostMediaCreateRequest{
 file: string;
 post: number;
}

interface Media {
  id: number;
  file: string;
}

export const createReservePostMediaService = async (data: ReservePostMediaCreateRequest ) => {
  const endpoint = "/api/reserves/media/";
  return post<Media, ReservePostMediaCreateRequest>(endpoint, data);
};

export const deleteReservePostMediaService = async (id: number ) => {
  const endpoint = `/api/reserves/media/${id}/`;
  return del(endpoint);
};



interface ReservPostContentUpdateRequest {
  content:  string;
}
export const updateReserveContentService = async (id: number, data: ReservPostContentUpdateRequest) => {
  const endpoint = `/api/reserves/${id}/`;
  return patch<ReservPostContentUpdateRequest, ReservPostContentUpdateRequest>(endpoint, data);
};





