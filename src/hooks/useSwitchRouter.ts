'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const useSwitchRouter = () => {
  const [pathname, setPathname] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPathname(window.location.pathname);
    }
  }, []);

  const switchRouter = (route: string) => {
    router.push(route);
    setPathname(route);
  };

  return { pathname, switchRouter };
};

export default useSwitchRouter;
