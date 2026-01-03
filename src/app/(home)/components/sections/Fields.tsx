import Star from '@/app/dashboard/components/ui/icons/Star'
import React from 'react'

const Fields = () => {
  return (
    <section className="mt-[64px] custom-container block md:hidden">
        <div className='flex flex-col gap-3'>
            <div className='p-[16px] bg-white rounded-[4px] flex flex-col gap-[20px]'>
                <h4 className='text-[20px] text-t-black font-semibold leading-[24px]'>Dizayn</h4>
                <div className='flex items-center gap-[6px]'>
                    <Star width={16} height={16} />
                    <span className='text-[16px] font-medium leading-[16px] text-primary'>4.5/5</span>
                </div>
            </div>
            <div className='p-[16px] bg-white rounded-[4px] flex flex-col gap-[20px]'>
                <h4 className='text-[20px] text-t-black font-semibold leading-[24px]'>Dizayn</h4>
                <div className='flex items-center gap-[6px]'>
                    <Star width={16} height={16} />
                    <span className='text-[16px] font-medium leading-[16px] text-primary'>4.5/5</span>
                </div>
            </div>
            <div className='p-[16px] bg-white rounded-[4px] flex flex-col gap-[20px]'>
                <h4 className='text-[20px] text-t-black font-semibold leading-[24px]'>Dizayn</h4>
                <div className='flex items-center gap-[6px]'>
                    <Star width={16} height={16} />
                    <span className='text-[16px] font-medium leading-[16px] text-primary'>4.5/5</span>
                </div>
            </div>
            <div className='p-[16px] bg-white rounded-[4px] flex flex-col gap-[20px]'>
                <h4 className='text-[20px] text-t-black font-semibold leading-[24px]'>Dizayn</h4>
                <div className='flex items-center gap-[6px]'>
                    <Star width={16} height={16} />
                    <span className='text-[16px] font-medium leading-[16px] text-primary'>4.5/5</span>
                </div>
            </div>
            <div className='p-[16px] bg-white rounded-[4px] flex flex-col gap-[20px]'>
                <h4 className='text-[20px] text-t-black font-semibold leading-[24px]'>Dizayn</h4>
                <div className='flex items-center gap-[6px]'>
                    <Star width={16} height={16} />
                    <span className='text-[16px] font-medium leading-[16px] text-primary'>4.5/5</span>
                </div>
            </div>


            <div className='text-end mt-[20px]'>
                <a href="#" className="text-[16px] font-medium leading-[24px] text-primary">Daha çox(4)</a>
            </div>
        </div>

    </section>
  )
}

export default Fields
