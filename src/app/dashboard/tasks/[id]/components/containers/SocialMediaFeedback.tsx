import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Task, TaskStatus } from "@/types/task.type";
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
import useTaskItemStore from "@/store/taskItemStore";
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
  instagram: PlatformContentFeatures;
  facebook: PlatformContentFeatures;
  tiktok: PlatformContentFeatures;
  youtube: PlatformContentFeatures;
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
      coverImage: true,
      duration: true,
    },
    carousel: {
      hashtags: true,
      mentions: true,
      location: true,
      caption: true,
      slides: true,
      firstComment: true,
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
    carousel: {
      hashtags: true,
      mentions: true,
      location: true,
      link: true,
      slides: true,
    },
  },
  tiktok: {
    post: {
      hashtags: true,
      mentions: true,
      music: true,
      effects: true,
      coverImage: true,
    },
    story: {
      hashtags: true,
      mentions: true,
      music: true,
      effects: true,
    },
    video: {
      hashtags: true,
      mentions: true,
      music: true,
      effects: true,
      coverImage: true,
      duration: true,
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
      category: true,
      thumbnail: true,
      duration: true,
      aspectRatio: true,
    },
  },
};

const defaultContentData: Record<
  SocialMediaPlatform,
  Record<ContentType, ContentData>
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
    },
    story: {
      content: "",
      medias: [],
      hashtags: [],
      mentions: [],
      location: "",
      link: "",
    },
    reels: {
      content: "",
      medias: [],
      hashtags: [],
      mentions: [],
      music: "",
      effects: "",
      coverImage: undefined,
      duration: 60,
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
    },
    video: {
      content: "",
      medias: [],
      hashtags: [],
      mentions: [],
      location: "",
      caption: "",
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
    },
    story: {
      content: "",
      medias: [],
      hashtags: [],
      mentions: [],
      location: "",
      link: "",
    },
    video: {
      content: "",
      medias: [],
      hashtags: [],
      mentions: [],
      title: "",
      description: "",
      thumbnail: undefined,
    },
    carousel: {
      content: "",
      medias: [],
      hashtags: [],
      mentions: [],
      location: "",
      link: "",
      slides: 2,
    },
    reels: {
      content: "",
      medias: [],
      hashtags: [],
      mentions: [],
      music: "",
      effects: "",
      coverImage: undefined,
      duration: 60,
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
    },
  },
  tiktok: {
    post: {
      content: "",
      medias: [],
      hashtags: [],
      mentions: [],
      music: "",
      effects: "",
      coverImage: undefined,
    },
    story: {
      content: "",
      medias: [],
      hashtags: [],
      mentions: [],
      music: "",
      effects: "",
    },
    video: {
      content: "",
      medias: [],
      hashtags: [],
      mentions: [],
      music: "",
      effects: "",
      coverImage: undefined,
      duration: 60,
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
    },
    reels: {
      content: "",
      medias: [],
      hashtags: [],
      mentions: [],
      music: "",
      effects: "",
      coverImage: undefined,
      duration: 60,
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
      duration: 0,
    },
    short: {
      content: "",
      medias: [],
      title: "",
      description: "",
      tags: [],
      category: "",
      thumbnail: undefined,
      duration: 60,
      aspectRatio: "9:16",
    },
    post: {
      content: "",
      medias: [],
      hashtags: [],
      mentions: [],
      location: "",
      caption: "",
      firstComment: "",
    },
    story: {
      content: "",
      medias: [],
      hashtags: [],
      mentions: [],
      location: "",
      link: "",
    },
    reels: {
      content: "",
      medias: [],
      hashtags: [],
      mentions: [],
      music: "",
      effects: "",
      coverImage: undefined,
      duration: 60,
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
    },
  },
};

interface Props {
  isEditing: boolean;
  platformContents: Record<
    SocialMediaPlatform,
    Record<ContentType, ContentData>
  >;
  setPlatformContents: React.Dispatch<
    React.SetStateAction<
      Record<SocialMediaPlatform, Record<ContentType, ContentData>>
    >
  >;
  jointContent: ContentData;
  setJointContent: React.Dispatch<React.SetStateAction<ContentData>>;
  isJointPost: boolean;
  setIsJointPost: (jointPost: boolean) => void;
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

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onPreview();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative aspect-square rounded-xl overflow-hidden bg-gray-100 group transition-all duration-200 ${
        isDragging ? "shadow-2xl scale-105 rotate-2 opacity-80" : "hover:shadow-lg"
      }`}
    >
      {/* Media content - preview için clickable */}
      <div
        onClick={handlePreview}
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

      {/* Overlay with controls */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
        {/* Drag handle - centered */}
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

        {/* Delete button - top right */}
      <button
        onClick={handleDelete}
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

        {/* File type indicator - bottom left */}
        <div className="absolute bottom-2 left-2 px-2 py-1 bg-white bg-opacity-90 text-gray-800 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-200 z-30">
          {file.type.startsWith("image/") ? "Image" : "Video"}
        </div>
      </div>
    </div>
  );
};

const validateContent = (
  content: ContentData,
  contentType: ContentType,
  platform: SocialMediaPlatform
): ValidationError[] => {
  const errors: ValidationError[] = [];
  const features = platformSpecificFeatures[platform]?.[contentType];

  // Content validation
  if (!content.content.trim()) {
    errors.push({
      field: "content",
      message: "Content is required",
    });
  }

  // Media validation
  if (content.medias.length === 0) {
    errors.push({
      field: "medias",
      message: "At least one media file is required",
    });
  }

  // Platform specific validations
  if (features) {
    if (features.hashtags && content.hashtags?.length === 0) {
      errors.push({
        field: "hashtags",
        message: "At least one hashtag is required",
      });
    }

    if (features.mentions && content.mentions?.length === 0) {
      errors.push({
        field: "mentions",
        message: "At least one mention is required",
      });
    }

    if (features.location && !content.location) {
      errors.push({
        field: "location",
        message: "Location is required",
      });
    }

    if (features.link && !content.link) {
      errors.push({
        field: "link",
        message: "Link is required",
      });
    }

    if (features.altText && !content.altText) {
      errors.push({
        field: "altText",
        message: "Alt text is required",
      });
    }

    if (features.caption && !content.caption) {
      errors.push({
        field: "caption",
        message: "Caption is required",
      });
    }

    if (features.title && !content.title) {
      errors.push({
        field: "title",
        message: "Title is required",
      });
    }

    if (features.description && !content.description) {
      errors.push({
        field: "description",
        message: "Description is required",
      });
    }

    if (features.tags && content.tags?.length === 0) {
      errors.push({
        field: "tags",
        message: "At least one tag is required",
      });
    }

    if (features.category && !content.category) {
      errors.push({
        field: "category",
        message: "Category is required",
      });
    }

    if (features.coverImage && !content.coverImage) {
      errors.push({
        field: "coverImage",
        message: "Cover image is required",
      });
    }

    if (features.thumbnail && !content.thumbnail) {
      errors.push({
        field: "thumbnail",
        message: "Thumbnail is required",
      });
    }

    if (features.duration && !content.duration) {
      errors.push({
        field: "duration",
        message: "Duration is required",
      });
    }

    if (features.aspectRatio && !content.aspectRatio) {
      errors.push({
        field: "aspectRatio",
        message: "Aspect ratio is required",
      });
    }

    if (features.slides && !content.slides) {
      errors.push({
        field: "slides",
        message: "Number of slides is required",
      });
    }

    if (features.firstComment && !content.firstComment) {
      errors.push({
        field: "firstComment",
        message: "First comment is required",
      });
    }
  }

  return errors;
};

export const SocialMediaFeedback: React.FC<Props> = ({
  isEditing,
  platformContents,
  setPlatformContents,
  jointContent,
  setJointContent,
  isJointPost,
  setIsJointPost,
}) => {
  const { task, currentStatus } = useTaskItemStore();
  const [dropIndicator, setDropIndicator] = useState<{ left: number; top: number; width: number } | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, ValidationError[]>>({});

  const initialSelectedSchedule = useMemo(() => {
    if (!task?.is_social_media_task || !task.post?.platform_schedules?.length) {
      return null;
    }
    const firstSchedule = task.post.platform_schedules[0];
    return {
      platform: firstSchedule.platform,
      content_type: firstSchedule.content_type,
      scheduled_date: firstSchedule.scheduled_date,
    };
  }, [task?.is_social_media_task, task?.post?.platform_schedules]);

  const [selectedSchedule, setSelectedSchedule] =
    useState<PlatformSchedule | null>(initialSelectedSchedule);

  const canModifyFiles = [
    "in_progress",
    "must_be_done",
    "must_be_done_again",
  ].includes(currentStatus?.key || "");

  const handlePlatformContentChange = useCallback(
    (
      platform: SocialMediaPlatform,
      contentType: ContentType,
      content: ContentData | string
    ) => {
      setPlatformContents((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          [contentType]: {
            ...prev[platform]?.[contentType],
            ...(typeof content === "string" ? { content } : content),
          },
        },
      }));
    },
    []
  );

  const handlePlatformMediaChange = useCallback(
    (
      platform: SocialMediaPlatform,
      contentType: ContentType,
      medias: File[]
    ) => {
      setPlatformContents((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          [contentType]: {
            ...prev[platform]?.[contentType],
            medias,
          },
        },
      }));
    },
    []
  );

  const handleJointMediaChange = useCallback((medias: File[]) => {
    setJointContent((prev) => ({ ...prev, medias }));
  }, []);

  const handleScheduleSelect = useCallback(
    (platform: SocialMediaPlatform, contentType: ContentType) => {
      setSelectedSchedule({
        platform,
        content_type: contentType,
        scheduled_date: new Date().toISOString(),
      });

      // Seçilen platform ve içerik türü için varsayılan değerleri ayarla
      setPlatformContents((prev) => {
        const existingContent = prev[platform]?.[contentType];
        const defaultContent = defaultContentData[platform][contentType];

        return {
          ...prev,
          [platform]: {
            ...prev[platform],
            [contentType]: {
              ...defaultContent,
              ...existingContent, // Mevcut içeriği koru
              medias: existingContent?.medias || [], // Medya dosyalarını koru
            },
          },
        };
      });
    },
    []
  );

  const handleJointPostChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsJointPost(e.target.checked);
    },
    [setIsJointPost]
  );

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px hareket ettikten sonra drag başlasın
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
        onChange(arrayMove(medias, oldIndex, newIndex));
      }
    }
  };

  const handleFileSelect = (
    onChange: (medias: File[]) => void,
    currentMedias: File[]
  ) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*,video/*";
    input.onchange = (e) => {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        onChange([...currentMedias, ...files]);
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
                    onClick={() => {
                      const newTags = [...(content.hashtags || [])];
                      newTags.splice(index, 1);
                      onChange({ ...content, hashtags: newTags });
                    }}
                    className="text-blue-400 hover:text-blue-600"
                  >
                    ×
                  </button>
                </div>
              ))}
              <input
                type="text"
                placeholder="Add hashtag..."
                className="text-sm border-none focus:ring-0 p-0"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    const newTag = e.currentTarget.value
                      .replace("#", "")
                      .trim();
                    if (newTag) {
                      onChange({
                        ...content,
                        hashtags: [...(content.hashtags || []), newTag],
                      });
                      e.currentTarget.value = "";
                    }
                  }
                }}
              />
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
                    onClick={() => {
                      const newMentions = [...(content.mentions || [])];
                      newMentions.splice(index, 1);
                      onChange({ ...content, mentions: newMentions });
                    }}
                    className="text-purple-400 hover:text-purple-600"
                  >
                    ×
                  </button>
                </div>
              ))}
              <input
                type="text"
                placeholder="Add mention..."
                className="text-sm border-none focus:ring-0 p-0"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    const newMention = e.currentTarget.value
                      .replace("@", "")
                      .trim();
                    if (newMention) {
                      onChange({
                        ...content,
                        mentions: [...(content.mentions || []), newMention],
                      });
                      e.currentTarget.value = "";
                    }
                  }
                }}
              />
            </div>
          </div>
        )}

        {features.location && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              value={content.location || ""}
              onChange={(e) =>
                onChange({ ...content, location: e.target.value })
              }
              placeholder="Add location..."
              className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {features.link && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Link
            </label>
            <input
              type="url"
              value={content.link || ""}
              onChange={(e) => onChange({ ...content, link: e.target.value })}
              placeholder="Add link..."
              className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {features.altText && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Alt Text
            </label>
            <textarea
              value={content.altText || ""}
              onChange={(e) =>
                onChange({ ...content, altText: e.target.value })
              }
              placeholder="Add alt text for accessibility..."
              className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>
        )}

        {features.caption && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Caption
            </label>
            <textarea
              value={content.caption || ""}
              onChange={(e) =>
                onChange({ ...content, caption: e.target.value })
              }
              placeholder="Add caption..."
              className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
            />
          </div>
        )}

        {features.music && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Music
            </label>
            <input
              type="text"
              value={content.music || ""}
              onChange={(e) => onChange({ ...content, music: e.target.value })}
              placeholder="Add music..."
              className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {features.effects && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Effects
            </label>
            <input
              type="text"
              value={content.effects || ""}
              onChange={(e) =>
                onChange({ ...content, effects: e.target.value })
              }
              placeholder="Add effects..."
              className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {features.title && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={content.title || ""}
              onChange={(e) => onChange({ ...content, title: e.target.value })}
              placeholder="Add title..."
              className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {features.description && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={content.description || ""}
              onChange={(e) =>
                onChange({ ...content, description: e.target.value })
              }
              placeholder="Add description..."
              className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>
        )}

        {features.tags && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {(content.tags || []).map((tag, index) => (
                <div
                  key={index}
                  className="bg-green-50 text-green-600 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => {
                      const newTags = [...(content.tags || [])];
                      newTags.splice(index, 1);
                      onChange({ ...content, tags: newTags });
                    }}
                    className="text-green-400 hover:text-green-600"
                  >
                    ×
                  </button>
                </div>
              ))}
              <input
                type="text"
                placeholder="Add tag..."
                className="text-sm border-none focus:ring-0 p-0"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value) {
                    const newTag = e.currentTarget.value.trim();
                    if (newTag) {
                      onChange({
                        ...content,
                        tags: [...(content.tags || []), newTag],
                      });
                      e.currentTarget.value = "";
                    }
                  }
                }}
              />
            </div>
          </div>
        )}

        {features.category && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={content.category || ""}
              onChange={(e) =>
                onChange({ ...content, category: e.target.value })
              }
              className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select category...</option>
              <option value="entertainment">Entertainment</option>
              <option value="music">Music</option>
              <option value="gaming">Gaming</option>
              <option value="education">Education</option>
              <option value="sports">Sports</option>
              <option value="technology">Technology</option>
            </select>
          </div>
        )}

        {features.coverImage && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onChange({ ...content, coverImage: file });
                }
              }}
              className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {features.thumbnail && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Thumbnail
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onChange({ ...content, thumbnail: file });
                }
              }}
              className="w-full p-2 text-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {features.duration && (
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Duration (seconds)
            </label>
            <input
              type="number"
              value={content.duration || ""}
              onChange={(e) =>
                onChange({ ...content, duration: parseInt(e.target.value) })
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
              Number of Slides
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={content.slides || ""}
              onChange={(e) =>
                onChange({ ...content, slides: parseInt(e.target.value) })
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

  const renderMediaSection = (
    medias: File[],
    onChange: (medias: File[]) => void
  ) => (
    <div className="mt-2">
      <label className="block text-[12px] font-medium text-gray-700 mb-1">
        Media
      </label>
      <div className="grid grid-cols-3 gap-3 relative">
        {dropIndicator && (
          <div
            className="absolute h-1 bg-blue-500 rounded-full transition-all duration-200 z-50"
            style={{
              left: dropIndicator.left,
              top: dropIndicator.top,
              width: dropIndicator.width,
            }}
          />
        )}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragOver={(event) => {
            const { active, over } = event;
            if (over && active.id !== over.id) {
              const overElement = document.querySelector(`[data-sortable-id="${over.id}"]`);
              if (overElement) {
                const overRect = overElement.getBoundingClientRect();
                setDropIndicator({
                  left: overRect.left,
                  top: overRect.top + overRect.height / 2,
                  width: overRect.width,
                });
              }
            }
          }}
          onDragEnd={(event) => {
            setDropIndicator(null);
            handleDragEnd(event, medias, onChange);
          }}
        >
          <SortableContext
            items={medias.map((_, index) => index)}
            strategy={verticalListSortingStrategy}
          >
            {medias.map((file, index) => (
              <SortableMediaItem
                key={`${file.name}-${index}`}
                file={file}
                index={index}
                onDelete={() => {
                  const newMedias = medias.filter((_, i) => i !== index);
                  onChange(newMedias);
                }}
                onPreview={() => handlePreview(file)}
              />
            ))}
          </SortableContext>
        </DndContext>

        {(canModifyFiles || isEditing) && (
          <button
            type="button"
            onClick={() => handleFileSelect(onChange, medias)}
            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
          >
            <svg
              className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
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
            <span className="mt-2 text-sm text-gray-500 group-hover:text-blue-500 transition-colors duration-200">
              Add Media
            </span>
          </button>
        )}
      </div>

      {previewFile && (
        <MediaPreviewModal
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
          mediaUrl={URL.createObjectURL(previewFile)}
          mediaType={previewFile.type.startsWith("image/") ? "image" : "video"}
          alt={previewFile.name}
        />
      )}
    </div>
  );

  const validateAllContent = useCallback(() => {
    const errors: Record<string, ValidationError[]> = {};

    if (isJointPost) {
      const jointErrors = validateContent(jointContent, "post", "instagram");
      if (jointErrors.length > 0) {
        errors["joint"] = jointErrors;
      }
    } else if (selectedSchedule) {
      const content =
        platformContents[selectedSchedule.platform]?.[
          selectedSchedule.content_type
        ];
      if (content) {
        const platformErrors = validateContent(
          content,
          selectedSchedule.content_type,
          selectedSchedule.platform
        );
        if (platformErrors.length > 0) {
          errors[
            `${selectedSchedule.platform}-${selectedSchedule.content_type}`
          ] = platformErrors;
        }
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [isJointPost, jointContent, selectedSchedule, platformContents]);

  const renderValidationErrors = (errors: ValidationError[]) => (
    <div className="mt-2 space-y-1">
      {errors.map((error, index) => (
        <p key={index} className="text-sm text-red-600">
          {error.message}
        </p>
      ))}
    </div>
  );

  const handleRemoveMedia = (
    platform: SocialMediaPlatform,
    contentType: ContentType,
    index: number
  ) => {
    setPlatformContents((prev) => {
      const newContents = { ...prev };
      const medias = [...newContents[platform][contentType].medias];
      medias.splice(index, 1);
      newContents[platform][contentType] = {
        ...newContents[platform][contentType],
        medias,
      };
      return newContents;
    });
  };

  const handleContentChange = (
    platform: SocialMediaPlatform,
    contentType: ContentType,
    value: string
  ) => {
    setPlatformContents((prev) => ({
      ...prev,
      [platform]: {
        ...prev[platform],
        [contentType]: {
          ...prev[platform][contentType],
          content: value,
        },
      },
    }));
  };

  const handleMediaChange = (
    platform: SocialMediaPlatform,
    contentType: ContentType,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setPlatformContents((prev) => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          [contentType]: {
            ...prev[platform][contentType],
            medias: [...prev[platform][contentType].medias, ...newFiles],
          },
        },
      }));
    }
  };

  const renderMediaPreview = (
    medias: File[],
    platform: SocialMediaPlatform,
    contentType: ContentType
  ) => {
    if (!medias || medias.length === 0) return null;

    return (
      <div className="mt-4 grid grid-cols-2 gap-4">
        {medias.map((media, index) => (
          <div key={index} className="relative group">
            {media.type.startsWith("image/") ? (
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  width={1000}
                  height={1000}
                  src={URL.createObjectURL(media)}
                  alt={`Media ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <button
                    onClick={() =>
                      handleRemoveMedia(platform, contentType, index)
                    }
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ) : media.type.startsWith("video/") ? (
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <video
                  src={URL.createObjectURL(media)}
                  controls
                  className="w-full h-full object-cover"
                />
                {isEditing && (
                  <button
                    onClick={() =>
                      handleRemoveMedia(platform, contentType, index)
                    }
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    );
  };

  const renderContentFields = (
    content: ContentData,
    platform: SocialMediaPlatform,
    contentType: ContentType
  ) => {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          {isEditing ? (
            <textarea
              value={content.content}
              onChange={(e) =>
                handleContentChange(platform, contentType, e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          ) : (
            <div className="w-full px-3 py-2 bg-gray-50 rounded-md">
              {content.content}
            </div>
          )}
        </div>

        {renderMediaPreview(content.medias, platform, contentType)}

        {isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Media
            </label>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(e) => handleMediaChange(platform, contentType, e)}
              className="w-full"
            />
          </div>
        )}

        {renderPlatformSpecificFields(
          platform,
          contentType,
          content,
          (updatedContent) => {
            setPlatformContents((prev) => ({
              ...prev,
              [platform]: {
                ...prev[platform],
                [contentType]: updatedContent,
              },
            }));
          }
        )}
      </div>
    );
  };

  if (!task || !task.is_social_media_task || !task.post) return null;

  const schedules: PlatformSchedule[] = task.post.platform_schedules || [];
  if (schedules.length === 0) return null;

  const platformGroups = schedules.reduce((acc, schedule) => {
    if (!acc[schedule.platform]) {
      acc[schedule.platform] = [];
    }
    acc[schedule.platform].push(schedule.content_type);
    return acc;
  }, {} as Record<SocialMediaPlatform, ContentType[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <h3 className="text-t-black text-[16px] font-medium">
          Sosial Media Təhvili
        </h3>
        {schedules.length > 1 && (
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Birgə Kontent</label>
            <input
              type="checkbox"
              checked={isJointPost}
              onChange={handleJointPostChange}
              disabled={!canModifyFiles && !isEditing}
              className="form-checkbox h-4 w-4 text-blue-600 rounded"
            />
          </div>
        )}
      </div>

      {isJointPost ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-[14px] font-medium text-gray-700 mb-2">
                Birgə Kontent
              </label>
              <textarea
                value={jointContent.content}
                onChange={(e) =>
                  setJointContent((prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                disabled={!canModifyFiles && !isEditing}
                placeholder="Birgə kontent yazın..."
                className={`w-full min-h-[120px] p-3 rounded-lg border ${
                  validationErrors["joint"]?.some((e) => e.field === "content")
                    ? "border-red-500"
                    : "border-gray-200"
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
              />
              {validationErrors["joint"]?.filter((e) => e.field === "content")
                .length > 0 &&
                renderValidationErrors(
                  validationErrors["joint"].filter((e) => e.field === "content")
                )}
            </div>
            {renderMediaSection(jointContent.medias, handleJointMediaChange)}
            {validationErrors["joint"]?.filter((e) => e.field === "medias")
              .length > 0 &&
              renderValidationErrors(
                validationErrors["joint"].filter((e) => e.field === "medias")
              )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="border-b border-gray-100">
            <div className="flex flex-wrap gap-2 p-4">
              {Object.entries(platformGroups).map(
                ([platform, contentTypes]) => (
                  <div key={platform} className="flex-1 min-w-[200px]">
                    <div className="flex items-center space-x-2 mb-2">
                      {getPlatformIcon(platform as SocialMediaPlatform)}
                      <span className="font-medium capitalize text-gray-700">
                        {platform}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {contentTypes.map((contentType) => (
                        <button
                          key={`${platform}-${contentType}`}
                          type="button"
                          onClick={() =>
                            handleScheduleSelect(
                              platform as SocialMediaPlatform,
                              contentType as ContentType
                            )
                          }
                          className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all
                          ${
                            selectedSchedule?.platform === platform &&
                            selectedSchedule?.content_type === contentType
                              ? "bg-blue-50 text-blue-600 ring-1 ring-blue-600"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {getContentTypeLabel(contentType as ContentType)}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
          {selectedSchedule && (
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-[14px] font-medium text-gray-700 mb-2">
                  {getContentTypeLabel(selectedSchedule.content_type)} Kontenti
                </label>
                <textarea
                  value={
                    platformContents[selectedSchedule.platform]?.[
                      selectedSchedule.content_type
                    ]?.content || ""
                  }
                  onChange={(e) =>
                    handlePlatformContentChange(
                      selectedSchedule.platform,
                      selectedSchedule.content_type,
                      e.target.value
                    )
                  }
                  disabled={!canModifyFiles && !isEditing}
                  placeholder={`${selectedSchedule.content_type} üçün kontent yazın...`}
                  className={`w-full min-h-[120px] p-3 rounded-lg border ${
                    validationErrors[
                      `${selectedSchedule.platform}-${selectedSchedule.content_type}`
                    ]?.some((e) => e.field === "content")
                      ? "border-red-500"
                      : "border-gray-200"
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none`}
                />
                {validationErrors[
                  `${selectedSchedule.platform}-${selectedSchedule.content_type}`
                ]?.filter((e) => e.field === "content").length > 0 &&
                  renderValidationErrors(
                    validationErrors[
                      `${selectedSchedule.platform}-${selectedSchedule.content_type}`
                    ].filter((e) => e.field === "content")
                  )}
              </div>
              {renderPlatformSpecificFields(
                selectedSchedule.platform,
                selectedSchedule.content_type,
                platformContents[selectedSchedule.platform]?.[
                  selectedSchedule.content_type
                ] || { content: "", medias: [] },
                (content) =>
                  handlePlatformContentChange(
                    selectedSchedule.platform,
                    selectedSchedule.content_type,
                    content
                  )
              )}
              {renderMediaSection(
                platformContents[selectedSchedule.platform]?.[
                  selectedSchedule.content_type
                ]?.medias || [],
                (medias) =>
                  handlePlatformMediaChange(
                    selectedSchedule.platform,
                    selectedSchedule.content_type,
                    medias
                  )
              )}
              {validationErrors[
                `${selectedSchedule.platform}-${selectedSchedule.content_type}`
              ]?.filter((e) => e.field === "medias").length > 0 &&
                renderValidationErrors(
                  validationErrors[
                    `${selectedSchedule.platform}-${selectedSchedule.content_type}`
                  ].filter((e) => e.field === "medias")
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
