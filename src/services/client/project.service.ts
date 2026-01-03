import { CreateProject, Project, ProjectMember } from "@/types/project.type";
import { PaginatedResponse } from "@/types/response.type";
import { get, post, del, patch, put } from "@/utils/apiClient";

export const getProjectService = async (
  page: number,
  searchQuery: string,
  workspace_slug: string
) => {
  try {
    const response = await get<PaginatedResponse<Project>>(
      "/api/dashboard/projects/",
      {
        params: {
          page: page,
          search: searchQuery,
          workspace_slug,
        },
      }
    );
    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    console.error("Error fetching workspaces from API:", error);
    throw error; // Hata durumunda fırlat
  }
};

export const getProjectItemService = async ({ slug }: { slug: string }) => {
  const response = await get<Project>(
    `/api/dashboard/projects/${slug}/`
  );
  return response;
};


export const createProjectService = async (data: CreateProject) => {
  const endpoint = "/api/dashboard/projects/";
  return post<Project, CreateProject>(endpoint, data);
};

export const deleteProjectService = async (slug: string) => {
  return del<void>(`/api/dashboard/projects/${slug}/`);
};


export const updateProjectService = async (slug: string, data: CreateProject) => {
  const endpoint = `/api/dashboard/projects/${slug}/`;
  return put<Project, CreateProject>(endpoint, data);
};


export const getProjectMemberService = async (
  page: number,
  searchQuery: string,
  projectSlug: string
) => {
  try {
    const response = await get<PaginatedResponse<ProjectMember>>(
      `/api/dashboard/projects/${projectSlug}/members/`,
      {
        params: {
          page: page,
          search: searchQuery,
        },
      }
    );
    return response; // API'den gelen ham veriyi döndür
  } catch (error) {
    console.error("Error fetching workspaces from API:", error);
    throw error; // Hata durumunda fırlat
  }
};

interface SendProjectInvitationServiceInputData {
  email: string;
  project: number;
  role:  string;
}

export const sendProjectInvitationService = async (data: SendProjectInvitationServiceInputData) => {
  const endpoint = "/api/dashboard/projects/send-invitation/";
  return post<SendProjectInvitationServiceInputData, SendProjectInvitationServiceInputData>(endpoint, data);
};

interface AcceptOrRejectProjectInvitationServiceInputData {
  status:  string;
}

export const acceptOrRejectProjectInvitationService = async (token: string, data: AcceptOrRejectProjectInvitationServiceInputData) => {
  const endpoint = `/api/dashboard/projects/accept-or-reject-invitation/${token}/`;
  return patch<AcceptOrRejectProjectInvitationServiceInputData, AcceptOrRejectProjectInvitationServiceInputData>(endpoint, data);
};


export const deleteProjectMemberService = async (id: number) => {
  return del<void>(`/api/dashboard/projects/members/${id}/`);
};

interface UpdateProjectMemberRoleServiceInputData {
  role:  string;
}
export const updateProjectMemberRoleService = async (id: number, data: UpdateProjectMemberRoleServiceInputData) => {
  const endpoint = `/api/dashboard/projects/members/${id}/`;

  return patch<UpdateProjectMemberRoleServiceInputData, UpdateProjectMemberRoleServiceInputData>(endpoint, data);
};