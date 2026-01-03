import AxesTopRight from '@/components/ui/icons/AxesTopRight'
import Link from 'next/link'
import React from 'react'

const ContactWithUs = () => {
  return (
    <Link href="/contact" className=" bg-white focus:bg-primary-focus gap-[8px] h-[36px] md:h-[52px] rounded-[4px] md:rounded-[8px] flex items-center text-center justify-center px-[13px] md:px-[24px]">
      <span className="font-medium text-primary text-[12px] md:text-[16px]">Bizimlə Əlaqə</span>
      <AxesTopRight className='fill-primary' />

    </Link>
  )
}

export default ContactWithUs
