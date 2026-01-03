import { AuthResponse } from "@/types/auth.type";
import { post } from "@/utils/apiClient";

interface UserLoginData {
    email: string;
    password: string;
}

export const loginService = async (data: UserLoginData) => {
    const endpoint = "/api/users/token/";
    return post<AuthResponse, UserLoginData>(endpoint, data);
};
