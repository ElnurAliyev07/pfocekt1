import { User } from "./auth.type";
import { KeyLabel } from "./keyLabel.type";

export interface WorkspaceMemberStatus {
    key: "pending" | "accepted" | "rejected";
    label: string;
}
 
export interface WorkspaceMember {
    id: number;
    user?: User;
    role: KeyLabel;
    email: string;
    status: WorkspaceMemberStatus;
  }
  
export interface WorkspaceCategory {
  id: number;
  name: string;
}

export interface WorkspaceStatus {
  key: string;
  label: string;
}
  
export interface Workspace {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: WorkspaceCategory;
  user_role: string;
  workspace_members: WorkspaceMember[];
  status: WorkspaceStatus;
  creator: string;
  workspace_project_count: number;
  members_count: number;
  tasks_count: number;
  created: string;
  get_absolute_url: string;
}

export interface CreateWorkspace {
    title: string,
    description: string,
    category?: number,
    status: string
}

export interface WorkspaceInvitation {
  id: number;
  user?: User | null;
  role: string;
  created: string;
  updated: string;
  email: string;
  token: string;
  accepted_at: string | null;
  status: string;
  workspace: Workspace;
  invited_by: User;
}


export interface WorkspaceHero {
  id: number;
  created: string;
  updated: string;
  title: string;
  description: string;
  image: string;
}

export interface WorkspaceContact {
  id: number;
  created: string;
  updated: string;
  title: string;
  description: string;
  image_overlay: string;
}
