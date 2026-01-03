import Menu from '@/components/ui/icons/Menu'
import { Button } from "@/components/ui"
import React from 'react'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/dropdown/Dropdown'

const ApplicationItem = () => {
    return (
            <tr className="text-t-black border-t dark:text-gray-400 text-[14px]">
                <td className="px-1 lg:px-4 py-2 md:py-3">User User</td>
                <td className="px-1 lg:px-4 py-2 md:py-3">
                    <div className='flex items-center justify-center gap-[8px]'>
                        <span>Frontend Development</span>
                        {/* <VacancyDetailModal vacancy={vacancy}/> */}
                    </div>

                </td>
                <td className="px-1 lg:px-4 py-2 md:py-3">06.02.2025</td>
                <td className="px-1 lg:px-4 py-2 md:py-3">
                <div className='py-[8px] px-[12px] md:px-[43px] rounded-[4px] bg-[#E8E9FF] flex items-center justify-center text-primary font-medium text-[14px] md:text-[16px] leading-[24px]'>
                    Müraciət
                </div>
                </td>
                <td className="px-1 lg:px-4 py-2 md:py-3">
                    <a href="#" className='text-[14px] font-medium leading-[20px] text-primary'>Geri dönüş et</a>
                </td>
                <td className="px-1 lg:px-4 py-2 md:py-3">
                    <a href="#" className='text-[14px] font-medium leading-[20px] text-[#F52824]'>Rədd et</a>
                </td>
                <td className="px-1 lg:px-4 py-2 md:py-3">

                    <Dropdown>
                        <DropdownTrigger nested>
                            <Menu />
                        </DropdownTrigger>
                        <DropdownMenu>
                            <DropdownItem onClick={() => {}}>
                                Edit
                            </DropdownItem>
                            <DropdownItem onClick={() => {}} className="text-red-500">
                                Sil
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>

                </td>
                {/* <ChangeMemberRoleModal member={member} isOpen={selectedModal === "change-role"} onClose={closeModal}/>
<DeleteMemberModal member={member} isOpen={selectedModal === "delete"} onClose={closeModal}/> */}
            </tr>
    )
}

export default ApplicationItem
