import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
const NotFound = () => {
  return (
    <div className='flex  items-center flex-col'>
      <Image src="/not-found.png" className='w-[411px] h-[380px] object-cover mb-[40px]' width={1000} height={1000} alt="not found" />
      <div className='text-center'>
         <h2 className='text-[28px] font-medium text-t-gray mb-[20px]'>Hazırda heç bir paketiniz yoxdur</h2>
         <p className='text-[16px] font-normal text-t-gray'>Paket yaratmaq üçün aşağıdakı düyməyə klik edin!</p>
         <div className='flex justify-center mt-[32px]'>
         <Link
            href="/dashboard/packages/create"
            className=" bg-primary focus:bg-primary-focus gap-[8px] h-[48px] md:h-[48px] rounded-[8px] flex items-center text-center justify-center md:px-[30px]"
          >
            <span className="font-medium text-white">Paket yarat</span>
          </Link>
         </div>
      </div>
    </div>
  )
}

export default NotFound
