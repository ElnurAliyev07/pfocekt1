import React from "react";

const WorkspaceItemSkeleton: React.FC = () => {
  return (
    <div className="relative h-auto min-h-[160px] flex flex-col gap-3 p-4 sm:p-5 rounded-2xl border border-[#E8EAED] bg-white animate-pulse">
      {/* Başlık */}
      <div className="h-5 w-3/4 bg-gray-200 rounded-md"></div>
      
      {/* Üyeler */}
      <div className="flex flex-row sm:items-center justify-between gap-3">
        <div className="flex relative items-center gap-2">
          <div className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] bg-gray-200 rounded-xl border-2 border-white"></div>
          <div className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] bg-gray-200 rounded-xl border-2 border-white absolute left-[26px]"></div>
          <div className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] bg-gray-300 rounded-xl border-2 border-white flex items-center justify-center font-bold text-white absolute left-[52px]"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          <div className="h-4 w-12 bg-gray-200 rounded-md"></div>
        </div>
      </div>

      {/* Alt Bilgiler */}
      <div className="flex flex-wrap gap-3 justify-between items-center mt-auto">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
          <div className="h-4 w-16 bg-gray-200 rounded-md"></div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-4 w-16 bg-gray-200 rounded-md"></div>
          <div className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceItemSkeleton;
