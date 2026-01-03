import Plus from "@/app/dashboard/components/ui/icons/Plus";
import { getPlanningPostListService, updatePlanningBulkService } from "@/services/client/planning.service";
import useProjectStore from "@/store/projectStore";
import useWorkspaceMemberStore from "@/store/workspaceMemberStore";
import {
  EditBulkPlanning,
  EditBulkPlanningPost,
  EditBulkPlanningPostAssigner,
  Planning,
} from "@/types/planning.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui";
import { 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  useDisclosure 
} from "@/components/ui/modal";
import { PlanningPost } from "@/types/planning.type";

import { Select, SelectItem } from "@/components/ui/form";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import SelectProject from "../inputs/SelectProject";
import SelectControler from "../inputs/SelectController";
import { User } from "@/types/auth.type";
import DatePicker from "@/components/ui/form/input/NewDateTimePicker";
import Trash from "../icons/Trash";
import AddPlanningPostUserModal from "./AddPlanningPostUser";
import usePlanningStore from "@/store/planningStore";
import Image from "next/image";
import { KeyLabel } from "@/types/keyLabel.type";
import { ApiError } from "@/types/error.type";
import PostPlatformModal from "./PostPlatformModal";
import { PlatformLocation } from "./PostPlatformModal";
import { 
  SocialMediaPlatform, 
  ContentType, 
  PLATFORM_CONFIGS, 
  CONTENT_TYPE_CONFIGS,
  getPlatformContentTypes
} from "@/types/social-media.type";
import { HiPencil } from "react-icons/hi";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { useAppContext } from "@/providers/AppProvider";
import usePlanningPostStore from "@/store/planningPostStore";
import useWorkspaceStore from "@/store/workspaceStore";
import DateRangePicker from "@/components/ui/form/input/DateRangePicker";
import { formatDateToString } from "@/utils/formateDateTime";

// platformConfigs'i PostPlatformModal'dan kopyala
const platformConfigs: Record<SocialMediaPlatform, { icon: string; locations: { id: ContentType; name: string }[] }> = {
  instagram: {
    icon: "/icons/instagram.svg",
    locations: [
      { id: "post", name: "Post" },
      { id: "story", name: "Story" },
      { id: "reels", name: "Reels" },
      { id: "carousel", name: "Carousel" }
    ]
  },
  facebook: {
    icon: "/icons/facebook.svg",
    locations: [
      { id: "post", name: "Post" },
      { id: "story", name: "Story" },
      { id: "video", name: "Video" }
    ]
  },
  tiktok: {
    icon: "/icons/tiktok.svg",
    locations: [
      { id: "video", name: "Video" },
      { id: "short", name: "Short" }
    ]
  },
  youtube: {
    icon: "/icons/youtube.svg",
    locations: [
      { id: "video", name: "Video" },
      { id: "short", name: "Short" }
    ]
  }
};

const schema = z.object({
  project: z
    .number({
      invalid_type_error: "Geçersiz değer",
    })
    .nonnegative({ message: "Proyekt negatif olamaz" })
    .optional(),

  controller: z.number().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  planning: Planning;
  isOpenProps?: boolean;
  hiddenButton?: boolean;
  onCloseProps?: (data: boolean) => void;
  className?: string;
}

const EditPlanningMultiple: React.FC<Props> = ({ planning, isOpenProps = false, hiddenButton = false, onCloseProps, className }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    errors: postErrors,
    posts,
    validatePosts,
    addPost,
    removePost,
    handleInputChange,
    fetchPlannings,
    setPosts,
    postTypes,
    postStatuses,
    setPostPlatformLocations
  } = usePlanningStore();
  const { projects } = useProjectStore();
  const { workspaceMembers } = useWorkspaceMemberStore();
  const { fetchPlanningPosts } = usePlanningPostStore();
  const {workspace} = useProjectStore()
  const { setIsLoading } = useAppContext();
  const [platformModalOpen, setPlatformModalOpen] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string>(formatDateToString(new Date()))
  const [endDate, setEndDate] = useState<string>(formatDateToString(new Date(new Date().setMonth(new Date().getMonth() + 1))));

  const ALL_PLATFORM_KEYS: SocialMediaPlatform[] = [
    "facebook",
    "instagram",
    "youtube",
    "tiktok"
  ];

  // Helper function to get platform icon based on platform name
  const getPlatformIcon = (platformName: string): string => {
    const platformKey = platformName.toLowerCase();
    const iconMap: Record<string, string> = {
      facebook: '/icons/facebook.svg',
      instagram: '/icons/instagram.svg',
      linkedin: '/icons/linkedin.svg',
      twitter: '/icons/twitter.svg',
      youtube: '/icons/youtube.svg',
      tiktok: '/icons/tiktok.svg'
    };
    return iconMap[platformKey] || '/icons/default.svg';
  };

  // useEffect(()=> {
  //   if (isOpen) {
  //     console.log('aciq')
  //   }
  //   // setPage(1)
 
    
    
  // }, [isOpen])
  
  const loadPosts = async (started?:string , ended?:string) => {
    const planningPosts = await getPlanningPostListService("", 1, 1000, started || startDate, ended || endDate, workspace?.id, planning.id)
    const mappedPosts = planningPosts.data.results.map((post) => {
      // Create locations for each platform
      // If is_publishable is false, show all platforms, not just those in social_accounts
      const isPublishable = typeof post.is_publishable === "boolean" ? post.is_publishable : false;

      const platformsToShow = !isPublishable
        ? ALL_PLATFORM_KEYS
        : planning.social_accounts.map(account => account.platform.toLowerCase() as SocialMediaPlatform);

      const platformLocations = platformsToShow.map((platformKey) => {
        // Find the account for this platform (if any)
        const account = planning.social_accounts.find(
          acc => acc.platform.toLowerCase() === platformKey
        );

        // Find all selected locations for this platform in this post
        const platformIntents = post.platform_intents || [];
        const selectedIntents = platformIntents.filter(
          intent => intent.platform.toLowerCase() === platformKey
        );

        // Get content types for this platform from social-media.type.ts
        const contentTypes = getPlatformContentTypes(platformKey);

        // Build locations array with proper structure
        const locations = contentTypes.map(contentType => {
          const selectedIntent = selectedIntents.find(intent => intent.content_type === contentType);
          return {
            id: contentType,
            name: CONTENT_TYPE_CONFIGS[contentType].displayName,
            selected: selectedIntent !== undefined,
            scheduled_date: selectedIntent?.scheduled_date || null
          };
        });

        return {
          platform: platformKey,
          icon: getPlatformIcon(account?.platform || platformKey),
          locations,
          id: account?.id?.toString() || platformKey,
          name: account?.platform || platformKey,
          selected: locations.some(loc => loc.selected)
        };
      });

      // Map users for this post - convert from PlanningPostAssigner to PostUser
      const postUsers = post.planning_post_assigners
        ?.map(assigner => ({
          assignerId: assigner.id,
          user: assigner.user,
          minute: assigner.time,
          profession: assigner.profession?.id ?? null
        })) || [];

      // Format post date as string if it's a Date object
      const postDate = post.date;
      const formattedDate = postDate || null;

      // Add is_publishable field, defaulting to post.is_publishable or false
      return {
        id: post.id,
        postId: post.id,
        type: post.type?.id?.toString() || '',
        description: post.content || '',
        date: formattedDate,
        status: post.status?.key || '',
        users: postUsers,
        platformLocations,
        is_publishable: typeof post.is_publishable === "boolean" ? post.is_publishable : false,
      };
    });

    // If there are no posts, add a default empty post
    if (mappedPosts.length === 0) {
      const defaultPlatformLocations = planning.social_accounts.map(account => {
        const platformKey = account.platform.toLowerCase() as SocialMediaPlatform;
        const contentTypes = getPlatformContentTypes(platformKey);
        
        return {
          platform: platformKey,
          icon: getPlatformIcon(account.platform),
          locations: contentTypes.map(contentType => ({
            id: contentType,
            name: CONTENT_TYPE_CONFIGS[contentType].displayName,
            selected: false,
            scheduled_date: null
          })),
          id: account.id.toString(),
          name: account.platform,
          selected: false
        };
      });

      mappedPosts.push({
        id: Date.now(), // Temporary ID for new post
        postId: 0, // Default ID for new post
        type: '',
        description: '',
        date: null,
        status: 'todo', // Default status for new post
        users: [],
        platformLocations: defaultPlatformLocations,
        is_publishable: false,
      });
    }

    setPosts(mappedPosts);
  };

  const {
    handleSubmit,
    formState: { errors },
    control,
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      controller: planning.controller?.id,
    },
  });

  const onOpenChange = () => {
    if (isOpen) {
      onClose();
      onCloseProps?.(false);
    } else {
      onOpen();
    }
  };

  useEffect(() => {
    if (isOpenProps) {
      onOpen();
      loadPosts();
    } else {
      onClose();
    }
  }, [isOpenProps]);

  const handlePlatformLocationsSave = (locations: PlatformLocation[]) => {
    if (currentPostId !== null) {
      // Save platform locations and update state
      const updatedLocations = locations.map(location => ({
        ...location,
        locations: location.locations.map(loc => ({
          ...loc,
          selected: loc.selected,
          scheduled_date: loc.selected ? (loc.scheduled_date || null) : null
        }))
      }));
      
      setPostPlatformLocations(currentPostId, updatedLocations);
      
      // Close the modal after saving
      setPlatformModalOpen(false);
      setCurrentPostId(null);
    }
  };

  const getSelectedPlatformIcons = (postId: number) => {
    const post = posts.find(p => p.id === postId);
    if (!post?.platformLocations || post.platformLocations.length === 0) return [];

    return post.platformLocations
      .filter(platform => platform.locations.some(loc => loc.selected))
      .map(platform => platform.icon);
  };

  const handleDateRange = async (startDate: string, endDate: string) => {
    await loadPosts(startDate, endDate)
  };


  const handleConfirm = async (data: FormData) => {
    const isValid = validatePosts();
    if (isValid) {
      try {
        setIsLoading(true);
        const payload: EditBulkPlanning = {
          project: data.project ?? planning.project.id,
          controller: data.controller,
          planning_posts: posts.map((post) => {
            const postPayload: EditBulkPlanningPost = {
              content: post.description || "",
              date: post.date || "",
              type: Number(post.type),
              status: post.status,
              is_publishable: typeof post.is_publishable === "boolean" ? post.is_publishable : false,
              planning_post_assigners: post.users.map((user) => {
                const userPayload: EditBulkPlanningPostAssigner = {
                  user: user.user.id,
                };
                if (user.profession) {
                  userPayload.profession = user.profession;
                }
                if (user.minute) {
                  userPayload.time = user.minute;
                }
                if (user.assignerId !== undefined) {
                  userPayload.id = user.assignerId;
                }
                return userPayload;
              }),
              platform_intents: post.platformLocations?.flatMap((item) => 
                item.locations
                  .filter(loc => loc.selected)
                  .map(loc => ({
                    platform: item.platform as SocialMediaPlatform,
                    content_type: loc.id as ContentType,
                    scheduled_date: loc.scheduled_date
                  }))
              ) || []
            };

            if (post.postId !== undefined) {
              postPayload.id = post.postId;
            }

            return postPayload;
          }),
        };

        await updatePlanningBulkService(planning.id, payload);
        await fetchPlannings();
        await fetchPlanningPosts();
        onOpenChange();
        onCloseProps?.(true);
      } catch (error) {
        const apiErrors = (error as ApiError).data;
        if (apiErrors && typeof apiErrors === "object") {
          Object.keys(apiErrors).forEach((field) => {
            const errorMessage = apiErrors[field]?.[0];
            if (errorMessage) {
              setError(field as keyof FormData, {
                type: "manual",
                message: errorMessage,
              });
            }
          });
        } else {
          setError("root", {
            type: "manual",
            message: "An unexpected error occurred. Please try again.",
          });
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      console.log("Validation errors:", errors);
    }
  };

  const handleAddPost = () => {
    addPost();
    // Scroll to bottom after post is added
    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  // Helper function to get initialSelectedLocations for PostPlatformModal
  const initialSelectedLocations = useMemo(() => {
    if (!currentPostId) return [];
    const currentPost = posts.find(p => p.id === currentPostId);
    if (!currentPost) return [];

    const isPublishable = typeof currentPost.is_publishable === "boolean" ? currentPost.is_publishable : false;

    if (!isPublishable) {
      // Tüm platformlar için doldur
      return ALL_PLATFORM_KEYS.map((platformKey: SocialMediaPlatform) => {
        const existing = currentPost.platformLocations?.find(p => p.platform.toLowerCase() === platformKey);
        if (existing) return existing;

        const config = platformConfigs[platformKey];
        return {
          platform: platformKey,
          icon: config.icon,
          locations: config.locations.map((loc: { id: ContentType; name: string }) => ({
            id: loc.id,
            name: loc.name,
            selected: false,
            scheduled_date: null
          }))
        };
      });
    }
    // Sadece mevcut platformLocations'u döndür
    return currentPost.platformLocations || [];
  }, [currentPostId, posts]);

  return (
    <>
      {!hiddenButton && (
        <button
          onClick={() => {
            clearErrors();
            loadPosts();
            onOpen();
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 ${className || ''}`}
        >
          <HiPencil className="w-4 h-4" />
          <span>Redaktə et</span>
        </button>
      )}
      <Modal
        className="w-[95%] md:w-[90%] lg:min-w-[1300px]"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
      >
        <ModalContent className="py-3 px-3 md:py-4 md:px-4 bg-white rounded-xl shadow-xl">
          <form
            className="flex flex-col"
            onSubmit={handleSubmit(handleConfirm)}
          >
            <ModalHeader className="p-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-lg md:text-xl text-gray-900">
                  Redaktə edin
                </span>
                
              </div>
            </ModalHeader>
            <ModalBody className="p-0 mt-4 md:pr-4">
              <div className="flex w-full flex-col">
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col gap-4">
                    {errors.root && (
                      <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-red-500 text-sm">
                          {errors.root.message}
                        </p>
                      </div>
                    )}
                    {/* Planning Select */}
                    <div className="bg-gray-50/50 p-4 rounded-xl">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <div className="mb-2 text-sm font-medium text-gray-700">Proyekt seçin</div>
                          <Controller
                            name="project"
                            control={control}
                            render={({ field }) => (
                              <SelectProject
                                placeholder="Seç"
                                onSelect={(e) => field.onChange(e?.id)}
                                options={projects}
                                defaultValue={planning.project}
                                aria-label="Müştəri seç"
                              />
                            )}
                          />
                          {errors.project && (
                            <p className="mt-1.5 text-red-500 text-sm">
                              {errors.project.message}
                            </p>
                          )}
                        </div>
                        <div>
                          <div className="mb-2 text-sm font-medium text-gray-700">Nəzarətçi seçin</div>
                          <Controller
                            name="controller"
                            control={control}
                            render={({ field }) => (
                              <SelectControler
                                onSelect={(e) => field.onChange(e?.id)}
                                defaultValue={planning.controller}
                                options={
                                  workspaceMembers
                                    .map((member) => member.user)
                                    .filter(
                                      (user): user is User =>
                                        user !== null && user !== undefined
                                    )
                                }
                                placeholder="Seç"
                              />
                            )}
                          />
                          {errors.controller && (
                            <p className="mt-1.5 text-red-500 text-sm">
                              {errors.controller.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base md:text-lg font-semibold text-gray-900">
                      Postlar
                    </h2>
                    <DateRangePicker className="py-2 pr-10" placeholder="Tarix aralığı seçin" startDate={startDate} endDate={endDate} onChange={(startDate, endDate) => {
                      setStartDate(startDate);
                      setEndDate(endDate);
                      handleDateRange(startDate, endDate);
                    }} />
                  </div>
                  <div ref={scrollContainerRef} className="w-full overflow-x-auto overflow-y-auto max-h-[300px]">
                    <div className="min-w-[900px]">
                      <div className="flex pb-2 mb-2">
                        <div className="flex-[1.1] pr-2 text-sm font-medium text-gray-500">Növü</div>
                        <div className="flex-[1.5] px-2 text-sm font-medium text-gray-500">Açıqlama</div>
                        <div className="flex-[1.2] px-2 text-sm font-medium text-gray-500">Tarixi</div>
                        <div className="flex-[0.8] px-2 text-sm font-medium text-gray-500">Status</div>
                        <div className="flex-[1] px-2 text-sm font-medium text-gray-500">Üzvlər</div>
                        <div className="flex-[1.5] px-2 text-sm font-medium text-gray-500">Paylaşım yerləri</div>
                        <div className="flex-[0.5] px-2 text-sm font-medium text-gray-500 text-center">Yayımlansın</div>
                        <div className="w-10 px-2"></div>
                      </div>

                      <div className="space-y-1">
                        {posts.map((post) => (
                          <div className="flex items-center bg-gray-50/50 rounded-lg p-1.5 hover:bg-gray-50 transition-colors" key={post.id}>
                            <div className="flex-[1.1] pr-2">
                              <Select
                                placeholder="Post növü seçin"
                                aria-label="Post növü seçin"
                                className="min-w-[120px] h-8 rounded-lg"
                                value={post.type}
                                resetable={false}
                                valueClassName="max-w-[100px]"
                                onValueChange={(e) =>
                                  handleInputChange(post.id, "type", String(e))
                                }
                              >
                                {postTypes.map((item) => (
                                  <SelectItem
                                    key={item.id}
                                    value={String(item.id)}
                                  >
                                    {item.title}
                                  </SelectItem>
                                ))}
                              </Select>
                              {postErrors[post.id]?.type && (
                                <p className="mt-0.5 text-red-500 text-sm">
                                  {postErrors[post.id].type}
                                </p>
                              )}
                            </div>
                            <div className="flex-[1.5] px-2">
                              <input
                                placeholder="Açıqlama daxil edin"
                                className="w-full p-2 rounded-lg h-8 bg-white border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                aria-label="Açıqlama"
                                value={post.description}
                                onChange={(e) =>
                                  handleInputChange(
                                    post.id,
                                    "description",
                                    e.target.value
                                  )
                                }
                                onKeyDown={e => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                  }
                                }}
                              />
                              {postErrors[post.id]?.description && (
                                <p className="mt-0.5 text-red-500 text-sm">
                                  {postErrors[post.id].description}
                                </p>
                              )}
                            </div>
                            <div className="flex-[1.2] px-2">
                              <DatePicker
                                id={`date_${post.id}`}
                                triggerClassName="h-8"
                                value={post.date || ""}
                                onChange={(date) =>
                                  handleInputChange(post.id, "date", date)
                                }
                                disableDatePrevious={new Date()}
                              />
                              {postErrors[post.id]?.date && (
                                <p className="mt-0.5 text-red-500 text-sm">
                                  {postErrors[post.id].date}
                                </p>
                              )}
                            </div>
                            <div className="flex-[0.8] px-2">
                              <Select
                                placeholder="Status seçin"
                                aria-label="Status seçin"
                                className="min-w-[100px] h-8 rounded-lg"
                                value={post.status}
                                onValueChange={(e) =>
                                  handleInputChange(post.id, "status", String(e))
                                }
                                resetable={false}
                              >
                                {postStatuses.map((item) => (
                                  <SelectItem
                                    key={item.key}
                                    value={String(item.key)}
                                  >
                                    {item.label}
                                  </SelectItem>
                                ))}
                              </Select>
                              {postErrors[post.id]?.type && (
                                <p className="mt-0.5 text-red-500 text-sm">
                                  {postErrors[post.id].status}
                                </p>
                              )}
                            </div>
                            <div className="flex-[1] px-2 flex items-center h-8">
                              <div className="flex items-center gap-1.5">
                                {post.users.length > 0 &&
                                  post.users.map(
                                    (item, index) =>
                                      index < 2 && (
                                        <Image
                                          key={index}
                                          src={
                                            item.user.user_profile.image ||
                                            "/grid.png"
                                          }
                                          alt={item.user.full_name}
                                          width={300}
                                          height={300}
                                          className="h-6 w-6 rounded-full ring-2 ring-white"
                                        />
                                      )
                                  )}
                                {post.users.length > 2 && (
                                  <span className="text-sm text-gray-500">
                                    +{post.users.length - 2}
                                  </span>
                                )}
                                <AddPlanningPostUserModal post={post} />
                              </div>
                            </div>
                            <div className="flex-[1.5] px-2 flex items-center h-8">
                              <button
                                type="button"
                                className="text-primary text-sm hover:text-primary-dark flex items-center gap-1.5 transition-colors"
                                onClick={() => {
                                  setCurrentPostId(post.id);
                                  setPlatformModalOpen(true);
                                }}
                              >
                                {getSelectedPlatformIcons(post.id).length > 0 ? (
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5">
                                      {getSelectedPlatformIcons(post.id).map((icon, index) => (
                                        <div key={index} className="w-5 h-5 rounded-md bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                                          <Image
                                            src={icon}
                                            alt="Platform"
                                            width={14}
                                            height={14}
                                            className="rounded"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-50/50 hover:bg-gray-100 transition-colors duration-200">
                                      <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                      <span className="text-xs font-medium text-gray-500">Düzəliş et</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-gray-50/50 hover:bg-gray-50 transition-colors duration-200">
                                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                    <span className="text-xs font-medium text-gray-500">Platform əlavə et</span>
                                  </div>
                                )}
                              </button>
                            </div>
                            {/* is_publishable field */}
                            <div className="flex-[0.5] px-2 flex items-center h-8 justify-center">
                              <ToggleSwitch
                                checked={post.is_publishable}
                                onCheckedChange={checked => handleInputChange(post.id, "is_publishable", checked)}
                                size="sm"
                              />
                            </div>
                            <div className="w-10 px-2">
                              <button 
                                onClick={() => removePost(post.id)}
                                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary bg-primary/5 hover:bg-primary/10 rounded-lg transition-colors"
                      onClick={handleAddPost}
                    >
                      <Plus color="primary" />
                      <span>Daha bir post əlavə edin</span>
                    </button>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="p-0 pt-4 flex flex-col sm:flex-row justify-end gap-2">
              <Button
                className="w-full sm:w-[180px]"
                variant="flat"
                onClick={() => {
                  onOpenChange();
                  onCloseProps?.(false);
                }}
              >
                Ləğv et
              </Button>
              <Button
                className="w-full sm:w-[180px]"
                variant="primary"
                type="submit"
              >
                Redaktə edin
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <PostPlatformModal
        isOpen={platformModalOpen}
        onClose={() => {
          setPlatformModalOpen(false);
          setCurrentPostId(null);
        }}
        onSave={handlePlatformLocationsSave}
        postId={currentPostId || 0}
        selectedPlatforms={planning.social_accounts.map(p => ({ key: p.platform, label: p.platform }))}
        initialSelectedLocations={initialSelectedLocations}
        planningId={planning.id}
        is_publishable={currentPostId ? posts.find(p => p.id === currentPostId)?.is_publishable : false}
        onPublishableChange={val => {
          if (currentPostId) handleInputChange(currentPostId, "is_publishable", val);
        }}
      />
    </>
  );
};

export default EditPlanningMultiple;
