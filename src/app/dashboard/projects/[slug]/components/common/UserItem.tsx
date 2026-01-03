import Menu from '@/components/ui/icons/Menu'
import { ProjectMember } from '@/types/project.type'
import { Dropdown, DropdownMenu, DropdownItem, DropdownTrigger } from "@/components/ui/dropdown/Dropdown"
import Image from 'next/image'
import React, { useState } from 'react'
import ChangeMemberRoleModal from '../modals/ChangeMemberRole'
import DeleteMemberModal from '../modals/DeleteMember'

interface Props{
    member: ProjectMember
}

const UserItem: React.FC<Props> = ({member}) => {
    const [selectedModal, setSelectedModal] = useState<string | number | null>(null);

    const openModal = (key: string | number) => {
        setSelectedModal(key);
    };
    
    const closeModal = () => {
        setSelectedModal(null);
    };
    
    return (
        <tr className="text-t-black border-t dark:text-gray-400 text-[14px]">
            <td className="px-1 whitespace-nowrap md:whitespace-normal md:px-4 py-2">
                {member.user?.user_profile && (
                    <Image
                        src={member.user?.user_profile.image || '/grid.png'}
                        width={40}
                        height={40}
                        alt="Profile Image"
                        className="w-10 h-10 object-cover rounded-full mx-auto"
                    />
                )}
            </td>
            <td className="px-1 whitespace-nowrap md:whitespace-normal md:px-4 py-2 font-medium text-gray-900 dark:text-white">{member.user?.full_name}</td>
            <td className="px-1 whitespace-nowrap md:whitespace-normal md:px-4 py-2">{member?.user?.user_profile?.profession?.name || 'Məlumat yoxdur'}</td>
            <td className="px-1 whitespace-nowrap md:whitespace-normal md:px-4 py-2">{member.user?.email || member.email}</td>
            <td className="px-1 whitespace-nowrap md:whitespace-normal md:px-4 py-2">{member.role.label}</td>
            <td className="px-1 whitespace-nowrap md:whitespace-normal md:px-4 py-2">{member.status.key !== 'accepted' && member.status.label}</td>
            <td className="px-1 whitespace-nowrap md:whitespace-normal md:px-4 py-2">
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
                
            </td>
            <ChangeMemberRoleModal member={member} isOpen={selectedModal === "change-role"} onClose={closeModal}/>
            <DeleteMemberModal member={member} isOpen={selectedModal === "delete"} onClose={closeModal}/>
        </tr>
    )
}

export default UserItem