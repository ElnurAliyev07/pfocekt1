"use client";

import React from "react";
import useWorkspaceStore from "@/store/workspaceStore";
import WorkspaceItem from "./WorkspaceItem";
import Link from "next/link";
import CreateWorkspaceModal from "../modals/CreateWorkspace";
import { WorkspaceCategory, WorkspaceStatus } from "@/types/workspace.type";
import WorkspaceItemSkeleton from "./WorkspaceItemSkeleton";
import { updateURLParam } from "@/utils/urlUtils";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

interface Props {
  className?: string;
  workspaceCategories: WorkspaceCategory[];
  workspaceStatusList: WorkspaceStatus[];
}

const WorkspaceList: React.FC<Props> = ({
  className = "",
  workspaceCategories,
  workspaceStatusList,
}) => {
  const {
    workspaces,
    isLoading,
    setIsCreator,
    setIsLoading,
    fetchWorkspaces,
  } = useWorkspaceStore();

  const searchParams = useSearchParams();
  const isCreator = searchParams.get("is_creator") === "true";

  const renderSkeleton = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-2"
    >
      {[1, 2].map((item) => (
        <WorkspaceItemSkeleton key={item} />
      ))}
    </motion.div>
  );

  return (
    <div className={`bg-white flex flex-col rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <h2 className="text-sm font-medium text-gray-900">Virtual Ofislər</h2>
        </div>
        <CreateWorkspaceModal
          workspaceCategories={workspaceCategories}
          workspaceStatusList={workspaceStatusList}
        />
      </div>

      {/* Tabs Section - Modern Mobile Style */}
      <div className="flex items-center gap-2 mb-3 bg-gray-50 p-1 rounded-full">
        <button
          onClick={async () => {
            if (isCreator) {
              setIsLoading(true);
              setIsCreator(false);
              updateURLParam("is_creator", "false");
              await fetchWorkspaces(true);
              setIsLoading(false);
            }
          }}
          className={`relative px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-full flex-1 text-center active:scale-95
            ${isCreator ? "text-gray-700" : "bg-white text-primary shadow-sm"}`}
        >
          Üzv olduğum
        </button>
        <button
          onClick={async () => {
            if (!isCreator) {
              setIsLoading(true);
              setIsCreator(true);
              updateURLParam("is_creator", "true");
              await fetchWorkspaces(true);
              setIsLoading(false);
            }
          }}
          className={`relative px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-full flex-1 text-center active:scale-95
            ${!isCreator ? "text-gray-700" : "bg-white text-primary shadow-sm"}`}
        >
          Mənim
        </button>
      </div>

      {/* Workspace List */}
      <motion.div 
        className="space-y-2 grow overflow-y-auto max-h-[300px] sm:max-h-[300px] lg:max-h-none scrollbar-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isLoading ? (
          renderSkeleton()
        ) : workspaces.length > 0 ? (
          workspaces.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="active:scale-98 transition-transform"
            >
              <WorkspaceItem workspace={item} />
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-gray-500 text-sm gap-2">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6.4V3C3 2.73478 3.10536 2.48043 3.29289 2.29289C3.48043 2.10536 3.73478 2 4 2H7.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 17.6V21C3 21.2652 3.10536 21.5196 3.29289 21.7071C3.48043 21.8946 3.73478 22 4 22H7.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.9 17.6V21C20.9 21.2652 20.7946 21.5196 20.6071 21.7071C20.4196 21.8946 20.1652 22 19.9 22H16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.9 6.4V3C20.9 2.73478 20.7946 2.48043 20.6071 2.29289C20.4196 2.10536 20.1652 2 19.9 2H16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>Boş</p>
            <button className="text-xs text-primary bg-primary/5 px-3 py-1 rounded-full mt-1">Ofis Yarat</button>
          </div>
        )}
      </motion.div>

      {/* View More Link */}
      {workspaces.length > 0 && (
        <div className="mt-3 text-center">
          <Link 
            href="/dashboard/workspaces/"
            className="inline-flex items-center justify-center w-full bg-gray-50 hover:bg-gray-100 text-primary transition-all text-xs font-medium py-2 rounded-lg active:scale-98"
          >
            Hamısını gör
            <svg 
              className="w-3.5 h-3.5 ml-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default WorkspaceList;
