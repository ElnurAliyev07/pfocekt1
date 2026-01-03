'use client'

import AxesTopRight from '@/components/ui/icons/AxesTopRight'
import { useAuth } from '@/providers/AuthProvider'
import Link from 'next/link'
import React from 'react'


const CreateOffice = () => {
  const { accessToken } = useAuth();
  return (
    <Link href={accessToken ? "/dashboard/workspaces": '/login?next=/dashboard/workspaces'} className="bg-primary  gap-[8px] h-[48px] rounded-[8px] flex items-center text-center justify-center px-[13px] md:px-[24px]">
      <span className="font-medium text-white text-[16px]">Virtual ofisini yarat</span>
      <AxesTopRight className='fill-white' />
    </Link>
  )
}

export default CreateOffice
