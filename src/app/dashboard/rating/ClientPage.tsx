'use client'

import React from 'react'
import Search from '../files/components/ui/icons/Search'
import Image from 'next/image'
import Loading from '../statistic/components/Loading'
import Pagination from '@/components/ui/pagination/Pagination'
import SectionWrapper from '@/components/common/wrappers/SectionWrapper'

const ClientPage = () => {
  return (
      <SectionWrapper disabled>
      <h1 className="mt-[36px] text-[32px] font-medium text-t-black leading-[40px]">
        Reytinq
      </h1>

      <div>
      <div className="mt-[24px]">
        <div className="bg-white border border-borderDefault rounded-[12px] h-[48px] w-[290px] flex px-[16px] items-center gap-[8px]">
          <Search />
          <input
            id="searchInput"
            placeholder="Axtarın"
            className="flex-1 border-none outline-hidden focus:ring-0 p-0"
            type="text"
          />
        </div>
      </div>

      <div className="mt-[36px] mb-[24px] bg-white overflow-x-auto">
        {/* <!-- Header Row --> */}
        <div className="grid grid-cols-5 gap-4 text-[18px] text-center font-medium text-t-black py-4">
          <div className="">İşçi</div>
          <div className="">Email</div>
          <div className="">Sürət</div>
          <div className="">Müştəriyə qatdığı dəyər</div>
          <div className="">Yekun iş faizi</div>
        </div>
        {/* <!-- Data Rows --> */}
        <div id="user-container" className="space-y-[8px] text-center">
          <div className="grid grid-cols-5 place-items-center border-t border-b border-borderDefault gap-4 py-[11px] items-center text-t-black dark:text-gray-400">
            <div className="flex justify-center items-center  gap-[12px]">
              <Image
                src="/grid.png"
                alt="Profile Image"
                className="w-[36px] h-[36px] rounded-full object-cover"
                width={1000}
                height={1000}
              />
              <span>Adil Əliyev</span>
            </div>
            <div className="">adilalieyev@gmail.com</div>
            <div className="">12/20</div>
            <div className="">20%</div>
            <div className="">
                <Loading width={16} height={16} text={12} />
            </div>  
          </div>

          <div className="grid grid-cols-5 border-t place-items-center border-b border-borderDefault gap-4 py-[11px] items-center text-t-black dark:text-gray-400">
            <div className="flex justify-center items-center  gap-[12px]">
              <Image
                src="/grid.png"
                alt="Profile Image"
                className="w-[36px] h-[36px] rounded-full object-cover"
                width={1000}
                height={1000}
              />
              <span>Adil Əliyev</span>
            </div>
            <div className="">adilalieyev@gmail.com</div>
            <div className="">12/20</div>
            <div className="">20%</div>
            <div className="">
                <Loading width={16} height={16} text={12} />
            </div>
          </div>

        </div> 
      </div>
      <div className="flex justify-end mt-[36px]">
         <Pagination totalPages={5} currentPage={1} onPageChange={(e) => {console.log(e)}} />
      </div>
    </div>

    </SectionWrapper>
  )
}

export default ClientPage
