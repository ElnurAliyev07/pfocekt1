import React, { useState } from "react";
import { Planning as PlanningType } from "@/types/planning.type";
import EditPlanningMultiple from "../../modals/EditPlanningMultiple";
import CreatePlanningModal from "../../modals/CreatePlanning";

interface EmptyStateProps {
  type: "planning" | "posts";
  planning?: PlanningType;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, planning }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className="min-h-[200px] md:min-h-[250px] flex flex-col items-center justify-center p-6 md:p-8">
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-200 hover:border-blue-300 transition-all duration-300 cursor-pointer rounded-2xl px-8 md:px-12 py-8 md:py-10 text-center group hover:shadow-lg hover:scale-105 transform"
      >
        <div className="mb-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 group-hover:rotate-12 transition-transform duration-300">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
        </div>
        <h3 className="text-gray-800 text-lg md:text-xl font-semibold mb-2">
          {type === "planning"
            ? "Planlama əlavə edin"
            : "Planlama postu əlavə edin"}
        </h3>
        {type === "planning" && (
          <p className="text-gray-500 text-sm md:text-base">
            Yeni bir planlama yaradın və postlarınızı idarə edin
          </p>
        )}
      </button>
      {type === "planning" && (
        <CreatePlanningModal
          isOpenProps={isOpen}
          onCloseProps={(e) => {
            setIsOpen(e);
          }}
          hiddenButton
        />
      )}
      {type === "posts" && planning && (
        <EditPlanningMultiple
          planning={planning}
          isOpenProps={isOpen}
          onCloseProps={(e) => {
            setIsOpen(e);
          }}
          hiddenButton
        />
      )}
    </div>
  );
};

export default EmptyState; 