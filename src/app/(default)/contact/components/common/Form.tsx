import React from 'react'
import SendMessage from '../ui/buttons/SendMessage'

const Form = () => {
  return (
    <div className="flex flex-col lg:block order-2 lg:order-none mt-[36px] lg:mt-0 lg:w-[60%] bg-transparent rounded-[24px] md:rounded-none px-[16px] py-[32px] md:px-0 md:py-0">
            <h3 className="block lg:hidden mb-[36px] text-[28px] md:text-[32px] font-semibold leading-[32px]">Bizimlə Əlaqə</h3>
            <form action="" method="post" >
                <div className="grid lg:grid-cols-2 gap-[28px] md:gap-[16px]">
                    <div>
                        <label className="text-[14px] md:text-[14px] block" htmlFor="first_name">Ad</label>
                        <input className="mt-[8px] w-full border border-gray rounded-[12px] py-[12px] md:py-[14px] focus:border-primary focus:ring-primary px-[16px] placeholder:text-[#8E8E93] text-[14px]" id="first_name" type="text" placeholder="Adınızı daxil edin" />
                    </div>
                    <div>
                        <label className="text-[14px] md:text-[14px] block" htmlFor="last_name">Soyad</label>
                        <input className="mt-[8px] w-full border border-gray rounded-[12px] py-[12px] md:py-[14px] focus:border-primary focus:ring-primary px-[16px] placeholder:text-[#8E8E93] text-[14px]" id="last_name" type="text" placeholder="Soyadınızı daxil edin" />
                    </div>
                </div>
                <div className="mt-[28px] md:mt-[16px] grid lg:grid-cols-2 gap-[28px] md:gap-[16px]">
                    <div>
                        <label className="text-[14px] md:text-[14px] block" htmlFor="email">Email</label>
                        <input className="mt-[8px] w-full border border-gray rounded-[12px] py-[12px] md:py-[14px] focus:border-primary focus:ring-primary px-[16px] placeholder:text-[#8E8E93] text-[14px]" id="email" type="email" placeholder="Email ünvanınızı daxil edin"/>
                    </div>
                    <div>
                        <label className="text-[14px] md:text-[14px] block" htmlFor="number">Telefon nömrəsi</label>
                        <input className="mt-[8px] w-full border border-gray rounded-[12px] py-[12px] md:py-[14px] focus:border-primary focus:ring-primary px-[16px] placeholder:text-[#8E8E93] text-[14px]" id="number" type="tel" placeholder="Telefon nömrənizi daxil edin"/>
                    </div>
                </div>
                <div className="mt-[28px] md:mt-[16px]">
                    <label className="text-[14px] md:text-[14px] block" htmlFor="text">Sizin mesajınız</label>
                    <textarea placeholder="Mesajınızı daxil edin" className="resize-none mt-[8px] h-[169px] md:h-[114px] w-full border border-gray rounded-[12px] py-[12px] md:py-[14px] focus:border-primary focus:ring-primary px-[16px] placeholder:text-[#8E8E93] text-[12px] md:text-[14px]" name="" id="text"></textarea>
                </div>
                <div className='block lg:flex mt-[48px] md:mt-[70px]'>
                <SendMessage />
                </div>
            </form>
        </div>
  )
}

export default Form
