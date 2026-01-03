"use client";

import { SubtaskKey, getSubtasksByCategory, Subtask, TaskCategoryKey, TASK_CATEGORIES, TaskSubcategoryKey } from "@/types/task_helper.type";
import { useState, useEffect } from "react";
import { FaChevronDown, FaCheck, FaInstagram, FaFacebookF, FaTiktok, FaYoutube, FaGlobe } from "react-icons/fa";
import Modal from "@/components/ui/modal/Modal";

interface SubtaskTypeSelectProps {
  value: { type: SubtaskKey }[];
  onChange: (types: { type: SubtaskKey }[]) => void;
  placeholder?: string;
  error?: string;
  isSocialMediaTask?: boolean;
  selectedContentTypes?: Record<string, { isSelected: boolean }>;
  allSelectedTaskTypes?: { type: SubtaskKey }[];
}

const PLATFORM_ICONS = {
  instagram: FaInstagram,
  facebook: FaFacebookF,
  tiktok: FaTiktok,
  youtube: FaYoutube,
  general: FaGlobe,
};

const SOCIAL_MEDIA_SUBTASKS = {
    general: [
        // Post Tasks
        { key: "social_media_post_writing" as SubtaskKey, label: "Sosial Media Post Yazma", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
        { key: "social_media_post_hashtag" as SubtaskKey, label: "Sosial Media Post Hashtag", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
        { key: "social_media_post_topic" as SubtaskKey, label: "Sosial Media Post Mövzu", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
         
        // Image Tasks
        { key: "social_media_image_creation" as SubtaskKey, label: "Sosial Media Şəkil Yaratma", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
      
        // Video Tasks
        { key: "social_media_video_creation" as SubtaskKey, label: "Sosial Media Video Yaratma", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
  
        // Audio Tasks
        { key: "social_media_audio_creation" as SubtaskKey, label: "Sosial Media Audio Yaratma", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
             // Carousel Tasks
        { key: "social_media_carousel_creation" as SubtaskKey, label: "Sosial Media Carousel Yaratma", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
      ],
  instagram: [
    { key: "instagram_post_caption" as SubtaskKey, label: "Instagram Post Başlıq", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
    { key: "instagram_post_hashtag" as SubtaskKey, label: "Instagram Post Hashtag", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
    { key: "instagram_post_media" as SubtaskKey, label: "Instagram Post Media", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
    { key: "instagram_story_content" as SubtaskKey, label: "Instagram Story Məzmun", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
    { key: "instagram_story_media" as SubtaskKey, label: "Instagram Story Media", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
    { key: "instagram_reel_script" as SubtaskKey, label: "Instagram Reel Ssenari", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
    { key: "instagram_reel_editing" as SubtaskKey, label: "Instagram Reel Montaj", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
    { key: "instagram_carousel_content" as SubtaskKey, label: "Instagram Carousel Məzmun", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
    { key: "instagram_carousel_media" as SubtaskKey, label: "Instagram Carousel Media", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
  ],
  facebook: [
    { key: "facebook_post_content" as SubtaskKey, label: "Facebook Post Məzmun", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
    { key: "facebook_post_media" as SubtaskKey, label: "Facebook Post Media", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
    { key: "facebook_story_content" as SubtaskKey, label: "Facebook Story Məzmun", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
    { key: "facebook_story_media" as SubtaskKey, label: "Facebook Story Media", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
    { key: "facebook_video_script" as SubtaskKey, label: "Facebook Video Ssenari", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
    { key: "facebook_video_editing" as SubtaskKey, label: "Facebook Video Montaj", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
  ],
  tiktok: [
    { key: "tiktok_script_writing" as SubtaskKey, label: "TikTok Ssenari Yazma", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
    { key: "tiktok_video_editing" as SubtaskKey, label: "TikTok Video Montaj", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
    { key: "tiktok_music_selection" as SubtaskKey, label: "TikTok Musiqi Seçimi", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
    { key: "tiktok_hashtag_research" as SubtaskKey, label: "TikTok Hashtag", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
  ],
  youtube: [
    { key: "youtube_script_writing" as SubtaskKey, label: "YouTube Ssenari Yazma", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
    { key: "youtube_video_editing" as SubtaskKey, label: "YouTube Video Montaj", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
    { key: "youtube_thumbnail_creation" as SubtaskKey, label: "YouTube Thumbnail", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
    { key: "youtube_description_writing" as SubtaskKey, label: "YouTube Təsvir", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
    { key: "youtube_tags_research" as SubtaskKey, label: "YouTube Etiket", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
    { key: "youtube_short_creation" as SubtaskKey, label: "YouTube Shorts", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
    { key: "youtube_collaboration_management" as SubtaskKey, label: "YouTube Əməkdaşlıq", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
    { key: "youtube_content_review" as SubtaskKey, label: "YouTube Məzmun", subcategoryKey: "social_media_post" as TaskSubcategoryKey, categoryKey: "social_media" as TaskCategoryKey },
  ],
 
};

const SubtaskTypeSelect: React.FC<SubtaskTypeSelectProps> = ({
  value,
  onChange,
  placeholder = "Seçin",
  error,
  isSocialMediaTask = false,
  selectedContentTypes = {},
  allSelectedTaskTypes = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TaskCategoryKey>(TASK_CATEGORIES[0].key);

  // Check if any general tasks are selected
  const hasGeneralTask = value.some(task => 
    Object.values(SOCIAL_MEDIA_SUBTASKS.general).some(generalTask => generalTask.key === task.type)
  );

  // Check if any platform-specific tasks are selected
  const hasPlatformTask = value.some(task => 
    Object.entries(SOCIAL_MEDIA_SUBTASKS).some(([platform, tasks]) => 
      platform !== 'general' && tasks.some(platformTask => platformTask.key === task.type)
    )
  );

  // Determine if a task should be disabled
  const isTaskDisabled = (taskKey: SubtaskKey) => {
    // First check if it's a general task
    const isGeneralTask = SOCIAL_MEDIA_SUBTASKS.general.some(task => task.key === taskKey);
    
    // If general task is selected, disable platform-specific tasks
    if (hasGeneralTask && !isGeneralTask) {
      return true;
    }

    // If platform task is selected, disable general tasks
    if (hasPlatformTask && isGeneralTask) {
      return true;
    }

    // Check if this task type is already selected in another subtask
    const isSelectedInOtherSubtasks = allSelectedTaskTypes.some(
      task => task.type === taskKey && !value.some(v => v.type === taskKey)
    );
    if (isSelectedInOtherSubtasks) {
      return true;
    }

    // For social media tasks, check if the specific content type is selected
    if (isSocialMediaTask && !isGeneralTask) {
      const taskPlatform = Object.entries(SOCIAL_MEDIA_SUBTASKS).find(([_, tasks]) => 
        tasks.some(task => task.key === taskKey)
      )?.[0];

      if (taskPlatform && taskPlatform !== 'general') {
        // Get the content type for this task
        const taskContentType = taskKey.includes('story') ? 'story' :
                              taskKey.includes('post') ? 'post' :
                              taskKey.includes('video') ? 'video' :
                              taskKey.includes('reel') ? 'reel' :
                              taskKey.includes('carousel') ? 'carousel' : null;

        if (taskContentType) {
          // Check if this specific content type is selected for the platform
          const hasSelectedContent = Object.entries(selectedContentTypes).some(([key, value]) => {
            const [platform, contentType] = key.split('-');
            return platform === taskPlatform && 
                   contentType === taskContentType && 
                   value.isSelected;
          });

          // If this content type is not selected for the platform, disable the task
          return !hasSelectedContent;
        }
      }
    }

    return false;
  };

  useEffect(() => {
    if (isOpen) {
      if (isSocialMediaTask) {
        // Set first social media platform as default
        setSelectedCategory(Object.keys(SOCIAL_MEDIA_SUBTASKS)[0] as TaskCategoryKey);
      } else if (!selectedCategory) {
        setSelectedCategory(TASK_CATEGORIES[0].key);
      }
    }
  }, [isOpen, isSocialMediaTask]);

  const handleSelect = (subtask: Subtask) => {
    // Don't allow selection if task is disabled
    if (isTaskDisabled(subtask.key)) {
      return;
    }

    const newTypes = [...value];
    const existingIndex = newTypes.findIndex(t => t.type === subtask.key);
    
    if (existingIndex >= 0) {
      newTypes.splice(existingIndex, 1);
    } else {
      newTypes.push({ type: subtask.key });
    }
    
    onChange(newTypes);
  };

  const getSelectedLabels = () => {
    if (value.length === 0) return placeholder;
    return value.map(v => {
      const subtask = TASK_CATEGORIES.flatMap(category => 
        getSubtasksByCategory(category.key)
      ).find(s => s.key === v.type);
      return subtask?.label || v.type;
    }).join(", ");
  };

  const getSubtasksForCategory = (categoryKey: TaskCategoryKey) => {
    if (isSocialMediaTask) {
      // For social media tasks, use the category key directly as it's now the platform name
      return SOCIAL_MEDIA_SUBTASKS[categoryKey as keyof typeof SOCIAL_MEDIA_SUBTASKS] || [];
    }
    return getSubtasksByCategory(categoryKey);
  };

  const getPlatformIcon = (categoryKey: string) => {
    const Icon = PLATFORM_ICONS[categoryKey as keyof typeof PLATFORM_ICONS];
    return Icon ? <Icon className="w-4 h-4" /> : null;
  };

  return (
    <div className="relative">
      <div
        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
          error 
            ? "border-red-500 bg-red-50" 
            : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/50"
        }`}
        onClick={() => setIsOpen(true)}
      >
        <span className={`text-sm ${value.length === 0 ? "text-gray-400" : "text-gray-700"}`}>
          {getSelectedLabels()}
        </span>
        <FaChevronDown className="text-gray-400" />
      </div>

      <Modal
        isOpen={isOpen}
        onOpenChange={() => setIsOpen(false)}
        size="lg"
        placement="center"
        isDismissable={true}
      >
        <div className="p-6" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {isSocialMediaTask ? "Sosial Media Alt Task Növləri" : "Alt Task Növləri"}
          </h3>
          
          {/* Category Tabs */}
          <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {isSocialMediaTask ? (
              // Show only social media platforms
              Object.entries(SOCIAL_MEDIA_SUBTASKS).map(([platform, subtasks]) => (
                <button
                  type="button"
                  key={platform}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(platform as TaskCategoryKey);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === platform
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {getPlatformIcon(platform)}
                  <span className="capitalize">{platform}</span>
                </button>
              ))
            ) : (
              // Show all categories
              TASK_CATEGORIES.map((category) => (
                <button
                  type="button"
                  key={category.key}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory(category.key);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === category.key
                      ? "bg-blue-100 text-blue-700 shadow-sm"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {getPlatformIcon(category.key)}
                  <span>{category.label}</span>
                </button>
              ))
            )}
          </div>

          {/* Subtasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
            {getSubtasksForCategory(selectedCategory).map((subtask) => {
              const isSelected = value.some(t => t.type === subtask.key);
              const isDisabled = isTaskDisabled(subtask.key);
              return (
                <div
                  key={subtask.key}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isDisabled) {
                      handleSelect(subtask);
                    }
                  }}
                  className={`flex items-center space-x-3 p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? "bg-blue-50 border border-blue-100" 
                      : isDisabled
                        ? "bg-gray-50 border border-gray-100 cursor-not-allowed opacity-50"
                        : "hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  <div className={`flex items-center justify-center w-5 h-5 rounded border transition-all duration-200 ${
                    isSelected 
                      ? "bg-blue-500 border-blue-500" 
                      : isDisabled
                        ? "border-gray-200"
                        : "border-gray-300"
                  }`}>
                    {isSelected && <FaCheck className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1">
                    <span className={`text-sm font-medium ${
                      isSelected ? "text-blue-700" : isDisabled ? "text-gray-400" : "text-gray-700"
                    }`}>
                      {subtask.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Count and Actions */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {value.length} seçim
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Təsdiqlə
            </button>
          </div>
        </div>
      </Modal>

      {error && (
        <p className="mt-2 text-sm text-red-500 flex items-center">
          <span className="mr-1">•</span>
          {error}
        </p>
      )}
    </div>
  );
};

export default SubtaskTypeSelect; 