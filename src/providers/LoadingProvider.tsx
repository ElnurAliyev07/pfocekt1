"use client";

import { useState, useEffect, useCallback, useTransition, Suspense } from "react";
import NavigationLoading from "@/components/ui/loading/NavigationLoading";
import { usePathname, useRouter } from "next/navigation";
// import { usePathname } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

// ClientOnly komponenti - hidrasyon sonrası render için
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return <>{children}</>;
}

// SearchParamsWatcher - useSearchParams kullanımını Suspense içinde izole ediyoruz
function SearchParamsWatcher({ 
  onParamsChange 
}: { 
  onParamsChange: () => void 
}) {
  "use client";
  const searchParams = useSearchParams();
  
  useEffect(() => {
    onParamsChange();
  }, [searchParams, onParamsChange]);
  
  return null;
}

export default function LoadingProvider({ 
  children,
  excludePaths = ['/google/callback', ]
}: { 
  children: React.ReactNode,
  excludePaths?: string[]
}) {
  const [navigationLoading, setNavigationLoading] = useState(false);
  const [lastNavigation, setLastNavigation] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const router = useRouter();
  const isExcludedPath = excludePaths.some(path => pathname.startsWith(path));
  
  // Suspense ve manuel navigasyon durumları için loading state
  const isLoading = navigationLoading || isPending;

  // URL oluşturucu yardımcı fonksiyon
  const getCurrentUrl = useCallback(() => {
    return pathname;
  }, [pathname]);
  
  // SearchParams değiştiğinde çağrılacak fonksiyon
  const handleSearchParamsChange = useCallback(() => {
    setNavigationLoading(false);
  }, []);

  useEffect(() => {
    const originalPush = router.push;
    const originalReplace = router.replace;

    router.push = (...args) => {
      const targetUrl = args[0];
      const currentUrl = getCurrentUrl();
      
      // Aynı sayfaya geçişi kontrol et
      if (!isExcludedPath && targetUrl !== currentUrl && targetUrl !== lastNavigation) {
        setNavigationLoading(true);
        setLastNavigation(targetUrl);
        
        // Suspense ile geçiş yap
        startTransition(() => {
          return originalPush.apply(router, args);
        });
        return Promise.resolve();
      }
      
      return originalPush.apply(router, args);
    };

    router.replace = (...args) => {
      const targetUrl = args[0];
      const currentUrl = getCurrentUrl();
      
      // Aynı sayfaya geçişi kontrol et
      if (!isExcludedPath && targetUrl !== currentUrl && targetUrl !== lastNavigation) {
        setNavigationLoading(true);
        setLastNavigation(targetUrl);
        
        // Suspense ile geçiş yap
        startTransition(() => {
          return originalReplace.apply(router, args);
        });
        return Promise.resolve();
      }
      
      return originalReplace.apply(router, args);
    };

    return () => {
      router.push = originalPush;
      router.replace = originalReplace;
    };
  }, [router, isExcludedPath, getCurrentUrl, lastNavigation, startTransition]);

  // pathname değiştiğinde loading'i kapat
  useEffect(() => {
    const timeout = setTimeout(() => setNavigationLoading(false), 300);
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      <ClientOnly>
        {isLoading && !isExcludedPath && <NavigationLoading />}
        {/* SearchParams değişimini Suspense içinde izole ediyoruz */}
        <Suspense fallback={null}>
          <SearchParamsWatcher onParamsChange={handleSearchParamsChange} />
        </Suspense>
      </ClientOnly>
      {children}
    </>
  );
}