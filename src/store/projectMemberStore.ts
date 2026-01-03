"use client";

import { create } from "zustand";
import { ProjectMemberStore } from "@/types/projectMemberStore.type";
import { getProjectMemberService } from "@/services/client/project.service";
import useTaskStore from "./taskStore";

const useProjectMemberStore = create<ProjectMemberStore>((set, get) => ({
  isLoading: true,
  projectMembers: [],
  page: 1,
  searchQuery: "",
  dateRange: "",
  hasNextPage: true,
  error: null,
  
  setError: (error) => {
    set({ error });
  },

  setIsLoading: (loading) => {
    set({ isLoading: loading });
  },

  fetchProjectMembers: async (reset = false) => {
    const { page, searchQuery, projectMembers } = get();
    const { projectSlug } = useTaskStore.getState();

    try {
      const currentPage = reset ? 1 : page; // Reset varsa ilk sayfa
      const response = await getProjectMemberService(
        currentPage,
        searchQuery,
        projectSlug
      ); // API'den veriyi çek

      set({
        projectMembers: reset
          ? response.data.results
          : [...projectMembers, ...response.data.results],
        hasNextPage: !!response.data.next,
        page: reset ? 2 : page + 1, // Reset varsa ikinci sayfa olarak başla
        isLoading: false
      });
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query, page: 1, hasNextPage: true });
  },
}));

export default useProjectMemberStore;
