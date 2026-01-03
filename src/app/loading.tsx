import React from 'react';
import CircularProgress from '@/components/ui/loading/CircularProgress';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
      <div className="flex flex-col items-center gap-4">
        <CircularProgress 
          size="lg" 
          color="primary" 
          isIndeterminate={true}
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">Yüklənir...</p>
      </div>
    </div>
  );
}
