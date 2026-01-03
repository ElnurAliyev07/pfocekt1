import { Planning, PlanningPost } from "@/types/planning.type";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { FaInstagram, FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa";
import {
  ContentType,
  PlatformSchedule,
  SocialMediaPlatform,
} from "@/types/social-media.type";
import MediaPreviewModal from "@/components/common/modals/MediaPreviewModal";
import Modal, { useDisclosure } from "@/components/ui/modal/Modal";
import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal/ModalContent";
import { getReserveService } from "@/services/client/reserve.service";
import { Reserve } from "@/types/reserve.type";
import { customFileToFile } from "@/utils/fileUtils";
import Image from "next/image";

interface ContentData {
  content: string;
  medias: File[];
  hashtags?: string[];
  mentions?: string[];
  location?: string;
  link?: string;
  altText?: string;
  caption?: string;
  music?: string;
  effects?: string;
  title?: string;
  description?: string;
  tags?: string[];
  category?: string;
  coverImage?: File;
  thumbnail?: File;
  duration?: number;
  aspectRatio?: string;
  slides?: number;
  firstComment?: string;
  schedule_date?: string;
}

interface PlatformFeatures {
  hashtags?: boolean;
  mentions?: boolean;
  location?: boolean;
  link?: boolean;
  altText?: boolean;
  caption?: boolean;
  music?: boolean;
  effects?: boolean;
  title?: boolean;
  description?: boolean;
  tags?: boolean;
  category?: boolean;
  coverImage?: boolean;
  thumbnail?: boolean;
  duration?: boolean;
  aspectRatio?: boolean;
  slides?: boolean;
  firstComment?: boolean;
}

interface PlatformContentFeatures {
  [key: string]: PlatformFeatures;
}

interface PlatformSpecificData {
  instagram: Partial<PlatformContentFeatures>;
  facebook: Partial<PlatformContentFeatures>;
  tiktok: Partial<PlatformContentFeatures>;
  youtube: Partial<PlatformContentFeatures>;
}

const platformSpecificFeatures: PlatformSpecificData = {
  instagram: {
    post: {
      hashtags: true,
      mentions: true,
      location: true,
      caption: true,
      firstComment: true,
    },
    story: {
      hashtags: true,
      mentions: true,
      location: true,
      link: true,
    },
    reels: {
      hashtags: true,
      mentions: true,
      music: true,
      effects: true,
    },
    carousel: {
      hashtags: true,
      mentions: true,
      location: true,
      caption: true,
      slides: true,
    },
  },
  facebook: {
    post: {
      hashtags: true,
      mentions: true,
      location: true,
      link: true,
    },
    story: {
      hashtags: true,
      mentions: true,
      location: true,
      link: true,
    },
    video: {
      hashtags: true,
      mentions: true,
      title: true,
      description: true,
      thumbnail: true,
    },
  },
  tiktok: {
    video: {
      hashtags: true,
      mentions: true,
      music: true,
      effects: true,
      coverImage: true,
      duration: true,
    },
    short: {
      hashtags: true,
      mentions: true,
      music: true,
      effects: true,
      coverImage: true,
    },
  },
  youtube: {
    video: {
      title: true,
      description: true,
      tags: true,
      category: true,
      thumbnail: true,
      duration: true,
    },
    short: {
      title: true,
      description: true,
      tags: true,
      thumbnail: true,
    },
  },
};

const defaultContentData: Record<SocialMediaPlatform, Partial<Record<ContentType, ContentData>>> = {
  instagram: {
    post: {
      content: "",
      medias: [],
      hashtags: [],
      mentions: [],
      location: "",
      caption: "",
      firstComment: "",
      schedule_date: new Date().toISOString(),
    },
    story: {
      content: "",
      medias: [],
      hashtags: [],
      mentions: [],
      location: "",
      link: "",
      schedule_date: new Date().toISOString(),
    },
    reels: {
      content: "",
      medias: [],
      hashtags: [],
      mentions: [],
      music: "",
      effects: "",
      schedule_date: new Date().toISOString(),
    },
    carousel: {
      content: "",
      medias: [],
      hashtags: [],
      mentions: [],
      location: "",
      caption: "",
      slides: 2,
      schedule_date: new Date().toISOString(),
    },
  },
  facebook: {
    post: {
      content: "",
      medias: [],
      hashtags: [],
      mentions: [],
      location: "",
      link: "",
      schedule_date: new Date().toISOString(),
    },
    story: {
      content: "",
      medias: [],
      hashtags: [],
      mentions: [],
      location: "",
      link: "",
      schedule_date: new Date().toISOString(),
    },
    video: {
      content: "",
      medias: [],
      hashtags: [],
      mentions: [],
      title: "",
      description: "",
      thumbnail: undefined,
      schedule_date: new Date().toISOString(),
    },
  },
  tiktok: {
    video: {
      content: "",
      medias: [],
      hashtags: [],
      mentions: [],
      music: "",
      effects: "",
      coverImage: undefined,
      duration: 60,
      schedule_date: new Date().toISOString(),
    },
    short: {
      content: "",
      medias: [],
      hashtags: [],
      mentions: [],
      music: "",
      effects: "",
      coverImage: undefined,
      schedule_date: new Date().toISOString(),
    },
  },
  youtube: {
    video: {
      content: "",
      medias: [],
      title: "",
      description: "",
      tags: [],
      category: "",
      thumbnail: undefined,
      duration: 60,
      schedule_date: new Date().toISOString(),
    },
    short: {
      content: "",
      medias: [],
      title: "",
      description: "",
      tags: [],
      thumbnail: undefined,
      schedule_date: new Date().toISOString(),
    },
  },
};

interface Props {
  planning: Planning;
  post: PlanningPost;
  isOpen?: boolean;
  onClose?: () => void;
}

const ViewReservePostModal: React.FC<Props> = ({ planning, post, isOpen: externalIsOpen, onClose: externalOnClose }) => {
  const { isOpen: internalIsOpen, onOpen, onOpenChange: internalOnOpenChange } = useDisclosure();
  
  // Use external control if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const onOpenChange = externalOnClose ? () => externalOnClose() : internalOnOpenChange;
  const [platformContents, setPlatformContents] =
    useState<Record<SocialMediaPlatform, Partial<Record<ContentType, ContentData>>>>(
      defaultContentData
    );
  const [selectedSchedules, setSelectedSchedules] = useState<Array<{
    platform: SocialMediaPlatform;
    content_type: ContentType;
    scheduled_date: string;
  }>>([]);
  const [activeSchedule, setActiveSchedule] = useState<{
    platform: SocialMediaPlatform;
    content_type: ContentType;
    scheduled_date: string;
  } | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [reservePost, setReservePost] = useState<Reserve>();
  const [isJointPost, setIsJointPost] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [jointContent, setJointContent] = useState<ContentData>({
    content: "",
    medias: [],
    hashtags: [],
    mentions: [],
    location: "",
    link: "",
    altText: "",
    caption: "",
    music: "",
    effects: "",
    title: "",
    description: "",
    tags: [],
    category: "",
    coverImage: undefined,
    thumbnail: undefined,
    duration: 60,
    aspectRatio: "9:16",
    slides: 2,
    firstComment: "",
    schedule_date: new Date().toISOString(),
  });

  // Filter platform features based on planning's social accounts
  const filteredPlatformFeatures = useMemo(() => {
    const planningSocialAccounts = planning?.social_accounts || [];
    const filtered: typeof platformSpecificFeatures = { ...platformSpecificFeatures };
    
    // If post is not publishable, show all platforms
    const isPublishable = typeof post.is_publishable === "boolean" ? post.is_publishable : false;
    
    if (!isPublishable) {
      // Return all platforms if post is not publishable
      return filtered;
    }
    
    // Only keep platforms that exist in planning's social accounts if post is publishable
    Object.keys(filtered).forEach((platform) => {
      const hasAccount = planningSocialAccounts.some(
        (account) => account.platform === platform
      );
      if (!hasAccount) {
        delete filtered[platform as SocialMediaPlatform];
      }
    });
    
    return filtered;
  }, [planning?.social_accounts, post.is_publishable, platformSpecificFeatures]);

  useEffect(() => {
    const loadTaskItem = async () => {
      if (post) {
        setIsLoadingData(true);
        try {
          const data = ((await getReserveService( post.id )).data);
        if (data.length === 1) {
          setReservePost(data[0])
          
          // Set default values from reservePost data
          if (data[0]) {
            const reserveData = data[0];
            
            // Check if this is a joint post
            const isJoint = reserveData.joint_post;
            setIsJointPost(isJoint);
            
            // Helper function to convert URL to File object
            const urlToFile = async (url: string, filename: string): Promise<File> => {
              const response = await fetch(url);
              const blob = await response.blob();
              return new File([blob], filename, { type: blob.type });
            };

            if (isJoint) {
              // Joint post - all platforms share the same content
              const jointMediaFiles: File[] = [];
              if (reserveData.medias && reserveData.medias.length > 0) {
                for (const media of reserveData.medias) {
                  const file = await customFileToFile(media.file);
                  jointMediaFiles.push(file);
                }
              }
              
              // Set joint content
              setJointContent({
                content: reserveData.content || "",
                medias: jointMediaFiles,
                hashtags: [],
                mentions: [],
                location: "",
                link: "",
                altText: "",
                caption: "",
                music: "",
                effects: "",
                title: "",
                description: "",
                tags: [],
                category: "",
                coverImage: undefined,
                thumbnail: undefined,
                duration: 60,
                aspectRatio: "9:16",
                slides: 2,
                firstComment: "",
                schedule_date: reserveData.scheduled_date || new Date().toISOString(),
              });
              
              // Set existing schedules for joint post
              if (reserveData.platform_schedules && reserveData.platform_schedules.length > 0) {
                // Use existing platform schedules
                const schedules = reserveData.platform_schedules.map((schedule) => ({
                  platform: schedule.platform,
                  content_type: schedule.content_type,
                  scheduled_date: schedule.scheduled_date,
                }));
                setSelectedSchedules(schedules);
                
                // Set the first schedule as active for initial view
                const firstSchedule = reserveData.platform_schedules[0];
                setActiveSchedule({
                  platform: firstSchedule.platform,
                  content_type: firstSchedule.content_type,
                  scheduled_date: firstSchedule.scheduled_date,
                });
              }
            } else {
              // Individual platform contents - use platform_schedules data
              const newPlatformContents = { ...defaultContentData };
              
              if (reserveData.platform_schedules && reserveData.platform_schedules.length > 0) {
                for (const schedule of reserveData.platform_schedules) {
                  if (!newPlatformContents[schedule.platform]) {
                    newPlatformContents[schedule.platform] = {};
                  }
                  
                  // Convert media URLs to File objects
                  const medias: File[] = [];
                  if (schedule.medias && Array.isArray(schedule.medias)) {
                    for (const media of schedule.medias) {
                      try {
                        const file = await customFileToFile(media.file);
                        medias.push(file);
                      } catch (error) {
                        console.error('Error converting media URL to file:', error);
                      }
                    }
                  }

                  // Convert cover image URL to File object
                  let coverImage: File | undefined;
                  if (schedule.cover_image) {
                    try {
                      coverImage = await customFileToFile(schedule.cover_image);
                    } catch (error) {
                      console.error('Error converting cover image URL to file:', error);
                    }
                  }

                  // Convert thumbnail URL to File object
                  let thumbnail: File | undefined;
                  if (schedule.thumbnail) {
                    try {
                      thumbnail = await customFileToFile(schedule.thumbnail);
                    } catch (error) {
                      console.error('Error converting thumbnail URL to file:', error);
                    }
                  }
                  
                  newPlatformContents[schedule.platform][schedule.content_type] = {
                    content: schedule.content_override || reserveData.content || "",
                    medias: medias,
                    hashtags: schedule.hashtags?.map(h => h.name) || [],
                    mentions: schedule.mentioned_users?.map(u => u.username) || [],
                    location: schedule.location || "",
                    link: schedule.link || "",
                    altText: "",
                    caption: schedule.content_override || reserveData.content || "",
                    music: schedule.music || "",
                    effects: schedule.effects || "",
                    title: schedule.title || "",
                    description: schedule.description || "",
                    tags: schedule.tags_input ? schedule.tags_input.split(',').map(t => t.trim()) : [],
                    category: schedule.category || "",
                    coverImage: coverImage,
                    thumbnail: thumbnail,
                    duration: schedule.duration || 60,
                    aspectRatio: schedule.aspect_ratio || "9:16",
                    slides: schedule.slides_count || 2,
                    firstComment: schedule.first_comment || "",
                    schedule_date: schedule.scheduled_date || new Date().toISOString(),
                  };
                }
              }
              
              setPlatformContents(newPlatformContents);
              
              // Set selected schedules
              const schedules = reserveData.platform_schedules?.map(schedule => ({
                platform: schedule.platform,
                content_type: schedule.content_type,
                scheduled_date: schedule.scheduled_date
              })) || [];
              
              setSelectedSchedules(schedules);
              if (schedules.length > 0) {
                setActiveSchedule(schedules[0]);
              }
            }
          }
        }
        } catch (error) {
          console.error('Error loading reserve data:', error);
        } finally {
          setIsLoadingData(false);
        }
      }
    };

    if (isOpen) {
      loadTaskItem();
    }
  }, [post, isOpen]);

  const handlePreview = useCallback((file: File) => {
    setPreviewFile(file);
    setIsPreviewOpen(true);
  }, []);

  const getMediaType = (file: File): 'image' | 'video' | 'pdf' | 'document' | 'spreadsheet' | 'presentation' | 'other' => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type === 'application/pdf') return 'pdf';
    if (file.type.includes('document') || file.type.includes('word')) return 'document';
    if (file.type.includes('sheet') || file.type.includes('excel')) return 'spreadsheet';
    if (file.type.includes('presentation') || file.type.includes('powerpoint')) return 'presentation';
    return 'other';
  };

  const handleClosePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setPreviewFile(null);
  }, []);

  const getPlatformIcon = (platform: SocialMediaPlatform) => {
    switch (platform) {
      case "instagram":
        return <FaInstagram className="w-4 h-4" />;
      case "facebook":
        return <FaFacebookF className="w-4 h-4" />;
      case "tiktok":
        return <FaTiktok className="w-4 h-4" />;
      case "youtube":
        return <FaYoutube className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getContentTypeLabel = (type: ContentType) => {
    switch (type) {
      case "post":
        return "Post";
      case "story":
        return "Story";
      case "reels":
        return "Reels";
      case "video":
        return "Video";
      case "carousel":
        return "Carousel";
      case "short":
        return "Short";
      default:
        return type;
    }
  };

  const renderMediaSection = (platform: SocialMediaPlatform, contentType: ContentType) => {
    const content = isJointPost 
      ? jointContent 
      : platformContents[platform]?.[contentType];
    
    if (!content) return null;

    const features = platformSpecificFeatures[platform]?.[contentType] || {};

    return (
      <div className="space-y-6">
        {/* Media Files Display */}
        {content.medias && content.medias.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Media Faylları ({content.medias.length})
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {content.medias.map((file, index) => (
                <div
                  key={index}
                  className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handlePreview(file)}
                >
                  {file.type.startsWith("image/") ? (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`Media ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  ) : file.type.startsWith("video/") ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <video
                        src={URL.createObjectURL(file)}
                        className="w-full h-full object-cover"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content/Caption */}
        {(features.caption || content.content) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {features.caption ? "Caption" : "Məzmun"}
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">
                {content.content || "Məzmun əlavə edilməyib"}
              </p>
            </div>
          </div>
        )}

        {/* Title */}
        {features.title && content.title && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Başlıq
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-900">{content.title}</p>
            </div>
          </div>
        )}

        {/* Description */}
        {features.description && content.description && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Təsvir
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{content.description}</p>
            </div>
          </div>
        )}

        {/* Hashtags */}
        {features.hashtags && content.hashtags && content.hashtags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hashtaglar
            </label>
            <div className="flex flex-wrap gap-2">
              {content.hashtags.map((hashtag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  #{hashtag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Mentions */}
        {features.mentions && content.mentions && content.mentions.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mention-lar
            </label>
            <div className="flex flex-wrap gap-2">
              {content.mentions.map((mention, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  @{mention}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Location */}
        {features.location && content.location && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Məkan
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-900">{content.location}</p>
            </div>
          </div>
        )}

        {/* Link */}
        {features.link && content.link && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <a 
                href={content.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 break-all"
              >
                {content.link}
              </a>
            </div>
          </div>
        )}

        {/* Alt Text */}
        {features.altText && content.altText && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alt Text
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-900">{content.altText}</p>
            </div>
          </div>
        )}

        {/* Music */}
        {features.music && content.music && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Musiqi
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-900">{content.music}</p>
            </div>
          </div>
        )}

        {/* Effects */}
        {features.effects && content.effects && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Effektlər
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-900">{content.effects}</p>
            </div>
          </div>
        )}

        {/* Tags */}
        {features.tags && content.tags && content.tags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Taglər
            </label>
            <div className="flex flex-wrap gap-2">
              {content.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Category */}
        {features.category && content.category && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kateqoriya
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-900">{content.category}</p>
            </div>
          </div>
        )}

        {/* Cover Image */}
        {features.coverImage && content.coverImage && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Üz şəkli
            </label>
            <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={URL.createObjectURL(content.coverImage)}
                alt="Cover"
                width={128}
                height={128}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => handlePreview(content.coverImage!)}
              />
            </div>
          </div>
        )}

        {/* Thumbnail */}
        {features.thumbnail && content.thumbnail && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail
            </label>
            <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={URL.createObjectURL(content.thumbnail)}
                alt="Thumbnail"
                width={128}
                height={128}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => handlePreview(content.thumbnail!)}
              />
            </div>
          </div>
        )}

        {/* Duration */}
        {features.duration && content.duration && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Müddət (saniyə)
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-900">{content.duration}</p>
            </div>
          </div>
        )}

        {/* Aspect Ratio */}
        {features.aspectRatio && content.aspectRatio && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aspect Ratio
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-900">{content.aspectRatio}</p>
            </div>
          </div>
        )}

        {/* Slides */}
        {features.slides && content.slides && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slayd sayı
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-900">{content.slides}</p>
            </div>
          </div>
        )}

        {/* First Comment */}
        {features.firstComment && content.firstComment && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              İlk şərh
            </label>
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{content.firstComment}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Only show button if not externally controlled */}
      {externalIsOpen === undefined && (
        <button
          onClick={onOpen}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Bax
        </button>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent className="max-h-[90vh] overflow-hidden">
          <ModalHeader className="border-b border-gray-100 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Post Məlumatları
                  </h2>
                  <p className="text-sm text-gray-500">
                    {(post as any).title || "Başlıqsız post"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {isJointPost && (
                  <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                    Birgə Post
                  </span>
                )}
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  post.is_publishable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {post.is_publishable ? 'Dərc edilə bilər' : 'Layihə'}
                </span>
              </div>
            </div>
          </ModalHeader>
          <ModalBody className="p-0 overflow-hidden">
            <div className="flex h-full">
              {/* Left Sidebar - Platforms */}
              <div className="w-80 border-r border-gray-100 bg-gray-50/50 overflow-y-auto">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Platformalar
                  </h3>
                  <div className="space-y-2">
                    {selectedSchedules.map((schedule, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveSchedule(schedule)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                          activeSchedule?.platform === schedule.platform && 
                          activeSchedule?.content_type === schedule.content_type
                            ? 'bg-blue-100 border border-blue-200 text-blue-900'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activeSchedule?.platform === schedule.platform && 
                          activeSchedule?.content_type === schedule.content_type
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {getPlatformIcon(schedule.platform)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium capitalize">
                              {schedule.platform}
                            </span>
                            <span className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded">
                              {getContentTypeLabel(schedule.content_type)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(schedule.scheduled_date).toLocaleString('az-AZ')}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Content Area */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6">
                  {isLoadingData ? (
                    <div className="flex items-center justify-center h-48">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center animate-spin">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                          Yüklənir...
                        </h3>
                        <p className="text-xs text-gray-500">
                          Post məlumatları hazırlanır
                        </p>
                      </div>
                    </div>
                  ) : activeSchedule ? (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          {getPlatformIcon(activeSchedule.platform)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 capitalize">
                            {activeSchedule.platform} {getContentTypeLabel(activeSchedule.content_type)}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Planlaşdırılmış vaxt: {new Date(activeSchedule.scheduled_date).toLocaleString('az-AZ')}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg border border-gray-200">
                        <div className="p-4">
                          <div className="p-3">
                            {renderMediaSection(activeSchedule.platform, activeSchedule.content_type)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-48">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                          Platform seçin
                        </h3>
                        <p className="text-xs text-gray-500">
                          Sol tərəfdən bir platform seçin
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="border-t border-gray-100 bg-gray-50/50">
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
                onClick={onOpenChange}
              >
                Bağla
              </button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {previewFile && (
        <MediaPreviewModal
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
          mediaUrl={URL.createObjectURL(previewFile)}
          mediaType={getMediaType(previewFile)}
          alt="Media preview"
        />
      )}
    </>
  );
};

export default ViewReservePostModal;
