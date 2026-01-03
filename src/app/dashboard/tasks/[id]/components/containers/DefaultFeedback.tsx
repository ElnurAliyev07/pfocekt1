import React from "react";
import { Task, TaskStatus } from "@/types/task.type";
import CustomEditor from "@/components/ui/form/input/CustomEditor";
import MultipleFileUpload from "@/components/ui/form/input/MultipleFileUpload";
import InitializerWrapper from "@/components/common/wrappers/InitializerWrapper";
import FileInputLoading from "@/components/ui/file/FileInputLoading";
import useTaskItemStore from "@/store/taskItemStore";

interface Props {
  user: any;
  isEditing: boolean;
  feedBackText: string;
  setFeedBackText: (text: string) => void;
  feedBackFiles: File[];
  setFeedBackFiles: (files: File[]) => void;
  loadingFeedBackFiles: boolean;
}

export const DefaultFeedback: React.FC<Props> = ({
  user,
  isEditing,
  feedBackText,
  setFeedBackText,
  feedBackFiles,
  setFeedBackFiles,
  loadingFeedBackFiles
}) => {
  const { task, currentStatus } = useTaskItemStore();

  const canEdit = ([
    "in_progress",
    "must_be_done",
    "pending",
    "must_be_done_again",
  ].includes(currentStatus?.key || "") &&
    (task?.task_assigner === user?.id ||
      task?.task_creator === user?.id)) ||
    isEditing;

  const isCompleted = ["completed", "accepted", "cancelled"].includes(currentStatus?.key || "");
  const canModifyFiles = [
    "in_progress",
    "must_be_done",
    "must_be_done_again",
  ].includes(currentStatus?.key || "");

  return (
    <>
      <h3 className="text-t-black text-[16px] font-medium leading-[24px] mb-[16px]">
        İşin Təhvili
      </h3>

      <div className="mb-[16px]">
        {canEdit ? (
          <>
            <label className="block text-[14px] font-medium text-t-gray mb-[8px]">
              Mesajınız
            </label>
            <CustomEditor
              initialValue={feedBackText}
              onChange={setFeedBackText}
              isDisabled={!canModifyFiles && !isEditing}
              placeholder="Geri bildirim yazın..."
            />
          </>
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: feedBackText || task?.feedback_text || "",
            }}
            className="custom-html-content"
          />
        )}
      </div>
      <div className="mb-[24px]">
        {(!isCompleted || isEditing || (task?.feedback_files?.length || 0 > 0)) && (
          <label className="block text-[14px] font-medium text-t-gray mb-[4px]">
            Fayllar
          </label>
        )}
        <InitializerWrapper
          delay={400}
          isLoading={loadingFeedBackFiles}
          loadingComponent={
            <div className="animate-pulse flex gap-[12px]">
              {task?.feedback_files?.map((_, index) => (
                <FileInputLoading key={index} />
              ))}
            </div>
          }
        >
          <MultipleFileUpload
            defaultValue={feedBackFiles}
            isCompleted={isCompleted && !isEditing}
            isDisabled={!canModifyFiles && !isEditing}
            onChange={setFeedBackFiles}
          />
        </InitializerWrapper>
      </div>
    </>
  );
}; 