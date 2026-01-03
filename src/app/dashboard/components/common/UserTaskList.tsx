import React from 'react'
import UserTask from './UserTask'

const UserTaskList = () => {
  return (
    <div>
        <h2 className='text-[32px] leading-[48px] text-t-black font-medium font-poppins'>İstifadəçi Taskları</h2>

        <div className='mt-[36px] grid grid-cols-1 lg:grid-cols-3 gap-[24px]'>
            <UserTask />
            <UserTask />
            <UserTask />
            <UserTask />
            <UserTask />
            <UserTask />
        </div>

        <div className='mt-[36px] flex justify-end'>
          <button className='font-medium text-t-black text-[20px]'>Daha çox</button>
        </div>
    </div>
  )
}

export default UserTaskList