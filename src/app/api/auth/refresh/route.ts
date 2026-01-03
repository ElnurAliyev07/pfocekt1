import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { refreshToken }: { refreshToken: string } = await request.json();

    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/refresh/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });
    
      if (!backendResponse.ok) {
        const errorData: { detail?: string } = await backendResponse.json();
        return NextResponse.json(
          { error: errorData?.detail || "Login failed" },
          { status: backendResponse.status }
        );
      }
    const response = NextResponse.json({ message: "Login successful" });

    const { access, refresh, user } = await backendResponse.json();

    response.cookies.set("access", access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 15, // Token'ın expiration süresi
        sameSite: "lax",
      });
      response.cookies.set("refresh", refresh, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // Token'ın expiration süresi
        sameSite: "lax",
      });
      response.cookies.set("user", JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // Token'ın expiration süresi
        sameSite: "lax",
      });
  

    return response;
  } catch (error) {
    console.error("Error during logout:", error);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
