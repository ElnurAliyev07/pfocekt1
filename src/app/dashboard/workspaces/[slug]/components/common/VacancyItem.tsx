import Menu from '@/components/ui/icons/Menu'
import React from 'react'
import VacancyDetailModal from '../modals/VacancyDetailModal'
import { Vacancy } from '@/types/vacancy.type'
import { formatDateOnly } from '@/utils/formateDateTime'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@/components/ui/dropdown/Dropdown'

interface Props {
    vacancy: Vacancy
}

const VacancyItem: React.FC<Props> = ({vacancy}) => {

    return (
        <tr className="text-t-black border-t dark:text-gray-400 text-[14px]">

            <td className="px-1 md:px-4 py-2">
                <div className='flex items-center justify-center gap-[8px]'>
                    <span>{vacancy.title}</span> 
                    <VacancyDetailModal vacancy={vacancy}/>
                </div>

            </td>
            <td className="px-1 md:px-4 py-2">{formatDateOnly(vacancy.started)}</td>
            <td className="px-1 md:px-4 py-2">10</td>
            <td className="px-1 md:px-4 py-2">Müraciətlərə bax</td>
            <td className="px-1 md:px-4 py-2">

                <Dropdown>
                    <DropdownTrigger>
                        <Menu className="text-gray-500" />
                    </DropdownTrigger>
                    <DropdownMenu>
                        <DropdownItem>
                            Edit
                        </DropdownItem>
                        <DropdownItem className="text-red-500">
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

export default VacancyItem
