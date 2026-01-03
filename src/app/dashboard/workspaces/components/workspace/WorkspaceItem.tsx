"use client";

import React, { useState } from "react";
import Link from "next/link";

// // UI Components
// import {
//   Dropdown,
//   DropdownTrigger,
//   DropdownMenu,
//   DropdownItem,
// } from "@/components/ui/dropdown";
import Button from "@/components/ui/Button";

// Icons
import AxesTopRight from "@/components/ui/icons/AxesTopRight";
import File from "../../../components/ui/icons/File";
import Task from "../icons/Task";
import Menu from "@/components/ui/icons/Menu";

// Modals
import DeleteWorkspaceModal from "../modals/DeleteWorkspace";
import EditWorkspaceModal from "../modals/EditWorkspace";

// Types
import {
  Workspace,
  WorkspaceCategory,
  WorkspaceStatus,
} from "@/types/workspace.type";
import Avatar from "@/components/common/avatar/Avatar";
import { useAuth } from "@/providers/AuthProvider";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@/components/ui/dropdown/Dropdown";

interface MemberAvatarProps {
  members: any[];
  count: number;
}

const MemberAvatars: React.FC<MemberAvatarProps> = ({ members, count }) => {
  const displayMembers = members
    .slice(0, 2)
    .filter((member) => member?.user?.user_profile);
  const hasMoreMembers = count > 2;

  return (
    <div className="flex relative items-center">
      {displayMembers.map((member, index) => (
        <div
          key={member.user.id}
          className={`${index === 1 ? "absolute left-[16px]" : ""} 
                    ${index === 0 ? "z-10" : "z-20"}`}
        >
          <Avatar user={member.user} size="sm" showHover={true} />
        </div>
      ))}

      {hasMoreMembers && (
        <div
          className="absolute left-[32px] z-30
                      w-8 h-8 rounded-full
                      ring-2 ring-white
                      bg-linear-to-r from-violet-500 to-fuchsia-500
                      text-white text-xs font-medium
                      flex items-center justify-center
                      transition-transform duration-300 hover:scale-105"
        >
          +{count - 2}
        </div>
      )}
    </div>
  );
};

interface StatusPillProps {
  status: string;
}

const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  return (
    <div
      className="inline-flex items-center rounded-full py-1 px-2.5
      bg-linear-to-r from-emerald-50 to-teal-50
      border border-emerald-100"
    >
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
      <span className="text-xs font-medium text-emerald-700 tracking-wide">
        {status}
      </span>
    </div>
  );
};

interface WorkspaceItemProps {
  workspace: Workspace;
  workspaceCategories: WorkspaceCategory[];
  workspaceStatusList: WorkspaceStatus[];
  index: number;
}

const WorkspaceItem: React.FC<WorkspaceItemProps> = ({
  workspace,
  workspaceCategories,
  workspaceStatusList,
}) => {
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const { user } = useAuth();
  const workspaceUrl = `/dashboard/workspaces/${workspace.slug}/`;

  return (
    <div
      className="group relative flex flex-col p-4 
                    rounded-xl overflow-hidden
                    bg-white
                    border border-gray-100
                    shadow-sm hover:shadow-md
                    transition-all duration-300 ease-out
                    hover:border-gray-200 hover:-translate-y-1"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-blue-50 via-transparent to-transparent rounded-bl-full" />

      {/* Header with Title and Status */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-3">
          <StatusPill status={workspace.status.label} />
          {Number(workspace.creator) === user?.id && (
            <Dropdown>
              <DropdownTrigger nested>
                <Menu className="text-gray-500" />
              </DropdownTrigger>
              <DropdownMenu placement="bottom-start">
                <DropdownItem onClick={() => setSelectedModal("edit")}>
                  Redaktə et
                </DropdownItem>
                <DropdownItem
                  onClick={() => setSelectedModal("delete")}
                  className="text-red-500"
                >
                  Sil
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>

        <Link
          href={workspaceUrl}
          className="group-hover:text-blue-600 transition-colors"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 line-clamp-2">
            {workspace.title}
          </h2>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 flex items-center justify-center rounded-full 
                        bg-linear-to-r from-blue-100 to-blue-50 
                        text-blue-500"
          >
            <File className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">
              {workspace.workspace_project_count}
            </span>
            <span className="text-xs text-gray-500">Proyektlər</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 flex items-center justify-center rounded-full 
                        bg-linear-to-r from-purple-100 to-purple-50
                        text-purple-500"
          >
            <Task className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">
              {workspace.tasks_count}
            </span>
            <span className="text-xs text-gray-500">Tapşırıqlar</span>
          </div>
        </div>
      </div>

      {/* Footer with Members and Action */}
      <div className="flex items-center justify-between mt-auto pt-3">
        <div className="flex items-center gap-3">
          <MemberAvatars
            members={workspace.workspace_members}
            count={workspace.members_count}
          />
          <span
            className={`text-sm text-gray-500 ${
              workspace.members_count > 2
                ? "ml-[24px]"
                : workspace.members_count > 1
                ? "ml-[16px]"
                : ""
            }`}
          >
            {workspace.members_count} üzv
          </span>
        </div>

        <Link
          href={workspaceUrl}
          className="px-3 h-8 flex items-center gap-1.5
                    bg-linear-to-r from-blue-600 to-blue-500
                    text-white rounded-lg font-medium text-sm
                    hover:from-blue-700 hover:to-blue-600
                    active:scale-[0.98]
                    transition-all duration-200
                    shadow-sm"
          aria-label="Go to workspace"
        >
          Bax
          <AxesTopRight className="w-4 h-4 fill-white" />
        </Link>
      </div>

      {/* Modals */}
      <DeleteWorkspaceModal
        workspace_slug={workspace.slug}
        isOpen={selectedModal === "delete"}
        onClose={() => setSelectedModal(null)}
      />

      <EditWorkspaceModal
        workspace={workspace}
        workspaceCategories={workspaceCategories}
        workspaceStatusList={workspaceStatusList}
        isOpen={selectedModal === "edit"}
        onClose={() => setSelectedModal(null)}
      />
    </div>
  );
};

export default WorkspaceItem;
