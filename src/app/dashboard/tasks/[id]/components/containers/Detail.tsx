"use client";

import React, { useEffect, useState } from "react";
import { Task, TaskStatus } from "@/types/task.type";
import Calendar from "../calendar/Calendar";
import { showToast, ToastType } from "@/utils/toastUtils";
import { convertFileToBase64 } from "@/utils/base64";
import {
  acceptTaskService,
  cancelTaskService,
  completeSocialMediaTaskService,
  completeTaskService,
  startTaskService,
  updateTaskResultService,
  CompleteSocialMediaTaskRequest,
  updateSocialMediaTaskResultService,
} from "@/services/client/task.service";
import { CustomFile } from "@/types/customFile.type";
import { convertMultipleFiles } from "@/utils/fileUtils";
import { useAuth } from "@/providers/AuthProvider";
import { ContentType, SocialMediaPlatform } from "@/types/social-media.type";

import TaskHeader from "@/app/dashboard/tasks/[id]/components/containers/TaskHeader";
import TaskInfo from "@/app/dashboard/tasks/[id]/components/containers/TaskInfo";
import TaskFiles from "@/app/dashboard/tasks/[id]/components/containers/TaskFiles";
import TaskModals from "@/app/dashboard/tasks/[id]/components/containers/TaskModals";
import { DefaultFeedback } from "./DefaultFeedback";
import { SocialMediaFeedback } from "./SocialMediaFeedback";
import useTaskItemStore from "@/store/taskItemStore";
import SubtaskList from "./SubtaskList";
import { useAppContext } from "@/providers/AppProvider";

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


const Detail: React.FC = () => {
  
  const { task, setCurrentStatus, fetchTask, isEditing, setIsEditing, setIsJointPost, isJointPost } = useTaskItemStore();

  // if (!task) {
  //   return null
  // }

  const [feedBackFiles, setFeedBackFiles] = useState<File[]>([]);
  const [confirmedFeedBackFiles, setConfirmedFeedBackFiles] = useState<File[]>([]);
  const [loadingFeedBackFiles, setLoadingFeedBackFiles] = useState<boolean>(false);
  const [feedBackText, setFeedBackText] = useState<string>(task?.feedback_text || "");
  const [confirmedFeedBackText, setConfirmedFeedBackText] = useState<string>(task?.feedback_text || "");
  const [platformContents, setPlatformContents] = useState<Record<SocialMediaPlatform, Record<ContentType, ContentData>>>({} as Record<SocialMediaPlatform, Record<ContentType, ContentData>>);
  const [jointContent, setJointContent] = useState<ContentData>({
    content: "",
    medias: [],
  });
  // const [isJointPost, setIsJointPost] = useState(task?.post?.joint_post || false);
  const { setIsLoading, isLoading } = useAppContext();
  const { user } = useAuth();

  // Modal states
  const [startTaskModal, setStartTaskModal] = useState(false);
  const [completeTaskModal, setCompleteTaskModal] = useState(false);
  const [acceptTaskModal, setAcceptTaskModal] = useState(false);
  const [rejectTaskModal, setRejectTaskModal] = useState(false);
  const [cancelTaskModal, setCancelTaskModal] = useState(false);
  const [sendToClientModal, setSendToClientModal] = useState(false);

  const convertAndSetFiles = async (customFiles: CustomFile[]) => {
    try {
      const convertedFiles = await convertMultipleFiles(customFiles);
      setFeedBackFiles(convertedFiles);
      setConfirmedFeedBackFiles(convertedFiles);
    } catch (error) {
      console.error("Dosya dönüştürme hatası:", error);
    }
  };

  useEffect(() => {
    if (task && task.feedback_files && task.feedback_files.length > 0) {
      setLoadingFeedBackFiles(true);
      convertAndSetFiles(task.feedback_files);
      setLoadingFeedBackFiles(false);
    }
  }, [task?.feedback_files]);

  useEffect(() => {
    const fetchPostMedias = async () => {
      if (task?.is_social_media_task && task.post) {
        // Joint content'i ayarla
        let post_medias = await convertMultipleFiles(task.post.medias.map((m) => m.file));
        
        setJointContent({
          content: task.post.content || "",
          medias: post_medias,
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
          duration: 0,
          aspectRatio: "",
          slides: 0,
          firstComment: "",
        });

        // Platform içeriklerini ayarla
        if (task.post.platform_schedules) {
          const initialPlatformContents: Record<SocialMediaPlatform, Record<ContentType, ContentData>> = {} as Record<SocialMediaPlatform, Record<ContentType, ContentData>>;

          // Tüm platform schedule'ları için medya dosyalarını paralel olarak dönüştür
          const platformSchedulesWithMedias = await Promise.all(
            task.post.platform_schedules.map(async (schedule) => {
              const medias = await convertMultipleFiles(schedule.medias.map((m) => m.file));
              return {
                ...schedule,
                convertedMedias: medias
              };
            })
          );

          // Dönüştürülmüş medya dosyalarıyla platform içeriklerini oluştur
          platformSchedulesWithMedias.forEach(schedule => {
            if (!initialPlatformContents[schedule.platform]) {
              initialPlatformContents[schedule.platform] = {} as Record<ContentType, ContentData>;
            }

            initialPlatformContents[schedule.platform][schedule.content_type] = {
              content: schedule.content_override || "",
              medias: schedule.convertedMedias,
              hashtags: schedule.hashtags?.map(h => h.name) || [],
              mentions: schedule.mentioned_users?.map(u => u.username) || [],
              location: schedule.location || "",
              link: schedule.link || "",
              altText: "",
              caption: schedule.first_comment || "",
              music: schedule.music || "",
              effects: schedule.effects || "",
              title: schedule.title || "",
              description: schedule.description || "",
              tags: schedule.tags_input?.split(",").map(t => t.trim()) || [],
              category: schedule.category || "",
              duration: schedule.duration || 0,
              aspectRatio: schedule.aspect_ratio || "",
              slides: schedule.slides_count || 0,
              firstComment: schedule.first_comment || "",
            };
          });

          setPlatformContents(initialPlatformContents);
        }
      }
    };

    fetchPostMedias();
  }, [task]);

  const handleStartTask = async () => {
    if (!task) {
      return;
    }
    try {
      setIsLoading(true);
      await startTaskService(task.id);
      setCurrentStatus({ key: "in_progress", label: "İcra edilir" });
      setIsLoading(false);
      showToast("Tapşırıq başladı", ToastType.SUCCESS);
      setStartTaskModal(false);
    } catch (error) {
      showToast("Tapırıq başladıla bilmədi!", ToastType.ERROR);
      setIsLoading(false);
    }
  };

  const handleAcceptTask = async () => {
    if (!task) {
      return;
    }
    try {
      setIsLoading(true);
      await acceptTaskService(task.id);
      setCurrentStatus({ key: "accepted", label: "Qəbul edildi" });
      setIsLoading(false);
      showToast("Tapşırıq qəbul edildi", ToastType.SUCCESS);
      setAcceptTaskModal(false);
    } catch (error) {
      console.log(error);
      showToast("Tapşırıq qəbul edilmədi!", ToastType.ERROR);
      setIsLoading(false);
    }
  };

  const handleCompleteDefault = async () => {
    if (!task) {
      return;
    }
    try {
      setIsLoading(true);
      const files = await Promise.all(
        feedBackFiles.map(async (file) => {
          if (file?.name) {
            const base64File = await convertFileToBase64(file);
            console.log(base64File);
            return base64File;
          }
          return null;
        })
      );

      const filteredFiles = files.filter((file) => file !== null);
     
      await completeTaskService(task.id, {
        feedback_text: feedBackText,
        feedback_files: filteredFiles,
      });
      setCurrentStatus({ key: "completed", label: "Tamamlandı" });
      setIsLoading(false);
      showToast("Tapşırıq tamamlandı", ToastType.SUCCESS);
      setCompleteTaskModal(false);
    } catch (error) {
      setIsLoading(false);
      showToast("Mətin və ya fayl göndərilməlidir!", ToastType.ERROR);
    }
  };

  const handleCompleteSocialMedia = async () => {
    if (!task) {
      return;
    }
    try {
      setIsLoading(true);

      // Medya dosyalarını base64'e dönüştür
      const processMedias = async (medias: File[]) => {
        return await Promise.all(
          medias.map(async (file) => {
            if (file?.name) {
              const base64File = await convertFileToBase64(file);
              return { file: base64File };
            }
            return null;
          })
        );
      };

      // Platform içeriklerini işle
      const platformSchedules = await Promise.all(
        Object.entries(platformContents).map(async ([platform, contentTypes]) => {
          return await Promise.all(
            Object.entries(contentTypes).map(async ([contentType, data]) => {
              const processedMedias = await processMedias(data.medias);
              return {
                platform: platform as SocialMediaPlatform,
                content_type: contentType as ContentType,
                content_override: data.content,
                medias: processedMedias.filter((media): media is { file: string } => media !== null),
              };
            })
          );
        })
      );

      // Joint content'i işle
      const processedJointContent = {
        content: jointContent.content,
        medias: (await processMedias(jointContent.medias)).filter((media): media is { file: string } => media !== null),
      };

      // API'ye gönderilecek veriyi hazırla
      const requestData: CompleteSocialMediaTaskRequest = {
        post: {
          content: processedJointContent.content,
          joint_post: isJointPost,
          medias: processedJointContent.medias,
          platform_schedules: platformSchedules.flat(),
        }
      };

      await completeSocialMediaTaskService(task.id, requestData);
      await fetchTask(task.id);

      
      // setCurrentStatus({ key: "completed", label: "Tamamlandı" });
      setIsLoading(false);
      showToast("Tapşırıq tamamlandı", ToastType.SUCCESS);
    } catch (error) {
      console.log(error)

      setIsLoading(false);
      showToast("Xəta baş verdi!", ToastType.ERROR);
    }
    finally{
      setCompleteTaskModal(false);
    }
  };
  
  const handleComplete = async () => {
    if (!task) {
      return;
    }
    if (task.is_social_media_task) {
      handleCompleteSocialMedia();
    } else {
      handleCompleteDefault();
    }
  };

  const handleCancelTask = async () => {
    if (!task) {
      return;
    }
    try {
      setIsLoading(true);
      await cancelTaskService(task.id);
       setCurrentStatus({ key: "cancelled", label: "Ləğv edildi" });
      setIsLoading(false);
      showToast("Tapşırıq ləğv edildi", ToastType.SUCCESS);
      setCancelTaskModal(false);
    } catch (error) {
      setIsLoading(false);
      showToast("Tapşırıq ləğv edilmədi!", ToastType.ERROR);
    }
  };

  const handleUpdateTaskResultDefault = async () => {
    if (!task) {
      return;
    }
    try {
      setIsLoading(true);
      let feedbackData;

      if (task.is_social_media_task) {
        // Social media task için feedback verilerini hazırla
        const socialMediaFeedback = {
          joint_content: jointContent,
          platform_contents: platformContents,
        };
        feedbackData = {
          feedback_text: JSON.stringify(socialMediaFeedback),
          feedback_files: [], // Medya dosyaları platform_contents içinde
        };
      } else {
        // Normal task için feedback verilerini hazırla
        const files = await Promise.all(
          feedBackFiles.map(async (file) => {
            if (file?.name) {
              const base64File = await convertFileToBase64(file);
              return base64File;
            }
            return null;
          })
        );

        const filteredFiles = files.filter((file) => file !== null);
        feedbackData = {
          feedback_text: feedBackText,
          feedback_files: filteredFiles,
        };
      }

      await updateTaskResultService(task.id, feedbackData);
      
      if (task.is_social_media_task) {
        // Social media task için state'leri güncelle
        setPlatformContents(platformContents);
        setJointContent(jointContent);
      } else {
        // Normal task için state'leri güncelle
        setConfirmedFeedBackText(feedBackText);
        setConfirmedFeedBackFiles(feedBackFiles);
      }

      setIsLoading(false);
      setIsEditing(false);
      showToast("Tapşırıq redaktə edildi", ToastType.SUCCESS);
    } catch (error) {
      setIsLoading(false);
      showToast("Tapşırıq redaktə edilmədi!", ToastType.ERROR);
    }
  };

  const handleUpdateTaskResultSocialMedia = async () => {
    if (!task) {
      return;
    }
    try {
      setIsLoading(true);

      // Medya dosyalarını base64'e dönüştür
      const processMedias = async (medias: File[]) => {
        return await Promise.all(
          medias.map(async (file) => {
            if (file?.name) {
              const base64File = await convertFileToBase64(file);
              return { file: base64File };
            }
            return null;
          })
        );
      };

      // Platform içeriklerini işle
      const platformSchedules = await Promise.all(
        Object.entries(platformContents).map(async ([platform, contentTypes]) => {
          return await Promise.all(
            Object.entries(contentTypes).map(async ([contentType, data]) => {
              const processedMedias = await processMedias(data.medias);
              return {
                platform: platform as SocialMediaPlatform,
                content_type: contentType as ContentType,
                content_override: data.content,
                medias: processedMedias.filter((media): media is { file: string } => media !== null),
              };
            })
          );
        })
      );

      // Joint content'i işle
      const processedJointContent = {
        content: jointContent.content,
        medias: (await processMedias(jointContent.medias)).filter((media): media is { file: string } => media !== null),
      };

      // API'ye gönderilecek veriyi hazırla
      const requestData: CompleteSocialMediaTaskRequest = {
        post: {
          content: processedJointContent.content,
          joint_post: isJointPost,
          medias: processedJointContent.medias,
          platform_schedules: platformSchedules.flat(),
        }
      };

      await updateSocialMediaTaskResultService(task.id, requestData);
      await fetchTask(task.id);
      setIsEditing(false)
      // setCurrentStatus({ key: "completed", label: "Tamamlandı" });
      showToast("Tapşırıq tamamlandı", ToastType.SUCCESS);
    } catch (error) {
      console.log(error)

      showToast("Xəta baş verdi!", ToastType.ERROR);
    }
    finally{
      setCompleteTaskModal(false);
      setIsLoading(false);
    }
  };
  
  
  const handleUpdateTaskResult = async () => {
    
    if (task?.is_social_media_task) {
      await handleUpdateTaskResultSocialMedia();
      
    } else {
      await handleUpdateTaskResultDefault();
    }
  }


  return (
    <div className="mt-[36px] flex w-full gap-[24px] flex-col lg:flex-row">
      {/* Sol kolon - Ana içerik */}
      <div className="w-full lg:w-[70%] flex flex-col gap-[24px]">
        {/* Main Info Section (Header, Info, Files) */}
        <div className="rounded-[20px] bg-white py-[24px] px-[12px] shadow-sm border border-gray-100">
          <TaskHeader 
            isEditing={isEditing}
            user={user}
            onStartTask={() => setStartTaskModal(true)}
            onCompleteTask={() => setCompleteTaskModal(true)}
            onAcceptTask={() => setAcceptTaskModal(true)}
            onRejectTask={() => setRejectTaskModal(true)}
            onEdit={() => setIsEditing(true)}
            onSendToClient={() => setSendToClientModal(true)}
            onCancelTask={() => setCancelTaskModal(true)}
            onCloseEdit={() => {
              setIsEditing(false);
              setFeedBackText(confirmedFeedBackText);
              setFeedBackFiles(confirmedFeedBackFiles);
            }}
            onUpdateTaskResult={handleUpdateTaskResult}
            isLoading={isLoading}
          />

          <div className="mt-[24px]">
            <TaskInfo />
          </div>

          {task && task.task_files && task.task_files.length > 0 && (
            <div className="mt-[24px]">
              <TaskFiles taskFiles={task.task_files} />
            </div>
          )}
        </div>

        {/* Subtask List Section */}
        {
        Number(task?.subtasks_count) > 0 && (
        <div className="rounded-[20px] bg-white  px-[12px] shadow-sm border border-gray-100">
          <SubtaskList/>
        </div>
        )
        }

        {/* Feedback Section */}
        <div className="rounded-[20px] bg-white py-[24px] px-[12px] shadow-sm border border-gray-100">
          {task?.is_social_media_task ? (
            <SocialMediaFeedback
              isEditing={isEditing}
              platformContents={platformContents}
              setPlatformContents={setPlatformContents}
              jointContent={jointContent}
              setJointContent={setJointContent}
              isJointPost={isJointPost}
              setIsJointPost={ (e) => {
                setIsJointPost(e)
              }}
            />
          ): (
            <DefaultFeedback
              isEditing={isEditing}
              user={user}
              feedBackText={feedBackText}
              setFeedBackText={setFeedBackText}
              feedBackFiles={feedBackFiles}
              setFeedBackFiles={setFeedBackFiles}
              loadingFeedBackFiles={loadingFeedBackFiles}
            />
          )}
        </div>
      </div>

      {/* Sağ kolon - Calendar */}
      <div className="w-full lg:w-[30%] lg:min-w-[300px] relative">
        <div className="sticky top-4">
          <Calendar />
        </div>
      </div>

      <TaskModals
        startTaskModal={startTaskModal}
        setStartTaskModal={setStartTaskModal}
        completeTaskModal={completeTaskModal}
        setCompleteTaskModal={setCompleteTaskModal}
        acceptTaskModal={acceptTaskModal}
        setAcceptTaskModal={setAcceptTaskModal}
        rejectTaskModal={rejectTaskModal}
        setRejectTaskModal={setRejectTaskModal}
        cancelTaskModal={cancelTaskModal}
        setCancelTaskModal={setCancelTaskModal}
        sendToClientModal={sendToClientModal}
        setSendToClientModal={setSendToClientModal}
        handleStartTask={handleStartTask}
        handleComplete={handleComplete}
        handleAcceptTask={handleAcceptTask}
        handleCancelTask={handleCancelTask}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Detail;
