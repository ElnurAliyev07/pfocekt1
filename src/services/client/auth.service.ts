import { OTPVerifyResponse, RegisterResponse, User } from "@/types/auth.type";
import { post } from "@/utils/apiClient";

interface UserRegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirm: string;
}

interface VerifyOTPData {
  email: string;
  otp: string;
}

export const registerService = async (data: UserRegisterData) => {
  const endpoint = "/api/users/register/";
  return post<RegisterResponse, UserRegisterData>(endpoint, data);
};

export const otpVerifyService = async (data: VerifyOTPData) => {
  const endpoint = "/api/users/verify-otp/";
  return post<OTPVerifyResponse, VerifyOTPData>(endpoint, data);
};

export const refreshTokenService = async (refreshToken: string) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/refresh/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    }
  );

  if (!response.ok) {
    throw new Error("Refresh token request failed");
  }

  const data = await response.json();

  if (!data.access || !data.refresh || !data.user) {
    throw new Error("Invalid response structure");
  }

  return data;
};



interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export const loginService = async (data: LoginRequest) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/login/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include", 
    }
  );
  const responseData: LoginResponse =
    await response.json();
  return responseData;
};

export const verifyTokenService = async (token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/verify/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: token }),
      }
    );
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error('Token verification failed');
    }
    return responseData;
  } catch (error) {
    console.log(error);
    return null;
  }
};
