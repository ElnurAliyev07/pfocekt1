import AxesRight from '@/components/ui/icons/AxesRight'
import Link from 'next/link'
import React from 'react'
import useTaskItemStore from '@/store/taskItemStore';

const Header = () => {
  const { task } = useTaskItemStore();
  return (
    <div className="mt-[16px] md:mt-[28px] flex flex-wrap gap-[2px] items-center text-[14px] leading-[20px]">
        <Link href="/dashboard/workspaces/" className="text-[#64717C]">
          Virtual Ofislər
        </Link>
        <AxesRight  />
        <Link href={`/dashboard/workspaces/${task?.project.workspace.slug}`} className="text-[#64717C]">

          <span>Virtual Ofis: {task?.project.workspace.title}</span>
        </Link>
        <AxesRight  />
        <Link href={`/dashboard/projects/${task?.project.slug}`} className="text-[#64717C]">

          <span>Proyekt: {task?.project.title}</span>
        </Link>
        <AxesRight  />
        <Link href={`/dashboard/tasks/${task?.id}/`} className="text-t-black">

          <span>Task: {task?.title}</span>
        </Link>
    </div> 
  )
}

export default Header