"use client";

import { create } from "zustand";
import { getPlanningPostListService } from "@/services/client/planning.service";
import { PlanningPost } from "@/types/planning.type";
import useProjectStore from "./projectStore";
import { updateURLParam } from "@/utils/urlUtils";
import { debounce } from "@/utils/debounceUtils";
import usePlanningStore from "./planningStore";

export type PlanningPostStore = {
  searchQuery: string;
  statusFilter: string;
  start_date: string,
  end_date: string,
  dateRange: { startDate: Date | null; endDate: Date | null };
  sortConfig: { key: 'date' | 'content' | 'status'; direction: 'ascending' | 'descending' } | null;
  isLoading: boolean;
  planningPosts: PlanningPost[];
  page: number;
  pageSize: number;
  totalPages: number;

  fetchPlanningPosts: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: string) => void;
  setDateRange: (range: { startDate: Date | null; endDate: Date | null }) => void;
  setSortConfig: (config: { key: 'date' | 'content' | 'status'; direction: 'ascending' | 'descending' } | null) => void;
  setIsLoading: (loading: boolean) => void;
  setPage: (page: number) => void;
  changePage: (page: number) => void;
  changeSearchQuery: (query: string) => void;
};

const usePlanningPostStore = create<PlanningPostStore>((set, get) => ({
  isLoading: true,
  planningPosts: [],
  start_date: '',
  end_date: '',
  searchQuery: "",
  statusFilter: "All",
  dateRange: { startDate: null, endDate: null },
  sortConfig: null,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  fetchPlanningPosts: async (reset = false) => {
    const { page, pageSize, searchQuery, start_date, end_date } = get();
    const { workspace } = useProjectStore.getState();
    const { selectedPlanning } = usePlanningStore.getState();
    set({ isLoading: true });
    try {
      const response = await getPlanningPostListService(searchQuery, page, pageSize, start_date, end_date , workspace?.id, selectedPlanning?.id);
      const dynamicTotalPages = Math.ceil(response.data.count / pageSize); 
      set({
        planningPosts: response.data.results,
        isLoading: false,
        page: reset ? 1 : page,
        totalPages: dynamicTotalPages,
      });
    } catch (error) {
      console.error("Error fetching planning:", error);
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setDateRange: (range) => set({ dateRange: range }),
  setSortConfig: (config) => set({ sortConfig: config }),

  setIsLoading: (loading) => {
    set({ isLoading: loading });
  },
  setPage: (page) => {
    set({ page: page });
  },
  changePage: (page) => {
    const { fetchPlanningPosts } = get();
    set({ page: page, isLoading: true });
    updateURLParam("page",String(page));
    fetchPlanningPosts();
    set({ isLoading: false });
  },
  changeSearchQuery: (query) => {
    const { fetchPlanningPosts } = get();
    set({ searchQuery: query, isLoading: true, page: 1 });
    
    updateURLParam("search",query);
    updateURLParam("page",String(1));
    fetchPlanningPosts();
    set({ isLoading: false });
  },


}));

export default usePlanningPostStore;
