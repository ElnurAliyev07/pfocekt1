import React from 'react'
import Phone from '../ui/icons/Phone'
import Message from '../ui/icons/Message'
import Location from '../ui/icons/Location'
import { ContactInfo } from '@/types/contact.type'


interface Props {
    data: ContactInfo
}

const Hero: React.FC<Props> = ({ data }) => {
    return (
        <div className='order-1'>
            <div className="pt-[84px] md:pt-[172px]">
                <h2 className="text-[24px] md:text-[48px]  font-semibold leading:[32px] md:leading-[56px] text-t-black dark:text-text-dark-black">{data.title}</h2>
                <p className="hidden md:block text-[12px] md:text-[24px] font-normal  mt-[20px] leading-[16px] md:leading-[36px] text-t-gray dark:text-text-dark-black">
                    {data.description}
                </p>
            </div>
            <div className="mt-[36px] md:mt-[64px] grid lg:grid-cols-3 gap-[14px] md:gap-[24px] bg-transparent overflow-hidden p-0">
                <div className="flex items-center gap-[32px] md:gap-[26px] bg-white rounded-[12px] md:rounded-[20px] px-[32px] md:px-[48px] py-[30px] md:py-[50px]">
                    <div className=''>
                        <Phone width={"w-[36px] md:w-[48px]"} height={"h-[36px] md:h-[48px]"} />
                    </div>
                    <div>
                        <ul className="space-y-[8px] md:space-y-[12px]">
                            {
                                data.phones.map((phone, index) => (
                                    <li key={index} className="text-[16px] md:text-[20px] font-medium leading-[24px] md:leading-[28px] text-t-black">{phone.phone}</li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
                <div className="flex items-center gap-[32px] md:gap-[26px] bg-white rounded-[12px] md:rounded-[20px] px-[32px] md:px-[48px] py-[30px] md:py-[50px]">
                    <div className=''>
                        <Message width={"w-[36px] md:w-[48px]"} height={"h-[36px] md:h-[48px]"} />
                    </div>
                    <div>
                        <ul className="space-y-[8px] md:space-y-[12px]">
                            {
                                data.emails.map((email, index) => (
                                    <li key={index} className="text-[16px] md:text-[20px] font-medium leading-[24px] md:leading-[28px] text-t-black">{email.email}</li>
                                ))
                            }
                        </ul>
                    </div>
                </div>
                <div className="flex items-center gap-[32px] md:gap-[26px] bg-white rounded-[12px] md:rounded-[20px] px-[32px] md:px-[48px] py-[30px] md:py-[50px]">
                    <div>
                        <Location width={"w-[36px] md:w-[48px]"} height={"h-[36px] md:h-[48px]"} />
                    </div>
                    <div>
                        <p className="text-[16px] w-[195px] md:w-full font-medium md:text-[20px] leading-[20px] md:leading-[28px] text-t-black">{data.location}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hero
