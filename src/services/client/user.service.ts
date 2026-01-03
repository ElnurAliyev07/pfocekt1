import { UserUpdateRequest } from "@/types/user.type";
import { patch } from "@/utils/apiClient";

export const updateUserService = async (id: number, data: UserUpdateRequest ) => {
    const endpoint = `/api/users/${id}/`;
    return patch<UserUpdateRequest, UserUpdateRequest>(endpoint, data);
  };