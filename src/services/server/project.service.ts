import { Project, ProjectInvitation } from "@/types/project.type";
import { get } from "@/utils/apiClient";


export const getProjectItemService = async ({ slug }: { slug: string }) => {
  const response = await get<Project>(
    `/api/dashboard/projects/${slug}/`
  );
  return response;
};


export const getProjectInvitationItemService = async ({ token }: { token: string }) => {
  const response = await get<ProjectInvitation>(`/api/dashboard/projects/invitations/${token}/`);
  return response;
};