import React from "react";
import { Task, TaskStatus } from "@/types/task.type";
import Button from "@/components/ui/Button";
import {
  FaPlay,
  FaCheck,
  FaCheckCircle,
  FaTimesCircle,
  FaEdit,
  FaPaperPlane,
  FaTrash,
  FaTimes,
} from "react-icons/fa";
import useTaskItemStore from "@/store/taskItemStore";

interface Props {
  isEditing: boolean;
  user: any;
  onStartTask: () => void;
  onCompleteTask: () => void;
  onAcceptTask: () => void;
  onRejectTask: () => void;
  onEdit: () => void;
  onSendToClient: () => void;
  onCancelTask: () => void;
  onCloseEdit: () => void;
  onUpdateTaskResult: () => void;
  isLoading: boolean;
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
  },
  must_be_done_again: {
    bgColor: "bg-[#FFE7E6]",
    textColor: "text-[#E53935]",
    circleColor: "bg-[#E53935]",
  },
  in_progress: {
    bgColor: "bg-[#EFECFF]",
    textColor: "text-[#444BD3]",
    circleColor: "bg-[#444BD3]",
  },
  completed: {
    bgColor: "bg-[#E6F9E8]",
    textColor: "text-[#2E7D32]",
    circleColor: "bg-[#2E7D32]",
  },
  rejected: {
    bgColor: "bg-[#F5F5F5]",
    textColor: "text-[#616161]",
    circleColor: "bg-[#616161]",
  },
  accepted: {
    bgColor: "bg-[#E6F9E8]",
    textColor: "text-[#2E7D32]",
    circleColor: "bg-[#2E7D32]",
  },
  cancelled: {
    bgColor: "bg-[#F5F5F5]",
    textColor: "text-[#616161]",
    circleColor: "bg-[#616161]",
  },
};

const TaskHeader: React.FC<Props> = ({
  isEditing,
  user,
  onStartTask,
  onCompleteTask,
  onAcceptTask,
  onRejectTask,
  onEdit,
  onSendToClient,
  onCancelTask,
  onCloseEdit,
  onUpdateTaskResult,
  isLoading,
}) => {
  const { task, currentStatus } = useTaskItemStore();
  const statusStyle = currentStatus
    ? statusStyles[currentStatus.key]
    : statusStyles["pending"];

  const hasSubtasks = task?.subtasks_count ? Number(task.subtasks_count) > 0 : false;

  return (
    <div className="flex justify-between mb-[24px]">
      <div className="flex gap-[12px]">
        <div
          className={`${
            isEditing ? "bg-[#dbb90d]" : statusStyle.bgColor
          } h-[30px] flex items-center gap-[4px] px-[12px] py-[4px] rounded-[4px]`}
        >
          <div
            className={`h-[8px] w-[8px] rounded-full ${
              isEditing ? "bg-white" : statusStyle.circleColor
            }`}
          ></div>
          <div
            className={`${
              isEditing ? "text-white" : statusStyle.textColor
            } text-[12px] leading-[16px] font-medium `}
          >
            {isEditing ? "Redaktə edilir" : currentStatus?.label}
          </div>
        </div>
      </div>

      <div className="flex max-w-[calc(100%-250px)] justify-end gap-[12px]">
        <div className="flex flex-wrap justify-end items-center gap-[8px]">
          {isEditing && (
            <>
              <Button
                onPress={onCloseEdit}
                variant="flat"
                size="sm"
                radius="lg"
                leadingIcon={<FaTimes />}
              >
                Bağla
              </Button>
              <Button
                onPress={onUpdateTaskResult}
                variant="primary"
                size="sm"
                radius="lg"
                isLoading={isLoading}
                leadingIcon={<FaCheck />}
              >
                Təsdiq et
              </Button>
            </>
          )}
          {hasSubtasks && (user?.id === task?.task_creator || user?.id === task?.task_checker) && !isEditing && (
            <>
              {!["accepted", "cancelled"].includes(
                currentStatus?.key || ""
              ) && (
                <Button
                  onPress={onAcceptTask}
                  variant="primary"
                  size="sm"
                  radius="lg"
                  isLoading={isLoading}
                  leadingIcon={<FaCheckCircle />}
                >
                  Təsdiq edirəm
                </Button>
              )}
              {!["cancelled"].includes(currentStatus?.key || "") && (
                <Button
                  onPress={onEdit}
                  variant="warning"
                  size="sm"
                  radius="lg"
                  leadingIcon={<FaEdit />}
                >
                  Redaktə et
                </Button>
              )}
              {["completed", "accepted", "rejected"].includes(
                currentStatus?.key || ""
              ) && (
                <Button
                  onPress={onSendToClient}
                  variant="outline"
                  size="sm"
                  radius="lg"
                  leadingIcon={<FaPaperPlane />}
                >
                  Müştəriyə göndər
                </Button>
              )}
              {(user?.id === task?.task_creator || user?.id === task?.task_checker) && currentStatus?.key !== 'cancelled' && (
                <Button
                  onPress={onCancelTask}
                  variant="danger"
                  size="sm"
                  radius="lg"
                  leadingIcon={<FaTrash />}
                >
                  Ləğv et
                </Button>
              )}
            </>
          )}
        </div>
        {!hasSubtasks && !isEditing && currentStatus?.key !== "cancelled" && (
          <div className="flex flex-wrap justify-end items-center gap-[8px]">
            {currentStatus?.key !== "in_progress" &&
              !["completed", "accepted", "rejected"].includes(
                currentStatus?.key || ""
              ) && (
                <Button
                  onPress={onStartTask}
                  variant="primary"
                  size="sm"
                  radius="lg"
                  isLoading={isLoading}
                  leadingIcon={<FaPlay />}
                >
                  Tapşırığa başla
                </Button>
              )}

            {currentStatus?.key === "in_progress" && (
              <Button
                onPress={onCompleteTask}
                variant="primary"
                size="sm"
                radius="lg"
                isLoading={isLoading}
                leadingIcon={<FaCheck />}
              >
                Tapşırığı tamamla
              </Button>
            )}

            {currentStatus?.key === "completed" && (
              <>
                <Button
                  onPress={onAcceptTask}
                  variant="primary"
                  size="sm"
                  radius="lg"
                  isLoading={isLoading}
                  leadingIcon={<FaCheckCircle />}
                >
                  Təsdiq edirəm
                </Button>
                <Button
                  onPress={onRejectTask}
                  variant="danger"
                  size="sm"
                  radius="lg"
                  leadingIcon={<FaTimesCircle />}
                >
                  Təsdiq etmirəm
                </Button>
              </>
            )}
            {["completed", "accepted", "rejected"].includes(
              currentStatus?.key || ""
            ) && (
              <Button
                onPress={onEdit}
                variant="warning"
                size="sm"
                radius="lg"
                leadingIcon={<FaEdit />}
              >
                Redaktə et
              </Button>
            )}
            {["completed", "accepted", "rejected"].includes(
              currentStatus?.key || ""
            ) && (
              <Button
                onPress={onSendToClient}
                variant="outline"
                size="sm"
                radius="lg"
                leadingIcon={<FaPaperPlane />}
              >
                Müştəriyə göndər
              </Button>
            )}
            {(user?.id === task?.task_creator || user?.id === task?.task_checker) && (
              <Button
                onPress={onCancelTask}
                variant="danger"
                size="sm"
                radius="lg"
                leadingIcon={<FaTrash />}
              >
                Ləğv et
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskHeader;
