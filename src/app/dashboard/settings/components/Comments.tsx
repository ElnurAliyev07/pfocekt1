import React from 'react'
import { StarEmpty } from '../svg/Svg'
import Image from 'next/image'

const Comments = () => {

    const Container = ({image}: {name: string, date: string, comment: string, image: string}) => {
        return (
            <div>
                <div className='flex gap-[12px] font-medium'>
                    <Image className='rounded-full' src={image} alt='' width={44} height={44} />
                    <div>
                        <h4 className='text-t-black text-[16px] leading-[19.36px] text-center'>Günel Qəmbərova</h4>
                        <p className='mt-[4px] text-t-gray text-[12px] leading-[14.52px]'>12 Avqust 2024</p>
                    </div>
                </div>

                <div className='mt-[20px] text-[14px] leading-[20px] font-normal text-[#64717C]'>
                    Lorem ipsum dolor sit amet consectetur. Turpis semper vitae tellus netus. Consequat neque felis consectetur egestas porttitor integer adipiscing. Massa etiam fusce a cursus netus lectus. Tellus eget rhoncus vel dolor leo. In vel mi facilisis amet morbi dui purus nulla purus. 
                </div>
            </div>
        )
    }

  return (
    <div className='rounded-[20px] bg-white p-[32px] border border-[#E8EAED] font[500] text-t-black'>
        <h3 className='text-20px leading-28px'>Rəylər</h3>
        <p className='text-t-gray text-[16px] leading-[24px] mt-[20px]'>8 Rəy</p>
        
        <div className='flex justify-between mt-[24px]'>
            <h4 className='text-[16px] leading-[24px]'>Rəy yaz</h4>
            <div className='flex gap-[8px]'><StarEmpty /><StarEmpty /><StarEmpty /><StarEmpty /><StarEmpty /></div>
        </div>

        <div className='flex justify-between mt-[32px]'>
            <input className='py-[12px] px-[8px] border border-[#D1D1D6] rounded-[16px] text-[14px] font-normal leading-[20px] text-[#D1D1D6] grow' placeholder='Fikirlərinizi paylaşın' />
            <button className='bg-[#444BD3] py-[10px] px-[16px] rounded-[8px] text-[14px] leading-[21px] font-poppins text-white'>Paylaş</button>
        </div>

        <div className='flex flex-col gap-[32px] mt-[32px]'>
            <Container name='Günel Qəmbərova' date='12 Avqust 2024' image='/profile_comments.png' comment='Lorem ipsum dolor sit amet consectetur. Turpis semper vitae tellus netus. Consequat neque felis consectetur egestas porttitor integer adipiscing. Massa etiam fusce a cursus netus lectus. Tellus eget rhoncus vel dolor leo. In vel mi facilisis amet morbi dui purus nulla purus. ' />
            <Container name='Günel Qəmbərova' date='12 Avqust 2024' image='/profile_comments.png' comment='Lorem ipsum dolor sit amet consectetur. Turpis semper vitae tellus netus. Consequat neque felis consectetur egestas porttitor integer adipiscing. Massa etiam fusce a cursus netus lectus. Tellus eget rhoncus vel dolor leo. In vel mi facilisis amet morbi dui purus nulla purus. ' />
        </div>
    </div>
  )
}

export default Comments