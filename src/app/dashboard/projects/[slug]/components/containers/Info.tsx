import React, { useEffect } from 'react'
import AxesRight from '@/components/ui/icons/AxesRight';
import Link from 'next/link';
import People from '../../../../components/ui/icons/People';
import Image from 'next/image';
import Task from '@/app/dashboard/workspaces/components/icons/Task';
import useTaskStore from '@/store/taskStore';
import AddUserModal from '../modals/AddUser';


const Info: React.FC = () => {
    const { project} = useTaskStore();

    
    if (!project) {
        return (
            <>
                <div className="mt-[28px] flex gap-[2px] items-center animate-pulse">
                    <div className="w-[80px] md:w-[120px] h-[16px] md:h-[20px] bg-gray-300 rounded-sm"></div>
                    <div className="w-[12px] md:w-[16px] h-[16px] md:h-[20px] bg-gray-300 rounded-sm"></div>
                    <div className="w-[120px] md:w-[200px] h-[16px] md:h-[20px] bg-gray-300 rounded-sm"></div>
                    <div className="w-[12px] md:w-[16px] h-[16px] md:h-[20px] bg-gray-300 rounded-sm"></div>
                    <div className="w-[100px] md:w-[150px] h-[16px] md:h-[20px] bg-gray-300 rounded-sm"></div>
                </div>

                <section id="project" className="mt-[20px] md:mt-[32px] md:h-[335px] rounded-[20px] bg-gray-100 flex flex-col md:flex-row justify-between items-center animate-pulse">
                    <div className="p-[20px] md:p-[44px] pb-[23px] w-full">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-[15px] md:gap-[30px]">
                            <div className="w-[150px] md:w-[200px] h-[30px] md:h-[40px] bg-gray-300 rounded-sm"></div>
                            <div className="flex flex-wrap items-center gap-[12px] md:gap-[24px]">
                                <div className="flex gap-[4px] items-center">
                                    <div className="w-[20px] md:w-[24px] h-[20px] md:h-[24px] bg-gray-300 rounded-sm"></div>
                                    <div className="w-[60px] md:w-[80px] h-[16px] md:h-[20px] bg-gray-300 rounded-sm"></div>
                                </div>
                                <div className="flex gap-[4px] items-center">
                                    <div className="w-[20px] md:w-[24px] h-[20px] md:h-[24px] bg-gray-300 rounded-sm"></div>
                                    <div className="w-[60px] md:w-[80px] h-[16px] md:h-[20px] bg-gray-300 rounded-sm"></div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-[20px] md:mt-[32px] w-full md:w-[50%] h-[20px] md:h-[24px] bg-gray-300 rounded-sm"></div>
                        <div className="mt-[8px] md:mt-[12px] w-full md:w-[60%] h-[20px] md:h-[24px] bg-gray-300 rounded-sm"></div>
                        <div className="mt-[20px] md:mt-[27px] flex flex-col md:flex-row items-start md:items-center gap-[15px] md:gap-[64px]">
                            <div className="w-full md:w-[143px] h-[40px] md:h-[44px] bg-gray-300 rounded-sm"></div>
                            <div className="w-[80px] md:w-[100px] h-[14px] md:h-[16px] bg-gray-300 rounded-sm"></div>
                        </div>
                    </div>

                    <div className="hidden md:flex w-full md:w-auto px-[20px] md:px-0 pb-[20px] md:pb-0">
                        <div className="w-full md:w-[271px] h-[200px] md:h-[271px] bg-gray-300 rounded-sm"></div>
                    </div>
                </section>
            </>
        )
    }
    return (
        <>
            <div className="mt-[28px] flex gap-[2px] items-center">
                <Link href="/dashboard/workspaces/" className="text-[14px] text-[#64717C] leading-[20px]">Virtual Ofislər</Link>
                <AxesRight />
                <Link href={`/dashboard/workspaces/${project.workspace.slug}`} className="text-[14px] text-[#64717C] leading-[20px]">Virtual Ofis: {project.workspace.title}</Link>
                <AxesRight />
                <div className="text-[14px] text-t-black leading-[20px]">Proyekt: {project.title}</div>

            </div>

            <section id="project" className="mt-[32px] p-[20px] md:p-[35px] pb-[23px] rounded-[20px] md:h-[335px] h-[200px] bg-gradient-to-r from-[#BEDCFF] via-[#EFF0FF] to-[#FBD4FE] flex flex-col md:flex-row justify-between items-center">
                <div className="w-full md:w-auto">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-[15px] md:gap-[30px]">
                        <h2 className="text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] text-t-black font-semibold">{ project.title }</h2>
                        <div className="flex flex-wrap items-center gap-[12px] md:gap-[24px]">
                            <div className="flex gap-[4px] items-center">
                                <Task />
                                <span className="text-[14px] text-t-black">{ project.tasks_count } Tapşırıq</span>
                            </div>
                            <div className="flex gap-[4px] items-center">
                                <People />
                                <span className="text-[14px] text-t-black">{ project.members_count } Üzv</span>
                            </div>
                        </div>
                    </div>
                    <p className="mt-[20px] md:mt-[32px] leading-[24px] text-t-gray w-full md:w-[50%]">
                        { project.description }
                    </p>
                    <div className="mt-[20px] md:mt-[27px] flex flex-col md:flex-row items-start md:items-center gap-[20px] md:gap-[64px]">
                        <AddUserModal/>
                    </div>
                    <div className="mt-[20px] md:mt-[27px]">
                        <span className="text-t-gray text-[12px] leading-[16px] font-medium">{ project.created_date }</span>    
                    </div>
                </div>

                <div className="hidden md:flex w-full md:w-auto px-[20px] md:px-0 pb-[20px] md:pb-0 md:pr-[19px]">
                    <Image className="h-[200px] md:h-[270px] w-auto rounded-[10px]" width={2000} height={2000} src="/dashboard/project-detail.svg" alt="hero" />
                </div>
            </section>
            
        </>
    )
}

export default Info