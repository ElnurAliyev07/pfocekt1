import React from 'react'

const Milestone = ({title}: {title: string}) => {

    const Container = ({year, title, subTitle, text}: {year: string; title: string; subTitle: string; text: string}) => {
        return (
            <div className='border-s-2 border-[#444BD3] border-dashed relative'>
                <div className='w-[16px] h-[16px] bg-[#444BD3] rounded-full absolute -left-[8px] -top-[8px]'></div>
                
                <div className='flex flex-col gap-[16px] text-t-black font-medium pb-[36px] ps-[27px]'>
                    <div className='bg-[#F3F6FC] px-[16px] py-[8px] rounded-[36px] text-[14px] leading-[24px] self-start mt-[15px]'>{year}</div>
                    <div className='flex flex-col gap-[8px]'>
                        <h3 className='text-[20px] leading-[24px]'>{title}</h3>
                        <h4 className='text-t-gray text-[16px] leading-[24px]'>{subTitle}</h4>
                    </div>
                    <p className='text-t-gray text-[14px] leading-[20px] font-normal tracking-[1px]'>{text}</p>
                </div>
            </div>
        )
    }

  return (
    <div className='bg-white px-[24px] py-[32px] rounded-[12px]'>
        <div className='flex justify-between'>
            <h3 className='text-[20px] leading-[28px] text-t-black font-medium'>{title}</h3>
        </div>

        <div className='mt-[32px]'>
            <Container year='2021-2024' title='Dizayner' subTitle='Bakı Dövlət Universiteti' text='Lorem ipsum dolor sit amet consectetur. Enim lacus cras mattis lectus suspendisse eu cras. Lectus sed iaculis mi ac et condimentum.' />
            <Container year='2021-2024' title='Dizayner' subTitle='Bakı Dövlət Universiteti' text='Lorem ipsum dolor sit amet consectetur. Enim lacus cras mattis lectus suspendisse eu cras. Lectus sed iaculis mi ac et condimentum.' />
        </div>
    </div>
  )
}

export default Milestone