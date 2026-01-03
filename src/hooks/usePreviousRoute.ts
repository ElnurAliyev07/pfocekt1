// app/hooks/usePreviousPathname.ts
'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function usePreviousPathname() {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    const currentPath = pathname;
    const timer = setTimeout(() => {
      previousPath.current = currentPath;
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  return previousPath;
}
