import { PaginatedResponse } from "@/types/response.type";
import {
  Workspace,
  WorkspaceCategory,
  WorkspaceContact,
  WorkspaceHero,
  WorkspaceInvitation,
  WorkspaceStatus,
} from "@/types/workspace.type";
import { get } from "@/utils/apiClient";



export const getWorkspaceService = async () => {
  const response = await get<PaginatedResponse<Workspace>>(
    "/api/dashboard/workspaces/"
  );
  return response;
};

export const getWorkspaceHeroService = async () => {
  const response = await get<WorkspaceHero []>(
    `/api/pages/workspace/hero/`
  );
  return response;
};

export const getWorkspaceContactService = async () => {
  const response = await get<WorkspaceContact []>(
    `/api/pages/workspace/contact/`
  );
  return response;
};


export const getWorkspaceItemService = async ({ slug }: { slug: string }) => {
  const response = await get<Workspace>(
    `/api/dashboard/workspaces/${slug}/`
  );
  return response;
};

export const getWorkspaceCategorieService = async () => {
  const response = await get<WorkspaceCategory[]>(
    "/api/dashboard/workspaces/categories/"
  );
  return response;
};

export const getWorkspaceStatusService = async () => {
  const response = await get<WorkspaceStatus[]>(
    "/api/dashboard/workspaces/status/"
  );
  return response;
};

export const getWorkspaceInvitationItemService = async ({ token }: { token: string }) => {
  const response = await get<WorkspaceInvitation>(`/api/dashboard/workspaces/invitations/${token}/`);
  return response;
};