import { Project } from "./project.type";
import { Workspace } from "./workspace.type";

export type ProjectStore = {
  workspaceSlug: string,
  workspace: Workspace | null,
  isLoading: boolean;
  isFiltered: boolean;
  projects: Project[];
  page: number;
  hasNextPage: boolean;
  searchQuery: string;
  dateRange: string;
  setWorkspaceSlug: (workspace: string ) => void;
  setIsLoading: (loading: boolean) => void;
  setIsFiltered: (filtered: boolean) => void;
  fetchWorkspace:() => Promise<void>;
  setWorkspace: (workspace: Workspace | null ) => void;
  fetchProjects: (reset?: boolean) => Promise<void>;
  setProjects: (projects: Project[]) => void;
  setSearchQuery: (query: string) => void;
  resetStore: () => void;
};
