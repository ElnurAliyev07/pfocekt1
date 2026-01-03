"use client";

import { getProjectService } from "@/services/client/project.service";
import { getWorkspaceItemService } from "@/services/client/workspace.service";
import { ProjectStore } from "@/types/projectStore.type";
import { create } from "zustand";

const useProjectStore = create<ProjectStore>((set, get) => ({
  workspaceSlug: "",
  workspace: null,
  isLoading: true,
  isFiltered: false,
  projects: [],
  page: 1,
  searchQuery: "",
  dateRange: "",
  hasNextPage: true,
  

  setIsFiltered: (filtered) => {
    set({ isFiltered: filtered });
  },

  setWorkspaceSlug: (workspaceSlug) => {
    set({ workspaceSlug });
  },
 
  setIsLoading: (loading) => {
    set({ isLoading: loading });
  },

  fetchWorkspace: async () => {
    const { workspaceSlug } = get();
    const response = await getWorkspaceItemService({slug: workspaceSlug})
    set({ workspace: response.data });
      
  },
  setWorkspace: async (workspace) => {
    set({ workspace: workspace });
  },
  fetchProjects: async (reset = false) => {
    const { page, searchQuery, projects, workspaceSlug, isFiltered } = get();

    if(page > 1 || searchQuery.length > 0){
      set({ isFiltered: true });
    }else{
      set({ isFiltered: false });
    }
    try {
      set({ isLoading: true });
      const currentPage = reset ? 1 : page; // Reset varsa ilk sayfa
      const response = await getProjectService(
        currentPage,
        searchQuery,
        workspaceSlug
      ); 

      set({
        projects: reset
          ? response.data.results
          : [...projects, ...response.data.results],
        hasNextPage: !!response.data.next,
        page: reset ? 1 : page, // Reset varsa ikinci sayfa olarak başla
        isLoading: false,
      });
    
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  },
  setProjects: (projects) => {
    set({ projects: projects, page: 1, hasNextPage: true });
  },
  setSearchQuery: (query) => {
    set({ searchQuery: query, page: 1, hasNextPage: true });
  },
  resetStore: () => {
    set({
      isLoading: true,
      projects: [],
      page: 1,
      searchQuery: "",
      dateRange: "",
      hasNextPage: true,
    });
  },
}));

export default useProjectStore;
