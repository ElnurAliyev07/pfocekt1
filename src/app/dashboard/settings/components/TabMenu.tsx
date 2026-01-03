'use client'
import { getLastSegment } from '@/utils/urlUtils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const TabMenu = () => {
  
  const pathname = usePathname()

  const tabs = [
    { name: 'Profil', url: 'profile' },
    { name: 'Təhlükəsizlik', url: 'security' },
    { name: 'Şifrə dəyişmə', url: 'change-password' },
    { name: 'Üstünlüklər', url: 'advantages' },
    { name: 'Plan & Faktura', url: 'plan-invoice' },
    { name: 'Bildirişlər', url: 'notifications' },
    { name: 'Rəylər', url: 'comments' },
    { name: 'İnteqrasiyalar', url: 'integrations' },
  ]
  
  return (
    <div className='hidden md:flex text-[14px] border-b-1 border-b-gray'>
        
        {
            tabs.map((tab)=>(
                <Link 
                 href={`/dashboard/settings/${tab.url}`} 
                 key={tab.url}
                 className={`${getLastSegment(pathname) === tab.url ? "text-t-black border-b-black" : "text-t-gray"} border-b-1 pt-[8px] pb-[12px] px-[16px] font-normal`}
                 >
                    {tab.name}
                </Link>
            ))
        }

    </div>
  )
}

export default TabMenu