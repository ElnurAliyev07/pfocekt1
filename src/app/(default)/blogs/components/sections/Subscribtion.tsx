import React from 'react'
import Subscribe from '../ui/buttons/Subscribe'

const Subscribtion = () => {
  return (
    <section className="mt-[72px] lg:mt-[148px]">
    <div className="bg-white py-[32px] px-[12px] lg:p-[48px] rounded-[20px] flex flex-col lg:flex-row lg:justify-between lg:items-center">
        <div className="lg:w-[37%]">
            <h2 className="text-[32px] lg:text-[48px] font-medium leading-[36px] md:leading-[56px]">Abunə olun</h2>
            <p className="mt-[16px] lg:mt-[12px] lg:text-[20px] leading-[28px] text-t-gray">Bütün yeniliklərdən xəbərdar olmaq üçün abunə ola bilərsiniz.</p>
        </div>
        <div className="mt-[40px] lg:mt-0 rounded-[10px] lg:rounded-[16px] h-[52px] lg:h-[72px] w-full md:w-[503px] flex gap-[16px] items-center justify-between px-[12px] py-[6px] lg:px-[24px] lg:py-[10px] border border-borderDefault">
            <input className=" border-black w-full p-0 bg-transparent border-0 focus:ring-0 focus:outline-hidden" type="text" placeholder="Emailinizi daxil edin" />
            <Subscribe />
        </div>
    </div>
</section>
  )
}

export default Subscribtion
