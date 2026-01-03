import usePlanningPostStore from "@/store/planningPostStore";
import usePlanningStore from "@/store/planningStore";
import { updateURLParam } from "@/utils/urlUtils";
import React from "react";

interface PlanningTabsProps {
  plannings: any[];
}

const PlanningTabs: React.FC<PlanningTabsProps> = ({
  plannings,
}) => {
  const {selectedPlanning} = usePlanningStore()
  return  (
  <div className="flex gap-1.5 overflow-x-auto pb-2 my-6 px-1">
    {plannings.map((item, index) => (
      <button
        onClick={() => {
         
          const params = new URLSearchParams(window.location.search);
          params.set("page", '1');
          params.set("planning", item.id);
          window.location.replace(`?${params.toString()}`);

        }
      }
        className={`px-3.5 h-8 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
          selectedPlanning?.id === item.id
            ? "bg-primary/10 text-primary"
            : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
        }`}
        type="button"
        key={index}
      >
        {item.project.title}
      </button>
    ))}
  </div>
)};

export default PlanningTabs; 