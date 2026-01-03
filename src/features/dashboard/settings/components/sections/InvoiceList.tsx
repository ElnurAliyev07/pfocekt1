'use client'

import React from 'react'
import { MoreVeritical } from '../ui/Svg'
import Pagination from '@/components/ui/pagination/Pagination'

const InvoiceList = () => {
    return (
        <>
            <div className='bg-white'>
                {/* Table head */}
                <div className="grid grid-cols-7 text-center font-medium text-t-black p-4">
                    <div className=''>İD</div>
                    <div className=''>Faktura</div>
                    <div className=''>Məbləğ</div>
                    <div className=''>Tarix</div>
                    <div className=''>Vaxt</div>
                    <div className=''>Status</div>
                    <div className=''></div>
                </div>

                {/* Table body */}
                <div className='flex flex-col gap-[8px]'>
                    <div className='grid grid-cols-7 text-center border-y py-3 px-4 items-center'>
                        <div className=''>1</div>
                        <div className=''>INV0045</div>
                        <div>2000 AZN</div>
                        <div>03.11.2024</div>
                        <div>12:22</div>
                        <div className='bg-[#EEFFEE] text-[#24C21F] font-medium rounded-sm p-2'>Ödənilib</div>
                        <div className='place-self-center'><MoreVeritical /></div>
                    </div>

                    <div className='grid grid-cols-7 text-center border-y py-3 px-4 items-center'>
                        <div className=''>2</div>
                        <div className=''>INV0045</div>
                        <div>2000 AZN</div>
                        <div>03.11.2024</div>
                        <div>12:22</div>
                        <div className='bg-[#EEFFEE] text-[#24C21F] font-medium rounded-sm p-2'>Ödənilib</div>
                        <div className='place-self-center'><MoreVeritical /></div>
                    </div>
                    <div className='grid grid-cols-7 text-center border-y py-3 px-4 items-center'>
                        <div className=''>3</div>
                        <div className=''>INV0045</div>
                        <div>2000 AZN</div>
                        <div>03.11.2024</div>
                        <div>12:22</div>
                        <div className='bg-[#EEFFEE] text-[#24C21F] font-medium rounded-sm p-2'>Ödənilib</div>
                        <div className='place-self-center'><MoreVeritical /></div>
                    </div>
                </div>
            </div>
            <div className='mt-[24px] flex justify-end'>
                <Pagination totalPages={5} currentPage={1} onPageChange={(e) => { console.log(e) }} />
            </div>
        </>
    )
}

export default InvoiceList