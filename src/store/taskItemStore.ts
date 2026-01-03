"use client";


import { getTaskItemService } from "@/services/server/task.service";
import { Task, TaskStatus } from "@/types/task.type";
import { create } from "zustand";

interface TaskItemStore {
  task: Task | null;
  currentStatus: TaskStatus | null;
  isLoading: boolean;
  isEditing: boolean;
  isJointPost: boolean;
  setIsLoading: (loading: boolean) => void;
  setIsEditing: (editing: boolean) => void;
  setIsJointPost: (jointPost: boolean) => void;
  fetchTask: (id: number) => Promise<void>;
  setTask: (task: Task) => void;
  setCurrentStatus: (status: TaskStatus) => void;
}

const useTaskItemStore = create<TaskItemStore>((set, get) => ({
  task: null,
  currentStatus: null,
  isLoading: false,
  isEditing: false,
  isJointPost: false,
  setIsLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },
  setIsEditing: (editing: boolean) => {
    set({ isEditing: editing });
  },
  setIsJointPost: (jointPost: boolean) => {
    set({ isJointPost: jointPost });
  },
  fetchTask: async (id: number) => {
    try {
      set({ isLoading: true });
      const response = await getTaskItemService({ id });
      set({ task: response.data });
      set({ currentStatus: response.data.status });
      set({ isJointPost: response.data.post?.joint_post || false });
    } catch (error) {
      console.error("Error fetching task:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  setTask: (task: Task) => {
    set({ task });
  },
  setCurrentStatus: (status: TaskStatus) => {
    set({ currentStatus: status });
  },
}));

export default useTaskItemStore;
