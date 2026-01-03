"use client";

import { getSubTaskService } from "@/services/client/subtask.service";
import { SubtaskStore } from "@/types/subtaskStore.type";
import { create } from "zustand";

const useSubtaskStore = create<SubtaskStore>((set, get) => ({
  task: 0,
  isLoading: true,
  subtasks: [],
  error: null,
  setTask: (task) => {
    set({task: task})
  },
  fetchSubtasks: async () => {
    const { task } = get();
    try {
      const response = await getSubTaskService(
        task
      ); // API'den veriyi çek

      set({
        subtasks: response.data,
      });
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  },
  
  setError: (error) => {
    set({ error });
  },
  setIsLoading: (loading) => {
    set({ isLoading: loading });
  },
}));

export default useSubtaskStore;
