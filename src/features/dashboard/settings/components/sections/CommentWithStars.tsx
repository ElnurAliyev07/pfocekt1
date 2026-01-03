import Image from 'next/image'
import React from 'react'
import { BigEmptyStar, BigFillStar } from '../ui/Svg'

const CommentWithStars = () => {
  return (
    <div className=''>
        <div className='flex justify-between'>
            <div className='flex gap-[12px] font-medium'>
                <Image className='rounded-full' src={'/profile_comments.png'} alt='' width={44} height={44} />
                <div>
                    <h4 className='text-t-black text-[16px] leading-[19.36px] text-center'>Günel Qəmbərova</h4>
                    <p className='mt-[4px] text-t-gray text-[12px] leading-[14.52px]'>12 Avqust 2024</p>
                </div>
            </div>

            <div className='flex gap-1'>
                <BigFillStar />
                <BigFillStar />
                <BigFillStar />
                <BigFillStar />
                <BigEmptyStar />
            </div>
        </div>

        <div className='mt-[20px] text-[14px] leading-[20px] font-normal text-[#64717C]'>
            Lorem ipsum dolor sit amet consectetur. Turpis semper vitae tellus netus. Consequat neque felis consectetur egestas porttitor integer adipiscing. Massa etiam fusce a cursus netus lectus. Tellus eget rhoncus vel dolor leo. In vel mi facilisis amet morbi dui purus nulla purus. 
        </div>
        </div>
  )
}

export default CommentWithStars