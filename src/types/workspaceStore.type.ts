import { Workspace } from "./workspace.type";

export type WorkspaceStore = {
  isCreator: boolean | undefined;
  category: number | undefined;
  isLoading: boolean;
  isFiltered: boolean;
  workspaces: Workspace[];
  totalPages: number;
  page: number;
  pageSize: number;
  searchQuery: string;
  dateRange: string;
  setIsCreator: (isCreator: boolean | undefined) => void;
  setIsFiltered: (isFiltered: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setPage: (page: number) => void;
  setTotalPages: (totalPages: number) => void;
  fetchWorkspaces: (reset?: boolean, pageSizeLimit?: number) => Promise<void>;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setSearchQuery: (query: string) => void;
  setCategory: (category: number | undefined) => void;
  resetStore: () => void;
};
