'use client'

import React from 'react'
import AxesRight from '@/components/ui/icons/AxesRight';
import Link from 'next/link';
import Task from '../../../components/icons/Task';
import People from '../../../../components/ui/icons/People';
import File from '../../../../components/ui/icons/File';
import Eye from '../../../../components/ui/icons/Eye';
import Image from 'next/image';
import useProjectStore from '@/store/projectStore';
import AddUserModal from '../modals/AddUser';
import { formatDate } from '@/utils/formateDateTime';


const Info: React.FC = () => {
    const { workspace } = useProjectStore();
    return (
        <>
            <div className="md:mt-[24px] flex gap-[2px] items-center">
                <Link href="/dashboard/workspaces/" className="text-[14px] text-[#64717C] leading-[20px]">Virtual Ofislər</Link>
                <AxesRight />
                <div className="text-[14px] text-t-black leading-[20px]">{workspace?.title}</div>
            </div>

            <section className="mt-[32px] p-[20px] md:p-[35px] pb-[23px] rounded-[20px] md:h-[335px] bg-gradient-to-r from-[#BEDCFF] via-[#EFF0FF] to-[#FBD4FE] flex flex-col md:flex-row justify-between items-center">
                    <div className="w-full md:w-auto">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-[24px] md:gap-[30px]">
                        <h2 className="text-[24px] md:text-[32px] leading-[32px] md:leading-[40px] text-t-black font-medium md:font-semibold">{workspace?.title}</h2>
                        <div className="flex items-center gap-[38px] md:gap-[24px]">
                            <div className="flex gap-[4px] items-center">
                                <File />
                                <span className="text-[12px] md:text-[14px] text-t-black">{workspace?.workspace_project_count} Proyekt</span>
                            </div>
                            <div className="flex gap-[4px] items-center">
                                <Task />
                                <span className="text-[12px] md:text-[14px]  text-t-black">{workspace?.tasks_count} Tapşırıq</span>
                            </div>
                            <div className="flex gap-[4px] items-center">
                                <People />
                                <span className="text-[12px] md:text-[14px]  text-t-black">{workspace?.members_count} Üzv</span>
                            </div>
                        </div>
                    </div>
                    <p className="mt-[32px] mb-[32px] text-[12px] md:text-[16px] leading-[20px] md:leading-[24px] text-t-gray w-[50%]">
                        {workspace?.description}
                    </p>

                    <AddUserModal />

                    <div className="mt-[24px] md:mt-[32px] flex items-center gap-[12px]">
                        <div className="flex items-center gap-[4px]">
                            <Eye />
                            <span className="text-t-gray text-[12px] leading-[16px] font-medium">{workspace?.status.label}</span>
                        </div>
                        <span className="text-t-gray text-[12px] leading-[16px] font-medium">{formatDate(workspace?.created || "")}</span>
                    </div>

                </div>

                <div className="hidden md:flex items-center justify-center">
                    <Image className="h-[271px] w-auto " width={1000} height={1000} src="/dashboard/workspace-detail.svg" alt="hero"/>
                </div>
            </section>
        </>
    )
}

export default Info