"use client";

import { create } from "zustand";
import useProjectStore from "./projectStore";
import { getPlanningItemService, getPlanningPostStatusService, getPlanningPostTypeService, getPlanningService } from "@/services/client/planning.service";
import { PlanningStore } from "@/types/planningStore.type";

const usePlanningStore = create<PlanningStore>((set, get) => ({
  isLoading: true,
  plannings: [],
  postTypes: [],
  postStatuses: [],
  searchQuery: "",
  planning: null,
  selectedPlanning: null,
  posts:[
    { id: 1, type: '', description: '', date: null, status: 'todo', users: [], platformLocations: [], is_publishable: false },
  ],
  errors: {}, 
  fetchPlanning: async (id) => {
    try {
      const response = await getPlanningItemService(id);
      set({
        planning: response.data,
      });
    } catch (error) {
      console.error("Error fetching planning:", error);
    }
  },
  setIsLoading: (loading) => {
    set({ isLoading: loading });
  },

  fetchPlannings: async () => {
    const { searchQuery } = get();
    const { workspaceSlug } = useProjectStore.getState();

    try {
      const response = await getPlanningService(searchQuery, workspaceSlug);
      set({
        plannings: response.data,
      });
    } catch (error) {
      console.error("Error fetching planning:", error);
    }
  },
  setSelectedPlanning: (planning) => {
    set({ selectedPlanning: planning });
  },
  fetchPlanningPostTypes: async () => {
    try {
      const response = await getPlanningPostTypeService();
      set({
        postTypes: response.data,
      });
    } catch (error) {
      console.error("Failed to fetch post types:", error);
    }
  },
  fetchPlanningPostStatuses: async () => {
    try {
      const response = await getPlanningPostStatusService();
      set({
        postStatuses: response.data,
      });
    } catch (error) {
      console.error("Failed to fetch post statuses:", error);
    }
  },
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
  setPosts: (posts) => {
    // Ensure is_publishable is always present
    const normalizedPosts = posts.map(post => ({
      ...post,
      is_publishable: typeof post.is_publishable === 'boolean' ? post.is_publishable : false
    }));
    set({ posts: normalizedPosts });
  },
  addPost: () =>
    set((state) => ({
      posts: [
        ...state.posts,
        { id: Date.now(), type: '', description: '', date: null, status: 'todo', users: [], platformLocations: [], is_publishable: false },
      ],
    })),
  
  removePost: (id) =>
    set((state) => ({
      posts: state.posts.filter((post) => post.id !== id),
    })),
  
  handleInputChange: (id, field, value) =>
    set((state) => {
      const updatedPosts = state.posts.map((post) =>
        post.id === id ? { ...post, [field]: value } : post
      );
  
      const updatedErrors = { ...state.errors };
      if (updatedErrors[id]?.[field]) {
        delete updatedErrors[id][field];
        if (Object.keys(updatedErrors[id]).length === 0) {
          delete updatedErrors[id];
        }
      }
  
      return {
        posts: updatedPosts,
        errors: updatedErrors,
      };
    }),
  
  updatePostUsers: (postId, users) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { ...post, users } : post
      ),
    })),

  setPostPlatformLocations: (postId, platforms) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === postId ? { 
          ...post, 
          platformLocations: platforms.map(platform => ({
            ...platform,
            locations: platform.locations.map(loc => ({
              ...loc,
              scheduled_date: loc.scheduled_date || null
            }))
          }))
        } : post
      ),
    })),

  validatePosts: () => {
    const errors: Record<number, Record<string, string>> = {};
    const { posts } = get();

    posts.forEach((post) => {
      const postErrors: Record<string, string> = {};
      if (!post.type) postErrors.type = "Post növü tələb olunur.";
      if (!post.status) postErrors.status = "Status tələb olunur.";
      if (!post.date) postErrors.date = "Tarix tələb olunur.";

      if (Object.keys(postErrors).length > 0) {
        errors[post.id] = postErrors;
      }
    });

    set({ errors });
    return Object.keys(errors).length === 0;
  },

  resetPosts: () => set({
    posts: [
      { id: 1, type: '', description: '', date: null, status: 'todo', users: [], platformLocations: [], is_publishable: false },
    ],
    errors: {},
  }),
}));

export default usePlanningStore;
