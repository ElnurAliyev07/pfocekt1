'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

import CheckedIcon from './components/CheckedIcon';

const Page: React.FC = () => {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center text-primary">Yükleniyor...</div>}>
      <PageContent />
    </Suspense>
  );
};

const PageContent: React.FC = () => {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const nextUrl = params.get("next") ? `/login?next=${params.get("next")}` : "/login";

    const timer = setTimeout(() => {
      router.push(nextUrl); // Redirect to the login page
    }, 3000); // 3 seconds

    return () => clearTimeout(timer); // Clean up the timer on component unmount
  }, [params, router]);

  return (
    <div className="h-screen w-screen relative">
      <Image
        className="w-full h-full object-cover absolute left-0 top-0"
        src="/login.jpeg"
        width={2000}
        height={2000}
        alt="Picture of the author"
      />
      <div className="absolute bg-[#444BD3] bg-opacity-[27%] w-full h-full top-0 left-0 z-1000 grid place-items-center">
        <div className="w-[240px] h-[240px] rounded-full bg-white bg-opacity-[38%] grid place-items-center">
          <CheckedIcon />
        </div>
      </div>
    </div>
  );
};

export default Page;
