import React, { useState } from "react";
import Menu from "@/components/ui/icons/Menu";
import Task from "../../../components/icons/Task";
import File from "../../../../components/ui/icons/File";
import Image from "next/image";
import { Project } from "@/types/project.type";
import EditProjectModal from "../modals/EditProject";
import Link from "next/link";
import DeleteProjectModal from "../modals/DeleteProject";
import AxesTopRight from "@/components/ui/icons/AxesTopRight";
import Avatar from "@/components/common/avatar/Avatar";
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
        <Avatar
          key={index}
          user={member.user}
          size="sm"
          showHover={true}
        />
      ))}

      {hasMoreMembers && (
        <div
          className="absolute left-[36px] z-30
                      w-9 h-9 rounded-full
                      ring-2 ring-white
                      bg-blue-600
                      text-white text-xs font-medium
                      flex items-center justify-center"
        >
          +{count - 2}
        </div>
      )}
    </div>
  );
};

// Main component
const ProjectItem: React.FC<{ project: Project }> = ({ project }) => {
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const projectUrl = `/dashboard/projects/${project.slug}/`;

  return (
    <div
      className="group relative flex flex-col gap-4 p-5 sm:p-6
                        min-h-[160px] rounded-lg overflow-hidden
                        bg-white
                        border border-gray-200
                        shadow-sm hover:shadow-md
                        transition-all duration-300 ease-out
                        hover:border-gray-300 hover:-translate-y-0.5"
    >
      {/* Background element */}
      <div className="absolute inset-0 opacity-[0.02] bg-slate-600 pointer-events-none" />
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-50 opacity-40 rounded-br-full pointer-events-none" />

      {/* Header with Title and Menu */}
      <div className="flex items-center justify-between">
        <Link
          href={projectUrl}
          className="group-hover:text-blue-600 transition-colors"
        >
          <h2 className="font-semibold text-base sm:text-lg text-gray-800 line-clamp-1">
            {project.title}
          </h2>
        </Link>

        <Dropdown>
          <DropdownTrigger nested>
                <Menu className="text-gray-500" />
          </DropdownTrigger>
          <DropdownMenu>
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
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3">
        <div className="px-3 py-1.5 bg-slate-50 rounded-lg flex items-center gap-2">
          <Task className="w-4 h-4 text-slate-600" />
          <span className="text-sm font-medium text-slate-700">
            {project.tasks_count} Tasks
          </span>
        </div>

        <div className="px-3 py-1.5 bg-blue-50 rounded-lg flex items-center gap-2">
          <File className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700">
            {project.subtasks_count} Subtasks
          </span>
        </div>
      </div>

      {/* Footer with Members and Action */}
      <div className="flex items-center justify-between mt-auto pt-4">
        <div className="flex items-center gap-2">
          <MemberAvatars
            members={project.project_members}
            count={project.project_members.length}
          />
          <span
            className={`text-sm text-gray-500 ${
              project.project_members.length > 2
                ? "ml-[28px]"
                : project.project_members.length > 1
                ? "ml-[18px]"
                : ""
            }`}
          >
            {project.project_members.length} Üzv
          </span>
        </div>

        <Link
          href={projectUrl}
          className="h-9 px-4 flex items-center gap-2
                              bg-blue-600
                              text-white rounded-lg text-sm font-medium
                              hover:bg-blue-700
                              active:scale-[0.98]
                              transition-all duration-200
                              shadow-sm"
          aria-label="View project details"
        >
          Bax
          <AxesTopRight className="w-4 h-4 fill-white" />
        </Link>
      </div>

      {/* Modals */}
      <EditProjectModal
        project={project}
        isOpen={selectedModal === "edit"}
        onClose={() => setSelectedModal(null)}
      />
      <DeleteProjectModal
        project_slug={project.slug}
        isOpen={selectedModal === "delete"}
        onClose={() => setSelectedModal(null)}
      />
    </div>
  );
};

export default ProjectItem;
