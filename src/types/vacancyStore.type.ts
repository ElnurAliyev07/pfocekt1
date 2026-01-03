import { PaginatedResponse } from "./response.type";
import { Vacancy, VacancyCategory, WorkMode, WorkScheduler } from "./vacancy.type";

export interface VacancyStore {
    isLoading: boolean,
    vacancies: Vacancy[],
    vacancyCategories: VacancyCategory[],
    workModes: WorkMode[],
    workSchedulers: WorkScheduler[],
    page: number,
    pageSize: number,
    totalPages: number,
    searchQuery: string,
    workspace: number | undefined,
    dateRange: string,
    category: number | undefined,
    setIsLoading: (loading: boolean) => void;
    setPage: (page: number) => void;
    setTotalPages: (totalPages: number) => void;
    fetchVacancies: (reset?: boolean) => Promise<void>;
    fetchCategories: () => Promise<void>;
    fetchWorkModes: () => Promise<void>;
    fetchWorkSchedulers: () => Promise<void>;
    setVacancies: (vacancies: PaginatedResponse<Vacancy>) => void;
    setSearchQuery: (query: string) => void;
    setCategory: (category: number | undefined) => void;
}  