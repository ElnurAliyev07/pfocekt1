'use client'

import React from 'react'

type ContainerProps = {
    Icon: React.ReactNode; // İkon TSX elementi
    iconBackgroundColor: string; // Arxa fon rəngi
    title: string; // Başlıq mətni
    moneyAmount: number | string; // Pulun meblegi
}

const Custom: React.FC<ContainerProps> = ({Icon, iconBackgroundColor, title, moneyAmount}) => {

  return (
    <div className='flex flex-col gap-6 rounded-lg px-4 py-6 bg-white'>
        {/* Icon and title */}
        <div className='flex items-center gap-6 me-16'>
            <div className='rounded-lg px-2 py-3' style={{backgroundColor: iconBackgroundColor}}>{Icon}</div>
            <h4 className='text-t-gray'>{title}</h4>
        </div>
        {/* Amount of money */}
        <p className='flex gap-1 text-t-black font-bold'>{moneyAmount}<span>AZN</span></p>
    </div>
  )
}

export default Custom