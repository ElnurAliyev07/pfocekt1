import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access")?.value;
  const refreshToken = request.cookies.get("refresh")?.value;

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const response = NextResponse.next();

  // if(accessToken){
  //   try {
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/verify/`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ token: accessToken }),
  //     });

  //     if (!res.ok) {
  //       const errorData = await res.json();
  //       console.error("Token refresh error:", errorData);

  //       response.cookies.delete("access");
  //       response.cookies.delete("refresh");
  //       response.cookies.delete("user");

  //       if (isProtectedRoute) {
  //         const loginUrl = new URL('/login', request.url);
  //         return NextResponse.redirect(loginUrl);
  //       }

  //       return response;
  //     }
  //   } catch (error) {
  //     console.error("Token refresh error:", error);
  //   }
  // }

  // Eğer accessToken yok ama refreshToken varsa, yeni accessToken almaya çalış
  if (!accessToken && refreshToken) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (res.ok) {
        const data = await res.json();

        response.cookies.set("access", data.access, {
          httpOnly: true,
          secure: true,
          path: "/",
          sameSite: "lax",
          maxAge: 60 * 15, // 15 dakika
        });

        // refreshToken güncellemek istersen burayı aç


        // console.log(data.refresh)

        // response.cookies.set("refresh", data.refresh, {
        //   httpOnly: true,
        //   secure: true,
        //   path: "/",
        //   sameSite: "lax",
        //   maxAge: 60 * 60 * 24 * 30, // 7 gün,
        //   domain: ".mediamarketin.az"
        // });

        if (data.user) {
          response.cookies.set("user", JSON.stringify(data.user), {
            httpOnly: false,
            secure: true,
            path: "/",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30, // 7 gün
          });
        }

        return response;
      } else {
        // Hatalı refresh token varsa çerezleri temizle
        const errorData = await res.json();
        console.error("Refresh token error:", errorData);

        response.cookies.delete("access");
        response.cookies.delete("refresh");
        response.cookies.delete("user");

        if (isProtectedRoute) {
          const loginUrl = new URL('/login', request.url);
          return NextResponse.redirect(loginUrl);
        }

        return response;
      }
    } catch (error) {
      console.error("Token refresh error:", error);

      response.cookies.delete("access");
      response.cookies.delete("refresh");
      response.cookies.delete("user");

      if (isProtectedRoute) {
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
      }

      return response;
    }
  }

  // accessToken yok ve korumalı sayfaya erişim isteniyorsa yönlendir
  if (!accessToken && isProtectedRoute) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|api|static|favicon.ico).*)"], // middleware hangi yolları kapsar
};
