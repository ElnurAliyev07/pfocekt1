"use client";

import DashboardLayout from "@/layouts/dashbaord/DashboardLayout";
import DefaultLayout from "@/layouts/default/DefaultLayout";
import { usePathname } from "next/navigation";
import { Config } from "@/types/config.type";

export default function LayoutProvider({
  children,
  config,
}: {
  children: React.ReactNode;
  config: Config;
}) {
  const pathname = usePathname();

  if (
    /^\/workspaces\/invitations\/[a-zA-Z0-9-]+$/.test(pathname) ||
    /^\/projects\/invitations\/[a-zA-Z0-9-]+$/.test(pathname) ||
    ["/login", "/register", "/otp", "/google", "/camera", '/facebook'].some((path) =>
      pathname.startsWith(path)
    )
  ) {
    return <>{children}</>;
  }

  if (pathname.startsWith("/dashboard")) {
    return <DashboardLayout config={config}>{children}</DashboardLayout>;
  }

  return (
    <DefaultLayout config={config}>
      {children}
    </DefaultLayout>
  );
}
