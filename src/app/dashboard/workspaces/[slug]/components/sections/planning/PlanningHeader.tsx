import React from "react";
import SearchInput from "../../inputs/Search";
import CreatePlanningModal from "../../modals/CreatePlanning";

interface PlanningHeaderProps {
  onSearch: (query: string) => void;
}

const PlanningHeader: React.FC<PlanningHeaderProps> = ({ onSearch }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
    <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 sm:gap-[30px] items-start sm:items-center">
      <h3 className="text-[20px] sm:text-[24px] font-semibold leading-[28px] sm:leading-[32px]">
        Planlama
      </h3>
      <SearchInput placeholder="Axtar..." onSearch={onSearch} className="w-full md:w-auto" />
    </div>
    <CreatePlanningModal />
  </div>
);

export default PlanningHeader; 