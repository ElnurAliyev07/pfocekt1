import React from 'react'
import PlusButton from './PlusButton'
import TaskListItem from './TaskListItem'

interface TaskListProps {
    title: string
    date: string
    className?: string
    onAddTask?: () => void
    onViewAll?: () => void
}

const TaskList: React.FC<TaskListProps> = ({
  title, 
  date, 
  className = '',
  onAddTask,
  onViewAll
}) => {
  return (
    <section 
      aria-label={`Task list: ${title}`}
      className={`flex flex-col bg-white py-4 px-4 sm:p-5 sm:max-h-[470px] grow rounded-xl shadow-sm hover:shadow transition-all duration-200 ${className}`}
    >
      <header className='flex flex-col mb-3'>
        <div className='flex items-center justify-between mb-1'>
          <div className='flex items-center gap-2'>
            <div className='w-2 h-2 rounded-full bg-primary' aria-hidden="true"></div> 
            <h3 className='font-medium text-base sm:text-lg text-gray-900'>{title}</h3>
          </div>
          <PlusButton 
            onClick={onAddTask} 
            aria-label={`Add task to ${title}`} 
          />
        </div>
        <time 
          dateTime={date} 
          className='text-xs text-gray-500 font-normal'
        >
          {date}
        </time>
      </header>

      <div 
        className='flex-1 flex flex-col gap-3 overflow-y-auto  scrollbar-none'
        role="list"
        aria-label="Task items"
      >
        {[1, 2, 3, 4, 5].map((item, index) => (
          <TaskListItem key={index} />
        ))}
        {/* If no tasks, show empty state */}
        {false && (
          <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <svg className="w-10 h-10 mb-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p className="text-sm">Hazırda heç bir tapşırıq yoxdur</p>
          </div>
        )}
      </div>

      <footer className="mt-4 flex justify-center">
        <button 
          onClick={onViewAll}
          className='group bg-gray-50 hover:bg-gray-100 text-primary text-xs font-medium transition-all px-4 py-2 rounded-full flex items-center gap-1.5 active:scale-98 focus:outline-none focus:ring-2 focus:ring-primary/20'
          aria-label={`View all tasks in ${title}`}
        >
          Daha çox
          <svg 
            className="w-3.5 h-3.5 transition-transform group-hover:translate-y-0.5" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </footer>
    </section>
  )
}

export default TaskList