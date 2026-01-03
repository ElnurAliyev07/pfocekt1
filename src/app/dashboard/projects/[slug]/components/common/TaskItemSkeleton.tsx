// components/skeletons/TaskItemSkeleton.tsx
import React from "react";

const TaskItemSkeleton = () => {
  return (
    <div
      className="relative h-auto flex flex-col overflow-hidden rounded-xl bg-white border border-slate-200 shadow-sm animate-pulse"
    >
      {/* Priority indicator bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-slate-300 to-slate-200"></div>

      {/* Background blur elements */}
      <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-slate-100 blur-xl"></div>
      <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-slate-100 blur-xl"></div>

      <div className="flex flex-col h-full p-5 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-200" />
            <div className="h-4 w-40 rounded-md bg-slate-200" />
          </div>
          <div className="w-6 h-6 bg-slate-200 rounded-full" />
        </div>

        {/* Progress */}
        <div className="flex flex-col gap-1 my-3">
          <div className="flex items-center justify-between">
            <div className="h-3 w-20 bg-slate-200 rounded" />
            <div className="h-3 w-10 bg-slate-200 rounded" />
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-slate-300 rounded-full w-3/4"></div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex gap-2 mb-4">
          <div className="w-24 h-5 bg-slate-200 rounded-full" />
          <div className="w-16 h-5 bg-slate-200 rounded-full" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="h-14 rounded-xl bg-slate-100" />
          <div className="h-14 rounded-xl bg-slate-100" />
          <div className="h-14 rounded-xl bg-slate-100" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="inline-block h-8 w-8 rounded-full bg-slate-200 border-2 border-white"
              />
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 w-20 bg-slate-200 rounded" />
            <div className="h-9 w-9 rounded-full bg-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItemSkeleton;
