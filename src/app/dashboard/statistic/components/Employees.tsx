import React from 'react'
import Employee from './Employee'

const Employees: React.FC = () => {
  return (
    <div className='lg:w-[35%] pt-6  pb-5  bg-white rounded-[20px] mt-[20px] lg:mt-0'>
       <h1 className='pr-3 pl-4 text-t-black mb-[16px] lg:mb-8 text-[20px] font-medium'>Əməkdaşlar</h1>
       <div className='h-[292px] overflow-y-auto pr-3 pl-4 custom-scrollbar flex flex-col gap-5'>
         <Employee />
         <Employee />
         <Employee />
         <Employee />
         <Employee />
         <Employee />
         <Employee />
         <Employee />
         <Employee />
         <Employee />
         <Employee />
         <Employee />
       </div>
    </div>
  )
}


export default Employees
