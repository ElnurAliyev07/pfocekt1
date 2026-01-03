import Join from '@/app/(default)/vacancies/[slug]/components/ui/buttons/Join';
import Clock from '@/app/(default)/vacancies/[slug]/components/ui/icons/Clock';
import Date from '@/app/(default)/vacancies/[slug]/components/ui/icons/Date';
import Location from '@/app/(default)/vacancies/[slug]/components/ui/icons/Location';
import Tick from '@/app/(default)/vacancies/[slug]/components/ui/icons/Tick';
import Wallet from '@/app/(default)/vacancies/[slug]/components/ui/icons/Wallet';
import Watch from '@/app/(default)/vacancies/[slug]/components/ui/icons/Watch'
import WorkRegime from '@/app/(default)/vacancies/[slug]/components/ui/icons/WorkRegime';
import AxesRight from '@/components/ui/icons/AxesRight';
import { Vacancy } from '@/types/vacancy.type';
import { formatDateOnly } from '@/utils/formateDateTime';
import { Modal } from "@/components/ui";
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'



interface Props {
    vacancy: Vacancy
}

const VacancyDetailModal: React.FC<Props> = ({vacancy}) => {
    const [isOpen, setIsOpen] = useState(false);
    const onOpenChange = () => setIsOpen(!isOpen);
    const onOpen = () => setIsOpen(true);


    return (
        <>
            <button onClick={onOpen}>
                <Watch />
            </button>

            <Modal.Modal className='custom-container py-[20px]' isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
                <Modal.ModalContent className=''>
                    <Modal.ModalHeader className='mb-[32px] md:mb-[10px] flex items-center gap-1'>
                        <Link href={"/workspaces"} className="text-t-gray text-[12px] md:text-[14px]">Vakansiyalar</Link>
                        <AxesRight />
                        <span className="text-t-black text-[12px] md:text-[14px]">{vacancy.title}</span>
                    </Modal.ModalHeader>
                    <Modal.ModalBody className='max-h-[438px] overflow-y-auto custom-scrollbar'>
                        <div className="bg-white rounded-[20px]">
                            <div className="px-[8px] py-[40px] lg:p-[15px]">
                                <div className="flex items-center gap-[12px] md:gap-[24px]">
                                    <Image
                                        src="/grid.png"
                                        className="w-[56px] h-[56px] md:w-[70px] md:h-[70px] rounded-full object-cover"
                                        width={1000}
                                        height={1000}
                                        alt="profile img"
                                    />
                                    <div className="space-y-[10px] md:space-y-[5px]">
                                        <h2 className="text-[18px] md:text-[20px] text-t-black font-medium leading-[24px] md:leading-[40px]">
                                            {vacancy.title}
                                        </h2>
                                        <h4 className="text-primary text-[14px] md:text-[14px] font-medium md:pr-[8px] mr-[8px]">
                                            {vacancy.establishment}
                                        </h4>
                                    </div>
                                </div>
                                <div className="flex gap-[8px] mt-[40px] md:hidden">
                                    <Date width={20} height={20} />
                                    <div>
                                        <h3 className="text-t-black text-[14px]">{formatDateOnly(vacancy.started)}</h3>
                                        <p className="text-t-gray text-[12px]">Elan tarixi</p>
                                    </div>
                                    <div className="ml-6">
                                        <h3 className="text-t-black text-[14px]">{formatDateOnly(vacancy.ended)}</h3>
                                        <p className="text-t-gray text-[12px]">Bitmə tarixi</p>
                                    </div>
                                </div>
                                <div className="mt-[32px] md:mt-[40px] rounded-[20px] md:border border-borderDefault md:py-[10px] md:px-[18px]">
                                    <div>
                                        <div className="hidden md:flex gap-[8px] mt-[32px] mb-[36px]">
                                            <Date />
                                            <div>
                                                <h3 className="text-t-black text-[20px]">{formatDateOnly(vacancy.started)}</h3>
                                                <p className="text-t-gray">Elan tarixi</p>
                                            </div>
                                            <div className="ml-8">
                                                <h3 className="text-t-black text-[20px]">{formatDateOnly(vacancy.ended)}</h3>
                                                <p className="text-t-gray">Bitmə tarixi</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 lg:flex lg:gap-[48px]">

                                            <div className="flex gap-[8px] mt-[32px]">
                                                <div className="hidden md:block">
                                                    <Location />
                                                </div>
                                                <div className="block md:hidden">
                                                    <Location width={20} height={20} />
                                                </div>

                                                <div>
                                                    <h3 className="text-t-black text-[16px] md:text-[20px]">{vacancy.location}</h3>
                                                    <p className="text-t-gray text-[12px] md:text-[16px]">Adress</p>
                                                </div>
                                            </div>


                                            <div className="flex gap-[8px] mt-[32px]">
                                                <div className="hidden md:block">
                                                    <Watch />
                                                </div>
                                                <div className="block md:hidden">
                                                    <Watch width={20} height={20} />
                                                </div>

                                                <div>
                                                    <h3 className="text-t-black text-[16px] md:text-[20px]">{vacancy.view_count}</h3>
                                                    <p className="text-t-gray text-[12px] md:text-[16px]">Baxış sayı</p>
                                                </div>
                                            </div>


                                            <div className="flex gap-[8px] mt-[32px]">
                                                <div className="hidden md:block">
                                                    <Wallet />
                                                </div>
                                                <div className="block md:hidden">
                                                    <Wallet width={20} height={20} />
                                                </div>
                                                <div>
                                                    <h3 className="text-t-black text-[16px] md:text-[20px]">{vacancy.salary} AZN</h3>
                                                    <p className="text-t-gray text-[12px] md:text-[16px]">Əmək haqqı</p>
                                                </div>
                                            </div>



                                            <div className="flex gap-[8px] mt-[32px]">
                                                <div className="hidden md:block">
                                                    <Clock />
                                                </div>
                                                <div className="block md:hidden">
                                                    <Clock width={20} height={20} />
                                                </div>
                                                <div>
                                                    <h3 className="text-t-black text-[16px] md:text-[20px]">İş saatı</h3>
                                                    <p className="text-t-gray text-[12px] md:text-[16px]">
                                                        {
                                                                vacancy.work_schedulers.map((item, index) => (
                                                                    <span key={index}>{item.title}{index !== vacancy.work_schedulers.length - 1 && ','}</span>
                                                                ))
                                                            }
                                                    </p>
                                                </div>
                                            </div>



                                            <div className="flex gap-[8px] mt-[32px]">
                                                <div className="hidden md:block">
                                                    <WorkRegime />
                                                </div>
                                                <div className="block md:hidden">
                                                    <WorkRegime width={20} height={20} />
                                                </div>
                                                <div>
                                                    <h3 className="text-t-black text-[16px] md:text-[20px]">İş rejimi</h3>
                                                    <p className="text-t-gray text-[12px] md:text-[16px]">
                                                        {
                                                                vacancy.work_modes.map((item, index) => (
                                                                    <span key={index}>{item.title}{index !== vacancy.work_modes.length - 1 && ','}</span>
                                                                ))
                                                            }
                                                    </p>
                                                </div>
                                            </div>


                                            <div className="flex gap-[8px] mt-[32px]">
                                                <div className="hidden md:block">
                                                    <Tick />
                                                </div>
                                                <div className="block md:hidden">
                                                    <Tick width={20} height={20} />
                                                </div>
                                                <div>
                                                    <h3 className="text-t-black text-[16px] md:text-[20px]">Təcrübə</h3>
                                                    <p className="text-t-gray text-[12px] md:text-[16px]">{vacancy.experience_start}{(vacancy.started && vacancy.experience_finish) ? '-': ''}{vacancy.experience_finish} il</p>
                                                </div>
                                            </div>


                                        </div>
                                    </div>

                                    <div className="mt-[48px] md:mt-[56px]">
                                        <h3 className="text-t-black text-[20px] md:text-[22px] font-medium leading-[28px] md:leading-[32px]">
                                            İş barədə məlumat
                                        </h3>
                                        <ul className="mt-[24px] md:mt-[20px] flex flex-col gap-3">
                                            {vacancy.vacancy_descriptions.map((item, index) => (
                                                    <li key={index} className="flex items-center text-[12px] leading-[20px] gap-[10px] md:text-[18px] md:leading-[28px] text-t-gray">
                                                        {
                                                            vacancy.vacancy_descriptions.length > 1 &&
                                                            <div className="w-[8px] h-[8px] rounded-full bg-primary inline-block lg:block"></div>
                                                        }
                                                        <span>
                                                            {item.description}
                                                        </span>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>



                                    <div className="mt-[32px]">
                                        <h3 className="text-t-black text-[20px] md:text-[22px] font-medium leading-[28px] md:leading-[32px]">
                                            Tələblər
                                        </h3>
                                        <ul className="mt-[24px] md:mt-[20px] flex flex-col gap-3">
                                            {vacancy.vacancy_requirements.map((item, index) => (
                                                    <li key={index} className="flex items-center text-[12px] leading-[20px] gap-[10px] md:text-[18px] md:leading-[28px] text-t-gray">
                                                        {
                                                            vacancy.vacancy_requirements.length > 1 &&
                                                            <div className="w-[8px] h-[8px] rounded-full bg-primary inline-block lg:block"></div>
                                                        }
                                                        <span>
                                                            {item.requirement}
                                                        </span>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.ModalBody>
                    <Modal.ModalFooter className='px-6 py-0'>
                        <div className="flex md:block mt-9 md:text-end">
                            <Join />
                        </div>
                    </Modal.ModalFooter>
                </Modal.ModalContent>
            </Modal.Modal>

        </>
    )
}

export default VacancyDetailModal
