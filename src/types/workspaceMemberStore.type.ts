import {   WorkspaceMember } from "./workspace.type";

export type WorkspaceMemberStore = {
  isLoading: boolean;
  workspaceMembers: WorkspaceMember[];
  page: number;
  hasNextPage: boolean;
  searchQuery: string;
  dateRange: string;
  error: string | null;
  setError: (error: string | null) => void;
  fetchWorkspaceMembers: (reset?: boolean) => Promise<void>;
  setIsLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
};
