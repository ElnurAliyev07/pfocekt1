"use client";

import { getWorkspaceMemberService } from "@/services/client/workspace.service";
import { WorkspaceMemberStore } from "@/types/workspaceMemberStore.type";
import { create } from "zustand";
import useProjectStore from "./projectStore";

const useWorkspaceMemberStore = create<WorkspaceMemberStore>((set, get) => ({
  isLoading: true,
  workspaceMembers: [],
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

  fetchWorkspaceMembers: async (reset = false) => {
    const { page, searchQuery, workspaceMembers } = get();
    const { workspaceSlug } = useProjectStore.getState();

    try {
      const currentPage = reset ? 1 : page; // Reset varsa ilk sayfa
      const response = await getWorkspaceMemberService(
        currentPage,
        searchQuery,
        workspaceSlug
      ); // API'den veriyi çek

      set({
        workspaceMembers: reset
          ? response.data.results
          : [...workspaceMembers, ...response.data.results],
        hasNextPage: !!response.data.next,
        page: reset ? 1 : page, // Reset varsa ikinci sayfa olarak başla
      });
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query, page: 1, hasNextPage: true });
  },
}));

export default useWorkspaceMemberStore;
