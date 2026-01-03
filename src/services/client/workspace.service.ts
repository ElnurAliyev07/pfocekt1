import { PaginatedResponse } from "@/types/response.type";
import {
  CreateWorkspace,
  Workspace,
  WorkspaceMember,
} from "@/types/workspace.type";
import {
 get,
 post,
 patch,
 del,
 put
} from "@/utils/apiClient";

export const getWorkspaceService = async (
  page?: number,
  page_size?: number,
  searchQuery?: string,
  category?: number,
  isCreator?: boolean 
) => {
  try {
    // Create params object with proper types
    const params: Record<string, string | number | string[] | number[]> = {};
    
    // Only add defined values with proper type conversion
    if (page !== undefined) params.page = page;
    if (searchQuery !== undefined) params.search = searchQuery;
    if (page_size !== undefined) params.page_size = page_size;
    if (category !== undefined) params.category = category;
    // Convert boolean to string representation
    if (isCreator !== undefined) params.is_creator = isCreator ? 'true' : 'false';
    const response = await get<PaginatedResponse<Workspace>>(
      "/api/dashboard/workspaces/",
      {
        params,
        cache: 'no-store',
        revalidate: 0
      }
    );
    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    throw error; // Hata durumunda fırlat
  }
};

export const getWorkspaceItemService = async ({ slug }: { slug: string }) => {
  const response = await get<Workspace>(
    `/api/dashboard/workspaces/${slug}/`
  );
  return response;
};

export const createWorkspaceService = async (data: CreateWorkspace) => {
  const endpoint = "/api/dashboard/workspaces/";
  return post<Workspace, CreateWorkspace>(endpoint, data);
};

export const updateWorkspaceService = async (
  slug: string,
  data: CreateWorkspace
) => {
  const endpoint = `/api/dashboard/workspaces/${slug}/`;
  return put<Workspace, CreateWorkspace>(endpoint, data);
};

export const deleteWorkspaceService = async (slug: string) => {
  return del<void>(`/api/dashboard/workspaces/${slug}/`);
};

export const getWorkspaceMemberService = async (
  page: number,
  searchQuery: string,
  workspaceSlug: string
) => {
  try {
    const response = await get<PaginatedResponse<WorkspaceMember>>(
      `/api/dashboard/workspaces/${workspaceSlug}/members/`,
      {
        params: {
          page: page,
          search: searchQuery,
        }
      }
    );
    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    throw error; // Hata durumunda fırlat
  }
};



interface SendWorkspaceInvitationServiceInputData {
  email: string;
  workspace: number;
  role:  string;
}

export const sendWorkspaceInvitationService = async (data: SendWorkspaceInvitationServiceInputData) => {
  const endpoint = "/api/dashboard/workspaces/send-invitation/";
  return post<SendWorkspaceInvitationServiceInputData, SendWorkspaceInvitationServiceInputData>(endpoint, data);
};

interface AcceptOrRejectWorkspaceInvitationServiceInputData {
  status:  "pending" | "accepted" | "rejected";
}

export const acceptOrRejectWorkspaceInvitationService = async (token: string, data: AcceptOrRejectWorkspaceInvitationServiceInputData) => {
  const endpoint = `/api/dashboard/workspaces/accept-or-reject-invitation/${token}/`;
  return patch<AcceptOrRejectWorkspaceInvitationServiceInputData, AcceptOrRejectWorkspaceInvitationServiceInputData>(endpoint, data);
};

export const acceptOrRejectWorkspaceInvitationByIdService = async (id: number, data: AcceptOrRejectWorkspaceInvitationServiceInputData) => {
  const endpoint = `/api/dashboard/workspaces/accept-or-reject-invitation-by-id/${id}/`;
  return patch<AcceptOrRejectWorkspaceInvitationServiceInputData, AcceptOrRejectWorkspaceInvitationServiceInputData>(endpoint, data);
};


export const deleteWorkspaceMemberService = async (id: number) => {
  return del<void>(`/api/dashboard/workspaces/members/${id}/`);
};

interface UpdateWorkspaceMemberRoleServiceInputData {
  role:  string;
}
export const updateWorkspaceMemberRoleService = async (id: number, data: UpdateWorkspaceMemberRoleServiceInputData) => {
  const endpoint = `/api/dashboard/workspaces/members/${id}/`;

  return patch<UpdateWorkspaceMemberRoleServiceInputData, UpdateWorkspaceMemberRoleServiceInputData>(endpoint, data);
};