'use client'
import { getLastSegment } from '@/utils/urlUtils'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const TabMenu = () => {
  const [url, setUrl] = useState<string>("")

  useEffect(() => {
    const pathname = getLastSegment(window.location.pathname);

    if(typeof window !== 'undefined') {
      setUrl(pathname)
    }
  },[])

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
    <div className='flex text-[14px] border-b-1 border-b-gray'>
        
        {
            tabs.map((tab)=>(
                <Link 
                 href={`/dashboard/settings/${tab.url}`} 
                 key={tab.url}
                 className={`${url === tab.url ? "text-t-black border-b-black" : "text-t-gray"} border-b-1 pt-[8px] pb-[12px] px-[16px] font-normal`}
                 >
                    {tab.name}
                </Link>
            ))
        }

    </div>
  )
}

export default TabMenu