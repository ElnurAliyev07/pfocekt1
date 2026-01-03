import { User } from "@/types/auth.type";
import { cookies } from "next/headers";

export const getUser = async (): Promise<{ user: User | undefined, accessToken: string | undefined, refreshToken: string | undefined }> => {
  if (typeof window === "undefined") {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('user');
    const accessTokenCookie = cookieStore.get("access");
    const refreshTokenCookie = cookieStore.get("refresh");

    let user: User | undefined = undefined;
    if (userCookie && userCookie.value && userCookie.value !== "undefined") {
      try {
        user = JSON.parse(userCookie.value) as User;
      } catch (e) {
        console.error("Invalid JSON in user cookie:", userCookie.value);
      }
    }

    const accessToken = accessTokenCookie?.value !== "undefined" ? accessTokenCookie?.value : undefined;
    const refreshToken = refreshTokenCookie?.value !== "undefined" ? refreshTokenCookie?.value : undefined;

    return { user, accessToken, refreshToken };
  }

  return { user: undefined, accessToken: undefined, refreshToken: undefined };
};
