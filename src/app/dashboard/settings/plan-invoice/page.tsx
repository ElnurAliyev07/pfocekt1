import React from 'react'
import Payment from '../components/Payment'
import SearchWithFilter from '../components/SearchWithFilter'
import InvoiceList from '../components/InvoiceList'
import TabMenu from '../components/TabMenu'

const page = () => {
  return (
    <div>
        <TabMenu />

        <div className='mt-[56px]'>
            <Payment />
        </div>

        <div className='mt-[36px]'>
            <h3 className='text-t-black text-[24px] leading-[32px] font-medium font-poppins'>Faktura siyahısı</h3>

            <div className='mt-[24px]'><SearchWithFilter /></div>

            <div className='my-[32px]'><InvoiceList /></div>

        </div>
    </div>
  )
}

export default page