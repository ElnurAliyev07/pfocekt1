import { User } from "@/types/auth.type";
import { get } from "@/utils/apiClient";

export const getProfileService = async ({ id }: { id: number }) => {
  const response = await get<User>(
    `/api/users/${id}/`
  );
  return response;
};    