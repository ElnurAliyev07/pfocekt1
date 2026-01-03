import AxesRight from '@/components/ui/icons/AxesRight'
import useSubtaskItemStore from '@/store/subtaskItemStore'
import { getSubtaskByKey } from '@/types/task_helper.type'
import Link from 'next/link'
import React from 'react'

const Header = () => {
  const { subtask } = useSubtaskItemStore();
  return (
    <div className="mt-4 md:mt-7 flex flex-wrap items-center gap-1 md:gap-0.5">
        <Link 
            href={`/dashboard/workspaces/`} 
            className="text-xs md:text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
            Virtual Ofislər
        </Link>
        <AxesRight className="w-4 h-4 text-gray-400" />
        <Link 
            href={`/dashboard/workspaces/${subtask?.task.project.workspace.slug}/`} 
            className="text-xs md:text-sm text-gray-500 hover:text-gray-700 transition-colors max-w-[150px] md:max-w-none truncate"
        >
            Virtual Ofis: {subtask?.task.project.workspace.title}
        </Link>
        <AxesRight className="w-4 h-4 text-gray-400" />
        <Link 
            href={`/dashboard/projects/${subtask?.task.project.slug}`} 
            className="text-xs md:text-sm text-gray-500 hover:text-gray-700 transition-colors max-w-[150px] md:max-w-none truncate"
        >
            Proyekt: {subtask?.task.project.title}
        </Link>
        <AxesRight className="w-4 h-4 text-gray-400" />
        <Link 
            href={`/dashboard/tasks/${subtask?.task.id}/`} 
            className="text-xs md:text-sm text-gray-500 hover:text-gray-700 transition-colors max-w-[150px] md:max-w-none truncate"
        >
            Task: {subtask?.task.title}
        </Link>
        <AxesRight className="w-4 h-4 text-gray-400" />
        <Link 
            href={`/dashboard/subtasks/${subtask?.id}/`} 
            className="text-xs md:text-sm text-gray-900 font-medium max-w-[150px] md:max-w-none truncate"
        >
            Subtask: {subtask?.job || subtask?.subtask_types.map((type) => getSubtaskByKey(type.type)?.label).join(', ')}
        </Link>
    </div> 
  )
}

export default Header