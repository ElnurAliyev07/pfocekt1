'use client'

import { useAppContext } from '@/providers/AppProvider';
import React, { useEffect, useState } from 'react';

interface InitializerWrapperProps {
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  isLoading?: boolean;
  delay?: number;
}

const DefaultLoadingSpinner = () => (
  <div className="flex items-center justify-center p-1 w-full h-full">
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 rounded-full border-4 border-gray-300 opacity-25"></div>
      <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin-fast"></div>
    </div>
  </div>
);

const InitializerWrapper: React.FC<InitializerWrapperProps> = ({
  children,
  loadingComponent,
  isLoading = false,
  delay = 0
}) => {
  const { isInitialized } = useAppContext();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      const timeoutId = setTimeout(() => {
        setIsReady(true);
      }, delay);

      return () => clearTimeout(timeoutId);
    } else {
      setIsReady(false);
    }
  }, [isLoading, delay]);

  if (isLoading || !isInitialized || !isReady) {
    return (
      <div className="relative w-full h-full min-h-0 overflow-hidden">
        {loadingComponent ?? <DefaultLoadingSpinner />}
      </div>
    );
  }

  return <>{children}</>;
};

export default InitializerWrapper;