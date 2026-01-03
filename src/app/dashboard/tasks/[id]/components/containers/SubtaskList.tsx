"use client";

import React, { useEffect, useState } from "react";
import SubtaskItem from "../common/SubtaskItem";
import useSubtaskStore from "@/store/subtaskStore";

import SubtaskItemSkeleton from "../common/SubtaskItemSkeleton";

import useTaskItemStore from "@/store/taskItemStore";

const SubtaskList = () => {
  const { fetchSubtasks, setTask, subtasks } = useSubtaskStore();
  const { task } = useTaskItemStore();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (!task) return;
    setTask(task.id);
    const loadSubtasks = async () => {
      await fetchSubtasks();
      setIsLoading(false);
    };
    loadSubtasks();
  }, [fetchSubtasks, setTask, task?.id]);

  return (
    <div className="mt-[24px] pb-5 flex gap-[12px]">
      <div className="flex-1">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Alt Tapşırıqlar</h2>
          <p className="text-sm text-gray-500 mt-1">Alt tapşırıqlarınızı burada idarə edin</p>
        </div>
        <div id="subtask-container" className="space-y-[16px]">
        {subtasks.map(
          (item, index) =>
            item.previous_subtasks.length === 0 && (
              <SubtaskItem
                persentage={100 / subtasks.length}
                isLast={index === subtasks.length - 1}
                key={index}
                subtask={item}
              />
            )
        )}

        {isLoading && (
          <>
            <SubtaskItemSkeleton />
            <SubtaskItemSkeleton />
            <SubtaskItemSkeleton />
          </>
        )}
        </div>
      </div>
    </div>
  );
};

export default SubtaskList;
