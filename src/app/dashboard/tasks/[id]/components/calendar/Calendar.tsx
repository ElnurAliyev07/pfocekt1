'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChevronLeft, HiChevronRight, HiCalendar, HiChevronDown } from 'react-icons/hi';

interface EventIndicator {
  color: string;
  count?: number;
}

interface DayEvents {
  [day: number]: EventIndicator[];
}

const CalendarComponent: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  
  // Mock events data - in a real app, this would come from your backend
  const [events, setEvents] = useState<DayEvents>({
    5: [{ color: 'bg-blue-500' }, { color: 'bg-purple-500' }],
    10: [{ color: 'bg-green-500' }, { color: 'bg-yellow-500' }, { color: 'bg-red-500' }],
    15: [{ color: 'bg-indigo-500' }],
    20: [{ color: 'bg-pink-500' }, { color: 'bg-teal-500' }],
    25: [{ color: 'bg-amber-500' }]
  });

  const months = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun',
    'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr',
  ];

  const today = new Date();
  const years = Array.from({ length: 10 }, (_, i) => today.getFullYear() - 5 + i);

  const getDaysInMonth = (year: number, month: number): number =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year: number, month: number): number =>
    new Date(year, month, 1).getDay();

  const generateCalendar = (year: number, month: number): Array<Array<number | null>> => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const calendar: Array<Array<number | null>> = [];
    let week: Array<number | null> = Array(firstDay).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);

      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      calendar.push([...week, ...Array(7 - week.length).fill(null)]);
    }

    return calendar;
  };

  const changeMonth = (offset: number): void => {
    setSelectedDay(null);
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(newDate);
  };

  const handleDayClick = (day: number | null): void => {
    if (day) {
      setSelectedDay(day);
      console.log(`Selected Day: ${day}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`);
      // Here you would typically handle the day selection, like showing events for that day
    }
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const calendarDays = generateCalendar(year, month);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Don't close if clicking on dropdown elements
      const target = e.target as HTMLElement;
      if (target.closest('.month-dropdown') || target.closest('.year-dropdown')) {
        return;
      }
      
      setIsMonthDropdownOpen(false);
      setIsYearDropdownOpen(false);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="p-5 max-h-[638px] mx-auto bg-white rounded-xl shadow-sm border border-gray-100">
      {/* Header with month and year display */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          {/* Month selector */}
          <div className="relative month-dropdown">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMonthDropdownOpen(!isMonthDropdownOpen);
                setIsYearDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-gray-800 font-medium bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <HiCalendar className="text-blue-500" />
              <span>{months[month]}</span>
              <HiChevronDown className={`transition-transform ${isMonthDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isMonthDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 z-20 mt-1 bg-white border rounded-lg shadow-lg w-[180px] overflow-hidden month-dropdown"
                >
                  <div className="flex flex-col max-h-[220px] overflow-y-auto py-1">
                    {months.map((monthName, index) => (
                      <button
                        key={index}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCurrentDate(new Date(year, index, 1));
                          setIsMonthDropdownOpen(false);
                        }}
                        className={`px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors
                          ${index === month ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
                      >
                        {monthName}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Year selector */}
          <div className="relative year-dropdown">
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsYearDropdownOpen(!isYearDropdownOpen);
                setIsMonthDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-gray-800 font-medium bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span>{year}</span>
              <HiChevronDown className={`transition-transform ${isYearDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isYearDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 z-20 mt-1 bg-white border rounded-lg shadow-lg w-[120px] overflow-hidden year-dropdown"
                >
                  <div className="flex flex-col max-h-[220px] overflow-y-auto py-1">
                    {years.map((yearValue) => (
                      <button
                        key={yearValue}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCurrentDate(new Date(yearValue, month, 1));
                          setIsYearDropdownOpen(false);
                        }}
                        className={`px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors
                          ${yearValue === year ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
                      >
                        {yearValue}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className='flex items-center'>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => changeMonth(-1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <HiChevronLeft className="text-gray-600 text-xl" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => changeMonth(1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors ml-1"
          >
            <HiChevronRight className="text-gray-600 text-xl" />
          </motion.button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {['BE', 'ÇA', 'ÇR', 'CA', 'CM', 'ŞƏ', 'BZ'].map((day, index) => (
          <div key={index} className="text-center text-xs font-semibold text-gray-500 py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-x-2 gap-y-3">
        {calendarDays.flat().map((day, index) => (
          <div className="flex flex-col items-center" key={index}>
            {day ? (
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  onClick={() => handleDayClick(day)}
                  className={`w-9 h-9 flex items-center justify-center text-sm font-medium rounded-full cursor-pointer transition-colors
                    ${day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                      ? 'bg-blue-500 text-white' // Today
                      : selectedDay === day
                        ? 'bg-primary text-white' // Selected Day
                        : 'hover:bg-gray-100 text-gray-700'} // Normal Days
                    ${events[day] ? 'ring-2 ring-blue-100' : ''}`}
                >
                  {day}
                </div>
                
                {/* Event indicators */}
                {events[day] && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex items-center gap-[2px] justify-center">
                    {events[day].slice(0, 3).map((event, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${event.color}`}></div>
                    ))}
                    {events[day].length > 3 && (
                      <div className="text-[9px] text-gray-500 ml-0.5">+{events[day].length - 3}</div>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="w-9 h-9"></div> // Empty space for days that don't exist
            )}
          </div>
        ))}
      </div>
      
      {/* Today button */}
      <div className="mt-4 flex justify-center">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            setCurrentDate(new Date());
            setSelectedDay(today.getDate());
          }}
          className="px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Bugün
        </motion.button>
      </div>
    </div>
  );
};

export default CalendarComponent;
