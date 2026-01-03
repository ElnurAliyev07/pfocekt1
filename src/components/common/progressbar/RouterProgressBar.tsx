// components/RouteProgressBar.tsx
'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';

interface ProgressStep {
  delay: number;
  value: number;
}

interface ProgressBarProps {
  height?: number;
  showOnShallow?: boolean;
  color?: string;
  className?: string;
}

const RouteProgressBar: React.FC<ProgressBarProps> = ({
  height = 3,
  showOnShallow = true,
  color = '#3b82f6',
  className = '',
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const IGNORE_PATHS = ['/login', '/admin', '/dashboard', '/booking'];
  const shouldIgnore = pathname && IGNORE_PATHS.some(p => pathname.startsWith(p));

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  // Ref to store the previous pathname
  const prevPathnameRef = useRef<string | null>(null);
  // Ref to track if it's the first render
  const isFirstRender = useRef(true);

  const startLoading = useCallback((): void => {
    setIsLoading(true);
    setProgress(0);
  }, []);

  const completeLoading = useCallback((): void => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 200);
  }, []);

  useEffect(() => {
    // On first render, just set the previous pathname and do nothing
    if (isFirstRender.current) {
      prevPathnameRef.current = pathname;
      isFirstRender.current = false;
      return;
    }

    // Only trigger progress bar if pathname changes (not on first load)
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;

      if (!showOnShallow && !pathname) return;

      startLoading();

      const progressSteps: ProgressStep[] = [
        { delay: 50, value: 20 },
        { delay: 150, value: 40 },
        { delay: 300, value: 60 },
        { delay: 500, value: 80 },
        { delay: 700, value: 95 },
      ];

      const timers: NodeJS.Timeout[] = progressSteps.map(({ delay, value }) =>
        setTimeout(() => {
          setProgress(value);
        }, delay)
      );

      const completeTimer: NodeJS.Timeout = setTimeout(() => {
        completeLoading();
      }, 800);

      return () => {
        [...timers, completeTimer].forEach((timer) => {
          clearTimeout(timer);
        });
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, showOnShallow, startLoading, completeLoading]);

  // Don't render if not loading
  if (shouldIgnore) return null;
  if (!isLoading && progress === 0) return null;

  return (
    <>
      <div
        className={`route-progress-bar ${className} hidden sm:block`}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Sayfa yükleniyor"
        style={{ height: `${height}px` }}
      >
        <div
          className="route-progress-fill"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${color} 0%, #06b6d4 50%, #10b981 100%)`,
          }}
        />
      </div>

      <style jsx>{`
        .route-progress-bar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.05);
          backdrop-filter: blur(8px);
          will-change: opacity;
          animation: fadeIn 0.2s ease-out;
        }

        .route-progress-fill {
          height: 100%;
          background-size: 200% 100%;
          transition: width 0.3s cubic-bezier(0.23, 1, 0.32, 1);
          position: relative;
          overflow: hidden;
          border-radius: 0 2px 2px 0;
          box-shadow: 
            0 0 10px rgba(59, 130, 246, 0.3),
            0 0 20px rgba(59, 130, 246, 0.1);
          animation: shimmer 2s infinite linear;
        }

        .route-progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 20px;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.6),
            transparent
          );
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-3px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0;
            transform: translateX(-20px);
          }
          50% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .route-progress-bar {
            animation: none;
          }
          .route-progress-fill {
            animation: none;
            background: ${color} !important;
            transition: width 0.5s ease;
          }
          .route-progress-fill::after {
            display: none;
          }
        }

        @media (prefers-color-scheme: dark) {
          .route-progress-bar {
            background: rgba(255, 255, 255, 0.05);
          }
          .route-progress-fill {
            box-shadow: 
              0 0 10px rgba(59, 130, 246, 0.4),
              0 0 20px rgba(59, 130, 246, 0.2);
          }
        }

        @media (max-width: 768px) {
          .route-progress-bar {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default RouteProgressBar;