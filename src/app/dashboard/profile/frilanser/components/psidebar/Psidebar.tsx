import React from 'react'
import Image from "next/image";

const Psidebar = () => {
  return (
    <div className='bg-[#FFFFFF] w-[272px]'>
      <Image src={"/logo.png"} width={1000} height={1000} alt="logo" />
    </div>
  )
}

export default Psidebar