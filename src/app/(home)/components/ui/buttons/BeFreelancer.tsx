import AxesTopRight from '@/components/ui/icons/AxesTopRight'
import Link from 'next/link'
import React from 'react'

const BeFreelancer = () => {
  return (
    <Link href="/register" className=" bg-primary hover:bg-primary-hover focus:bg-primary-focus gap-[8px] h-[48px] lg:h-[52px] rounded-[8px] flex items-center text-center justify-center md:px-[24px]">
      <span className="font-medium text-white stroke-text-white">Frilanser ol</span>
      <AxesTopRight />
    </Link>
  )
}

export default BeFreelancer
