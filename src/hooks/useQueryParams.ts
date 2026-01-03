'use client'

import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const useQueryParams = () => {
  const searchParams = useSearchParams();

  // Parametreleri güncelleyen bir fonksiyon
  const updateQueryParam = useCallback((name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  }, [searchParams]);

  return { updateQueryParam };
};

export default useQueryParams;
