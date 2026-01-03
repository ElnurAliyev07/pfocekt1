import { User } from "@/types/auth.type";
import { NextResponse } from "next/server";

interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code is missing" },
        { status: 400 }
      );
    }

    // Send the authorization code to the Django endpoint
    const authResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/google/login/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ access_token: code }),
      }
    );


    if (!authResponse.ok) {
      const errorData: { detail?: string } = await authResponse.json();
      return NextResponse.json(
        { error: errorData?.detail || "Google login failed" },
        { status: authResponse.status }
      );
    }

    const { access, refresh, user }: AuthResponse = await authResponse.json();

    // Process the response from Django
    const response = NextResponse.json({ message: "Login successful" });

    response.cookies.set("access", access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 15, // Token'ın expiration süresi
    });
    response.cookies.set("refresh", refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // Token'ın expiration süresi
    });
    response.cookies.set("user", JSON.stringify(user), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // Kullanıcı bilgisi refresh token süresiyle eşleştirildi
    });
    return response;
  } catch (error) {
    console.error("Error communicating with Django API:", error);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
