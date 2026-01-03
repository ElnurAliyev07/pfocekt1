import { User } from "./auth.type";
import { Planning, PlanningPostType, PlanningPostStatus } from "./planning.type";
import { PlatformLocation } from "@/app/dashboard/workspaces/[slug]/components/modals/PostPlatformModal";

export interface PostUser{
  assignerId?: number;
  user: User;
  minute: number | null;
  profession: number |null;
}

export interface Post {
  id: number;
  postId?: number;
  type: string;
  description: string;
  date: string | null;
  status: string;
  users: PostUser[];
  platformLocations?: PlatformLocation[];
  is_publishable: boolean;
}

export type PlanningStore = {
  isLoading: boolean;
  plannings: Planning[];
  selectedPlanning: Planning | null;
  postTypes: PlanningPostType [];
  postStatuses: PlanningPostStatus [];
  planning: Planning | null;
  searchQuery: string;
  posts: Post[];
  errors: Record<number, Record<string, string>>;
  fetchPlannings: () => Promise<void>;
  fetchPlanning: (id: number) => Promise<void>;
  setSelectedPlanning: (planning: Planning | null) => void;
  fetchPlanningPostTypes: () => Promise<void>;
  fetchPlanningPostStatuses: () => Promise<void>;
  setIsLoading: (loading: boolean) => void;
  setSearchQuery: (query: string) => void;
  setPosts: (posts: Post[]) => void;
  addPost: () => void;
  removePost: (id: number) => void;
  handleInputChange: <K extends keyof Post>(id: number, field: K, value: Post[K]) => void;
  updatePostUsers: (postId: number, users: PostUser []) => void;
  validatePosts: () => boolean;
  resetPosts: () => void;
  setPostPlatformLocations: (postId: number, platforms: PlatformLocation[]) => void;
};

