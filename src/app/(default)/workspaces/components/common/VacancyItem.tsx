import Calendar from '@/app/(default)/workspaces/components/ui/icons/Calendar'
import Currency from '@/app/(home)/components/ui/icons/Currency'
import Location from '@/app/(home)/components/ui/icons/Location'
import { Vacancy } from '@/types/vacancy.type'
import { formatDateOnly } from '@/utils/formateDateTime'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface Props {
    item: Vacancy
}

const VacancyItem: React.FC<Props> = ({ item }) => (
    <div className="bg-white flex flex-col border border-gray rounded-[20px] py-[24px] md:py-[32px] px-[16px] md:px-[18px] ">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-[16px]">
                <div className="w-[64px] h-[64px] rounded-full grid place-items-center">
                    <Image src="/grid.png" className='w-auto h-auto object-cover rounded-full' width={300} height={300} alt='office item img' />
                </div>
                <div>
                    <p className="font-medium text-[18px] md:text-[20px] text-t-black dark:text-text-dark-black">{item.title}</p>
                    <p className="mt-[6px] text-[14px] ">
                        <span className="font-medium text-primary">{item.establishment}</span>
                    </p>
                </div>
            </div>
        </div>

        <div className='flex items-center flex-wrap gap-[14px] place-items-center my-[28px]'>
            {item.work_schedulers.map((work_scheduler, index) => (
                <span key={index} className='py-[6px] w-[92px] md:w-[96px] lg:w-[108px] text-center text-[12px] md:text-[14px] font-medium text-primary bg-[#F3F4F5] rounded-[6px]'>
                    {work_scheduler.title}
                </span>
            ))}
            {item.work_modes.map((work_mode, index) => (
                <span key={index} className='py-[6px] w-[92px] md:w-[96px] lg:w-[108px] text-center text-[12px] md:text-[14px] font-medium text-primary bg-[#F3F4F5] rounded-[6px]'>
                    {work_mode.title}
                </span>
            ))}
            {
            (item.experience_start || item.experience_finish) ? (
                <span className='py-[6px] w-[92px] md:w-[96px] lg:w-[108px] text-center text-[12px] md:text-[14px] font-medium text-primary bg-[#F3F4F5] rounded-[6px]'>
                    {item.experience_start}{(item.started && item.experience_finish) ? '-': ''}{item.experience_finish} il
                </span>
            ) : ''
            }
        </div>

        <div className='flex flex-col gap-[12px]'>
            {
                item.salary && (
                    <div className='flex items-center gap-[12px]'>
                        <span className='w-[32px] h-[32px] bg-[#D3C5FA] flex justify-center items-center rounded-full'><Currency /></span>
                        <span className='font-normal text-[16px] text-t-gray'>{item.salary}</span>
                    </div>
                )
            }
            {
                item.location && (
                    <div className='flex items-center gap-[12px]'>
                        <span className='w-[32px] h-[32px] bg-[#CEF9E1] flex justify-center items-center rounded-full'><Location color='#3CB56F' /></span>
                        <span className='font-normal text-[14px] md:text-[16px] text-t-gray'>{item.location}</span>
                    </div>
                )
            }
        </div>

        <div className='mt-[24px] flex-1 flex flex-col justify-end'>
            <div className='grid grid-cols-2 gap-[12px]'>
                <a href="#" className="flex items-center justify-center bg-primary text-white hover:bg-primary-hover focus:bg-primary-focus text-center rounded-[8px] h-[44px] px-[24px] font-medium text-[16px] leading-[28px]">
                    Müraciət et
                </a>
                <Link href={`/vacancies/${item.slug}/`} className="flex items-center justify-center border border-primary bg-white text-primary  hover:text-primary-hover focus:text-primary-focus hover:border-primary-hover focus:border-primary-focus text-center rounded-[8px] h-[44px] px-[24px] font-medium text-[16px] leading-[28px]">
                    Daha çox
                </Link>
            </div>

            <div className='flex items-center gap-1 mt-[24px]'>
                <Calendar />
                <span className='text-[14px] text-t-gray font-normal'>{formatDateOnly(item.started)}</span>
            </div>
        </div>

    </div>
)

export default VacancyItem
