import Image from 'next/image'
import React from 'react'

interface RecentItemProps {
  userName?: string;
  userImage?: string;
  projectName?: string;
  taskName?: string;
  action?: string;
  timestamp?: string;
  onClick?: () => void;
}

const RecentItem: React.FC<RecentItemProps> = ({
  userName = 'Ayaz Aliyev',
  userImage = '/grid.png',
  projectName = 'Proyekt',
  taskName = 'Task',
  action = 'lorem ipsum dolor sit amet consectetur.',
  timestamp = 'Bu gün 20:08',
  onClick
}) => {
  return (
    <article 
      role="article"
      onClick={onClick}
      className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <div className="flex-shrink-0">
        <Image 
          className="rounded-full" 
          width={40} 
          height={40} 
          src={userImage} 
          alt={`Profile picture of ${userName}`} 
        />
      </div>
      
      <div className="flex-1 min-w-0"> {/* min-width prevents text overflow issues */}
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="text-sm font-medium text-gray-900">{projectName}</h4>
          <div className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden="true"></div>
          <h4 className="text-sm font-medium text-gray-900">{taskName}</h4>
        </div>
        
        <div className="mt-1 text-xs sm:text-sm">
          <span className="font-medium text-gray-900">{userName} </span>
          <span className="text-gray-600">{action}</span>
        </div>
        
        <time 
          dateTime={timestamp} 
          className="block mt-1.5 text-[10px] sm:text-xs text-gray-500 font-medium"
        >
          {timestamp}
        </time>
      </div>
    </article>
  )
}

export default RecentItem