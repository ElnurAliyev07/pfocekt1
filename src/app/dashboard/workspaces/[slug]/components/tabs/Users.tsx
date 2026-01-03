'use client'


import React, { useEffect } from 'react'
import SearchInput from '../inputs/Search'
import { debounce } from '@/utils/debounceUtils';
import useWorkspaceMemberStore from '@/store/workspaceMemberStore';
import UserItem from '../common/UserItem';
import AddUserModal from '../modals/AddUser';
import useProjectStore from '@/store/projectStore';
import { useAppContext } from '@/providers/AppProvider';

const Users = () => {
  const { workspaceMembers } = useWorkspaceMemberStore();


  const handleSearch = debounce(async (query: string) => {
    console.log(query)
  }, 300);



  return (
    <div className='mt-[20px] md:mt-[42px]'>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 sm:gap-[30px] items-start sm:items-center">
          <h3 className="text-[20px] sm:text-[24px] font-semibold leading-[28px] sm:leading-[32px]">Üzvlər</h3>
          <SearchInput
            onSearch={handleSearch}
          />
        </div>

        <AddUserModal />
      </div>

        <div className="mt-[36px] max-w-[320px] sm:max-w-[390px] md:max-w-full overflow-x-auto">
          <table className="w-full md:max-w-full  table-auto text-center text-sm sm:text-base lg:text-[20px]">
            <thead>
              <tr className="font-medium text-t-black">
                <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base lg:text-[20px]">Profil</th>
                <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base lg:text-[20px]">Ad soyad</th>
                <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base lg:text-[20px]">İxtisas</th>
                <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base lg:text-[20px]">Email</th>
                <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base lg:text-[20px]">Rol</th>
                <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3">Status</th>
                <th className="px-2 sm:px-3 lg:px-4 py-2 sm:py-3"></th>
              </tr>
            </thead>
            <tbody>
              {workspaceMembers.map((member, index) => (
                <UserItem key={index} member={member} />
              ))}
            </tbody>
          </table>
      </div>
    </div>
  )
}

export default Users