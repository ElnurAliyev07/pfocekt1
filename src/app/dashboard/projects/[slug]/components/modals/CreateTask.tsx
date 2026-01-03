"use client";

import { useForm, Controller, set } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Plus from "../../../../components/ui/icons/Plus";
import FileUpload from "@/components/ui/form/input/FileUpload";
import { createTaskService } from "@/services/client/task.service";
import { ApiError } from "@/types/error.type";
import useTaskStore from "@/store/taskStore";
import { convertFileToBase64 } from "@/utils/base64";
import useTaskUserStore, { TaskUserErrorMessages } from "@/store/taskUserStore";
import SelectUserTaskModal from "./SelectUserTask";
import useProjectMemberStore from "@/store/projectMemberStore";
import CheckerSelect from "../inputs/CheckerSelect";
import Close from "../icons/Close";
import { formatDate, formatDateOnly } from "@/utils/formateDateTime";
import PlanningPostListModal from "./PlanningPostList";
import { PlanningPost } from "@/types/planning.type";
import { useEffect, useState, useRef } from "react";


import DatePicker from "@/components/ui/form/input/NewDateTimePicker";
import usePlanningStore from "@/store/planningStore";
import SubtaskSelect from "../inputs/SubtaskSelect";
import Trash from "@/app/dashboard/workspaces/[slug]/components/icons/Trash";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import Button from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/form";
import {
  FaCheckCircle,
  FaRegCircle,
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaYoutube,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import AssignerSelect from "../inputs/AssingnerSelect";
import { removeURLParam } from "@/utils/urlUtils";
import { CreateTask } from "@/types/task.type";
import {
  SocialMediaPlatform,
  ContentType,
  PlatformSchedule,
  PLATFORM_CONFIGS,
  CONTENT_TYPE_CONFIGS,
  getPlatformContentTypes,
  getPlatformDisplayName,
  getContentTypeDisplayName,
} from "@/types/social-media.type";
import SubtaskTypeSelect from "../inputs/SubtaskTypeSelect";
import {
  DndContext,
  closestCenter,
  useSensors,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from "next/image";
import { useAppContext } from "@/providers/AppProvider";
import usePlanningPostStore from "@/store/planningPostStore";

// Define Zod schema

const schema = z
  .object({
    teamWorkIsActive: z.boolean(),
    title: z.string().min(1, "Başlıq tələb olunur"),
    content: z.string().optional(),
    files: z.array(z.any()).optional(),
    planning_post: z.number().optional(),
    started: z.string().optional(),
    deadline: z.string().optional(),
    assigner: z.number().optional(),
    subtasks_count: z.number(),
  })
  .superRefine((data, ctx) => {
    if (!data.teamWorkIsActive) {
      if (!data.started) {
        ctx.addIssue({
          path: ["started"],
          code: z.ZodIssueCode.custom,
          message: "Başlama tarixi tələb olunur",
        });
      }

      if (!data.deadline) {
        ctx.addIssue({
          path: ["deadline"],
          code: z.ZodIssueCode.custom,
          message: "Bitmə tarixi tələb olunur",
        });
      }

      // Check if start date is before current time
      if (data.started && new Date(data.started) <= new Date()) {
        ctx.addIssue({
          path: ["started"],
          code: z.ZodIssueCode.custom,
          message: "Başlama tarixi cari tarixdən sonra olmalıdır",
        });
      }

      // Check if deadline is after start date
      if (
        data.started &&
        data.deadline &&
        new Date(data.deadline) <= new Date(data.started)
      ) {
        ctx.addIssue({
          path: ["deadline"],
          code: z.ZodIssueCode.custom,
          message: "Bitmə tarixi başlama tarixindən sonra olmalıdır",
        });
      }
    }
    if (data.subtasks_count < 1 && data.teamWorkIsActive) {
      ctx.addIssue({
        path: ["subtasks_count"],
        code: z.ZodIssueCode.custom,
        message: "Alt işlər sayı tələb olunur",
      });
    }
  });

type FormData = z.infer<typeof schema>;

interface Props {
  isOpenProps?: boolean;
  children?: React.ReactNode;
  containerClassName?: string;
}

interface ContentTypeState {
  isSelected: boolean;
  scheduleTime?: string;
}

// Add interface for error messages
interface ErrorMessages {
  [key: number]: TaskUserErrorMessages;
}

// Add interface for SortableUserCard props
interface SortableUserCardProps {
  user: {
    order: number;
    projectMember: {
      user: {
        first_name: string;
        last_name: string;
        email: string;
        user_profile?: {
          image?: string;
          profession?: {
            name: string;
          };
        };
      };
    };
  };
  index: number;
  selectedUser: any;
  setSelectedUser: (user: any) => void;
  removeUser: (order: number) => void;
  reorderUser: (order: number, direction: "up" | "down") => void;
  errorMessages: ErrorMessages;
  selectedUsers: any[];
}

// Move SortableUserCard component outside
const SortableUserCard: React.FC<SortableUserCardProps> = ({
  user,
  index,
  selectedUser,
  setSelectedUser,
  removeUser,
  reorderUser,
  errorMessages,
  selectedUsers,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: user.order });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 0.2s ease, box-shadow 0.2s ease',
    opacity: isDragging ? 0.8 : 1,
    boxShadow: isDragging ? '0 8px 16px rgba(0,0,0,0.1)' : 'none',
    zIndex: isDragging ? 1 : 0,
  };

  const hasError = errorMessages[user.order] && Object.values(errorMessages[user.order]).some(
    (value) => Array.isArray(value) && value.length > 0
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => setSelectedUser(user)}
      className={`${
        user.order === selectedUser?.order
          ? "bg-primary text-white"
          : "bg-white hover:bg-gray-50 text-gray-700"
      } relative cursor-pointer rounded-lg border ${
        user.order === selectedUser?.order
          ? "border-primary"
          : "border-gray-200"
      } group flex items-center gap-2 px-3 py-2 pl-6 transition-all duration-200 ${
        isDragging ? 'scale-105' : ''
      }`}
    >
      {/* Order Badge - Absolute Positioned */}
      <div
        className={`absolute -top-2 -left-2 flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold shadow-md ${
          user.order === selectedUser?.order
            ? "bg-white text-primary ring-1 ring-primary"
            : "bg-primary text-white"
        }`}
      >
        {user.order}
      </div>

      {/* User Avatar with Border */}
      <div
        className={`w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border ${
          user.order === selectedUser?.order
            ? "border-white"
            : "border-gray-200 bg-gray-100"
        }`}
      >
        {user.projectMember.user.user_profile?.image ? (
          <Image
            width={28}
            height={28}
            src={user.projectMember.user.user_profile.image}
            alt={user.projectMember.user.first_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 text-xs font-medium">
            {user.projectMember.user.first_name.charAt(0)}
          </div>
        )}
      </div>

      {/* User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <p
            className={`text-xs font-medium truncate ${
              user.order === selectedUser?.order
                ? "text-white"
                : "text-gray-900"
            }`}
          >
            {user.projectMember.user.first_name}{" "}
            {user.projectMember.user.last_name}
          </p>
          {user.projectMember.user.user_profile?.profession && (
            <span
              className={`text-[10px] ${
                user.order === selectedUser?.order
                  ? "text-white/80"
                  : "text-gray-500"
              }`}
            >
              ({user.projectMember.user.user_profile.profession.name})
            </span>
          )}
        </div>
        <p
          className={`text-[10px] truncate ${
            user.order === selectedUser?.order
              ? "text-white/80"
              : "text-gray-500"
          }`}
        >
          {user.projectMember.user.email}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            removeUser(user.order);
          }}
          className={`p-1 rounded-full ${
            user.order === selectedUser?.order
              ? "text-white/80 hover:text-white hover:bg-white/10"
              : "text-gray-400 hover:text-red-600 hover:bg-red-50"
          } transition-colors duration-200`}
        >
          <svg
            className="w-3 h-3"
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

        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded-md transition-all duration-200 hover:scale-110"
        >
          <svg
            className="w-3 h-3 text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="9" cy="5" r="1" />
            <circle cx="9" cy="12" r="1" />
            <circle cx="9" cy="19" r="1" />
            <circle cx="15" cy="5" r="1" />
            <circle cx="15" cy="12" r="1" />
            <circle cx="15" cy="19" r="1" />
          </svg>
        </div>
      </div>

      {/* Error Indicator */}
      {hasError && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

const CreateTaskModal: React.FC<Props> = ({
  isOpenProps = false,
  children,
  containerClassName,
}): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpenChange = () => {
    setIsOpen(!isOpen);
    removeURLParam("isOpen");
  };
  const onOpen = () => setIsOpen(true);
  const onClose = () => {
    setIsOpen(false);
    setSelectedPlanningPost(null);
    setValue("planning_post", undefined);
    setSosialIsActive(false);
    setTeamWorkIsActive(false);
    setSelectedPlatform("instagram");
    setContentTypes({});
    resetSelectedUsers();
    setTaskFiles([new File([], "")]);
  };

  const [sosialIsActive, setSosialIsActive] = useState(false);
  const [teamWorkIsActive, setTeamWorkIsActive] = useState(false);
  const [selectedPlanningPost, setSelectedPlanningPost] =
    useState<PlanningPost | null>(null);

  // Sosyal medya görevi için platform seçimi
  const [selectedPlatform, setSelectedPlatform] =
    useState<SocialMediaPlatform>("instagram");

  // Görev öncelik seçimi için state
  const [priority, setPriority] = useState<string>("normal"); // yüksek, normal, düşük

  // İçerik türü seçimi için state
  const [contentTypes, setContentTypes] = useState<
    Record<string, ContentTypeState>
  >({});

  const [isInstructionOpen, setIsInstructionOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isOpenProps) {
      onOpen();
    } else {
      onClose();
    }
  }, [isOpenProps]);

  const { fetchTasks, project } = useTaskStore();
  const { planningPosts, fetchPlanningPosts } = usePlanningPostStore();
   

  useEffect(() => {
    fetchPlanningPosts();
  }, [fetchPlanningPosts]);

  const {
    started,
    setStarted,
    deadline,
    setDeadline,
    selectedUsers,
    errorMessages,
    selectedUser,
    reset: resetSelectedUsers,

    setSelectedUser,
    setSelectedTaskChecker,
    setSelectedAssigner,
    selectedTaskChecker,
    selectedAssigner,
    removeUser,
    updateUserContent,
    updateUserDeadline,
    updateUserFile,
    updateUserJob,
    updateUserStarted,
    addUser,
    updateUserTaskChecker,
    updateUserNextSubtaskTemp,
    addUserFile,
    removeUserFile,
    updateUserSubtaskType,
  } = useTaskUserStore();
  const { planning, fetchPlanning } = usePlanningStore();

  const { projectMembers, fetchProjectMembers } = useProjectMemberStore();
  const { setIsLoading } = useAppContext();

  // const [taskFiles, setTaskFiles] = useState<File[]>([new File([], "")])
  const [taskFiles, setTaskFiles] = useState<(File | null)[]>([
    new File([], ""),
  ]);

  const handleAddFile = () => {
    setTaskFiles([...taskFiles, null]);
  };

  const handleFileChange = (file: File | null, index: number) => {
    if (file) {
      const updatedFiles = [...taskFiles];
      updatedFiles[index] = file;
      setTaskFiles(updatedFiles);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...taskFiles];
    updatedFiles.splice(index, 1);
    setTaskFiles(updatedFiles);
  };

  const validateForm = (): boolean => {
    const { selectedUsers } = useTaskUserStore.getState();
    let isValid = true;
    let firstErrorElement: HTMLElement | null = null;

    const updatedErrors: Record<number, TaskUserErrorMessages> = {};

    // Ana task için tarih kontrolü
    if (!teamWorkIsActive) {
      if (started && deadline && new Date(deadline) <= new Date(started)) {
        setError("deadline", {
          type: "manual",
          message: "Bitmə tarixi başlama tarixindən sonra olmalıdır",
        });
        firstErrorElement = document.getElementById("deadline_1000");
        isValid = false;
      }
    }

    selectedUsers.forEach((user) => {
      const userErrors: TaskUserErrorMessages = {};

      if (!user.job || user.job.trim() === "") {
        // Check if it's a subtask
        const isSubtask = user.subtask_types && user.subtask_types.length > 0;
        if (!isSubtask) {
          userErrors.job = ["Task başlığı doldurulmalıdır."];
          if (!firstErrorElement) {
            firstErrorElement = document.getElementById(`user_${user.order}_job`);
          }
          isValid = false;
        }
      }

      if (!user.started) {
        userErrors.started = ["Başlama tarixi seçilməlidir."];
        if (!firstErrorElement) {
          firstErrorElement = document.getElementById(`started_${user.order}`);
        }
        isValid = false;
      }

      if (!user.deadline) {
        userErrors.deadline = ["Bitmə tarixi seçilməlidir."];
        if (!firstErrorElement) {
          firstErrorElement = document.getElementById(`deadline_${user.order}`);
        }
        isValid = false;
      }

      // Subtask için tarih kontrolü
      if (user.started && user.deadline) {
        const startDate = new Date(user.started);
        const endDate = new Date(user.deadline);

        if (endDate <= startDate) {
          userErrors.deadline = [
            ...(userErrors.deadline || []),
            "Bitmə tarixi başlama tarixindən sonra olmalıdır",
          ];
          if (!firstErrorElement) {
            firstErrorElement = document.getElementById(
              `deadline_${user.order}`
            );
          }
          isValid = false;
        }

        // Önceki subtask'ın bitiş tarihi kontrolü
        const previousSubtask = selectedUsers.find(
          (u) => u.order === user.order - 1
        );
        if (previousSubtask?.nextSubtaskTemp && previousSubtask.deadline) {
          const previousEndDate = new Date(previousSubtask.deadline);
          if (startDate <= previousEndDate) {
            userErrors.started = [
              ...(userErrors.started || []),
              "Başlama tarixi önceki taskın bitmə tarixindən sonra olmalıdır",
            ];
            if (!firstErrorElement) {
              firstErrorElement = document.getElementById(
                `started_${user.order}`
              );
            }
            isValid = false;
          }
        }
      }

      updatedErrors[user.order] = userErrors;
    });

    // Hataları güncelle
    useTaskUserStore.setState((state) => ({
      errorMessages: {
        ...state.errorMessages,
        ...updatedErrors,
      },
    }));

    // Scroll to first error if exists
    if (firstErrorElement) {
      firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
      firstErrorElement.focus();
    }

    return isValid;
  };

  const handleSelectPlanningPost = (selected: PlanningPost) => {
    setSelectedPlanningPost(selected);
    resetSelectedUsers();
    if (selected.planning_post_assigners.length < 2) {
      // setSelectedOptions(selected);
      selected.planning_post_assigners.map((item, index) => {
        let selectedProjectMember = projectMembers.find(
          (member) =>
            member.user.id === item.user.id && member.status.key == "accepted"
        );

        if (selectedProjectMember) {
          setSelectedAssigner(selectedProjectMember);
        } else {
          setSelectedAssigner(null);
        }
      });
    } else {
      selected.planning_post_assigners.map((item, index) => {
        const selectedProjectMember = projectMembers.find(
          (member) => member.user.id === item.user.id
        );
        if (selectedProjectMember) {
          addUser({
            order: index + 1,
            projectMember: selectedProjectMember,
            isPlanningPost: true,
            ...(item.time && { timeLimit: item.time }),
            ...(item.profession && { profession: item.profession.title }),
            files: [new File([], "")],
          });
        }
      });
    }

    // Set platform and content types based on platform_intents
    if (selected.platform_intents && selected.platform_intents.length > 0) {
      // Get the first platform from platform_intents
      const firstPlatform = selected.platform_intents[0].platform;
      setSelectedPlatform(firstPlatform);

      // Set content types for each platform intent
      const newContentTypes: Record<string, ContentTypeState> = {};
      selected.platform_intents.forEach((intent) => {
        const key = `${intent.platform}-${intent.content_type}`;
        newContentTypes[key] = {
          isSelected: true,
          scheduleTime: intent.scheduled_date || undefined,
        };
      });
      setContentTypes(newContentTypes);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setError,
    trigger,
    setValue,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      teamWorkIsActive: false,
      subtasks_count: 0,
    },
  });

  useEffect(() => {
    setValue("subtasks_count", selectedUsers.length);
    // Eğer selectedPlanning mevcutsa, aynı ID'ye sahip olan planning'i bul ve güncelle
    if (selectedUser) {
      const updateSelectedUser = selectedUsers.find(
        (user) => user.order === selectedUser.order
      );
      if (updateSelectedUser) {
        setSelectedUser(updateSelectedUser);
      }
    } else if (selectedUsers.length > 0) {
      // Eğer selectedPlanning yoksa ilk planning'i seç
      setSelectedUser(selectedUsers[0]);
    }
  }, [selectedUser, selectedUsers, setSelectedUser]); // plannings değiştiğinde çalışır

  // React Hook Form setup

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      const isValid = validateForm();
      if (!isValid) {
        setIsLoading(false);
        return;
      }
      if (!project) {
        return;
      }
      const files = await Promise.all(
        taskFiles.map(async (file) => {
          if (file?.name) {
            const base64File = await convertFileToBase64(file);
            return base64File;
          }
          return null;
        })
      );

      const filteredFiles = files.filter((file) => file !== null);

      const subtasks = await Promise.all(
        selectedUsers.map(async (user) => {
          const subtaskFiles = user.files
            ? await Promise.all(
                user.files.map(async (file) =>
                  file?.name ? await convertFileToBase64(file) : null
                )
              )
            : [];

          const filteredSubtaskFiles = subtaskFiles.filter(
            (file) => file !== null
          );

          const subtaskTypes = user.subtask_types;
          return {
            assigned_to: user.projectMember.user.id,
            subtask_types: subtaskTypes?.filter(Boolean) || [],
            subtask_files: filteredSubtaskFiles,
            content: user.content || "",
            deadline: user.deadline || "",
            started_date: user.started || "",
            job: user.job || "",
            next_subtask_temp_id: user.nextSubtaskTemp || null,
            subtask_checker: user.taskChecker?.user.id,
          };
        })
      );

      // Ana veri yapısı
      const requestData: CreateTask = {
        title: data.title,
        content: data.content || "",
        deadline: data.deadline,
        started: data.started,
        project: project.id,
        task_checker: selectedTaskChecker?.user.id,
        task_assigner: selectedAssigner?.user.id,
        planning_post: data.planning_post,
        task_files: filteredFiles,
        subtasks: subtasks,
        is_social_media_task: sosialIsActive,
        platform_schedules: Object.entries(contentTypes)
          .filter(([_, value]) => value.isSelected)
          .map(([key, value]) => {
            const [platformId, contentTypeId] = key.split("-") as [
              SocialMediaPlatform,
              string
            ];
            return {
              platform: platformId,
              content_type: contentTypeId as ContentType,
              scheduled_date: value.scheduleTime || null,
            } satisfies PlatformSchedule;
          }),
      };

      await createTaskService(requestData);

      await fetchTasks(true);

      setIsLoading(false);
      onOpenChange();

      if (project.planning) {
        await fetchPlanning(project.planning);
      }
      reset();
      setTaskFiles([]);
      resetSelectedUsers();
      setSelectedPlatform("instagram");
      setContentTypes({});
      setSosialIsActive(false);
      setTeamWorkIsActive(false);
      setPriority("normal");
      setTaskFiles([new File([], "")]);
      setSelectedPlanningPost(null);
    } catch (error) {
      const apiErrors = (error as ApiError).data;
      if (apiErrors && typeof apiErrors === "object") {
        let firstErrorField: string | null = null;
        Object.keys(apiErrors).forEach((field) => {
          const errorMessage = apiErrors[field]?.[0];
          if (field === "non_field_errors") {
            setError("root", {
              type: "manual",
              message: errorMessage,
            });
          } else if (errorMessage) {
            setError(field as keyof FormData, {
              type: "manual",
              message: errorMessage,
            });
            if (!firstErrorField) {
              firstErrorField = field;
            }
          }
        });

        // Scroll to first error field
        if (firstErrorField) {
          const errorElement = document.getElementById(firstErrorField);
          if (errorElement) {
            errorElement.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
            errorElement.focus();
          }
        }
      } else {
        setError("root", {
          type: "manual",
          message: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getContentTypesForPlatform = (
    platformId: SocialMediaPlatform
  ): ContentType[] => {
    return getPlatformContentTypes(platformId);
  };

  const handleContentTypeChange = (
    platformId: SocialMediaPlatform,
    contentTypeId: ContentType
  ) => {
    const key = `${platformId}-${contentTypeId}`;
    setContentTypes((prev) => {
      const newContentTypes = { ...prev };
      if (newContentTypes[key]?.isSelected) {
        delete newContentTypes[key];
      } else {
        newContentTypes[key] = {
          isSelected: true,
          scheduleTime: undefined,
        };
      }
      return newContentTypes;
    });
  };

  // Add handleScheduleTimeChange
  const handleScheduleTimeChange = (
    platformId: SocialMediaPlatform,
    contentTypeId: ContentType,
    time: string
  ) => {
    const key = `${platformId}-${contentTypeId}`;
    setContentTypes((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        scheduleTime: time,
      },
    }));
  };

  const reorderUser = (currentOrder: number, direction: "up" | "down") => {
    const { selectedUsers } = useTaskUserStore.getState();
    const currentIndex = selectedUsers.findIndex(
      (user) => user.order === currentOrder
    );

    if (direction === "up" && currentIndex > 0) {
      const newUsers = [...selectedUsers];
      const temp = newUsers[currentIndex];
      newUsers[currentIndex] = newUsers[currentIndex - 1];
      newUsers[currentIndex - 1] = temp;

      // Update orders
      const updatedUsers = newUsers.map((user, index) => ({
        ...user,
        order: index + 1,
      }));

      useTaskUserStore.setState({ selectedUsers: updatedUsers });
      setSelectedUser(updatedUsers[currentIndex - 1]);
    } else if (
      direction === "down" &&
      currentIndex < selectedUsers.length - 1
    ) {
      const newUsers = [...selectedUsers];
      const temp = newUsers[currentIndex];
      newUsers[currentIndex] = newUsers[currentIndex + 1];
      newUsers[currentIndex + 1] = temp;

      // Update orders
      const updatedUsers = newUsers.map((user, index) => ({
        ...user,
        order: index + 1,
      }));

      useTaskUserStore.setState({ selectedUsers: updatedUsers });
      setSelectedUser(updatedUsers[currentIndex + 1]);
    }
  };

  // Inside the CreateTaskModal component, add sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Add handleDragEnd function
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = selectedUsers.findIndex((user) => user.order === active.id);
      const newIndex = selectedUsers.findIndex((user) => user.order === over.id);
      const newUsers = arrayMove(selectedUsers, oldIndex, newIndex);
      const updatedUsers = newUsers.map((user, index) => ({
        ...user,
        order: index + 1,
      }));
      
      useTaskUserStore.setState({ selectedUsers: updatedUsers });
      setSelectedUser(updatedUsers[newIndex]);
    }
  };

  return (
    <>
      {children ? (
        <button className={containerClassName} onClick={onOpenChange}>
          {children}
        </button>
      ) : (
        <Button
          onClick={onOpenChange}
          className="bg-primary rounded-[8px] text-white text-[14px] font-[500] w-full md:w-auto"
        >
          <Plus />
          <span>Task yarat</span>
        </Button>
      )}
      <Modal
        isOpen={isOpen}
        size="xl"
        onOpenChange={onOpenChange}
        placement="center"
      >
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader className="pl-[16px] pr-[16px] md:pl-[25px] md:pr-[25px]">
              <div className="flex flex-1 w-full pr-3 items-center justify-between ">
                <span>Task əlavə et</span>
                <button
                  type="button"
                  onClick={() => setIsInstructionOpen(true)}
                  className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Təlimatlar
                </button>
              </div>
            </ModalHeader>
            <ModalBody className="p-0">
              <div className="max-h-[600px] md:max-h-[520px]  overflow-y-auto flex flex-col gap-4 px-2">
                <h3 className="text-xl font-semibold  text-gray-800">
                  Özəlliklər
                </h3>
                <div className="flex gap-2">
                  <div
                    className={`flex items-center gap-3 cursor-pointer transition-all duration-300 p-2 rounded-xl border ${
                      sosialIsActive
                        ? "bg-blue-100 border-blue-500 text-blue-700"
                        : "bg-gray-50 border-gray-300 text-gray-700"
                    } ${
                      selectedPlanningPost &&
                      selectedPlanningPost.platform_intents.length === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:shadow-md"
                    }`}
                    onClick={() => {
                      if (
                        selectedPlanningPost &&
                        selectedPlanningPost.platform_intents.length === 0
                      )
                        return;
                      setSosialIsActive(!sosialIsActive);
                    }}
                  >
                    {sosialIsActive ? (
                      <FaCheckCircle className="text-blue-600 text-xl" />
                    ) : (
                      <FaRegCircle className="text-gray-400 text-xl" />
                    )}
                    <span className="text-base">Sosial şəbəkə taskı</span>
                    {selectedPlanningPost &&
                      selectedPlanningPost.platform_intents.length === 0 && (
                        <span className="text-xs text-red-500 ml-2">
                          (Platform seçilməyib)
                        </span>
                      )}
                  </div>
                  <div
                    className={`flex items-center gap-3 cursor-pointer transition-all duration-300 p-2 rounded-xl border ${
                      teamWorkIsActive
                        ? "bg-blue-100 border-blue-500 text-blue-700"
                        : "bg-gray-50 border-gray-300 text-gray-700"
                    } hover:shadow-md`}
                    onClick={() => {
                      setTeamWorkIsActive(!teamWorkIsActive);
                      setValue("teamWorkIsActive", !teamWorkIsActive);
                      setValue("deadline", undefined);
                      setValue("started", undefined);
                      clearErrors("started");
                      clearErrors("deadline");
                      resetSelectedUsers();
                    }}
                  >
                    {teamWorkIsActive ? (
                      <FaCheckCircle className="text-blue-600 text-xl" />
                    ) : (
                      <FaRegCircle className="text-gray-400 text-xl" />
                    )}
                    <span className="text-base">Komanda işi</span>
                  </div>
                </div>

                {planning &&
                  planningPosts.filter((post) => post.task === null)
                    .length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label>Planlama postu</label>
                        {selectedPlanningPost && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedPlanningPost(null);
                              setValue("planning_post", undefined);
                              setSosialIsActive(false);
                              setTeamWorkIsActive(false);
                              setSelectedPlatform("instagram");
                              setContentTypes({});
                              resetSelectedUsers();
                            }}
                            className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Seçimi ləğv et
                          </button>
                        )}
                      </div>
                      <Controller
                        name="planning_post"
                        control={control}
                        render={({ field }) => (
                          <div>
                            <PlanningPostListModal
                              onSelect={(e) => {
                                field.onChange(e.id);
                                handleSelectPlanningPost(e);
                                setSosialIsActive(true);
                                if (e.planning_post_assigners.length > 1) {
                                  setTeamWorkIsActive(true);
                                  setValue("teamWorkIsActive", true);
                                } else {
                                  setTeamWorkIsActive(false);
                                  setValue("teamWorkIsActive", false);
                                }
                              }}
                            />

                            {errors.planning_post?.message && (
                              <p className="text-red-500 text-sm md:text-[16px] mt-1">
                                {String(errors.planning_post.message)}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    </div>
                  )}
                {/* Title Field */}
                <div>
                  <Input
                    labelPlacement="outside"
                    autoFocus
                    label="Task"
                    placeholder="Task başlığını qeyd edin"
                    isInvalid={!!errors.title}
                    errorMessage={errors.title?.message}
                    {...register("title")}
                  />
                </div>

                {/* Description Field */}
                <div>
                  <Textarea
                    labelPlacement="outside"
                    label="Xüsusi qeyd"
                    placeholder="Qeydinizi daxil edin"
                    isInvalid={!!errors.content}
                    errorMessage={errors.content?.message}
                    {...register("content")}
                  />
                </div>

                {/* Sosyal Medya Görevleri Bölümü */}
                {sosialIsActive &&
                  (() => {
                    // Get available platforms based on selected planning post
                    const availablePlatforms = Object.values(
                      PLATFORM_CONFIGS
                    ).filter((platform) => {
                      if (!selectedPlanningPost) return true;
                      return selectedPlanningPost.platform_intents.some(
                        (intent) => intent.platform === platform.id
                      );
                    });

                    // If no platforms are available, don't render the section
                    if (availablePlatforms.length === 0) return null;

                    return (
                      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <h3 className="text-lg font-semibold text-blue-700 mb-3">
                          Sosial şəbəkə taskı
                        </h3>

                        {/* Sosyal Medya Platformu Seçimi */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Platform
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {availablePlatforms.map((platform) => {
                              const hasSelectedContent = Object.keys(
                                contentTypes
                              ).some((key) => key.startsWith(platform.id));
                              const isSelected =
                                selectedPlatform === platform.id ||
                                hasSelectedContent;

                              return (
                                <button
                                  key={platform.id}
                                  type="button"
                                  onClick={() =>
                                    setSelectedPlatform(platform.id)
                                  }
                                  className={`
                                group relative overflow-hidden
                                ${
                                  isSelected
                                    ? "ring-2 ring-blue-500 scale-105 shadow-lg"
                                    : "hover:ring-1 hover:ring-gray-300"
                                }
                                ${platform.color} text-white p-3 rounded-xl
                                flex flex-col items-center justify-center gap-1
                                transition-all duration-300 h-16
                                hover:brightness-110
                              `}
                                >
                                  <div className="relative z-10 flex flex-col items-center gap-1">
                                    {platform.icon === "FaInstagram" && (
                                      <FaInstagram className="w-5 h-5" />
                                    )}
                                    {platform.icon === "FaFacebookF" && (
                                      <FaFacebookF className="w-5 h-5" />
                                    )}
                                    {platform.icon === "FaTiktok" && (
                                      <FaTiktok className="w-5 h-5" />
                                    )}
                                    {platform.icon === "FaYoutube" && (
                                      <FaYoutube className="w-5 h-5" />
                                    )}
                                    <span className="text-xs font-medium">
                                      {platform.displayName}
                                    </span>
                                  </div>
                                  {hasSelectedContent && (
                                    <div className="absolute top-1 left-1 w-2 h-2 bg-green-400 rounded-full ring-1 ring-white"></div>
                                  )}
                                  {selectedPlatform === platform.id && (
                                    <>
                                      <div className="absolute inset-0 bg-white/10"></div>
                                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"></div>
                                      <div className="absolute top-1.5 right-1.5">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                          <svg
                                            className="w-2 h-2 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={3}
                                              d="M5 13l4 4L19 7"
                                            />
                                          </svg>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Kontent Növü Seçimi */}
                        {selectedPlatform && (
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              Kontent növü
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {getContentTypesForPlatform(selectedPlatform).map(
                                (contentTypeId) => {
                                  const contentType =
                                    CONTENT_TYPE_CONFIGS[contentTypeId];
                                  const key = `${selectedPlatform}-${contentTypeId}`;
                                  const isDisabled = false;

                                  return (
                                    <div
                                      key={contentTypeId}
                                      className={`
                                  relative flex flex-col p-3 rounded-xl
                                  ${
                                    contentTypes[key]?.isSelected
                                      ? "bg-blue-50 border-2 border-blue-500"
                                      : "bg-gray-50 border-2 border-transparent hover:border-gray-200"
                                  }
                                  ${
                                    isDisabled
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }
                                  transition-all duration-200
                                `}
                                    >
                                      <label
                                        className={`flex items-center gap-2 ${
                                          isDisabled
                                            ? "cursor-not-allowed"
                                            : "cursor-pointer"
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={
                                            contentTypes[key]?.isSelected ||
                                            false
                                          }
                                          onChange={() =>
                                            !isDisabled &&
                                            handleContentTypeChange(
                                              selectedPlatform,
                                              contentTypeId
                                            )
                                          }
                                          className="sr-only"
                                          disabled={isDisabled}
                                        />
                                        <div
                                          className={`
                                    w-5 h-5 rounded border-2 flex items-center justify-center
                                    ${
                                      contentTypes[key]?.isSelected
                                        ? "border-blue-500 bg-blue-500"
                                        : "border-gray-300"
                                    }
                                  `}
                                        >
                                          {contentTypes[key]?.isSelected && (
                                            <svg
                                              className="w-3 h-3 text-white"
                                              fill="none"
                                              viewBox="0 0 24 24"
                                              stroke="currentColor"
                                            >
                                              <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                              />
                                            </svg>
                                          )}
                                        </div>
                                        <span
                                          className={`
                                    text-sm font-medium
                                    ${
                                      contentTypes[key]?.isSelected
                                        ? "text-blue-700"
                                        : "text-gray-700"
                                    }
                                  `}
                                        >
                                          {contentType.displayName}
                                        </span>
                                      </label>

                                      {contentTypes[key]?.isSelected && (
                                        <div className="mt-2">
                                          <DatePicker
                                            id={`schedule_${selectedPlatform}_${contentTypeId}`}
                                            value={
                                              contentTypes[key]?.scheduleTime ||
                                              ""
                                            }
                                            onChange={(time) =>
                                              !isDisabled &&
                                              handleScheduleTimeChange(
                                                selectedPlatform,
                                                contentTypeId,
                                                time
                                              )
                                            }
                                            label="Planlaşdırma vaxtı"
                                            disableDatePrevious={new Date()}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                <div>
                  <label>Təsdiq edəcək şəxs</label>
                  <div className="mt-[8px]">
                    <CheckerSelect
                      placeholder="Seçin"
                      options={projectMembers.filter(
                        (item) => item.status.key !== "pending"
                      )}
                      onSelect={(e) => setSelectedTaskChecker(e)}
                    />
                  </div>
                </div>
                {!teamWorkIsActive && (
                  <div>
                    <label>İcra edəcək şəxs</label>
                    <div className="mt-[8px]">
                      <AssignerSelect
                        placeholder="Seçin"
                        error={errors.assigner?.message}
                        options={projectMembers.filter(
                          (item) => item.status.key !== "pending"
                        )}
                        value={selectedAssigner}
                        onSelect={(e) => {
                          setSelectedAssigner(e);
                          setValue("assigner", e?.id);
                          trigger();
                        }}
                      />
                      {errors.assigner && (
                        <p className="text-red-500 text-sm md:text-[16px] mt-1">
                          {errors.assigner.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {/* File Field */}
                <div>
                  <div className="flex justify-between items-center">
                    <label>Fayl</label>
                    <button type="button" onClick={handleAddFile}>
                      <Plus color="primary" />
                    </button>
                  </div>
                  <div>
                    {taskFiles.map((file, index) => (
                      <div
                        className="flex justify-between items-center gap-2"
                        key={index}
                      >
                        <FileUpload
                          id={`main_file_${index}`}
                          onChange={(file) => handleFileChange(file, index)}
                          selectedFile={file}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <Trash />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                {!teamWorkIsActive && (
                  <div className="grid grid-cols-2 gap-4">
                    {/* DateTime Field */}
                    <div>
                      <Controller
                        name="started"
                        control={control}
                        render={({ field }) => (
                          <div>
                            <DatePicker
                              id="started_1000"
                              value={field.value || ""}
                              onChange={(date) => {
                                field.onChange(date);
                                setStarted(date);
                                clearErrors("started");
                              }}
                              label="Başlama tarixi"
                              disableDatePrevious={new Date()}
                              // activeDatePeriods={[{  startDate: new Date('2025-01-18T01:00:00'),
                              //     endDate: new Date('2025-01-22T02:00:00')},
                              //     {  startDate: new Date('2025-01-25T01:00:00'),
                              //         endDate: new Date('2025-01-27T02:00:00')}]}
                            />
                            {errors.started && (
                              <p className="text-red-500 text-sm md:text-[16px] mt-1">
                                {errors.started.message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    </div>

                    {/* DateTime Field */}
                    <div>
                      <Controller
                        name="deadline"
                        control={control}
                        render={({ field }) => (
                          <div>
                            <DatePicker
                              id="deadline_1000"
                              value={field.value || ""}
                              onChange={(date) => {
                                field.onChange(date);
                                setDeadline(date);
                                clearErrors("deadline");
                              }}
                              label="Bitmə tarixi"
                              disableDatePrevious={new Date(started)}
                            />
                            {errors.deadline && (
                              <p className="text-red-500 text-sm md:text-[16px] mt-1">
                                {errors.deadline.message}
                              </p>
                            )}
                          </div>
                        )}
                      />
                    </div>
                  </div>
                )}

                {teamWorkIsActive && (
                  <>
                    <div>
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-[8px]">
                            <label>Subtasklar</label>
                            {selectedUsers.length > 0 && (
                              <SelectUserTaskModal />
                            )}
                          </div>
                          {selectedUsers.length > 0 && (
                            <div className="flex items-center gap-[2px]">
                              <div className="w-[12px] h-[12px] bg-custom-red rounded-full"></div>
                              -
                              <span className="text-[12px] leading-[16px] text-t-black">
                                Xəta var
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-[16px]">
                          <div className="grid grid-cols-2 gap-2">
                            <DndContext
                              collisionDetection={closestCenter}
                              onDragEnd={handleDragEnd}
                            >
                              <SortableContext
                                items={selectedUsers.map((user) => user.order)}
                                strategy={verticalListSortingStrategy}
                              >
                                {selectedUsers.map((user, index) => (
                                  <SortableUserCard
                                    key={user.order}
                                    user={user}
                                    index={index}
                                    selectedUser={selectedUser}
                                    setSelectedUser={setSelectedUser}
                                    removeUser={removeUser}
                                    reorderUser={reorderUser}
                                    errorMessages={errorMessages}
                                    selectedUsers={selectedUsers}
                                  />
                                ))}
                              </SortableContext>
                            </DndContext>
                          </div>
                        </div>
                      </div>
                      <div className="">
                        {selectedUsers.map((item, index) => {
                          const parentUser = selectedUsers.find(
                            (user) =>
                              selectedUser &&
                              user.nextSubtaskTemp === selectedUser.order - 1
                          );
                          return (
                            item.order === selectedUser?.order && (
                              <div key={index} className="pt-[20px] space-y-4">
                                {/* Content */}
                                <div>
                                  <Input
                                    id={`user_${selectedUser?.order}_job`}
                                    labelPlacement="outside"
                                    label="Task"
                                    placeholder="Task başlığını qeyd edin"
                                    value={item.job || ""}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>
                                    ) =>
                                      updateUserJob(item.order, e.target.value)
                                    }
                                  />
                                  {errorMessages[item.order] &&
                                    errorMessages[item.order].job && (
                                      <p className="text-red-500 text-sm">
                                        {errorMessages[item.order].job}
                                      </p>
                                    )}
                                </div>

                                {/* Subtask Type Selection */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Alt Task Növləri
                                  </label>
                                  <SubtaskTypeSelect
                                    value={item.subtask_types || []}
                                    onChange={(types) => {
                                      updateUserSubtaskType(item.order, types);
                                    }}
                                    isSocialMediaTask={sosialIsActive}
                                    selectedContentTypes={contentTypes}
                                    allSelectedTaskTypes={selectedUsers.flatMap(
                                      (user) => user.subtask_types || []
                                    )}
                                  />
                                </div>

                                {/* Content */}
                                <div>
                                  <Textarea
                                    labelPlacement="outside"
                                    label="Xüsusi qeyd"
                                    placeholder="Qeydinizi daxil edin"
                                    value={item.content}
                                    onChange={(
                                      e: React.ChangeEvent<HTMLTextAreaElement>
                                    ) =>
                                      updateUserContent(
                                        item.order,
                                        e.target.value
                                      )
                                    }
                                  />
                                  {errorMessages[item.order] &&
                                    errorMessages[item.order].content && (
                                      <p className="text-red-500 text-sm">
                                        {errorMessages[item.order].content}
                                      </p>
                                    )}
                                </div>

                                <div>
                                  {/* <PlanningPostListModal planningPost={}/> */}
                                </div>

                                <div>
                                  <label>Təsdiq edəcək şəxs</label>
                                  <div className="mt-[8px]">
                                    <CheckerSelect
                                      placeholder="Seçin"
                                      value={item.taskChecker}
                                      options={projectMembers}
                                      onSelect={(e) =>
                                        updateUserTaskChecker(
                                          item.order,
                                          e || undefined
                                        )
                                      }
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label>Növbəti tapşırıq</label>
                                  <div className="mt-[8px]">
                                    <SubtaskSelect
                                      placeholder="Seçin"
                                      value={item.nextSubtaskTemp}
                                      options={selectedUsers.filter(
                                        (user) => user.order > item.order
                                      )}
                                      onSelect={(e) =>
                                        updateUserNextSubtaskTemp(
                                          item.order,
                                          (e && e.order - 1) || null
                                        )
                                      }
                                    />
                                  </div>
                                </div>

                                <div>
                                  <div className="flex justify-between items-center">
                                    <label>Fayl</label>
                                    <button
                                      type="button"
                                      onClick={() => addUserFile(item.order)} // Add a new empty file slot for this user
                                    >
                                      <Plus color="primary" />
                                    </button>
                                  </div>
                                  <div>
                                    {item.files?.map((file, fileIndex) => (
                                      <div
                                        className="flex justify-between items-center gap-2"
                                        key={`useritem_${index}_file_${fileIndex}`}
                                      >
                                        <FileUpload
                                          id={`user_${index}_file_${fileIndex}`}
                                          onChange={
                                            (file) =>
                                              updateUserFile(
                                                item.order,
                                                file,
                                                fileIndex
                                              ) // Update a specific file for this user
                                          }
                                          selectedFile={file}
                                        />
                                        <button
                                          type="button"
                                          onClick={() =>
                                            removeUserFile(
                                              item.order,
                                              fileIndex
                                            )
                                          }
                                        >
                                          <Trash />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div
                                  key={index}
                                  className="pt-[20px] grid grid-cols-2 gap-[20px]"
                                >
                                  {/* Başlama Tarixi */}
                                  <div>
                                    <DatePicker
                                      id={`started_${index}`}
                                      value={item.started || ""}
                                      onChange={(e) =>
                                        updateUserStarted(
                                          item.order,
                                          e,
                                          item.timeLimit
                                        )
                                      }
                                      label="Başlama tarixi"
                                      disableDatePrevious={
                                        selectedUsers.find(
                                          (u) => u.order === item.order - 1
                                        )?.deadline
                                          ? new Date(
                                              selectedUsers.find(
                                                (u) =>
                                                  u.order === item.order - 1
                                              )?.deadline || new Date()
                                            )
                                          : new Date()
                                      }
                                    />
                                    {errorMessages[item.order]?.started?.[0] && (
                                      <p className="text-red-500 text-sm mt-1">
                                        {errorMessages[item.order]?.started?.[0]}
                                      </p>
                                    )}
                                  </div>

                                  {/* Bitmə Tarixi */}
                                  <div>
                                    <DatePicker
                                      id={`deadline_${index}`}
                                      value={item.deadline || ""}
                                      onChange={(e) =>
                                        updateUserDeadline(item.order, e)
                                      }
                                      label="Bitmə tarixi"
                                      disableDatePrevious={
                                        new Date(item.started || new Date())
                                      }
                                    />
                                    {errorMessages[item.order] &&
                                      errorMessages[item.order].deadline && (
                                        <p className="text-red-500 text-sm">
                                          {errorMessages[item.order].deadline}
                                        </p>
                                      )}
                                  </div>
                                </div>
                              </div>
                            )
                          );
                        })}
                      </div>
                    </div>
                    {errors.root && (
                      <div className="mb-4 text-red-500 text-sm">
                        {errors.root.message}
                      </div>
                    )}
                    {selectedUsers.length === 0 && !errors.subtasks_count && (
                      <div className="flex justify-center items-center">
                        <div className="text-center space-y-6 max-w-md mx-auto p-1">
                          {/* Normal Icon */}
                          <div className="relative">
                            <div className="w-24 h-24 mx-auto mb-4 relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full animate-pulse"></div>
                              <div className="relative flex items-center justify-center w-full h-full">
                                <svg
                                  className="w-12 h-12 text-gray-400"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Normal message */}
                          <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-gray-700">
                              Hələ heç kim seçilməyib
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                              İstifadəçi seçmək üçün klik edin
                            </p>
                          </div>

                          {/* Normal decorative elements */}
                          <div className="flex justify-center space-x-2 opacity-60">
                            <div
                              className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-purple-300 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-pink-300 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                          </div>

                          <div className="pt-4">
                            <SelectUserTaskModal />
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedUsers.length === 0 && errors.subtasks_count && (
                      <div className="flex justify-center items-center">
                        <div className="text-center space-y-6 max-w-md mx-auto p-1 border-2 border-red-200 rounded-xl bg-red-50">
                          {/* Error Icon */}
                          <div className="relative">
                            <div className="w-24 h-24 mx-auto mb-4 relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-red-200 to-rose-200 rounded-full animate-pulse"></div>
                              <div className="relative flex items-center justify-center w-full h-full">
                                <svg
                                  className="w-12 h-12 text-red-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>

                          {/* Error message */}
                          <div className="space-y-3">
                            <h3 className="text-lg font-semibold text-red-700">
                              İstifadəçi seçilməlidir!
                            </h3>
                            <p className="text-red-600 text-sm leading-relaxed font-medium">
                              Davam etmək üçün ən azı bir istifadəçi seçin
                            </p>
                          </div>

                          {/* Error decorative elements */}
                          <div className="flex justify-center space-x-2 opacity-80">
                            <div
                              className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-rose-500 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                          </div>

                          <div className="pt-4 space-y-2">
                            <SelectUserTaskModal />
                            <p className="text-xs text-red-500 font-medium">
                              ⚠️ Bu sahə mütləqdir
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
              {selectedUsers.length > 0 && (
                <div className="hidden md:block fixed top-[10px] right-[10px] transform rounded-xl p-4 bg-white shadow-lg z-50 max-w-[400px] w-full border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-gray-800">
                      Seçilmiş istifadəçilər
                    </h2>
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {selectedUsers.length} istifadəçi
                    </span>
                  </div>
                  <div className="space-y-3">
                    {selectedUsers.map((item, index) => (
                      <div
                        key={index}
                        className={`relative p-3 rounded-lg border transition-all duration-200 `}
                      >
                        {/* Order Badge */}
                        <div
                          className={`absolute -top-2 -left-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                            selectedUser?.order === item.order
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item.order}
                        </div>

                        {/* User Info */}
                        <div className="flex items-start gap-3">
                          {/* User Avatar */}
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                            {item.projectMember.user.user_profile?.image ? (
                              <Image
                                width={32}
                                height={32}
                                src={item.projectMember.user.user_profile.image}
                                alt={item.projectMember.user.first_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600 text-xs font-medium">
                                {item.projectMember.user.first_name.charAt(0)}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 space-y-2">
                            {/* User Details */}
                            <div className="flex items-center gap-3">
                              <div>
                                <p className="text-base font-semibold text-gray-900">
                                  {item.projectMember.user.full_name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {item.projectMember.user.email}
                                </p>
                              </div>
                              {item.profession && (
                                <span className="ml-auto text-sm text-gray-400 italic">
                                  {item.profession}
                                </span>
                              )}
                            </div>

                            {/* Time Info */}
                            {(item.timeLimit ||
                              (item.started && item.deadline)) && (
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                {item.timeLimit && (
                                  <div className="flex items-center gap-1">
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
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                      />
                                    </svg>
                                    <span>{item.timeLimit} dəqiqə</span>
                                  </div>
                                )}
                                {item.started && item.deadline && (
                                  <div className="flex items-center gap-1">
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
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                    <span>
                                      {formatDate(item.started)} -{" "}
                                      {formatDate(item.deadline)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Next Subtask Info */}
                            {item.nextSubtaskTemp && (
                              <div className="flex items-center gap-2 text-sm mt-2 text-gray-600">
                                <div className="flex items-center gap-1 text-primary font-medium">
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
                                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                  </svg>
                                  Sonrakı tapşırıq:
                                </div>
                                <span className="truncate">
                                  {
                                    selectedUsers.find(
                                      (u) =>
                                        u.order - 1 === item.nextSubtaskTemp
                                    )?.order
                                  }
                                  .
                                  {
                                    selectedUsers.find(
                                      (u) =>
                                        u.order - 1 === item.nextSubtaskTemp
                                    )?.projectMember.user.full_name
                                  }
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter className="grid grid-cols-2 gap-[16px]">
              <Button
                className="bg-custom-gray font-[500]"
                variant="flat"
                onClick={onOpenChange}
                type="button"
              >
                Ləğv et
              </Button>
              <Button
                className="bg-primary text-white font-[500]"
                type="submit"
              >
                Əlavə edin
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Talimatlar Dialog */}
      <Modal
        isOpen={isInstructionOpen}
        onOpenChange={() => setIsInstructionOpen(false)}
        placement="center"
        size="md"
      >
        <ModalContent>
          <ModalHeader className="flex flex-row items-center justify-between">
            <span>Task Yaratma Təlimatları</span>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {/* Genel Talimatlar */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-base font-medium text-gray-800 mb-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Ümumi Təlimatlar
                </h3>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>Task yaratmaq üçün sadə addımlar:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Task başlığı və ətraflı təsviri daxil edin</li>
                    <li>Deadline (son tarix) və başlama vaxtını təyin edin</li>
                    <li>Failları əlavə edin (zəruri olduqda)</li>
                    <li>Taskı təsdiq edəcək üzvü seçin</li>
                  </ul>
                </div>
              </div>

              {/* Komanda İşi Talimatları */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-base font-medium text-blue-800 mb-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Komanda İşi
                </h3>
                <div className="text-sm text-blue-700 space-y-2">
                  <p>Komanda işini təşkil etmək üçün:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>"Komanda işi" seçimi aktiv edin</li>
                    <li>
                      Task yaratdıqdan sonra alt görəvlər (subtask) əlavə edin
                    </li>
                    <li>
                      Hər bir alt görəvə ayrı-ayrı komanda üzvlərini təyin edin
                    </li>
                    <li>
                      Bir-biri ilə əlaqəli olan alt görəvləri qrup halında
                      təşkil edin
                    </li>
                    <li>
                      Xarici elementlərdən asılı olan alt görəvləri
                      əlaqələndirin
                    </li>
                  </ul>
                </div>
              </div>

              {/* Sosyal Medya Görevi Talimatları */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="text-base font-medium text-purple-800 mb-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                  Sosial Media Taskı
                </h3>
                <div className="text-sm text-purple-700 space-y-2">
                  <p>Sosial media taskı yaratmaq üçün:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>"Sosial şəbəkə taskı" seçimi aktiv edin</li>
                    <li>
                      Sosial media platformunu seçin (Instagram, Facebook,
                      Twitter və s.)
                    </li>
                    <li>
                      Task yaratdıqdan sonra müxtəlif kontent növləri üçün alt
                      görəvlər əlavə edin:
                    </li>
                    <li className="pl-5">- Caption/mətn hazırlanması</li>
                    <li className="pl-5">
                      - Görsəllərin (foto/video) hazırlanması
                    </li>
                    <li className="pl-5">
                      - Hashtag və etiketlərin hazırlanması
                    </li>
                    <li className="pl-5">- Post dizaynı və formatlanması</li>
                    <li>
                      Hər bir alt görəvə fərqli komanda üzvlərini təyin edə
                      bilərsiniz
                    </li>
                  </ul>
                </div>
              </div>

              {/* Önerilen Alt Görevler */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="text-base font-medium text-green-800 mb-2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                    />
                  </svg>
                  Sosial Media Üçün Tövsiyə Edilən Alt Görəvlər
                </h3>
                <div className="text-sm text-green-700 space-y-2">
                  <p>
                    Taskınızı daha effektiv etmək üçün aşağıdakı alt görəvləri
                    əlavə edə bilərsiniz:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {[
                      "Başlıq hazırla",
                      "Hashtags hazırla",
                      "Foto hazırla",
                      "Caption yaz",
                      "Stories formatla",
                      "Post mətni yaz",
                      "Video hazırla",
                    ].map((subtask, index) => (
                      <div
                        key={index}
                        className="flex items-center p-2 rounded-md bg-white border border-green-100"
                      >
                        <div className="h-5 w-5 mr-2 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="text-xs text-gray-700">{subtask}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => setIsInstructionOpen(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Bağla
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateTaskModal;
