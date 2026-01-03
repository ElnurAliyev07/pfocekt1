import { getVacancyCategoryService, getVacancyService, getWorkModeService, getWorkSchedulerService } from "@/services/client/vacancy.service";
import { VacancyStore } from "@/types/vacancyStore.type";
import { create } from "zustand";

export const useVacancyStore = create<VacancyStore>((set, get) => ({
  isLoading: true,
  vacancies: [],
  vacancyCategories: [],
  page: 1,
  pageSize: 6,
  totalPages: 0,
  searchQuery: "",
  dateRange: "",
  workspace: undefined,
  category: undefined,
  workModes: [],
  workSchedulers: [],
  setIsLoading: (loading) => {
    set({ isLoading: loading });
  },

  fetchVacancies: async (reset = false) => {
    const { page, pageSize, searchQuery, category } = get();
    try {
      const currentPage = reset ? 1 : page; // Reset varsa ilk sayfa
      const response = await getVacancyService(currentPage, pageSize, searchQuery, category); // API'den veriyi çek
      const dynamicTotalPages = Math.ceil(response.data.count / pageSize); // Sayfa sayısını hesapla
      set({
        vacancies: response.data.results,
        page: currentPage, 
        totalPages: dynamicTotalPages
      });
    } catch (error) {
      console.error("Error fetching vacancies:", error);
    }
  },
  fetchCategories: async () => {
    const response = await getVacancyCategoryService();
    set({ vacancyCategories: response.data });
  },
  fetchWorkModes: async () => {
    const response = await getWorkModeService();
    set({ workModes: response.data });
  },
  fetchWorkSchedulers: async () => {
    const response = await getWorkSchedulerService();
    set({ workSchedulers: response.data });
  },
  setVacancies: (vacancies) => {
    const {pageSize} = get();
    const dynamicTotalPages = Math.ceil(vacancies.count / pageSize); // Sayfa sayısını hesapla
    set({ vacancies: vacancies.results, totalPages: dynamicTotalPages});
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

}))

