import { User } from "./auth.type";
import { Profession } from "./profession.type";
import { Project } from "./project.type";
import { PlatformLocation } from "@/app/dashboard/workspaces/[slug]/components/modals/PostPlatformModal";
import { ContentType, SocialMediaPlatform } from "./social-media.type";
import { SocialAccount } from "./social_account.type";

export interface PlanningPlatform {
  id: number;
  created: string;
  updated: string;
  title: string;
  link: string;
  planning: number;
  icon?: string;
}

export interface PlanningPostStatus {
  key: "todo" | "scheduled" | "published" | "failed" | "cancelled";
  label: string;
}

export interface PlatformIntent {
  platform: SocialMediaPlatform;
  content_type: ContentType;
  scheduled_date: string | null;
};

export interface PlanningPostAssigner {
  id: number;
  user: User;
  created: string;
  updated: string;
  time: number | null;
  planning_post: number;
  profession: Profession | null;
}

export interface PlanningPostType {
  id: number;
  created: string;
  updated: string;
  title: string;
}

export interface PlanningPost {
  id: number;
  type: PlanningPostType;
  created: string;
  updated: string;
  content: string;
  date: string;
  planning: Planning | null;
  status: PlanningPostStatus;
  planning_post_assigners: PlanningPostAssigner[];
  task: number | null;
  platform_locations?: PlatformLocation[];
  platform_intents: PlatformIntent[];
  is_publishable: boolean;
  is_reserved: boolean;
}


export interface Planning {
  id: number;
  customer?: User;
  controller: User;
  // planning_posts: PlanningPost[];
  created: string;
  updated: string;
  project: Project;
  social_accounts: SocialAccount []
}

export interface CreatePlanningPost {
  content: string;
  date: string;
  type: number;
  planning: number;
  status: number;
}

export interface CreatePlanning {
  customer?: number;
  project: number;
  controller?: number;
}

export interface CreatePlanningPlatform {
  title?: string;
  link: string;
  planning?: number;
}

export interface PlanningPostType {
  id: number;
  created: string;
  updated: string;
  title: string;
}

export interface CreateBulkPlanning {
  customer?: number;
  project: number;
  controller?: number;
  planning_posts: {
    type: number;
    content: string;
    date: string;
    status: string;
    planning_post_assigners: {
      user: number;
      profession: number;
      time: number;
    }[];
    platform_intents: PlatformIntent[];
  }[];
}

export interface EditBulkPlanning {
  customer?: number;
  project: number;
  controller?: number;
  planning_posts: EditBulkPlanningPost[];
}

export interface EditBulkPlanningPost {
  id?: number;
  content: string;
  date: string;
  type: number;
  status: string;
  planning_post_assigners: EditBulkPlanningPostAssigner[];
  platform_intents: PlatformIntent[];
  is_publishable: boolean;
}

export interface EditBulkPlanningPostAssigner {
  id?: number;
  user: number;
  profession?: number;
  time?: number;
}
