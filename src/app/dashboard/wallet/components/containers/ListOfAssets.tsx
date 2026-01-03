"use client"

import React, { useEffect } from 'react'
import Left from '../icons/Left'
import Right from '../icons/Right'
import { formatDateOnly, formatTime } from '@/utils/formateDateTime'
import useWalletStore from '@/store/walletStore'
import { getURLParam } from '@/utils/urlUtils'



const ListOfAssets = () => {
  const { wallets, fetchWorkspaces, setSearchQuery } = useWalletStore();
  
  useEffect(() => {
    const search = getURLParam("search");
    setSearchQuery(search || '')
    const getWallets = async () => {
      await fetchWorkspaces();
    }
    getWallets();
  }, [fetchWorkspaces, setSearchQuery])

  return (
    <>
      {/* Table */}
      <div className='bg-white rounded-sm'>
        {/* Table head */}
        <div className="grid grid-cols-8 text-center font-medium text-t-black p-4">
          <div className='text-start'>İD</div>
          <div className='col-span-3'>Göndəriş məlumatı</div>
          <div className=''>Məbləğ</div>
          <div className=''>Tarix</div>
          <div className=''>Vaxt</div>
          <div className=''>Status</div>
        </div>

        {/* Table body */}
        <div className=''>
          {
            wallets?.map((item, index) => (
              <div key={index} className='grid grid-cols-8 text-center border-y py-3 px-4 items-center'>
                <div className='text-start'>{item.id}</div>
                <div className='col-span-3 text-center'>{item.description}</div>
                <div>{item.amount} AZN</div>
                <div>{formatDateOnly(item.date)}</div>
                <div>{formatTime(item.date)}</div>
                <div className='bg-[#EEFFEE] text-[#24C21F] font-medium rounded-sm p-2'>Ödənilib</div>
              </div>
            ))
          }
          
        </div>
      </div>



      {/* Pagination buttons */}
      <div className='flex justify-end items-center gap-2 mt-8'>
        {/* Previous button */}
        <button>
          <Left />
        </button>

        {/* Page numbers */}
        <div className='flex gap-2 mx-4'>
          {
            Array.from({ length: 5 }, (_, index) => (index + 1)).map((page) => (
              <button
                key={page}
                className={`w-8 h-8 rounded-full font-medium ${page === 3 ? "bg-[#F5AB20] text-white" : ''}`}>
                {page}
              </button>
            ))
          }
        </div>

        {/* Next button */}
        <button>
          <Right />
        </button>
      </div>
    </>
  )
}

export default ListOfAssets