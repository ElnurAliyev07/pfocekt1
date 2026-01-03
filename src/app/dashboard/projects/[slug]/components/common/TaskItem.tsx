// import People from '@/app/dashboard/components/ui/icons/People'
import Task from "@/app/dashboard/workspaces/components/icons/Task";
import Menu from "@/components/ui/icons/Menu";
import { Task as TaskType } from "@/types/task.type";
import Button from "@/components/ui/Button";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownTrigger,
} from "@/components/ui/dropdown/Dropdown";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import DeleteTaskModal from "../modals/DeleteTask";
import { formatDate } from "@/utils/formateDateTime";
import AxesTopRight from "@/components/ui/icons/AxesTopRight";
import {
  HiChatAlt2,
  HiPaperClip,
  HiCalendar,
  HiClock,
  HiStar,
} from "react-icons/hi";
import Avatar from "@/components/common/avatar/Avatar";

interface Props {
  task: TaskType;
}

const TaskItem: React.FC<Props> = ({ task }) => {
  const [selectedModal, setSelectedModal] = useState<string | number | null>(
    null
  );
  const [isHovered, setIsHovered] = useState(false);
  const taskUrl = `/dashboard/tasks/${task.id}/`;

  const openModal = (key: string | number) => {
    setSelectedModal(key);
  };

  const closeModal = () => {
    setSelectedModal(null);
  };

  // Determine priority color
  const getPriorityColor = () => {
    // Replace with actual priority logic from your task object
    const priority = task.priority?.toLowerCase() || "medium";
    switch (priority) {
      case "high":
        return "from-red-500 to-pink-500";
      case "medium":
        return "from-yellow-400 to-orange-500";
      case "low":
        return "from-green-400 to-emerald-500";
      default:
        return "from-blue-400 to-indigo-500";
    }
  };

  // Determine completion percentage (placeholder)
  const completionPercentage = 75;

  const getStatusColors = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          bg: 'from-yellow-50 to-amber-50',
          text: 'text-yellow-700',
          border: 'border-yellow-100',
          icon: 'text-yellow-600'
        };
      case 'in_progress':
        return {
          bg: 'from-blue-50 to-indigo-50',
          text: 'text-blue-700',
          border: 'border-blue-100',
          icon: 'text-blue-600'
        };
      case 'completed':
        return {
          bg: 'from-green-50 to-emerald-50',
          text: 'text-green-700',
          border: 'border-green-100',
          icon: 'text-green-600'
        };
      case 'cancelled':
        return {
          bg: 'from-red-50 to-rose-50',
          text: 'text-red-700',
          border: 'border-red-100',
          icon: 'text-red-600'
        };
      case 'on_hold':
        return {
          bg: 'from-purple-50 to-violet-50',
          text: 'text-purple-700',
          border: 'border-purple-100',
          icon: 'text-purple-600'
        };
      default:
        return {
          bg: 'from-gray-50 to-slate-50',
          text: 'text-gray-700',
          border: 'border-gray-100',
          icon: 'text-gray-600'
        };
    }
  };

  return (
    <div
      className="group relative h-auto flex flex-col overflow-hidden rounded-lg
                 bg-white border border-slate-100
                 shadow-sm transition-all duration-300
                 hover:shadow-md hover:border-slate-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Priority indicator bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-0.5 ${getPriorityColor()}`}
      ></div>

      <div className="flex flex-col h-full p-4">
        {/* Header with Title and Menu */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-50">
              <Task className="w-4 h-4 text-slate-600" />
            </div>
            <Link
              href={taskUrl}
              className="hover:text-blue-600 transition-colors flex-1"
            >
              <h2 className="font-medium text-base text-slate-800 line-clamp-1">
                {task.title}
              </h2>
            </Link>
          </div>

          <Dropdown>
            <DropdownTrigger>
              <Menu className="text-slate-400" />
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem onClick={() => openModal("edit")}>
                Redaktə et
              </DropdownItem>
              <DropdownItem
                onClick={() => openModal("delete")}
                className="text-red-500"
              >
                Sil
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {Number(task.subtasks_count) > 0 && (
          <div className="flex flex-col gap-1 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                İrəliləyiş
              </span>
              <span className="text-xs font-medium text-blue-600">
                {completionPercentage}%
              </span>
            </div>
            <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Status badge */}
        <div className="flex flex-wrap gap-2 mb-3">
          <div className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${getStatusColors(task.status.key).bg} ${getStatusColors(task.status.key).text} border ${getStatusColors(task.status.key).border}`}>
            <HiClock className={`w-3 h-3 mr-1 ${getStatusColors(task.status.key).icon}`} />
            {task.status.label}
          </div>
        </div>

        {/* Task stat cards */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {Number(task.subtasks_count) > 0 && (
            <div className="flex flex-col items-center justify-center py-1.5 rounded-md bg-slate-50">
              <span className="text-sm font-medium text-slate-700">
                {task.subtasks_count}
              </span>
              <span className="text-xs text-slate-500">Subtask</span>
            </div>
          )}
          <div className="flex flex-col items-center justify-center py-1.5 rounded-md bg-slate-50">
            <span className="text-sm font-medium text-slate-700">
              {task.message_count}
            </span>
            <span className="text-xs text-slate-500">Mesaj</span>
          </div>

          <div className="flex flex-col items-center justify-center py-1.5 rounded-md bg-slate-50">
            <span className="text-sm font-medium text-slate-700">
              {task.task_files.length}
            </span>
            <span className="text-xs text-slate-500">Fayl</span>
          </div>
        </div>

        {/* Members & Date */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
          <div className="flex -space-x-2 overflow-hidden p-1">
            {task.assigned_members.slice(0, 2).map(
              (member, index) =>
                member?.user?.user_profile && (
                  <div key={index} className="relative z-[1] hover:z-[2]">
                    <Avatar 
                      size="sm" 
                      user={member.user}
                      showHover={true}
                    />
                  </div>
                )
            )}

            {task.assigned_members.length > 2 && (
              <div className="z-[1] flex items-center justify-center h-8 w-8 rounded-full bg-slate-100 text-slate-600 text-xs font-medium ring-2 ring-white">
                +{task.assigned_members.length - 2}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center text-slate-500 text-xs">
              <HiCalendar className="h-3.5 w-3.5 mr-1" />
              <time className="whitespace-nowrap">
                {formatDate(task.started)}
              </time>
            </div>

            <Link href={taskUrl} className="group/button">
              <div className="relative">
                <div className="h-8 w-8 flex items-center justify-center rounded-md 
                              bg-blue-50 text-blue-600
                              hover:bg-blue-100 transition-colors
                              shadow-sm hover:shadow">
                  <AxesTopRight className="w-4 h-4 fill-blue-600" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      <DeleteTaskModal
        task={task.id}
        isOpen={selectedModal === "delete"}
        onClose={closeModal}
      />
    </div>
  );
};

export default TaskItem;
