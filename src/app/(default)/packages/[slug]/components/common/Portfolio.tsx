import { PackagePortfolio } from '@/types/package.type'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface Props{
  portfolio: PackagePortfolio
}

const Portfolio: React.FC<Props> = ({portfolio}) => {
  return (
    <Link href={portfolio.link} className="overflow-hidden">
      <Image width={1000} height={1000} className="w-full h-[280px] object-cover rounded-[12px]" src={portfolio.cover_image} alt={portfolio.name} />
      <h4 className="mt-[16px] md:mt-[20px] text-t-black md:text-primary px-[8px]">{portfolio.name} </h4>
    </Link>
  )
}

export default Portfolio
