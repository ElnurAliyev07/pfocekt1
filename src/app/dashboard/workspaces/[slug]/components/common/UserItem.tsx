'use client'

import Menu from '@/components/ui/icons/Menu'
import { WorkspaceMember } from '@/types/workspace.type'
import { Button } from "@/components/ui"
import Image from 'next/image'
import React, { useState } from 'react'
import DeleteMemberModal from '../modals/DeleteMember'
import ChangeMemberRoleModal from '../modals/ChangeMemberRole'
import useProjectStore from '@/store/projectStore'
import Link from 'next/link'
import Avatar from '@/components/common/avatar/Avatar'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/dropdown/Dropdown'

interface Props{
    member: WorkspaceMember
}

const UserItem: React.FC<Props> = ({member}) => {
    const [selectedModal, setSelectedModal] = useState<string | number | null>(null);
    const { workspace } = useProjectStore();

        const openModal = (key: string | number) => {
            setSelectedModal(key);
          };
        
          const closeModal = () => {
            setSelectedModal(null);
          };
    
    return (
        <tr className="text-t-black border-t dark:text-gray-400 text-[14px]">
            <td className="px-2 sm:px-4 py-2 flex justify-center items-center">
                {member.user?.user_profile && (
                    <Avatar
                        user={member.user}
                        size="sm"
                        showHover={true}
                    />
                )}
            </td>
            <td className="px-2 sm:px-4 py-2 font-medium text-gray-900 dark:text-white">
                <span className='whitespace-nowrap'>{member.user?.full_name}</span>
            </td>
            <td className="h px-4 py-2">
                <span className="whitespace-nowrap">
                    {
                        member.user?.user_profile?.profession?.name || 'Məlumat yoxdur'
                    }
                </span>
            </td>
            <td className=" px-4 py-2">
                <span className="whitespace-nowrap">{member.user?.email || member.email}</span>
            </td>
            <td className="px-2 sm:px-4 py-2">
                <span className="whitespace-nowrap">{member.role.label}</span>
            </td>
            <td className=" px-4 py-2">
                {member.status.key !== 'accepted' && member.status.label}
            </td>
            <td className="px-2 sm:px-4 py-2">
                {
                        workspace?.user_role !== 'member' && (
                        <Dropdown>
                            <DropdownTrigger>
                                <Menu className="text-gray-500" />
                            </DropdownTrigger>
                            <DropdownMenu>
                                <DropdownItem onClick={() => openModal("change-role")}>
                                    Rolu dəyiş
                                </DropdownItem>
                                <DropdownItem onClick={() => openModal("delete")} className="text-red-500">
                                    Sil
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    )
                }
                
            </td>
            <ChangeMemberRoleModal member={member} isOpen={selectedModal === "change-role"} onClose={closeModal}/>
            <DeleteMemberModal member={member} isOpen={selectedModal === "delete"} onClose={closeModal}/>
        </tr>
    )
}

export default UserItem