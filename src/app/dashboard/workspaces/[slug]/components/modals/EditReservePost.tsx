import { Planning, PlanningPost } from "@/types/planning.type";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { FaInstagram, FaFacebookF, FaTiktok, FaYoutube } from "react-icons/fa";
import {
  ContentType,
  PlatformSchedule,
  SocialMediaPlatform,
} from "@/types/social-media.type";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import MediaPreviewModal from "@/components/common/modals/MediaPreviewModal";
import Modal, { useDisclosure } from "@/components/ui/modal/Modal";
import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal/ModalContent";
import ImageCropModal from "@/components/common/modals/ImageCropModal";
import VideoCropModal from "@/components/common/modals/VideoCropModal";
import { getTaskItemService } from "@/services/server/task.service";
import { getReserveService, updateReservePostService } from "@/services/client/reserve.service";
import { Reserve } from "@/types/reserve.type";
import NewDateTimePicker from "@/components/ui/form/input/NewDateTimePicker";
import { convertFileToBase64 } from "@/utils/base64";
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

interface ValidationError {
  field: string;
  message: string;
}

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  minFiles?: number;
  maxFiles?: number;
  fileTypes?: string[];
  maxFileSize?: number; // in bytes
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
      duration: true,
      aspectRatio: true,
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
      music: true,
    },
  },
};

const defaultContentData: Record<
  SocialMediaPlatform,
  Partial<Record<ContentType, ContentData>>
> = {
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
      firstComment: "",
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
      duration: 60,
      aspectRatio: "9:16",
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
      music: "",
      schedule_date: new Date().toISOString(),
    },
  },
};

interface Props {
    planning: Planning;
  post: PlanningPost;
}

const SortableMediaItem = ({
  file,
  index,
  onDelete,
  onPreview,
}: {
  file: File;
  index: number;
  onDelete: () => void;
  onPreview: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative aspect-square rounded-lg overflow-hidden bg-gray-100 group transition-all duration-200 ${
        isDragging
          ? "shadow-2xl scale-105 rotate-2 opacity-80"
          : "hover:shadow-lg"
      }`}
    >
      <div
        onClick={onPreview}
        className="w-full h-full cursor-pointer relative z-10"
      >
        {file.type.startsWith("image/") ? (
          <Image
            width={1000}
            height={1000}
            src={URL.createObjectURL(file)}
            alt="Media content"
            className="w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <video
            src={URL.createObjectURL(file)}
            className="w-full h-full object-cover pointer-events-none"
          />
        )}
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
        <div
          {...attributes}
          {...listeners}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-2 bg-white bg-opacity-90 text-gray-800 rounded-full cursor-move opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-opacity-100 hover:scale-110 z-30 shadow-lg"
          onClick={(e) => e.stopPropagation()}
          title="Sürükle"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM7 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM7 14a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM13 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM13 8a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM13 14a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
          </svg>
        </div>

        <button
          onClick={onDelete}
          type="button"
          className="absolute top-2 right-2 p-2 bg-white bg-opacity-90 text-red-500 rounded-full hover:bg-opacity-100 hover:scale-110 transition-all duration-200 opacity-0 group-hover:opacity-100 z-30 shadow-lg"
          style={{
            minWidth: "32px",
            minHeight: "32px",
          }}
          title="Sil"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="absolute bottom-2 left-2 px-2 py-1 bg-white bg-opacity-90 text-gray-800 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 z-30">
          {file.type.startsWith("image/") ? "Image" : "Video"}
        </div>
      </div>
    </div>
  );
};

interface AddOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  onAdd: (type: string, value: string) => void;
}

const AddOptionModal: React.FC<AddOptionModalProps> = ({
  isOpen,
  onClose,
  type,
  onAdd,
}) => {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(type, value.trim());
      setValue("");
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>
          Add {type.charAt(0).toUpperCase() + type.slice(1)}
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Enter ${type}...`}
              />
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Add
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const EditReservePostModal: React.FC<Props> = ({ planning, post }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
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
  const [validationErrors, setValidationErrors] = useState<
    Record<string, ValidationError[]>
  >({});
  const [addOptionModalOpen, setAddOptionModalOpen] = useState(false);
  const [addOptionType, setAddOptionType] = useState("");
  const [imageCropModalOpen, setImageCropModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [cropAspectRatio, setCropAspectRatio] = useState<number | undefined>(
    undefined
  );
  const [videoCropModalOpen, setVideoCropModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [reservePost, setReservePost] = useState<Reserve>();
  const [isJointPost, setIsJointPost] = useState(false);
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
  const [remainingFiles, setRemainingFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Filter platform features based on planning's social accounts
  // Filter platform features based on planning's social accounts and post publishable status
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
              } else {
                // If no platform schedules exist, set default to Instagram Post
                setSelectedSchedules([{
                  platform: 'instagram',
                  content_type: 'post',
                  scheduled_date: new Date().toISOString(),
                }]);
                setActiveSchedule({
                  platform: 'instagram',
                  content_type: 'post',
                  scheduled_date: new Date().toISOString(),
                });
              }
            } else {
              // Individual platform posts
              const initialPlatformContents = { ...defaultContentData };
              
              if (reserveData.platform_schedules && reserveData.platform_schedules.length > 0) {
                // Populate with existing platform schedules
                const schedules = reserveData.platform_schedules.map((schedule) => ({
                  platform: schedule.platform,
                  content_type: schedule.content_type,
                  scheduled_date: schedule.scheduled_date,
                }));
                setSelectedSchedules(schedules);
                
                // Populate all platform schedules with content
                for (const schedule of reserveData.platform_schedules) {
                  // Convert media files from URLs to File objects
                  const mediaFiles: File[] = [];
                  if (schedule.medias && schedule.medias.length > 0) {
                    for (const media of schedule.medias) {
                      const file = await customFileToFile(media.file);
                      mediaFiles.push(file);
                    }
                  }
                  
                  initialPlatformContents[schedule.platform][schedule.content_type] = {
                    content: schedule.content_override || reserveData.content || "",
                    medias: mediaFiles,
                    hashtags: schedule.hashtags?.map(h => h.name) || [],
                    mentions: schedule.mentioned_users?.map(u => u.username) || [],
                    location: schedule.location || "",
                    link: schedule.link || "",
                    caption: schedule.content_override || "",
                    music: schedule.music || "",
                    effects: schedule.effects || "",
                    title: schedule.title || "",
                    description: schedule.description || "",
                    tags: schedule.tags_input ? schedule.tags_input.split(',').map(t => t.trim()) : [],
                    category: schedule.category || "",
                    coverImage: schedule.cover_image ? await customFileToFile(schedule.cover_image) : undefined,
                    thumbnail: schedule.thumbnail ? await customFileToFile(schedule.thumbnail) : undefined,
                    firstComment: schedule.first_comment || "",
                    slides: schedule.slides_count || 2,
                    aspectRatio: schedule.aspect_ratio || "9:16",
                    duration: schedule.duration || 60,
                    schedule_date: schedule.scheduled_date || new Date().toISOString(),
                  };
                }
                
                // Set the first schedule as selected for initial view
                const firstSchedule = reserveData.platform_schedules[0];
                setActiveSchedule({
                  platform: firstSchedule.platform,
                  content_type: firstSchedule.content_type,
                  scheduled_date: firstSchedule.scheduled_date,
                });
              } else {
                // If no platform schedules exist, populate with reserve content to all platforms
                const allSchedules: Array<{
                  platform: SocialMediaPlatform;
                  content_type: ContentType;
                  scheduled_date: string;
                }> = [];
                
                Object.entries(platformSpecificFeatures).forEach(([platform, contentTypes]) => {
                  Object.keys(contentTypes).forEach((contentType) => {
                    allSchedules.push({
                      platform: platform as SocialMediaPlatform,
                      content_type: contentType as ContentType,
                      scheduled_date: new Date().toISOString(),
                    });
                  });
                });
                
                setSelectedSchedules(allSchedules);
                
                if (reserveData.content) {
                  // Convert reserve medias to File objects
                  const reserveMediaFiles: File[] = [];
                  if (reserveData.medias && reserveData.medias.length > 0) {
                    for (const media of reserveData.medias) {
                      const file = await customFileToFile(media.file);
                      reserveMediaFiles.push(file);
                    }
                  }
                  
                  Object.keys(initialPlatformContents).forEach((platform) => {
                    Object.keys(initialPlatformContents[platform as SocialMediaPlatform]).forEach((contentType) => {
                      initialPlatformContents[platform as SocialMediaPlatform][contentType as ContentType] = {
                        ...initialPlatformContents[platform as SocialMediaPlatform][contentType as ContentType],
                        content: reserveData.content,
                        medias: reserveMediaFiles,
                      };
                    });
                  });
                }
                
                // Set default to Instagram Post for initial view
                setActiveSchedule({
                  platform: 'instagram',
                  content_type: 'post',
                  scheduled_date: new Date().toISOString(),
                });
              }
              
              setPlatformContents(initialPlatformContents);
            }
          }
        }
    };
    }

    if (isOpen && post) {
      loadTaskItem();
    }
  }, [isOpen, post?.id]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (
    event: DragEndEvent,
    medias: File[],
    onChange: (medias: File[]) => void
  ) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = medias.findIndex((_, index) => index === active.id);
      const newIndex = medias.findIndex((_, index) => index === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newMedias = arrayMove(medias, oldIndex, newIndex);
        onChange(newMedias);
      }
    }
  };

  const handleFileSelect = (
    onChange: (medias: File[]) => void,
    existingMedias: File[] = []
  ) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*,video/*";
    input.multiple = true;

    input.onchange = (e: Event) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        // Process all selected files
        const imageFiles = files.filter(file => file.type.startsWith("image/"));
        const videoFiles = files.filter(file => file.type.startsWith("video/"));
        const otherFiles = files.filter(file => !file.type.startsWith("image/") && !file.type.startsWith("video/"));

        // If we have image or video files, open crop modal for the first one
        if (imageFiles.length > 0) {
          setSelectedImage(imageFiles[0]);
          setImageCropModalOpen(true);
          // Store remaining files for later processing
          if (imageFiles.length > 1 || videoFiles.length > 0 || otherFiles.length > 0) {
            const remainingFiles = [
              ...imageFiles.slice(1),
              ...videoFiles,
              ...otherFiles
            ];
            setRemainingFiles(remainingFiles);
          }
        } else if (videoFiles.length > 0) {
          setSelectedVideo(videoFiles[0]);
          setVideoCropModalOpen(true);
          // Store remaining files for later processing
          if (videoFiles.length > 1 || otherFiles.length > 0) {
            const remainingFiles = [
              ...videoFiles.slice(1),
              ...otherFiles
            ];
            setRemainingFiles(remainingFiles);
          }
        } else {
          // No image or video files, add all files directly
          onChange([...existingMedias, ...files]);
        }
      }
    };

    input.click();
  };

  const handlePreview = (file: File) => {
    setPreviewFile(file);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewFile(null);
  };

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
      case "carousel":
        return "Karussel";
      case "video":
        return "Video";
      case "short":
        return "Qısa Video";
      default:
        return type;
    }
  };

  const renderMediaSection = (
    platform: SocialMediaPlatform,
    contentType: ContentType
  ) => {
    const content = platformContents[platform]?.[contentType] || {
      content: "",
      medias: [],
    };
    const medias = content.medias || [];

    const handleMediaChange = (newMedias: File[]) => {
      setPlatformContents((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          [contentType]: {
            ...prev[platform]?.[contentType],
            medias: newMedias,
          },
        },
      }));
    };

    return (
      <div className="mt-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) => handleDragEnd(event, medias, handleMediaChange)}
        >
          <SortableContext
            items={medias.map((_, index) => index)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-3 gap-2">
              {medias.map((file, index) => (
                <SortableMediaItem
                  key={`${file.name}-${index}`}
                  file={file}
                  index={index}
                  onDelete={() => {
                    const newMedias = medias.filter((_, i) => i !== index);
                    handleMediaChange(newMedias);
                  }}
                  onPreview={() => handlePreview(file)}
                />
              ))}
              <button
                type="button"
                onClick={() => handleFileSelect(handleMediaChange, medias)}
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group h-24"
              >
                <svg
                  className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="mt-1 text-xs text-gray-500 group-hover:text-blue-500 transition-colors duration-200">
                  Add Media
                </span>
              </button>
            </div>
          </SortableContext>
        </DndContext>

        {previewFile && (
          <MediaPreviewModal
            isOpen={isPreviewOpen}
            onClose={handleClosePreview}
            mediaUrl={URL.createObjectURL(previewFile)}
            mediaType={
              previewFile.type.startsWith("image/") ? "image" : "video"
            }
            alt={previewFile.name}
          />
        )}
      </div>
    );
  };

  const handleAddOption = (type: string, value: string) => {
    if (isJointPost) {
      // Joint post mode - add to joint content
      setJointContent((prev) => ({
        ...prev,
        [type]: type === 'hashtags' || type === 'mentions' || type === 'tags' 
          ? [...(prev[type] || []), value]
          : value,
      }));
    } else {
      // Individual mode - add to active schedule
      if (!activeSchedule) return;
      
      const platform = activeSchedule.platform;
      const contentType = activeSchedule.content_type;
      const currentContent = platformContents[platform]?.[contentType] || {
        content: "",
        medias: [],
      };

      let updatedContent = { ...currentContent };

      switch (type) {
        case "hashtags":
          updatedContent.hashtags = [...(updatedContent.hashtags || []), value];
          break;
        case "mentions":
          updatedContent.mentions = [...(updatedContent.mentions || []), value];
          break;
        case "location":
          updatedContent.location = value;
          break;
        case "link":
          updatedContent.link = value;
          break;
        case "caption":
          updatedContent.caption = value;
          break;
        case "music":
          updatedContent.music = value;
          break;
        case "effects":
          updatedContent.effects = value;
          break;
        case "title":
          updatedContent.title = value;
          break;
        case "description":
          updatedContent.description = value;
          break;
        case "tags":
          updatedContent.tags = [...(updatedContent.tags || []), value];
          break;
        case "category":
          updatedContent.category = value;
          break;
        case "firstComment":
          updatedContent.firstComment = value;
          break;
      }

      setPlatformContents((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          [contentType]: updatedContent,
        },
      }));
    }

    setAddOptionModalOpen(false);
  };

  const handleRemoveOption = (type: string, value: string) => {
    if (isJointPost) {
      // Joint post mode - remove from joint content
      setJointContent((prev) => ({
        ...prev,
        [type]: type === 'hashtags' || type === 'mentions' || type === 'tags'
          ? (prev[type] || []).filter((item: string) => item !== value)
          : "",
      }));
    } else {
      // Individual mode - remove from active schedule
      if (!activeSchedule) return;
      
      const platform = activeSchedule.platform;
      const contentType = activeSchedule.content_type;
      const currentContent = platformContents[platform]?.[contentType] || {
        content: "",
        medias: [],
      };

      let updatedContent = { ...currentContent };

      switch (type) {
        case "hashtags":
          updatedContent.hashtags = (updatedContent.hashtags || []).filter(
            (tag) => tag !== value
          );
          break;
        case "mentions":
          updatedContent.mentions = (updatedContent.mentions || []).filter(
            (mention) => mention !== value
          );
          break;
        case "location":
          updatedContent.location = "";
          break;
        case "link":
          updatedContent.link = "";
          break;
        case "caption":
          updatedContent.caption = "";
          break;
        case "music":
          updatedContent.music = "";
          break;
        case "effects":
          updatedContent.effects = "";
          break;
        case "title":
          updatedContent.title = "";
          break;
        case "description":
          updatedContent.description = "";
          break;
        case "tags":
          updatedContent.tags = (updatedContent.tags || []).filter(
            (tag) => tag !== value
          );
          break;
        case "category":
          updatedContent.category = "";
          break;
        case "firstComment":
          updatedContent.firstComment = "";
          break;
      }

      setPlatformContents((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          [contentType]: updatedContent,
        },
      }));
    }
  };

  const handleContentChange = (value: string) => {
    if (selectedSchedules.length === 0) return;
    setPlatformContents((prev) => ({
      ...prev,
      [selectedSchedules[0].platform]: {
        ...prev[selectedSchedules[0].platform],
        [selectedSchedules[0].content_type]: {
          ...prev[selectedSchedules[0].platform]?.[selectedSchedules[0].content_type],
          content: value,
        },
      },
    }));
  };

  const handleThumbnailChange = (
    file: File | null,
    content: ContentData,
    onChange: (content: ContentData) => void
  ) => {
    if (file) {
      const contentData = { ...content };
      contentData.thumbnail = file;
      onChange(contentData);
    } else {
      const contentData = { ...content };
      delete contentData.thumbnail;
      onChange(contentData);
    }
  };

  const handleDurationChange = (
    value: string,
    content: ContentData,
    onChange: (content: ContentData) => void
  ) => {
    const contentData = { ...content };
    contentData.duration = parseInt(value) || 60;
    onChange(contentData);
  };

  const handleSlidesChange = (
    value: string,
    content: ContentData,
    onChange: (content: ContentData) => void
  ) => {
    const contentData = { ...content };
    contentData.slides = parseInt(value) || 2;
    onChange(contentData);
  };

  const handleCropComplete = (croppedImage: File) => {
    if (isJointPost) {
      // Joint post mode - add to joint content
      setJointContent((prev) => ({
        ...prev,
        medias: [...prev.medias, croppedImage],
      }));
    } else {
      // Individual mode - add to active schedule
      if (!activeSchedule) return;
      
      const platform = activeSchedule.platform;
      const contentType = activeSchedule.content_type;
      const currentContent = platformContents[platform]?.[contentType] || {
        content: "",
        medias: [],
      };

      setPlatformContents((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          [contentType]: {
            ...currentContent,
            medias: [...(currentContent.medias || []), croppedImage],
          },
        },
      }));
    }

    // Process remaining files if any
    if (remainingFiles.length > 0) {
      const nextImageFile = remainingFiles.find(file => file.type.startsWith("image/"));
      const nextVideoFile = remainingFiles.find(file => file.type.startsWith("video/"));
      const otherFiles = remainingFiles.filter(file => !file.type.startsWith("image/") && !file.type.startsWith("video/"));

      if (nextImageFile) {
        setSelectedImage(nextImageFile);
        setImageCropModalOpen(true);
        const newRemainingFiles = remainingFiles.filter(file => file !== nextImageFile);
        setRemainingFiles(newRemainingFiles);
      } else if (nextVideoFile) {
        setSelectedVideo(nextVideoFile);
        setVideoCropModalOpen(true);
        const newRemainingFiles = remainingFiles.filter(file => file !== nextVideoFile);
        setRemainingFiles(newRemainingFiles);
      } else if (otherFiles.length > 0) {
        // Add remaining non-image/video files directly
        if (isJointPost) {
          setJointContent((prev) => ({
            ...prev,
            medias: [...prev.medias, ...otherFiles],
          }));
        } else {
          if (!activeSchedule) return;
          
          const platform = activeSchedule.platform;
          const contentType = activeSchedule.content_type;
          const currentContent = platformContents[platform]?.[contentType] || {
            content: "",
            medias: [],
          };

          setPlatformContents((prev) => ({
            ...prev,
            [platform]: {
              ...prev[platform],
              [contentType]: {
                ...currentContent,
                medias: [...(currentContent.medias || []), ...otherFiles],
              },
            },
          }));
        }
        setRemainingFiles([]);
      }
    } else {
      setRemainingFiles([]);
    }
  };

  const handleVideoCropComplete = (croppedVideo: File) => {
    if (isJointPost) {
      // Joint post mode - add to joint content
      setJointContent((prev) => ({
        ...prev,
        medias: [...prev.medias, croppedVideo],
      }));
    } else {
      // Individual mode - add to active schedule
      if (!activeSchedule) return;
      
      const platform = activeSchedule.platform;
      const contentType = activeSchedule.content_type;
      const currentContent = platformContents[platform]?.[contentType] || {
        content: "",
        medias: [],
      };

      setPlatformContents((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          [contentType]: {
            ...currentContent,
            medias: [...(currentContent.medias || []), croppedVideo],
          },
        },
      }));
    }

    // Process remaining files if any
    if (remainingFiles.length > 0) {
      const nextImageFile = remainingFiles.find(file => file.type.startsWith("image/"));
      const nextVideoFile = remainingFiles.find(file => file.type.startsWith("video/"));
      const otherFiles = remainingFiles.filter(file => !file.type.startsWith("image/") && !file.type.startsWith("video/"));

      if (nextImageFile) {
        setSelectedImage(nextImageFile);
        setImageCropModalOpen(true);
        const newRemainingFiles = remainingFiles.filter(file => file !== nextImageFile);
        setRemainingFiles(newRemainingFiles);
      } else if (nextVideoFile) {
        setSelectedVideo(nextVideoFile);
        setVideoCropModalOpen(true);
        const newRemainingFiles = remainingFiles.filter(file => file !== nextVideoFile);
        setRemainingFiles(newRemainingFiles);
      } else if (otherFiles.length > 0) {
        // Add remaining non-image/video files directly
        if (isJointPost) {
          setJointContent((prev) => ({
            ...prev,
            medias: [...prev.medias, ...otherFiles],
          }));
        } else {
          if (!activeSchedule) return;
          
          const platform = activeSchedule.platform;
          const contentType = activeSchedule.content_type;
          const currentContent = platformContents[platform]?.[contentType] || {
            content: "",
            medias: [],
          };

          setPlatformContents((prev) => ({
            ...prev,
            [platform]: {
              ...prev[platform],
              [contentType]: {
                ...currentContent,
                medias: [...(currentContent.medias || []), ...otherFiles],
              },
            },
          }));
        }
        setRemainingFiles([]);
      }
    } else {
      setRemainingFiles([]);
    }
  };

  const renderPlatformSpecificFields = (
    platform: SocialMediaPlatform,
    contentType: ContentType,
    content: ContentData,
    onChange: (content: ContentData) => void
  ) => {
    const features = platformSpecificFeatures[platform]?.[contentType];
    if (!features) return null;

    return (
      <div className="mt-4 space-y-4">
        {features.hashtags && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Hashtags
            </label>
            <div className="flex flex-wrap gap-2">
              {(content.hashtags || []).map((tag, index) => (
                <div
                  key={index}
                  className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveOption("hashtags", tag)}
                    className="text-blue-400 hover:text-blue-600"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setAddOptionType("hashtags");
                  setAddOptionModalOpen(true);
                }}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 hover:bg-blue-100"
              >
                + Hashtag
              </button>
            </div>
          </div>
        )}
        
        {features.mentions && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Mentions
            </label>
            <div className="flex flex-wrap gap-2">
              {(content.mentions || []).map((mention, index) => (
                <div
                  key={index}
                  className="bg-purple-50 text-purple-600 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  @{mention}
                  <button
                    type="button"
                    onClick={() => handleRemoveOption("mentions", mention)}
                    className="text-purple-400 hover:text-purple-600"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setAddOptionType("mentions");
                  setAddOptionModalOpen(true);
                }}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-600 hover:bg-purple-100"
              >
                + Mention
              </button>
            </div>
          </div>
        )}

        {features.location && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Location
            </label>
            <div className="flex items-center gap-2">
              {content.location ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {content.location}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveOption("location", content.location || "")
                    }
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAddOptionType("location");
                    setAddOptionModalOpen(true);
                  }}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600 hover:bg-green-100"
                >
                  + Location
                </button>
              )}
            </div>
          </div>
        )}

        {features.link && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Link
            </label>
            <div className="flex items-center gap-2">
              {content.link ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {content.link}
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveOption("link", content.link || "")
                    }
                    className="ml-1 text-indigo-600 hover:text-indigo-800"
                  >
                    ×
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAddOptionType("link");
                    setAddOptionModalOpen(true);
                  }}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                >
                  + Link
                </button>
              )}
            </div>
          </div>
        )}

        {features.music && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Music
            </label>
            <div className="flex items-center gap-2">
              {content.music ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                  {content.music}
                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveOption("music", content.music || "")
                    }
                    className="ml-1 text-pink-600 hover:text-pink-800"
                  >
                    ×
                  </button>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAddOptionType("music");
                    setAddOptionModalOpen(true);
                  }}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-pink-600 hover:bg-pink-100"
                >
                  + Music
                </button>
              )}
            </div>
          </div>
        )}

        {features.thumbnail && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Thumbnail
            </label>
            {content.thumbnail ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {content.thumbnail instanceof File
                    ? content.thumbnail.name
                    : "Thumbnail"}
                </span>
                <button
                  type="button"
                  onClick={() => handleThumbnailChange(null, content, onChange)}
                  className="text-red-600 hover:text-red-800"
                >
                  ×
                </button>
              </div>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleThumbnailChange(file, content, onChange);
                  }
                }}
                className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>
        )}

        {features.duration && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Duration
            </label>
            <input
              type="text"
              value={content.duration || ""}
              onChange={(e) =>
                handleDurationChange(e.target.value, content, onChange)
              }
              placeholder="Enter duration..."
              className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {features.aspectRatio && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Aspect Ratio
            </label>
            <select
              value={content.aspectRatio || ""}
              onChange={(e) =>
                onChange({ ...content, aspectRatio: e.target.value })
              }
              className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select aspect ratio...</option>
              <option value="9:16">9:16 (Vertical)</option>
              <option value="16:9">16:9 (Horizontal)</option>
              <option value="1:1">1:1 (Square)</option>
            </select>
          </div>
        )}

        {features.slides && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Slides
            </label>
            <input
              type="number"
              value={content.slides?.toString() || ""}
              onChange={(e) =>
                handleSlidesChange(e.target.value, content, onChange)
              }
              placeholder="Enter number of slides..."
              className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {features.firstComment && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              First Comment
            </label>
            <textarea
              value={content.firstComment || ""}
              onChange={(e) =>
                onChange({ ...content, firstComment: e.target.value })
              }
              placeholder="Add first comment..."
              className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>
        )}
      </div>
    );
  };

  const handleScheduleSelection = (platform: SocialMediaPlatform, content_type: ContentType) => {
    if (isJointPost) {
      // Joint post mode - multiple selection
      const existingIndex = selectedSchedules.findIndex(
        schedule => schedule.platform === platform && schedule.content_type === content_type
      );

      if (existingIndex >= 0) {
        // Remove if already selected
        setSelectedSchedules(prev => prev.filter((_, index) => index !== existingIndex));
      } else {
        // Add new selection
        setSelectedSchedules(prev => [...prev, {
          platform,
          content_type,
          scheduled_date: new Date().toISOString(),
        }]);
      }
    } else {
      // Individual mode - multiple selection with active item
      const existingIndex = selectedSchedules.findIndex(
        schedule => schedule.platform === platform && schedule.content_type === content_type
      );

      if (existingIndex >= 0) {
        // Remove if already selected
        setSelectedSchedules(prev => prev.filter((_, index) => index !== existingIndex));
        // If we're removing the active schedule, set active to null or first remaining
        if (activeSchedule?.platform === platform && activeSchedule?.content_type === content_type) {
          const remainingSchedules = selectedSchedules.filter((_, index) => index !== existingIndex);
          setActiveSchedule(remainingSchedules.length > 0 ? remainingSchedules[0] : null);
        }
      } else {
        // Add new selection
        const newSchedule = {
          platform,
          content_type,
          scheduled_date: new Date().toISOString(),
        };
        setSelectedSchedules(prev => [...prev, newSchedule]);
        // Set as active if it's the first selection
        if (selectedSchedules.length === 0) {
          setActiveSchedule(newSchedule);
        }
      }
    }
  };

  const handleListItemClick = (platform: SocialMediaPlatform, content_type: ContentType) => {
    // Check if this schedule is already selected
    const isSelected = selectedSchedules.some(
      schedule => schedule.platform === platform && schedule.content_type === content_type
    );

    if (!isSelected) {
      // If not selected, add it to selections
      const newSchedule = {
        platform,
        content_type,
        scheduled_date: new Date().toISOString(),
      };
      setSelectedSchedules(prev => [...prev, newSchedule]);
      setActiveSchedule(newSchedule);
    } else {
      // If already selected, just make it active
      const schedule = selectedSchedules.find(
        s => s.platform === platform && s.content_type === content_type
      );
      if (schedule) {
        setActiveSchedule(schedule);
      }
    }
  };

  const isScheduleSelected = (platform: SocialMediaPlatform, content_type: ContentType) => {
    return selectedSchedules.some(
      schedule => schedule.platform === platform && schedule.content_type === content_type
    );
  };

  const isActiveSchedule = (platform: SocialMediaPlatform, content_type: ContentType) => {
    return activeSchedule?.platform === platform && activeSchedule?.content_type === content_type;
  };

  const handleSave = async () => {
    if (!reservePost) return;
    
    setIsLoading(true);
    try {
      // Helper function to convert File to base64
      

      // Prepare platform schedules data
      const platformSchedules = [];
      
      if (isJointPost) {
        // Joint post - create schedules for all selected platforms
        for (const schedule of selectedSchedules) {
          const platformContent = platformContents[schedule.platform]?.[schedule.content_type] || {
            content: "",
            medias: [],
          };

          // Convert media files to base64
          const mediaFiles = [];
          for (const media of jointContent.medias) {
            const base64 = await convertFileToBase64(media);
            mediaFiles.push({ file: base64 });
          }

          platformSchedules.push({
            content_override: platformContent.content || jointContent.content,
            platform: schedule.platform,
            content_type: schedule.content_type,
            scheduled_date: jointContent.schedule_date || schedule.scheduled_date,
            medias: mediaFiles,
            first_comment: jointContent.firstComment,
            hashtags: jointContent.hashtags?.map(tag => ({ name: tag })) || [],
            mentioned_users: jointContent.mentions?.map(mention => ({ username: mention })) || [],
            title: jointContent.title,
            description: jointContent.description,
            tags_input: jointContent.tags?.join(',') || "",
            category: jointContent.category,
            music: jointContent.music,
            effects: jointContent.effects,
            cover_image: jointContent.coverImage ? await convertFileToBase64(jointContent.coverImage) : undefined,
            thumbnail: jointContent.thumbnail ? await convertFileToBase64(jointContent.thumbnail) : undefined,
            duration: jointContent.duration,
            aspect_ratio: jointContent.aspectRatio,
            slides_count: jointContent.slides,
            location: jointContent.location,
            link: jointContent.link,
          });
        }
      } else {
        // Individual post - create schedules for selected platforms
        for (const schedule of selectedSchedules) {
          const platformContent = platformContents[schedule.platform]?.[schedule.content_type] || {
            content: "",
            medias: [],
          };

          // Convert media files to base64
          const mediaFiles = [];
          for (const media of platformContent.medias || []) {
            const base64 = await convertFileToBase64(media);
            mediaFiles.push({ file: base64 });
          }

          platformSchedules.push({
            content_override: platformContent.content,
            platform: schedule.platform,
            content_type: schedule.content_type,
            scheduled_date: platformContent.schedule_date || schedule.scheduled_date,
            medias: mediaFiles,
            first_comment: platformContent.firstComment,
            hashtags: platformContent.hashtags?.map(tag => ({ name: tag })) || [],
            mentioned_users: platformContent.mentions?.map(mention => ({ username: mention })) || [],
            title: platformContent.title,
            description: platformContent.description,
            tags_input: platformContent.tags?.join(',') || "",
            category: platformContent.category,
            music: platformContent.music,
            effects: platformContent.effects,
            cover_image: platformContent.coverImage ? await convertFileToBase64(platformContent.coverImage) : undefined,
            thumbnail: platformContent.thumbnail ? await convertFileToBase64(platformContent.thumbnail) : undefined,
            duration: platformContent.duration,
            aspect_ratio: platformContent.aspectRatio,
            slides_count: platformContent.slides,
            location: platformContent.location,
            link: platformContent.link,
          });
        }
      }

      // Convert joint content media files to base64
      const jointMediaFiles = [];
      if (isJointPost) {
        for (const media of jointContent.medias) {
          const base64 = await convertFileToBase64(media);
          jointMediaFiles.push({ file: base64 });
        }
      }

      // Prepare the update data
      const updateData = {
        planning_post: post.id,
        content: isJointPost ? jointContent.content : (platformContents[selectedSchedules[0]?.platform]?.[selectedSchedules[0]?.content_type]?.content || ""),
        medias: isJointPost ? jointMediaFiles : [],
        platform_schedules: platformSchedules,
        scheduled_date: isJointPost 
          ? (jointContent.schedule_date || new Date().toISOString())
          : (platformContents[selectedSchedules[0]?.platform]?.[selectedSchedules[0]?.content_type]?.schedule_date || new Date().toISOString()),
        joint_post: isJointPost,
      };

      // Call the update service
      console.log(updateData)
      await updateReservePostService(reservePost.id, updateData);
      
      // Close modal on success
      onOpenChange();
    } catch (error) {
      console.error("Error saving reserve post:", error);
      // You can add error handling here (show toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={onOpen}
        className="inline-flex whitespace-nowrap items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
        Düzəliş et
      </button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="6xl"
        title="Sosial Media Təhvili"
      >
        <ModalContent className="max-w-[90vw] mx-auto">
          <ModalHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Sosial Media Təhvili
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Status:</span>
                <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-50 rounded-full">
                  Draft
                </span>
              </div>
            </div>
          </ModalHeader>
          <ModalBody className="max-h-[calc(100vh-200px)] overflow-y-auto">
            <div className="space-y-6 max-w-[1400px] mx-auto">
              {/* Joint Post Toggle */}
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-gray-900">
                      Sosial Media Təhvili
                    </h3>
                    <p className="text-sm text-gray-500">
                      Ortaq məzmun və ya ayrı məzmun
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Ortaq Məzmun</span>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isJointPost}
                      onChange={(e) => setIsJointPost(e.target.checked)}
                      className="sr-only"
                      id="joint-post-toggle"
                    />
                    <label
                      htmlFor="joint-post-toggle"
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 cursor-pointer ${
                        isJointPost ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          isJointPost ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {isJointPost ? (
                /* Joint Post Form */
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
                    {/* Platform/Content Type List */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-r border-gray-200">
                      <div className="p-3 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-md">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                              Platform və Content Type'lar
                            </h3>
                            <p className="text-xs text-gray-500">
                              Seçim edin və düzəliş edin
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
                        {Object.entries(filteredPlatformFeatures).map(
                          ([platform, contentTypes]) => (
                            <div key={platform} className="space-y-2">
                              <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg shadow-sm border border-white/20">
                                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                  {getPlatformIcon(platform as SocialMediaPlatform)}
                                </div>
                                <div>
                                  <span className="font-medium capitalize text-gray-900 text-xs">
                                    {platform}
                                  </span>
                                  <p className="text-xs text-gray-500">
                                    {Object.keys(contentTypes).length} content type
                                  </p>
                                </div>
                              </div>
                              <div className="ml-3 space-y-1">
                                {Object.keys(contentTypes).map((contentType) => (
                                  <button
                                    key={`${platform}-${contentType}`}
                                    type="button"
                                    onClick={() => handleListItemClick(platform as SocialMediaPlatform, contentType as ContentType)}
                                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-all duration-200 flex items-center gap-2 group
                                    ${
                                      isActiveSchedule(platform as SocialMediaPlatform, contentType as ContentType)
                                        ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 ring-1 ring-blue-200 shadow-md transform scale-[1.01]"
                                        : isScheduleSelected(platform as SocialMediaPlatform, contentType as ContentType)
                                        ? "bg-gradient-to-r from-green-50 to-green-100 text-green-700 ring-1 ring-green-200 shadow-md transform scale-[1.01]"
                                        : "bg-white/80 text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-sm hover:scale-[1.005] border border-transparent hover:border-gray-200"
                                    }`}
                                  >
                                    <div className={`p-1 rounded-md transition-all duration-200 ${
                                      isActiveSchedule(platform as SocialMediaPlatform, contentType as ContentType)
                                        ? "bg-blue-200 text-blue-600"
                                        : isScheduleSelected(platform as SocialMediaPlatform, contentType as ContentType)
                                        ? "bg-green-200 text-green-600"
                                        : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                                    }`}>
                                      {isScheduleSelected(platform as SocialMediaPlatform, contentType as ContentType) ? (
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      ) : (
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                      )}
                                    </div>
                                    <span className="font-medium">{getContentTypeLabel(contentType as ContentType)}</span>
                                    {isActiveSchedule(platform as SocialMediaPlatform, contentType as ContentType) && (
                                      <div className="ml-auto">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                                      </div>
                                    )}
                                    {isScheduleSelected(platform as SocialMediaPlatform, contentType as ContentType) && !isActiveSchedule(platform as SocialMediaPlatform, contentType as ContentType) && (
                                      <div className="ml-auto">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Joint Content Area */}
                    <div className="lg:col-span-3">
                      {selectedSchedules.length > 0 ? (
                        <div className="p-4 space-y-4">
                          {/* Selected Combinations Summary */}
                          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                            <h3 className="text-xs font-medium text-blue-900 mb-2">
                              Seçilmiş Platform və Content Type'lar:
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedSchedules.map((schedule, index) => (
                                <div
                                  key={`${schedule.platform}-${schedule.content_type}-${index}`}
                                  className="flex items-center gap-2 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium transition-all group"
                                >
                                  <div className="flex items-center gap-2">
                                    <div className="p-0.5 bg-white rounded">
                                      {getPlatformIcon(schedule.platform)}
                                    </div>
                                    <span className="capitalize">{schedule.platform}</span>
                                    <span>•</span>
                                    <span>{getContentTypeLabel(schedule.content_type)}</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleScheduleSelection(schedule.platform, schedule.content_type)}
                                    className="ml-1 p-0.5 rounded-full hover:bg-red-100 hover:text-red-600 transition-all"
                                    title="Sil"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Content Section */}
                            <div className="space-y-4">
                              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-3 border-b border-gray-200">
                                  <h3 className="text-xs font-medium text-gray-900">
                                    Ortaq Məzmun
                                  </h3>
                                </div>
                                <div className="p-3">
                                  <textarea
                                    value={jointContent.content}
                                    onChange={(e) =>
                                      setJointContent((prev) => ({
                                        ...prev,
                                        content: e.target.value,
                                      }))
                                    }
                                    placeholder="Ortaq məzmun yazın..."
                                    className="w-full h-24 p-2 text-xs border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                  />
                                </div>
                              </div>

                              {/* Schedule Date Section */}
                              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-3 border-b border-gray-200">
                                  <h3 className="text-xs font-medium text-gray-900">
                                    Təhvil Tarixi
                                  </h3>
                                </div>
                                <div className="p-3">
                                  <NewDateTimePicker
                                    id="joint-schedule-date"
                                    value={jointContent.schedule_date}
                                    onChange={(value) =>
                                      setJointContent((prev) => ({
                                        ...prev,
                                        schedule_date: value,
                                      }))
                                    }
                                    label=""
                                    className="w-full"
                                  />
                                </div>
                              </div>

                              {/* Platform Specific Fields */}
                              {selectedSchedules.map(({ platform, content_type }) => (
                                <div key={`${platform}-${content_type}-fields`} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                  <div className="p-3 border-b border-gray-200">
                                    <div className="flex items-center gap-2">
                                      <div className="p-1 bg-gray-100 rounded">
                                        {getPlatformIcon(platform)}
                                      </div>
                                      <h3 className="text-xs font-medium text-gray-900">
                                        {platform.charAt(0).toUpperCase() + platform.slice(1)} - {getContentTypeLabel(content_type)}
                                      </h3>
                                    </div>
                                  </div>
                                  <div className="p-3 space-y-3">
                                    {renderPlatformSpecificFields(
                                      platform,
                                      content_type,
                                      jointContent,
                                      (newContent) => {
                                        setJointContent((prev) => ({
                                          ...prev,
                                          ...newContent,
                                        }));
                                      }
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Media Section */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                              <div className="p-3 border-b border-gray-200">
                                <h3 className="text-xs font-medium text-gray-900">
                                  Ortaq Media
                                </h3>
                              </div>
                              <div className="p-3">
                                <DndContext
                                  sensors={sensors}
                                  collisionDetection={closestCenter}
                                  onDragEnd={(event) =>
                                    handleDragEnd(event, jointContent.medias, (medias) =>
                                      setJointContent((prev) => ({ ...prev, medias }))
                                    )
                                  }
                                >
                                  <SortableContext
                                    items={jointContent.medias.map((_, index) => index)}
                                    strategy={verticalListSortingStrategy}
                                  >
                                    <div className="grid grid-cols-3 gap-2">
                                      {jointContent.medias.map((file, index) => (
                                        <SortableMediaItem
                                          key={`${file.name}-${index}`}
                                          file={file}
                                          index={index}
                                          onDelete={() => {
                                            const newMedias = jointContent.medias.filter((_, i) => i !== index);
                                            setJointContent((prev) => ({ ...prev, medias: newMedias }));
                                          }}
                                          onPreview={() => handlePreview(file)}
                                        />
                                      ))}
                                      <button
                                        type="button"
                                        onClick={() => handleFileSelect((medias) => setJointContent((prev) => ({ ...prev, medias })), jointContent.medias)}
                                        className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
                                      >
                                        <svg
                                          className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4v16m8-8H4"
                                          />
                                        </svg>
                                        <span className="mt-1 text-xs text-gray-500 group-hover:text-blue-500 transition-colors duration-200">
                                          Add Media
                                        </span>
                                      </button>
                                    </div>
                                  </SortableContext>
                                </DndContext>
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
                              Sol tərəfdən platform və content type seçin
                            </p>
                          </div>
                        </div>
                      )}

                      {previewFile && (
                        <MediaPreviewModal
                          isOpen={isPreviewOpen}
                          onClose={handleClosePreview}
                          mediaUrl={URL.createObjectURL(previewFile)}
                          mediaType={
                            previewFile.type.startsWith("image/") ? "image" : "video"
                          }
                          alt={previewFile.name}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* Individual Platform Posts */
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
                    {/* Platform/Content Type List */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-r border-gray-200">
                      <div className="p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                              Platform və Content Type'lar
                            </h3>
                            <p className="text-xs text-gray-500">
                              Seçim edin və düzəliş edin
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                        {Object.entries(filteredPlatformFeatures).map(
                          ([platform, contentTypes]) => (
                            <div key={platform} className="space-y-2">
                              <div className="flex items-center gap-2 p-2 bg-white/60 rounded-lg shadow-sm border border-white/20">
                                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                  {getPlatformIcon(platform as SocialMediaPlatform)}
                                </div>
                                <div>
                                  <span className="font-medium capitalize text-gray-900 text-xs">
                                    {platform}
                                  </span>
                                  <p className="text-xs text-gray-500">
                                    {Object.keys(contentTypes).length} content type
                                  </p>
                                </div>
                              </div>
                              <div className="ml-3 space-y-1">
                                {Object.keys(contentTypes).map((contentType) => (
                                  <button
                                    key={`${platform}-${contentType}`}
                                    type="button"
                                    onClick={() => handleListItemClick(platform as SocialMediaPlatform, contentType as ContentType)}
                                    className={`w-full text-left px-3 py-2 text-xs rounded-lg transition-all duration-200 flex items-center gap-2 group
                                    ${
                                      isActiveSchedule(platform as SocialMediaPlatform, contentType as ContentType)
                                        ? "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 ring-1 ring-blue-200 shadow-md transform scale-[1.01]"
                                        : isScheduleSelected(platform as SocialMediaPlatform, contentType as ContentType)
                                        ? "bg-gradient-to-r from-green-50 to-green-100 text-green-700 ring-1 ring-green-200 shadow-md transform scale-[1.01]"
                                        : "bg-white/80 text-gray-700 hover:bg-white hover:text-gray-900 hover:shadow-sm hover:scale-[1.005] border border-transparent hover:border-gray-200"
                                    }`}
                                  >
                                    <div className={`p-1 rounded-md transition-all duration-200 ${
                                      isActiveSchedule(platform as SocialMediaPlatform, contentType as ContentType)
                                        ? "bg-blue-200 text-blue-600"
                                        : isScheduleSelected(platform as SocialMediaPlatform, contentType as ContentType)
                                        ? "bg-green-200 text-green-600"
                                        : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                                    }`}>
                                      {isScheduleSelected(platform as SocialMediaPlatform, contentType as ContentType) ? (
                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                      ) : (
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                      )}
                                    </div>
                                    <span className="font-medium">{getContentTypeLabel(contentType as ContentType)}</span>
                                    {isActiveSchedule(platform as SocialMediaPlatform, contentType as ContentType) && (
                                      <div className="ml-auto">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                                      </div>
                                    )}
                                    {isScheduleSelected(platform as SocialMediaPlatform, contentType as ContentType) && !isActiveSchedule(platform as SocialMediaPlatform, contentType as ContentType) && (
                                      <div className="ml-auto">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                      </div>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Active Selection Content */}
                    <div className="lg:col-span-3">
                      {activeSchedule ? (
                        <div className="p-4 space-y-4">
                          {/* Selected Items Summary */}
                          {selectedSchedules.length > 1 && (
                            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                              <h3 className="text-xs font-medium text-green-900 mb-2">
                                Seçilmiş Platform və Content Type'lar:
                              </h3>
                              <div className="flex flex-wrap gap-2">
                                {selectedSchedules.map((schedule, index) => (
                                  <div
                                    key={`${schedule.platform}-${schedule.content_type}-${index}`}
                                    className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium transition-all group
                                    ${
                                      isActiveSchedule(schedule.platform, schedule.content_type)
                                        ? "bg-blue-100 text-blue-700 ring-1 ring-blue-600"
                                        : "bg-green-100 text-green-700 hover:bg-green-200"
                                    }`}
                                  >
                                    <div 
                                      className="flex items-center gap-2 cursor-pointer"
                                      onClick={() => handleListItemClick(schedule.platform, schedule.content_type)}
                                    >
                                      <div className="p-0.5 bg-white rounded">
                                        {getPlatformIcon(schedule.platform)}
                                      </div>
                                      <span className="capitalize">{schedule.platform}</span>
                                      <span>•</span>
                                      <span>{getContentTypeLabel(schedule.content_type)}</span>
                                      {isActiveSchedule(schedule.platform, schedule.content_type) && (
                                        <span className="text-xs">(Aktiv)</span>
                                      )}
                                    </div>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleScheduleSelection(schedule.platform, schedule.content_type);
                                      }}
                                      className="ml-1 p-0.5 rounded-full hover:bg-red-100 hover:text-red-600 transition-all"
                                      title="Sil"
                                    >
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Active Selection Header */}
                          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                            <div className="flex items-center gap-2">
                              <div className="p-1 bg-white rounded-md shadow-sm">
                                {getPlatformIcon(activeSchedule.platform)}
                              </div>
                              <div>
                                <h3 className="text-xs font-medium text-blue-900">
                                  {activeSchedule.platform.charAt(0).toUpperCase() + activeSchedule.platform.slice(1)} - {getContentTypeLabel(activeSchedule.content_type)}
                                </h3>
                                <p className="text-xs text-blue-700">
                                  Aktiv seçim
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Content Section */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {/* Content Section */}
                            <div className="space-y-4">
                              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-3 border-b border-gray-200">
                                  <h3 className="text-xs font-medium text-gray-900">
                                    Məzmun
                                  </h3>
                                </div>
                                <div className="p-3">
                                  <textarea
                                    value={
                                      platformContents[activeSchedule.platform]?.[activeSchedule.content_type]?.content || ""
                                    }
                                    onChange={(e) =>
                                      setPlatformContents((prev) => ({
                                        ...prev,
                                        [activeSchedule.platform]: {
                                          ...prev[activeSchedule.platform],
                                          [activeSchedule.content_type]: {
                                            ...prev[activeSchedule.platform]?.[activeSchedule.content_type],
                                            content: e.target.value,
                                          },
                                        },
                                      }))
                                    }
                                    placeholder={`${activeSchedule.platform} ${activeSchedule.content_type} məzmunu yazın...`}
                                    className="w-full h-24 p-2 text-xs border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                                  />
                                </div>
                              </div>

                              {/* Schedule Date Section */}
                              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-3 border-b border-gray-200">
                                  <h3 className="text-xs font-medium text-gray-900">
                                    Təhvil Tarixi
                                  </h3>
                                </div>
                                <div className="p-3">
                                  <NewDateTimePicker
                                    id={`${activeSchedule.platform}-${activeSchedule.content_type}-schedule-date`}
                                    value={
                                      platformContents[activeSchedule.platform]?.[activeSchedule.content_type]?.schedule_date || 
                                      activeSchedule.scheduled_date ||
                                      new Date().toISOString()
                                    }
                                    onChange={(value) =>
                                      setPlatformContents((prev) => ({
                                        ...prev,
                                        [activeSchedule.platform]: {
                                          ...prev[activeSchedule.platform],
                                          [activeSchedule.content_type]: {
                                            ...prev[activeSchedule.platform]?.[activeSchedule.content_type],
                                            schedule_date: value,
                                          },
                                        },
                                      }))
                                    }
                                    label=""
                                    className="w-full"
                                  />
                                </div>
                              </div>

                              {/* Platform Specific Fields */}
                              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-3 border-b border-gray-200">
                                  <h3 className="text-xs font-medium text-gray-900">
                                    Əlavə Seçimlər
                                  </h3>
                                </div>
                                <div className="p-3 space-y-3">
                                  {renderPlatformSpecificFields(
                                    activeSchedule.platform,
                                    activeSchedule.content_type,
                                    platformContents[activeSchedule.platform]?.[activeSchedule.content_type] || {
                                      content: "",
                                      medias: [],
                                    },
                                    (newContent) => {
                                      setPlatformContents((prev) => ({
                                        ...prev,
                                        [activeSchedule.platform]: {
                                          ...prev[activeSchedule.platform],
                                          [activeSchedule.content_type]: newContent,
                                        },
                                      }));
                                    }
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Media Section */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                              <div className="p-3 border-b border-gray-200">
                                <h3 className="text-xs font-medium text-gray-900">
                                  Media
                                </h3>
                              </div>
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
                              Sol tərəfdən bir platform və content type seçin
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalFooter className="border-t border-gray-100 bg-gray-50/50">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
                onClick={onOpenChange}
              >
                Ləğv Et
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saxlanılır...
                  </div>
                ) : (
                  "Yadda Saxla"
                )}
              </button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AddOptionModal
        isOpen={addOptionModalOpen}
        onClose={() => setAddOptionModalOpen(false)}
        type={addOptionType}
        onAdd={handleAddOption}
      />

      <ImageCropModal
        isOpen={imageCropModalOpen}
        onClose={() => {
          setImageCropModalOpen(false);
          setRemainingFiles([]);
        }}
        image={selectedImage!}
        onCrop={handleCropComplete}
        aspectRatio={cropAspectRatio}
      />

      <VideoCropModal
        isOpen={videoCropModalOpen}
        onClose={() => {
          setVideoCropModalOpen(false);
          setRemainingFiles([]);
        }}
        video={selectedVideo!}
        onCrop={handleVideoCropComplete}
      />
    </>
  );
};

export default EditReservePostModal;
