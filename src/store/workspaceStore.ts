"use client";

import { getWorkspaceService } from "@/services/client/workspace.service";
import { WorkspaceStore } from "@/types/workspaceStore.type";
import { create } from "zustand";



const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  isCreator: undefined,
  isLoading: true,
  isFiltered: false,
  workspaces: [],
  page: 1,
  pageSize: 24,
  totalPages: 0,
  searchQuery: "",
  dateRange: "",
  category:  undefined ,
  setIsCreator: (isCreator) => {
    set({ isCreator: isCreator });
  },
  setIsFiltered: (isFiltered) => {
    set({ isFiltered: isFiltered });
  },
  setIsLoading: (loading) => {
    set({ isLoading: loading });
  },
  fetchWorkspaces: async (reset = false, pageSizeLimit) => {
    const { page, pageSize, searchQuery, category, isCreator } = get();
    if(page > 1 || searchQuery || category || isCreator){
      set({ isFiltered: true });
    }else{
      set({ isFiltered: false });
    }
    try {
      set({ isLoading: true });

      const currentPage = reset ? 1 : page; 

      const response = await getWorkspaceService(currentPage, pageSizeLimit || pageSize, searchQuery, category, isCreator); 

      const dynamicTotalPages = Math.ceil(response.data.count / (pageSizeLimit || pageSize)); 
      set({
        workspaces: response.data.results,
        page: currentPage, 
        totalPages: dynamicTotalPages,
      });
     
      
    } catch (error) {
      
    }finally{
      set({ isLoading: false });
    }
  },
  setWorkspaces: (workspaces) => {
    set({ workspaces: workspaces, page: 1});
  },
  setSearchQuery: (query) => {
    set({ searchQuery: query, page: 1});
  },
 
  setPage(page) {
      set({ page: page });
  },
  setTotalPages(totalPages) {
    set({ totalPages: totalPages });
  },
  setCategory(category) {
    set({ category: category });
  },
  resetStore() {
    set({
      isCreator: undefined,
      workspaces: [],
      page: 1,
      pageSize: 24,
      totalPages: 0,
      searchQuery: "",
      dateRange: "",
      category: undefined,
      isLoading: true,
    });
  },
}));

export default useWorkspaceStore;
