import React, { useState } from 'react'
import RecentItem from './RecentItem'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface RecentActivityProps {
  date?: string;
  totalCount?: number;
  className?: string;
  onViewAll?: () => void;
  activities?: Array<{
    id: string | number;
    type: 'comment' | 'update' | 'creation' | 'assignment' | 'completion';
    userName: string;
    userImage: string;
    projectName: string;
    taskName: string;
    action: string;
    timestamp: string;
  }>;
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  date = '04 Sent 2024, Şənbə',
  totalCount = 20,
  className = '',
  onViewAll,
  activities = []
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // If no activities are provided, use demo data
  const demoActivities = [
    { id: 1, type: 'comment', userName: 'Ayaz Aliyev', userImage: '/grid.png', projectName: 'Veb Saytı', taskName: 'Yeni səhifə', action: 'bir şərh əlavə etdi', timestamp: 'Bu gün 20:08' },
    { id: 2, type: 'update', userName: 'Anar Mammadov', userImage: '/grid.png', projectName: 'TaskFries', taskName: 'Dashboard', action: 'statusu yenilədi', timestamp: 'Bu gün 18:45' },
    { id: 3, type: 'creation', userName: 'Leyla Aliyeva', userImage: '/grid.png', projectName: 'CRM', taskName: 'Yeni müştəri', action: 'yeni müştəri yaratdı', timestamp: 'Dünən 15:30' },
    { id: 4, type: 'assignment', userName: 'Elvin Huseynov', userImage: '/grid.png', projectName: 'Mobile App', taskName: 'Login UI', action: 'Vusala təyin edildi', timestamp: 'Dünən 12:20' },
    { id: 5, type: 'completion', userName: 'Vusala Mammadova', userImage: '/grid.png', projectName: 'E-commerce', taskName: 'Ödəniş sistemi', action: 'tamamlandı', timestamp: '18 May 09:10' },
  ];

  const displayActivities = activities.length > 0 ? activities : demoActivities;
  
  // Filter options
  const filterOptions = [
    { id: 'all', label: 'Hamısı' },
    { id: 'comment', label: 'Şərhlər' },
    { id: 'update', label: 'Yenilənmələr' },
  ];

  // Animation variants for list items
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setIsLoading(true);
    setActiveFilter(filter);
    
    // Simulate loading delay
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      aria-labelledby="recent-activity-heading"
      className={`flex flex-col sm:max-h-[470px] bg-white py-4 px-4 sm:p-5 grow rounded-xl shadow-sm hover:shadow transition-all duration-200 ${className}`}
    >
      <header className="flex flex-col space-y-2 mb-4">
        <div className='flex justify-between items-center'>
          <div className="flex items-center gap-2">
            <h3 
              id="recent-activity-heading"
              className="text-base sm:text-lg font-semibold text-gray-900"
            >
              Son Aktivliklər
            </h3>
            <span 
              className={`inline-flex items-center justify-center w-2 h-2 rounded-full ${isLoading ? 'bg-green-500 animate-pulse' : 'bg-green-500'}`}
              aria-hidden="true"
            ></span>
          </div>
          
          <Link 
            href="/dashboard/activity"
            className="group flex items-center gap-1.5 text-primary text-xs font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 rounded px-1"
            onClick={(e) => {
              if (onViewAll) {
                e.preventDefault();
                onViewAll();
              }
            }}
          >
            <span>Hamısı</span>
            <span className="px-1.5 py-0.5 text-[10px] font-medium text-primary bg-primary/10 rounded-full">
              {totalCount}
            </span>
            <svg 
              width="16" height="16" viewBox="0 0 16 16" 
              className="transition-transform group-hover:translate-x-0.5" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
        
        <div className="flex space-x-1 overflow-x-auto scrollbar-none pb-1">
          {filterOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleFilterChange(option.id)}
              className={`px-2.5 py-1 text-xs rounded-full whitespace-nowrap transition-colors ${activeFilter === option.id ? 'bg-primary/10 text-primary font-medium' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {option.label}
            </button>
          ))}
        </div>
        
        <time 
          dateTime={date} 
          className="text-xs text-gray-500 font-normal"
        >
          {date}
        </time>
      </header>
      
      {isLoading ? (
        <div className="flex-1 flex flex-col gap-3" aria-busy="true" aria-label="Yüklənir...">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="flex gap-3 p-2 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-gray-200"></div>
              <div className="flex-1">
                <div className="h-2.5 bg-gray-200 rounded w-24 mb-2.5"></div>
                <div className="h-2 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-2 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          ))}
        </div>
      ) : displayActivities.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex-1 flex flex-col gap-3 overflow-y-auto max-h-[270px] sm:max-h-[300px] scrollbar-none"
          role="feed"
          aria-label="Recent activity items"
        >
          {displayActivities.map((activity, index) => (
            <motion.div key={index} variants={itemVariants}>
              <RecentItem 
                userName={activity.userName}
                userImage={activity.userImage}
                projectName={activity.projectName}
                taskName={activity.taskName}
                action={activity.action}
                timestamp={activity.timestamp}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-10 text-gray-400 bg-gray-50/50 rounded-lg">
          <svg className="w-12 h-12 mb-3 text-gray-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 17H20L18.5951 15.5951C18.2141 15.2141 18 14.6973 18 14.1585V11C18 8.38757 16.3304 6.16509 14 5.34142V5C14 3.89543 13.1046 3 12 3C10.8954 3 10 3.89543 10 5V5.34142C7.66962 6.16509 6 8.38757 6 11V14.1585C6 14.6973 5.78595 15.2141 5.40493 15.5951L4 17H9M15 17V18C15 19.6569 13.6569 21 12 21C10.3431 21 9 19.6569 9 18V17M15 17H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p className="text-sm font-medium mb-1">Heç bir aktivitə yoxdur</p>
          <p className="text-xs text-gray-500">Faylları yeniləyin və ya yeni məzmun yaradın</p>
          <button className="mt-4 text-xs bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-lg transition-colors">
            Yeni iş yaradın
          </button>
        </div>
      )}
      
      <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {isLoading ? 
            'Yüklənir...' : 
            `Son yeniləmə: ${new Date().toLocaleTimeString('az', {hour: '2-digit', minute:'2-digit'})}`
          }
        </span>
        <button 
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 600);
          }}
          className="text-xs text-primary hover:text-primary/80 transition-colors"
          aria-label="Yenilə"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </motion.section>
  )
}

export default RecentActivity