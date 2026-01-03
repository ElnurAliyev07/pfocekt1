// import type { Metadata } from "next";
import localFont from "next/font/local";

import { Poppins, Inter } from "next/font/google";
import LayoutProvider from "@/providers/LayoutProvider";
import { ToastContainer } from "react-toastify";

import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import ThemeProvider from "@/providers/ThemeProvider";
import LoadingOverlay from "@/components/ui/loading/LoadingOverlay";
import { getConfigService } from "@/services/server/config.service";
import { Metadata } from "next";
import { AuthProvider } from "@/providers/AuthProvider";
import { getUser } from "@/utils/getUser";
import GoogleOneTapLogin from "@/components/common/google/GoogleOneTapLogin";
import { Suspense } from "react";
import RouteProgressBar from "@/components/common/progressbar/RouterProgressBar";
import { AppProvider } from "@/providers/AppProvider";
import { headers } from "next/headers";
import { getDeviceType } from "@/utils/get-device-type";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const inter = Inter({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export async function generateMetadata(): Promise<Metadata> {
  const configData = await getConfigService();

  return {
    title: configData.data.site_name
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const configData = await getConfigService();
  const { user, accessToken, refreshToken } = await getUser();
  const headersList =  await headers();
  const userAgent = headersList.get('user-agent') || '';
  const deviceType = getDeviceType(userAgent);

  return (
    <html lang="az">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${inter.variable} antialiased bg-[#FBFCFF] dark:bg-gray-900 text-black dark:text-white`}
      >
        <AppProvider deviceTypeProp={deviceType} config={configData.data}>
          <Suspense fallback={null}>
            <RouteProgressBar
              height={3}
              color="#3b82f6"
              showOnShallow={true}
              className="custom-progress"
            />
          </Suspense>
          <AuthProvider
            accessToken={accessToken}
            refreshToken={refreshToken}
            user={user}
          >
            <ThemeProvider>
              <LayoutProvider config={configData.data}>
                {children}
                <ToastContainer />
                <LoadingOverlay />
                <GoogleOneTapLogin />
              </LayoutProvider>
            </ThemeProvider>
          </AuthProvider>
        </AppProvider>
      </body>
    </html>
  );
}
