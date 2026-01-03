import Image from 'next/image'
import React from 'react'

const Payment = () => {
  return (
    <div className='font-medium text-t-black w-[494px] bg-white p-[28px] rounded-[12px]'>

        <div className='flex gap-24px justify-between'>
            <h3 className='font-poppins text-[20px] leading-[28px]'>Ödəniş Metodu</h3>
            <button className='text-[16px] leading-[24px] underline'>Əlavə et</button>
        </div>

        <div className='flex items-center justify-between rounded-[8px] bg-[#F9F9F9] py-[18px] ps-[13px] pe-[91px] mt-[24px]'>
            <Image src={'/payment_card.png'} width={106} height={66} alt='Card image' />

            <div>
                <h5 className='text-[16px] leading-[24px]'>Visa</h5>
                <p className='text-t-gray font-normal text-[12px] leading-[16px] mt-[12px]'>Expire date : 17/11</p>
            </div>

            <div>
                <h5 className='text-[14px] leading-[20px]'>Bank 360</h5>
                <p className='text-t-gray font-normal text-[12px] leading-[16px] mt-[12px]'>****4423</p>
            </div>
        </div>
    </div>
  )
}

export default Payment