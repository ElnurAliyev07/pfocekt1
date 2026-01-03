export interface InstagramAccount {
  username: string;
  display_name: string | null;
  access_token: string;
  refresh_token: string;
  token_expires_at: string | null;
  business_account_id: string | null;
  followers_count: number;
  media_count: number;
  biography: string;
  profile_picture_url: string | null;
}

export type SocialPlatform = 'instagram' | 'facebook' | 'twitter' | 'linkedin' | 'tiktok';

export type AccountStatus = 'active' | 'inactive' | 'pending' | 'expired';

export interface SocialAccount {
  id: number;
  user: number | null;
  platform: SocialPlatform;
  status: AccountStatus;
  created_at: string;
  updated_at: string;
  instagram_account: InstagramAccount | null;
}
