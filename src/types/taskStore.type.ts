import { Project } from "./project.type";
import { Task } from "./task.type";

export type TaskStore = {
  project: Project | null,
  projectSlug: string;
  isLoading: boolean;
  tasks: Task[];
  isFiltered: boolean;
  page: number;
  hasNextPage: boolean;
  searchQuery: string;
  dateRange: string;
  error: string | null;
  setIsFiltered: (filtered: boolean) => void;
  setProjectSlug: (project: string) => void;
  setError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  fetchProject:() => Promise<void>;
  setProject: (project: Project ) => void;
  fetchTasks: (reset?: boolean) => Promise<void>;
  resetFilters: () => void;
  setTasks: (tasks: Task[]) => void;
  setSearchQuery: (query: string) => void;
};
