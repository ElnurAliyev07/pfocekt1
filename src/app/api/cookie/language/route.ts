import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { language } = body;

    if (!language || typeof language !== "string") {
      return NextResponse.json(
        { error: "Invalid language parameter." },
        { status: 400 }
      );
    }

    // Create a response and set the language cookie
    const response = NextResponse.json({ message: "Language set successfully" });
    
    response.cookies.set("lang", language, {
      httpOnly: true, // Accessible only by the server
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      path: "/", // Cookie is available for all routes
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error("Error setting language:", error);
    return NextResponse.json(
      { error: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
