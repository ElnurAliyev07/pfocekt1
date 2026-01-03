import { User } from "./auth.type";
import { KeyLabel } from "./membershipStatus.type";
import { Workspace } from "./workspace.type";

export interface ProjectMemberStatus{
  key: "pending" | "accepted" | "rejected";
  label: string;
}

export interface ProjectMember {
  id: number;
  user: User;
  role: KeyLabel;
  status: ProjectMemberStatus;
  email: string;
}

export interface CreateProject {
  title: string;
  description: string;
  workspace: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  workspace: Workspace;
  project_members: ProjectMember[];
  get_absolute_url: string;
  creator: string;
  tasks_count: string;
  subtasks_count: string;
  members_count: string;
  created_date: string;
  planning: number;
}

export interface ProjectInvitation {
  id: number;
  user?: User | null;
  role: string;
  created: string;
  updated: string;
  email: string;
  token: string;
  accepted_at: string | null;
  status: string;
  project: Project;
  invited_by: User;
}

