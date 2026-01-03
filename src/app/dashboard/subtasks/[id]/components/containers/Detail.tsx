"use client";

import Menu from "@/components/ui/icons/Menu";
import { SubTask, SubtaskStatus } from "@/types/subtask.type";
import React, { useEffect, useState } from "react";
import Date from "../icons/Date";
import CustomEditor from "@/components/ui/form/input/CustomEditor";
import {
  formatDate,
  formatDateOnly,
  formatTime,
  getCurrentTimeISO,
} from "@/utils/formateDateTime";
import { capitalize } from "@/utils/textUtils";
import { getSubtaskByKey } from "@/types/task_helper.type";

import MultipleFileUpload from "@/components/ui/form/input/MultipleFileUpload";
import {
  acceptSubtaskService,
  completeSubTaskService,
  startSubTaskService,
  updateSubTaskResultService,
} from "@/services/client/subtask.service";
import { showToast, ToastType } from "@/utils/toastUtils";
import { convertFileToBase64 } from "@/utils/base64";
import FileInput from "@/components/ui/file/FileInput";
import { useAuth } from "@/providers/AuthProvider";
import {
  base64ToFile,
  convertMultipleFiles,
  customFileToFile,
} from "@/utils/fileUtils";
import { CustomFile } from "@/types/customFile.type";
import { getSubtaskItemService } from "@/services/server/subtask.service";
import Image from "next/image";
import { useAppContext } from "@/providers/AppProvider";

interface Props {
  subtask: SubTask;
}

interface ConvertedFile extends Omit<CustomFile, "file"> {
  file: File;
}

const statusStyles: Record<
  string,
  { bgColor: string; textColor: string; circleColor: string }
> = {
  pending: {
    bgColor: "bg-[#FEF9E1]",
    textColor: "text-[#F2A705]",
    circleColor: "bg-[#F2A705]",
  },
  must_be_done: {
    bgColor: "bg-[#FFE7E6]",
    textColor: "text-[#E53935]",
    circleColor: "bg-[#E53935]",
  }, // Kırmızı tonları
  must_be_done_again: {
    bgColor: "bg-[#FFE7E6]",
    textColor: "text-[#E53935]",
    circleColor: "bg-[#E53935]",
  }, // Kırmızı tonları
  in_progress: {
    bgColor: "bg-[#EFECFF]",
    textColor: "text-[#444BD3]",
    circleColor: "bg-[#444BD3]",
  },
  completed: {
    bgColor: "bg-[#E6F9E8]",
    textColor: "text-[#2E7D32]",
    circleColor: "bg-[#2E7D32]",
  }, // Yeşil tonları
  rejected: {
    bgColor: "bg-[#F5F5F5]",
    textColor: "text-[#616161]",
    circleColor: "bg-[#616161]",
  }, // Gri tonları
  accepted: {
    bgColor: "bg-[#E6F9E8]",
    textColor: "text-[#2E7D32]",
    circleColor: "bg-[#2E7D32]",
  },
};

const Detail: React.FC<Props> = ({ subtask }) => {
  const [currentStatus, setCurrentStatus] = useState<SubtaskStatus>(
    subtask.subtask_status
  );
  const [previousSubtask, setPreviousSubtask] = useState<SubTask | null>(null);
  const [lastStatusHistory, setLastStatusHistory] = useState<
    string | undefined
  >(
    subtask.status_history.filter(
      (task) => task.new_status === currentStatus.status
    )[
      subtask.status_history.filter(
        (task) => task.new_status === currentStatus.status
      ).length - 1
    ]?.changed_at
  );

  const [feedBackFiles, setFeedBackFiles] = useState<File[]>([]);
  const [confirmedFeedBackFiles, setConfirmedFeedBackFiles] = useState<File[]>(
    []
  );
  const [feedBackText, setFeedBackText] = useState<string>(
    subtask.feedback_text || ""
  );
  const [confirmedFeedBackText, setConfirmedFeedBackText] = useState<string>(
    subtask.feedback_text || ""
  );
  const [isEditing, setIsEditing] = useState(false);

  // Converted files states
  const [convertedSubtaskFiles, setConvertedSubtaskFiles] = useState<
    ConvertedFile[]
  >([]);
  const [convertedPreviousFiles, setConvertedPreviousFiles] = useState<
    ConvertedFile[]
  >([]);
  const [isLoadingSubtaskFiles, setIsLoadingSubtaskFiles] = useState(true);
  const [isLoadingPreviousFiles, setIsLoadingPreviousFiles] = useState(true);

  const { user } = useAuth();
  const { setIsLoading } = useAppContext();

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
    if (subtask.feedback_files && subtask.feedback_files.length > 0) {
      convertAndSetFiles(subtask.feedback_files);
    }
  }, [subtask.feedback_files]);

  // Convert subtask files
  useEffect(() => {
    const convertSubtaskFiles = async () => {
      try {
        const converted = await Promise.all(
          subtask.subtask_files.map(async (item) => ({
            ...item,
            file: await customFileToFile(item.file),
          }))
        );
        setConvertedSubtaskFiles(converted);
      } catch (error) {
        console.error("Error converting subtask files:", error);
      } finally {
        setIsLoadingSubtaskFiles(false);
      }
    };

    if (subtask.subtask_files.length > 0) {
      convertSubtaskFiles();
    } else {
      setIsLoadingSubtaskFiles(false);
    }
  }, [subtask.subtask_files]);

  // Convert previous subtask files
  useEffect(() => {
    const convertPreviousFiles = async () => {
      if (
        previousSubtask?.feedback_files &&
        previousSubtask.feedback_files.length > 0
      ) {
        try {
          const converted = await Promise.all(
            previousSubtask.feedback_files.map(async (item) => ({
              ...item,
              file: await customFileToFile(item.file),
            }))
          );
          setConvertedPreviousFiles(converted);
        } catch (error) {
          console.error("Error converting previous files:", error);
        } finally {
          setIsLoadingPreviousFiles(false);
        }
      } else {
        setIsLoadingPreviousFiles(false);
      }
    };

    convertPreviousFiles();
  }, [previousSubtask?.feedback_files]);

  useEffect(() => {
    const fetchPreviousSubtask = async () => {
      if (subtask.previous_subtasks && subtask.previous_subtasks.length > 0) {
        try {
          const response = await getSubtaskItemService({
            id: subtask.previous_subtasks[0],
          });
          setPreviousSubtask(response.data);
        } catch (error) {
          console.error("Error fetching previous subtask:", error);
        }
      }
    };

    fetchPreviousSubtask();
  }, [subtask.previous_subtasks]);

  const handleStartTask = async () => {
    try {
      setIsLoading(true);
      await startSubTaskService(subtask.id);
      setCurrentStatus({ status: "in_progress", status_display: "Davam edir" });
      setLastStatusHistory(getCurrentTimeISO());
      setIsLoading(false);
      showToast("Tapşırıq başladı", ToastType.SUCCESS);
    } catch (error) {
      console.log(error);
      showToast("Failed to start subtask!", ToastType.ERROR);
      setIsLoading(false);
    }
  };

  const handleAcceptTask = async () => {
    try {
      setIsLoading(true);
      await acceptSubtaskService(subtask.id);
      setCurrentStatus({ status: "accepted", status_display: "Qəbul edildi" });
      setLastStatusHistory(getCurrentTimeISO());
      setIsLoading(false);
      showToast("Tapşırıq qəbul edildi", ToastType.SUCCESS);
    } catch (error) {
      console.log(error);
      showToast("Failed to start subtask!", ToastType.ERROR);
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    try {
      setIsLoading(true);
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
      await completeSubTaskService(subtask.id, {
        feedback_files: filteredFiles,
        feedback_text: feedBackText,
      });
      setCurrentStatus({ status: "completed", status_display: "Tamamlandı" });
      setLastStatusHistory(getCurrentTimeISO());
      setIsLoading(false);
      showToast("Tapşırıq göndərildi", ToastType.SUCCESS);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      showToast("Mətn və ya fayl göndərilməlidir!", ToastType.ERROR);
    }
  };

  const handleUpdateTaskResult = async () => {
    try {
      setIsLoading(true);
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
      await updateSubTaskResultService(subtask.id, {
        feedback_files: filteredFiles,
        feedback_text: feedBackText,
      });

      setConfirmedFeedBackText(feedBackText);
      setConfirmedFeedBackFiles(feedBackFiles);
      setIsEditing(false);
      setIsLoading(false);
      showToast("Tapşırıq redaktə edildi", ToastType.SUCCESS);
    } catch (error) {
      setIsLoading(false);
      showToast("Tapşırıq redaktə edilmədi!", ToastType.ERROR);
    }
  };

  const statusStyle =
    statusStyles[currentStatus.status] || statusStyles["pending"];

  return (
    <div className="mt-4 md:mt-8 bg-white rounded-2xl shadow-sm border border-gray-100">
      {/* Header Section */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 w-full sm:w-auto">
            <div
              className={`${statusStyle.bgColor} h-7 sm:h-8 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg transition-all duration-200`}
            >
              <div
                className={`h-1.5 sm:h-2 w-1.5 sm:w-2 rounded-full ${statusStyle.circleColor}`}
              ></div>
              <div
                className={`${statusStyle.textColor} text-xs sm:text-sm font-medium`}
              >
                {currentStatus.status_display}
              </div>
            </div>
            {!["in_progress", "must_be_done", "pending"].includes(
              currentStatus.status
            ) && (
              <div className="flex items-center text-xs sm:text-sm font-medium text-gray-500">
                {lastStatusHistory && formatDate(lastStatusHistory)}
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
            {currentStatus.status !== "in_progress" &&
              !["completed", "accepted", "rejected"].includes(
                currentStatus.status
              ) &&
              user?.id === subtask.assigned_user.user.id && (
                <button
                  disabled={
                    !["must_be_done", "must_be_done_again", "pending"].includes(
                      currentStatus.status
                    )
                  }
                  onClick={handleStartTask}
                  type="button"
                  className={`
                    ${
                      [
                        "must_be_done",
                        "must_be_done_again",
                        "pending",
                      ].includes(currentStatus.status)
                        ? "bg-primary hover:bg-primary-hover focus:bg-primary-focus"
                        : "bg-primary-disabled cursor-not-allowed"
                    } 
                                    w-full sm:w-auto h-9 sm:h-10 px-4 sm:px-5 text-xs sm:text-sm font-medium text-white rounded-lg
                                    transition-all duration-200 transform hover:scale-[1.02]
                                `}
                >
                  {currentStatus.status == "pending"
                    ? "Taska vaxtından əvvəl başla"
                    : "Taska başla"}
                </button>
              )}
            {currentStatus.status === "in_progress" && !isEditing && (
              <button
                onClick={handleComplete}
                type="button"
                className={`
                                    bg-primary hover:bg-primary-hover focus:bg-primary-focus 
                                    w-full sm:w-auto h-9 sm:h-10 px-4 sm:px-5 text-xs sm:text-sm font-medium text-white rounded-lg
                                    transition-all duration-200 transform hover:scale-[1.02]
                                `}
              >
                Taskı təhvil ver
              </button>
            )}
            {currentStatus.status === "completed" &&
              (subtask.subtask_checker == user?.id ||
                Number(subtask.subtask_creator) == user?.id) && (
                <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-2">
                  {!isEditing ? (
                    <>
                      <button
                        onClick={handleAcceptTask}
                        type="button"
                        className={`
                                        bg-primary hover:bg-primary-hover h-9 sm:h-10 px-4 sm:px-5 text-xs sm:text-sm font-medium 
                                        text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02]
                                        w-full sm:w-auto
                                    `}
                      >
                        Təsdiq edirəm
                      </button>
                      <button
                        type="button"
                        className={`
                                        bg-red-500 hover:bg-red-400 h-9 sm:h-10 px-4 sm:px-5 text-xs sm:text-sm font-medium 
                                        text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02]
                                        w-full sm:w-auto
                                    `}
                      >
                        Təsdiq etmirəm
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleUpdateTaskResult}
                        type="button"
                        className={`
                          bg-primary hover:bg-primary-hover h-9 sm:h-10 px-4 sm:px-5 text-xs sm:text-sm font-medium 
                          text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02]
                          w-full sm:w-auto
                        `}
                      >
                        Yadda saxla
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFeedBackText(confirmedFeedBackText);
                          setFeedBackFiles(confirmedFeedBackFiles);
                        }}
                        type="button"
                        className={`
                          bg-gray-500 hover:bg-gray-400 h-9 sm:h-10 px-4 sm:px-5 text-xs sm:text-sm font-medium 
                          text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02]
                          w-full sm:w-auto
                        `}
                      >
                        Ləğv et
                      </button>
                    </>
                  )}
                </div>
              )}
            {currentStatus.status === "completed" &&
              (subtask.subtask_checker == user?.id ||
                Number(subtask.subtask_creator) == user?.id) &&
              !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  type="button"
                  className={`
                    bg-gray-500 hover:bg-gray-400 h-9 sm:h-10 px-4 sm:px-5 text-xs sm:text-sm font-medium 
                    text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02]
                    w-full sm:w-auto
                  `}
                >
                  Redaktə et
                </button>
              )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 md:p-6 space-y-4 md:space-y-5">
        {/* Title and Types */}
        <div className="space-y-2">
          {!subtask.subtask_types || subtask.subtask_types.length === 0 ? (
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">
              {subtask.job}
            </h2>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {subtask.subtask_types.map((type, index) => {
                const subtaskInfo = getSubtaskByKey(type.type);
                return (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs md:text-sm font-medium bg-blue-50 text-blue-700 rounded-lg
                                                 transition-all duration-200 hover:bg-blue-100"
                  >
                    {subtaskInfo?.label || type.type}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {/* Notes Section */}
        {subtask.content && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-semibold text-gray-900">Qeyd</h4>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-600 text-sm leading-relaxed">
                {subtask.content}
              </p>
            </div>
          </div>
        )}

        {/* Task Type and Platform Info */}
        {subtask.task.planning_post && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-semibold text-gray-900">
                Task məlumatları
              </h4>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg space-y-2">
              <p className="flex flex-wrap items-center gap-1.5 text-sm font-medium">
                <span className="text-gray-500">Task növü:</span>
                <span className="text-gray-900">
                  {subtask.task.planning_post.type.title}
                </span>
              </p>
              {subtask.task.planning_post.planning &&
                subtask.task.planning_post.planning.social_accounts.length >
                  0 && (
                  <p className="flex flex-wrap items-center gap-1.5 text-sm font-medium">
                    <span className="text-gray-500">Platforma:</span>
                    <span className="text-gray-900">
                      {subtask.task.planning_post.planning?.social_accounts?.map(
                        (account, index) =>
                          capitalize(account.platform) +
                          (index ===
                          (subtask.task.planning_post.planning?.social_accounts
                            ?.length ?? 0) -
                            1
                            ? ""
                            : ", ")
                      )}
                    </span>
                  </p>
                )}
            </div>
          </div>
        )}

        {/* Dates Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-semibold text-gray-900">Tarixlər</h4>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <Date className="text-gray-400" />
              <span className="text-gray-500">Başlama tarixi:</span>
              <span className="text-gray-900">
                {formatDate(subtask.started_date)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium">
              <Date className="text-gray-400" />
              <span className="text-gray-500">Son tarix:</span>
              <span className="text-gray-900">
                {formatDate(subtask.deadline)}
              </span>
            </div>
          </div>
        </div>

        {/* Files Section */}
        {subtask.subtask_files.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-semibold text-gray-900">Fayllar</h4>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {isLoadingSubtaskFiles ? (
                <div className="text-gray-500">Yükleniyor...</div>
              ) : (
                convertedSubtaskFiles.map((item, index) => (
                  <div key={index} className="group">
                    <FileInput
                      file={item.file}
                      index={index}
                      onDownload={() => {
                        const url = URL.createObjectURL(item.file);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = item.title;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Current Task Executor Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-semibold text-gray-900">
              İcra edən şəxs
            </h4>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Image
                  src={
                    subtask.assigned_user.user.user_profile.image || "/grid.png"
                  }
                  alt="assigned user"
                  width={32}
                  height={32}
                  className="text-sm font-medium text-gray-600"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {subtask.assigned_user.user.first_name}{" "}
                  {subtask.assigned_user.user.last_name}
                </p>
                <p className="text-xs text-gray-500">
                  {subtask.assigned_user.user.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Previous Subtask Section */}
        {previousSubtask && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h4 className="text-base font-semibold text-gray-900">
                Əvvəlki taskın nəticəsi
              </h4>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <div className="space-y-3 bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
              {/* Previous Task Executor Info */}
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span className="text-sm font-medium text-gray-500">
                    İcra edən şəxs
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {previousSubtask.assigned_user.user.first_name?.[0]}
                      {previousSubtask.assigned_user.user.last_name?.[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {previousSubtask.assigned_user.user.first_name}{" "}
                      {previousSubtask.assigned_user.user.last_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {previousSubtask.assigned_user.user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Previous Task Status */}
              <div className="p-3 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  <span className="text-sm font-medium text-gray-500">
                    Task statusu
                  </span>
                </div>
                <div
                  className={`${
                    statusStyles[previousSubtask.subtask_status.status].bgColor
                  } inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg`}
                >
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${
                      statusStyles[previousSubtask.subtask_status.status]
                        .circleColor
                    }`}
                  ></div>
                  <span
                    className={`text-xs font-medium ${
                      statusStyles[previousSubtask.subtask_status.status]
                        .textColor
                    }`}
                  >
                    {previousSubtask.subtask_status.status_display}
                  </span>
                </div>
              </div>

              {/* Previous Task Feedback */}
              {previousSubtask.feedback_text && (
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span className="text-sm font-medium text-gray-500">
                      Qeyd
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {previousSubtask.feedback_text}
                  </p>
                </div>
              )}

              {/* Previous Task Files */}
              {previousSubtask.feedback_files &&
                previousSubtask.feedback_files.length > 0 && (
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      <span className="text-sm font-medium text-gray-500">
                        Fayllar
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {isLoadingPreviousFiles ? (
                        <div className="text-gray-500">Yükleniyor...</div>
                      ) : (
                        convertedPreviousFiles.map((item, index) => (
                          <div key={index} className="group">
                            <FileInput
                              file={item.file}
                              index={index}
                              onDownload={() => {
                                const url = URL.createObjectURL(item.file);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = item.title;
                                a.click();
                                URL.revokeObjectURL(url);
                              }}
                            />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Work Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-semibold text-gray-900">
              İşin təhvili
            </h4>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          {(!subtask.task.is_social_media_task ||
            (subtask.task.is_social_media_task &&
              subtask.subtask_types.some(
                (type) => !["instagram_post_caption"].includes(type.type)
              ))) && (
            <MultipleFileUpload
              defaultValue={feedBackFiles}
              isDisabled={currentStatus.status !== "in_progress" && !isEditing}
              onChange={(e) => setFeedBackFiles(e)}
              maxFiles={
                subtask.subtask_types.some(
                  (type) => type.type === "instagram_post_media"
                )
                  ? 1
                  : undefined
              }
              accept={
                subtask.subtask_types.some(
                  (type) => type.type === "instagram_post_media"
                )
                  ? "image/*"
                  : undefined
              }
            />
          )}
        </div>

        {/* Notes Editor Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-semibold text-gray-900">
              Qeyd əlavə et
            </h4>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>
          {subtask.task.is_social_media_task ? (
            <textarea
              value={feedBackText}
              onChange={(e) => setFeedBackText(e.target.value)}
              disabled={currentStatus.status !== "in_progress" && !isEditing}
              className="w-full h-32 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Qeyd əlavə edin..."
            />
          ) : (
            <CustomEditor
              initialValue={feedBackText}
              onChange={setFeedBackText}
              isDisabled={currentStatus.status !== "in_progress" && !isEditing}
            />
          )}
          {feedBackText.length > 0 &&
            (currentStatus.status === "in_progress" || isEditing) && (
              <div className="flex justify-end">
                <button
                  onClick={isEditing ? handleUpdateTaskResult : handleComplete}
                  type="button"
                  className={`
                    w-full md:w-auto h-9 px-4 bg-primary hover:bg-primary-hover text-sm font-medium 
                                    text-white rounded-lg transition-all duration-200 transform hover:scale-[1.02]
                                `}
                >
                  {isEditing ? "Yadda saxla" : "Göndər"}
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Detail;
