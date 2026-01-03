"use client";


import { getProjectItemService } from "@/services/client/project.service";
import { getTaskService } from "@/services/client/task.service";
import { TaskStore } from "@/types/taskStore.type";
import { create } from "zustand";

const useTaskStore = create<TaskStore>((set, get) => ({
  projectSlug: "",
  project: null,
  isLoading: true,
  isFiltered: false,
  tasks: [],
  page: 1,
  hasNextPage: true,
  searchQuery: "",
  dateRange: "",
  error: null,
  setIsFiltered: (filtered) => {
    set({ isFiltered: filtered });
  },
  resetFilters: () => {
    set({ isFiltered: false, searchQuery: "", dateRange: "", page: 1 });
  },
  setProjectSlug: (projectSlug) => {
    set({ projectSlug });
  },
  setProject: (project) => {
    set({ project });
  },
  setError: (error) => {
    set({ error });
  },
  setIsLoading: (loading) => {
    set({ isLoading: loading });
  },
  fetchProject: async () => {
      const { projectSlug } = get();
      const response = await getProjectItemService({slug: projectSlug})
      set({ project: response.data });
        
    },
  fetchTasks: async (reset = false) => {
    const { page, searchQuery, tasks, projectSlug } = get();
    if(page > 1 || searchQuery.length > 0){
      set({ isFiltered: true });
    }else{
      set({ isFiltered: false });
    }
    try {
      set({ isLoading: true });
      const currentPage = reset ? 1 : page; // Reset varsa ilk sayfa
      const response = await getTaskService(
        currentPage,
        searchQuery,
        projectSlug
      ); // API'den veriyi çek

      set({
        tasks: reset
          ? response.data.results
          : [...tasks, ...response.data.results],
        hasNextPage: !!response.data.next,
        page: reset ? 1 : page, // Reset varsa ikinci sayfa olarak başla
      });
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      set({ isLoading: false });
    }
  },
  setTasks: (tasks) => {
    set({ tasks: tasks, page: 1, hasNextPage: true });
  },
  setSearchQuery: (query) => {
    set({ searchQuery: query, page: 1, hasNextPage: true });
  },
}));

export default useTaskStore;
