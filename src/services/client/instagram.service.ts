import { SocialMediaPlatform } from "@/types/social-media.type";
import { post } from "@/utils/apiClient";

interface InstagramCallbackServiceRequest {
  code: string;
}

interface InstagramCallbackServiceResponse {
  message: string;
  instagram_accounts: {
    id: string;
    username: string;
    name: string;
    profile_picture_url: string;
    followers_count: number;
    media_count: number;
    biography: string;
    business_account_id: string;
    access_token: string;
  }[];
}

export const postInstagramCallbackService = async (
  data: InstagramCallbackServiceRequest
) => {
  const endpoint = `/api/social-medias/instagram/callback/`;
  const response = await post<
    InstagramCallbackServiceResponse,
    InstagramCallbackServiceRequest
  >(endpoint, data);
  return response;
};


interface InstagramAccountRequest {
  platform: SocialMediaPlatform;
  platform_user_id: string;
  planning: number;
  instagram_account: {
    username: string;
    display_name: string;
    access_token: string;
    refresh_token?: string;
    token_expires_at?: string;
    business_account_id: string;
    followers_count: number;
    media_count: number;
    biography: string;
    profile_picture_url: string;
  };
}


export const postInstagramAccountService = async (
    data: InstagramAccountRequest
  ) => {
    const endpoint = `/api/dashboard/plannings/social-account/add-instagram-account/`;
    const response = await post<
        InstagramAccountRequest,
        InstagramAccountRequest
    >(endpoint, data);
    return response;
  };