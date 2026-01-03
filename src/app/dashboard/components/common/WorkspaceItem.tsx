import React from "react";
import { Eye, PeopleFilled } from "../svgs/SvgS";
import { Workspace } from "@/types/workspace.type";
import { formatDateOnly } from "@/utils/formateDateTime";
import Image from "next/image";
import Link from "next/link";
import AxesTopRight from "@/components/ui/icons/AxesTopRight";
import File from "@/app/dashboard/components/ui/icons/File";
import Task from "@/app/dashboard/workspaces/components/icons/Task";

interface Props {
  workspace: Workspace;
}

const WorkspaceItem: React.FC<Props> = ({ workspace }) => {
  return (
    <div className="group relative flex flex-col p-4 rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 ease-out hover:border-gray-200 hover:-translate-y-1">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-bl from-blue-50 via-transparent to-transparent rounded-bl-full" />
      
      {/* Header with Title */}
      <Link href={`/dashboard/workspaces/${workspace.slug}/`} className="group-hover:text-blue-600 transition-colors">
        <h2 className="font-semibold text-base text-gray-800 line-clamp-1 mb-3">
          {workspace.title}
        </h2>
      </Link>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full 
                        bg-linear-to-r from-blue-100 to-blue-50 
                        text-blue-500">
            <File className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">{workspace.workspace_project_count}</span>
            <span className="text-xs text-gray-500">Proyektlər</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full 
                        bg-linear-to-r from-purple-100 to-purple-50
                        text-purple-500">
            <Task className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">{workspace.tasks_count}</span>
            <span className="text-xs text-gray-500">Tapşırıqlar</span>
          </div>
        </div>
      </div>

      {/* Members Section */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex relative items-center">
          {workspace.workspace_members.slice(0, 2).map((member, index) => (
            member?.user?.user_profile && (
              <div 
                key={member.user.id}
                className={`${index === 1 ? 'absolute left-[18px]' : ''} 
                          w-8 h-8 rounded-full overflow-hidden 
                          ring-2 ring-white
                          transition-transform duration-300 hover:scale-105
                          ${index === 0 ? 'z-10' : 'z-20'}`}
              >
                <Image
                  className="w-full h-full object-cover bg-gray-100"
                  src={member.user.user_profile.image || "/grid.png"}
                  width={100}
                  height={100}
                  alt={`Member ${index + 1}`}
                />
              </div>
            )
          ))}

          {workspace.workspace_members.filter((member) => member.user).length > 2 && (
            <div className="absolute left-[36px] z-30
                          w-8 h-8 rounded-full
                          ring-2 ring-white
                          bg-linear-to-r from-violet-500 to-fuchsia-500
                          text-white text-xs font-medium
                          flex items-center justify-center
                          transition-transform duration-300 hover:scale-105">
              +{workspace.workspace_members.length - 2}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <PeopleFilled className="text-indigo-500 w-4 h-4" />
          <p className="text-sm font-medium text-indigo-600">{workspace.members_count} üzv</p>
        </div>
      </div>

      {/* Footer with Status and Action */}
      <div className="flex items-center justify-between mt-auto">
        <div className="inline-flex items-center rounded-full py-1 px-2.5
                      bg-linear-to-r from-emerald-50 to-teal-50
                      border border-emerald-100">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
          <span className="text-xs font-medium text-emerald-700 tracking-wide">
            {workspace.status.label}
          </span>
        </div>

        <Link 
          href={`/dashboard/workspaces/${workspace.slug}/`} 
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
          <AxesTopRight className="w-3.5 h-3.5 fill-white" />
        </Link>
      </div>
    </div>
  );
};

export default WorkspaceItem;