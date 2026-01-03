'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import React, { Suspense } from 'react'

const LoginBtnContent = () => {
    const params = useSearchParams()
    
    return (
        <Link href={params.get("next") ? `/login?next=${params.get("next")}` : "/login"} className="ml-[9px] text-primary">
            Daxil olun
        </Link>
    );
}

const LoginBtn = () => (
    <Suspense fallback={null}>
        <LoginBtnContent />
    </Suspense>
);

export default LoginBtn;
