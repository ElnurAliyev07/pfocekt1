"use client";


import { getSubtaskItemService } from "@/services/server/subtask.service";
import { SubTask, SubtaskStatus } from "@/types/subtask.type";
import { create } from "zustand";

interface TaskItemStore {
  subtask: SubTask | null;
  previousSubtask: SubTask | null;
  currentStatus: SubtaskStatus | null;
  isLoading: boolean;
  isEditing: boolean;
  setIsLoading: (loading: boolean) => void;
  setIsEditing: (editing: boolean) => void;
  fetchSubtask: (id: number) => Promise<void>;
  setSubtask: (subtask: SubTask) => void;
  setCurrentStatus: (status: SubtaskStatus) => void;
  setPreviousSubtask: (subtask: SubTask) => void;
}

const useTaskItemStore = create<TaskItemStore>((set, get) => ({
  subtask: null,
  previousSubtask: null,
  currentStatus: null,
  isLoading: false,
  isEditing: false,
  setIsLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
  setIsEditing: (editing: boolean) => {
    set({ isEditing: editing });
  },
 
  fetchSubtask: async (id: number) => {
    try {
      set({ isLoading: true });
      const response = await getSubtaskItemService({ id });
      set({ subtask: response.data });
      set({ currentStatus: response.data.subtask_status });
    } catch (error) {
      console.error("Error fetching subtask:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  setSubtask: (subtask: SubTask) => {
    set({ subtask });
  },
  setCurrentStatus: (status: SubtaskStatus) => {
    set({ currentStatus: status });
  },
  setPreviousSubtask: (subtask: SubTask) => {
    set({ previousSubtask: subtask });
  },
}));

export default useTaskItemStore;
