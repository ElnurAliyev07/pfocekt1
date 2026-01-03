import { ProjectMember } from "./project.type";

export type ProjectMemberStore = {
  isLoading: boolean;
  projectMembers: ProjectMember[];
  page: number;
  hasNextPage: boolean;
  searchQuery: string;
  dateRange: string;
  error: string | null;
  setError: (error: string | null) => void;
  fetchProjectMembers: (reset?: boolean) => Promise<void>;
  setIsLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
};
