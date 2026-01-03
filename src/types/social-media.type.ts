// Base types
export type SocialMediaPlatform = "facebook" | "instagram" | "tiktok" | "youtube";
export type ContentType = "story" | "reels" | "carousel" | "post" | "video" | "short";

// Platform configuration interface
export interface PlatformConfig {
  id: SocialMediaPlatform;
  displayName: string;
  icon: string;
  color: string;
  contentTypes: ContentType[];
}

// Content type configuration interface
export interface ContentTypeConfig {
  id: ContentType;
  displayName: string;
  description?: string;
}

// Platform configurations
export const PLATFORM_CONFIGS: Record<SocialMediaPlatform, PlatformConfig> = {
  instagram: {
    id: "instagram",
    displayName: "Instagram",
    icon: "FaInstagram",
    color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500",
    contentTypes: ["story", "reels", "carousel", "post"]
  },
  facebook: {
    id: "facebook",
    displayName: "Facebook",
    icon: "FaFacebookF",
    color: "bg-blue-600",
    contentTypes: ["post", "story", "video"]
  },
  tiktok: {
    id: "tiktok",
    displayName: "TikTok",
    icon: "FaTiktok",
    color: "bg-black",
    contentTypes: ["video", "short"]
  },
  youtube: {
    id: "youtube",
    displayName: "YouTube",
    icon: "FaYoutube",
    color: "bg-red-600",
    contentTypes: ["video", "short"]
  }
} as const;

// Content type configurations
export const CONTENT_TYPE_CONFIGS: Record<ContentType, ContentTypeConfig> = {
  story: {
    id: "story",
    displayName: "Story",
    description: "24 saatlıq görünən şəkil və ya video"
  },
  reels: {
    id: "reels",
    displayName: "Reels",
    description: "Qısa video məzmun"
  },
  carousel: {
    id: "carousel",
    displayName: "Carousel",
    description: "Çoxlu şəkil və ya video"
  },
  post: {
    id: "post",
    displayName: "Post",
    description: "Tək şəkil və ya video"
  },
  video: {
    id: "video",
    displayName: "Video",
    description: "Uzun video məzmun"
  },
  short: {
    id: "short",
    displayName: "Short",
    description: "Qısa video məzmun"
  }
} as const;

// Helper functions
export const getPlatformConfig = (platformId: SocialMediaPlatform): PlatformConfig => {
  return PLATFORM_CONFIGS[platformId];
};

export const getContentTypeConfig = (contentTypeId: ContentType): ContentTypeConfig => {
  return CONTENT_TYPE_CONFIGS[contentTypeId];
};

export const getPlatformContentTypes = (platformId: SocialMediaPlatform): ContentType[] => {
  return PLATFORM_CONFIGS[platformId].contentTypes;
};

export const getContentTypeDescription = (contentTypeId: ContentType): string | undefined => {
  return CONTENT_TYPE_CONFIGS[contentTypeId].description;
};

// Type for platform schedule
export interface PlatformSchedule {
  platform: SocialMediaPlatform;
  content_type: ContentType;
  scheduled_date: string | null;
}

// Utility functions
export const getPlatformDisplayName = (platformId: SocialMediaPlatform): string => {
  return PLATFORM_CONFIGS[platformId].displayName;
};

export const getContentTypeDisplayName = (contentTypeId: ContentType): string => {
  return CONTENT_TYPE_CONFIGS[contentTypeId].displayName;
};

// Mapping functions for backward compatibility
export const PLATFORM_MAP: Record<string, SocialMediaPlatform> = Object.values(PLATFORM_CONFIGS).reduce((acc, platform) => {
  acc[platform.displayName] = platform.id;
  return acc;
}, {} as Record<string, SocialMediaPlatform>);

export const CONTENT_TYPE_MAP: Record<string, ContentType> = Object.values(CONTENT_TYPE_CONFIGS).reduce((acc, contentType) => {
  acc[contentType.displayName] = contentType.id;
  return acc;
}, {} as Record<string, ContentType>); 