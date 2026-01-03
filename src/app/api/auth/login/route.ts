import { User } from "@/types/auth.type";
import { NextResponse } from "next/server";


interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export async function POST(request: Request) {
  try {
    // İstek gövdesini ayrıştırma
    const { email, password }: { email: string; password: string } = await request.json();

    // Django API'sine kimlik doğrulama isteği gönderme
    const authResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!authResponse.ok) {
      const errorData: { detail?: string } = await authResponse.json();
      return NextResponse.json(
        { error: errorData?.detail || "Login failed" },
        { status: authResponse.status }
      );
    }

    const { access, refresh, user }: AuthResponse = await authResponse.json();



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
      httpOnly: true,
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
