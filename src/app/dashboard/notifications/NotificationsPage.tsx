'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import SectionWrapper from '@/components/common/wrappers/SectionWrapper';

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    type: 'mention',
    content: 'İlgar Hasanzada sizi bir yorumda etiketledi',
    task: 'Yeni login sayfası tasarımı',
    time: '5 dəqiqə əvvəl',
    read: false,
    avatar: '/avatar-placeholder.png'
  },
  {
    id: 2,
    type: 'assignment',
    content: 'Size yeni bir iş atandı',
    task: 'Mobil Görünüm Testi',
    time: '1 saat əvvəl',
    read: false,
    avatar: null
  },
  {
    id: 3,
    type: 'deadline',
    content: 'Bir işin bitiş tarixi yaxınlaşır',
    task: 'API Entegrasyonu',
    time: 'Dünən',
    read: true,
    avatar: null
  },
  {
    id: 4,
    type: 'comment',
    content: 'Əli Məmmədov işinizə şərh yazdı',
    task: 'Tərcümə dosyaları',
    time: '2 gün əvvəl',
    read: true,
    avatar: '/avatar-placeholder.png'
  },
  {
    id: 5,
    type: 'workflow',
    content: 'İş durumu dəyişdirildi: İnkişaf etdirilir → Test edilir',
    task: 'Dashboard Yenidən Dizayn',
    time: '3 gün əvvəl',
    read: true,
    avatar: null
  }
];

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  // Icon components for notification types
  const NotificationIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'mention':
        return (
          <div className="rounded-full bg-blue-100 p-2 text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
              <path d="M12 8v8" />
              <path d="M8.5 14.5c5 0 6-4 6-4" />
              <path d="M16 12c-4 0-5-4-5-4" />
            </svg>
          </div>
        );
      case 'assignment':
        return (
          <div className="rounded-full bg-purple-100 p-2 text-purple-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
        );
      case 'deadline':
        return (
          <div className="rounded-full bg-amber-100 p-2 text-amber-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
        );
      case 'comment':
        return (
          <div className="rounded-full bg-green-100 p-2 text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
        );
      case 'workflow':
        return (
          <div className="rounded-full bg-indigo-100 p-2 text-indigo-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="rounded-full bg-gray-100 p-2 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
        );
    }
  };

  return (
    <SectionWrapper disabled className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Bildirişlər</h1>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div className="flex space-x-2">
            <button 
              onClick={() => setFilter('all')} 
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Hamısı
            </button>
            <button 
              onClick={() => setFilter('unread')} 
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${filter === 'unread' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Oxunmamış
            </button>
            <button 
              onClick={() => setFilter('read')} 
              className={`px-3 py-1.5 text-sm rounded-full transition-colors ${filter === 'read' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Oxunmuş
            </button>
          </div>
          <button 
            onClick={markAllAsRead} 
            className="text-sm text-primary hover:text-primary-dark transition-colors"
          >
            Hamısını oxunmuş olaraq işarələ
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {filteredNotifications.length > 0 ? (
          <ul className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => (
              <li 
                key={notification.id} 
                className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50/30' : ''}`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  {notification.avatar ? (
                    <div className="relative flex-shrink-0 w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-sm">
                      <Image 
                        src={notification.avatar} 
                        alt="User avatar" 
                        fill 
                        className="object-cover"
                      />
                      {!notification.read && (
                        <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
                      )}
                    </div>
                  ) : (
                    <NotificationIcon type={notification.type} />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{notification.content}</p>
                    <p className="text-sm text-primary mt-0.5">{notification.task}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                  
                  <div className="ml-auto pl-3 flex-shrink-0">
                    <button className="text-gray-400 hover:text-gray-500 focus:outline-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="19" cy="12" r="1" />
                        <circle cx="5" cy="12" r="1" />
                      </svg>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 mb-4 text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">{filter === 'all' ? 'Bildiriş yoxdur' : filter === 'unread' ? 'Oxunmamış bildiriş yoxdur' : 'Oxunmuş bildiriş yoxdur'}</h3>
            <p className="text-gray-500 text-sm">Yeni bildirişlər gələndə burada görünəcəklər</p>
          </div>
        )}
      </div>

      {/* Mobile-friendly pagination */}
      {filteredNotifications.length > 0 && (
        <div className="mt-4 flex justify-center sm:justify-between items-center">
          <div className="hidden sm:flex text-sm text-gray-500">
            <span>5 bildiriş göstərilir</span>
          </div>
          <div className="flex space-x-1">
            <button className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button className="px-3 py-1 rounded-md bg-primary text-white">1</button>
            <button className="px-3 py-1 rounded-md hover:bg-gray-100 text-gray-500">2</button>
            <button className="p-2 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </SectionWrapper>
  )
}

export default NotificationsPage