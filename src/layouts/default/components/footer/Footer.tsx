'use client'

import React from 'react'
import Facebook from '../ui/icons/Facebook'
import Linkedin from '../ui/icons/Linkedin'
import Instagram from '../ui/icons/Instagram'
import Image from 'next/image'
import Copyright from '../ui/icons/Copyright'
import Link from 'next/link'
import { navItems } from '../../data/menuData'
import { useRouter, usePathname } from 'next/navigation'
import { Config } from '@/types/config.type';

const Footer = ({config}: {config: Config}) => {
  const router = useRouter();
  const pathname = usePathname();
  
  return (
    <footer className=" bg-white mt-[88px] md:mt-[200px] dark:bg-secondary-dark py-[32px]">
      <div className="custom-container mb-[32px] flex flex-col md:flex-row justify-between items-center border--[2px] border-t-[#EAECF4]">
        <div>
          <Image src={config.logo || '/grid.png'} alt="logo img" width={152} height={36} className='h-auto' />
        </div>
        <ul className="mt-[24px] md:mt-0 flex flex-col md:flex-row gap-[12px] md:gap-[17px] font-normal text-[16px] text-t-black dark:text-text-dark-black">
          {navItems.map((item) => (
            <li className='text-center' key={item.href}>
              <button 
                onClick={() => router.push(item.href)} 
                className={`${pathname === item.href ? 'text-t-black border-primary' : 'text-[#64717C] border-transparent'} border-b  pb-[6px] hover:border-primary`}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="custom-container">
        <div className="h-[2px] w-full bg-[#EAECF4]"></div>
      </div>
      <div className="custom-container overflow-hidden pt-[24px]">
        <div className="flex flex-col-reverse md:flex-row justify-between items-center ">
          <div className="mt-[19px] md:mt-0 text-[14px] md:text-[20px] font-medium text-t-black dark:text-text-dark-black flex items-center gap-[3px]">Copyright <Copyright /> {new Date().getFullYear()}</div>
          <div className='mt-[19px] md:mt-0 flex items-center gap-[16px]'>
            <Link href={'/term-service'} className="text-[14px] md:text-[16px] font-normal text-t-black">Xidmət şərtləri</Link>
            <Link href={'/privacy-policy'} className="text-[14px] md:text-[16px] font-normal text-t-black">Gizlilik politikası</Link>
          </div>
          <div className="md:hidden h-[2px] w-[200%] bg-[#EAECF4]"></div>
          <div className="flex flex-col pb-[24px] md:pb-0 md:flex-row items-center gap-[16px] md:gap-[24px] ">
            <p className="text-[14px] md:text-[20px] font-medium text-text-gray md:text-t-black dark:text-text-dark-black">Sosial şəbəkələrdə biz</p>
            <div className="flex items-center gap-[8px]">
              <a href={config.facebook? config.facebook : '#'} target={config.facebook ? '_blank': '_self'}>
                <Facebook />                       
              </a>
              <a href={config.linkedin? config.linkedin : '#'} target={config.linkedin ? '_blank': '_self'}>
                <Linkedin />                       
              </a>
              <a href={config.instagram? config.instagram : '#'} target={config.instagram ? '_blank': '_self'}>
                <Instagram />                       
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
