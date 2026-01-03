import React from 'react'

interface TaskListItemProps {
  title?: string;
  timeStart?: string;
  timeEnd?: string;
  status?: 'not-started' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  onClick?: () => void;
}

const TaskListItem: React.FC<TaskListItemProps> = ({
  title = 'Task Title',
  timeStart = '09:00',
  timeEnd = '09:30',
  status = 'not-started',
  priority = 'medium',
  onClick
}) => {
  // Status colors
  const statusColors = {
    'not-started': 'bg-yellow-500',
    'in-progress': 'bg-blue-500',
    'completed': 'bg-green-500'
  };
  
  // Priority indicators
  const priorityDisplay = {
    'low': { color: 'bg-green-100 text-green-800', text: 'Aşağı' },
    'medium': { color: 'bg-blue-100 text-blue-800', text: 'Orta' },
    'high': { color: 'bg-red-100 text-red-800', text: 'Yüksək' }
  };

  return (
    <div 
      role="listitem"
      onClick={onClick}
      className='flex justify-between items-center border-b border-gray-100 py-3 hover:bg-gray-50 rounded px-2 transition-colors cursor-pointer'
    >
      <div className='flex items-center gap-2'>
        <div className={`w-2 h-2 rounded-full ${statusColors[status]}`}></div>
        <p className='text-sm sm:text-base font-medium'>{timeStart}</p>
      </div>
      
      <div className='flex-1 flex items-center justify-between ml-4'>
        <div className='flex flex-col'>
          <h4 className='text-sm sm:text-base font-medium text-gray-900'>{title}</h4>
          <p className='text-xs text-gray-500'>{timeStart}-{timeEnd}</p>
        </div>
        
        <span className={`text-[10px] px-2 py-0.5 rounded-full ${priorityDisplay[priority].color}`}>
          {priorityDisplay[priority].text}
        </span>
      </div>
    </div>
  )
}

export default TaskListItem