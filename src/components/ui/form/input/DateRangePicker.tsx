'use client';

import { useState, useRef, useEffect } from 'react';
import { format, isToday, isAfter, isBefore, addMonths, startOfMonth, endOfMonth, 
  eachDayOfInterval, getDay, parseISO, isValid, addYears, subYears, getYear, setMonth, setYear } from 'date-fns';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';
import { twMerge } from 'tailwind-merge';
import * as Popover from '@radix-ui/react-popover';
import * as Dialog from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

type ColorOption = 'slate' | 'zinc' | 'blue' | 'indigo' | 'violet' | 'purple' | 'teal';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
  primaryColor?: ColorOption;
  secondaryColor?: ColorOption;
  label?: string;
  placeholder?: string;
  className?: string;
  hasError?: boolean;
}

const colorVariants = {
  slate: {
    primary: 'bg-slate-400 text-slate-800 hover:bg-slate-500',
    light: 'bg-slate-200 text-slate-700 border-slate-100',
    text: 'text-slate-600',
    hover: 'hover:bg-slate-50',
    ring: 'ring-slate-200',
    border: 'border-slate-400'
  },
  zinc: {
    primary: 'bg-zinc-400 text-zinc-800 hover:bg-zinc-205',
    light: 'bg-zinc-200 text-zinc-700 border-zinc-100',
    text: 'text-zinc-600',
    hover: 'hover:bg-zinc-50',
    ring: 'ring-zinc-200',
    border: 'border-zinc-400'
  },
  blue: {
    primary: 'bg-blue-400 text-blue-800 hover:bg-blue-205',
    light: 'bg-blue-200 text-blue-700 border-blue-100',
    text: 'text-blue-600',
    hover: 'hover:bg-blue-50',
    ring: 'ring-blue-200',
    border: 'border-blue-400'
  },
  indigo: {
    primary: 'bg-indigo-400 text-indigo-800 hover:bg-indig5-200',
    light: 'bg-indigo-200 text-indigo-700 border-indigo-100',
    text: 'text-indigo-600',
    hover: 'hover:bg-indigo-50',
    ring: 'ring-indigo-200',
    border: 'border-indigo-400'
  },
  violet: {
    primary: 'bg-violet-400 text-violet-800 hover:bg-viole5-200',
    light: 'bg-violet-200 text-violet-700 border-violet-100',
    text: 'text-violet-600',
    hover: 'hover:bg-violet-50',
    ring: 'ring-violet-200',
    border: 'border-violet-400'
  },
  purple: {
    primary: 'bg-purple-400 text-purple-800 hover:bg-purpl5-200',
    light: 'bg-purple-200 text-purple-700 border-purple-100',
    text: 'text-purple-600',
    hover: 'hover:bg-purple-50',
    ring: 'ring-purple-200',
    border: 'border-purple-400'
  },
  teal: {
    primary: 'bg-teal-400 text-teal-800 hover:bg-teal-205',
    light: 'bg-teal-200 text-teal-700 border-teal-100',
    text: 'text-teal-600',
    hover: 'hover:bg-teal-50',
    ring: 'ring-teal-200',
    border: 'border-teal-400'
  }
};

const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  primaryColor = 'indigo',
  secondaryColor = 'violet',
  label,
  placeholder,
  className = '',
  hasError
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Internal state for temporary selection
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  
  const [currentMonth, setCurrentMonth] = useState(
    startDate && isValid(parseISO(startDate)) ? parseISO(startDate) : new Date()
  );
  const [secondCurrentMonth, setSecondCurrentMonth] = useState(addMonths(
    startDate && isValid(parseISO(startDate)) ? parseISO(startDate) : new Date(), 1
  ));
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [activeSelection, setActiveSelection] = useState<'start' | 'end'>('start');
  
  const calendarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  
  // Sync internal state with props when modal opens
  useEffect(() => {
    if (isOpen) {
      setTempStartDate(startDate);
      setTempEndDate(endDate);
      setActiveSelection('start');
    }
  }, [isOpen, startDate, endDate]);
  
  const parsedStartDate = startDate ? parseISO(startDate) : null;
  const parsedEndDate = endDate ? parseISO(endDate) : null;
  
  // Temp dates for calendar display
  const parsedTempStartDate = tempStartDate ? parseISO(tempStartDate) : null;
  const parsedTempEndDate = tempEndDate ? parseISO(tempEndDate) : null;
  
  // Format for display
  const displayValue = parsedStartDate && parsedEndDate 
    ? `${format(parsedStartDate, 'MMM dd, yyyy')} — ${format(parsedEndDate, 'MMM dd, yyyy')}`
    : placeholder;
  
  // Close calendar when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node) && 
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update second month when first month changes
  useEffect(() => {
    setSecondCurrentMonth(addMonths(currentMonth, 1));
  }, [currentMonth]);
  
  // Navigate month independently for each calendar
  const navigateMonth = (direction: 'prev' | 'next', monthIndex: number) => {
    if (monthIndex === 0) {
      setCurrentMonth(prevMonth => 
        direction === 'prev' ? addMonths(prevMonth, -1) : addMonths(prevMonth, 1)
      );
    } else {
      setSecondCurrentMonth(prevMonth => 
        direction === 'prev' ? addMonths(prevMonth, -1) : addMonths(prevMonth, 1)
      );
    }
  };

  // Handle year change
  const handleYearChange = (newYear: number, monthIndex: number) => {
    const currentYear = getYear(monthIndex === 0 ? currentMonth : secondCurrentMonth);
    const yearDiff = newYear - currentYear;
    
    if (monthIndex === 0) {
      setCurrentMonth(prevMonth => addYears(prevMonth, yearDiff));
    } else {
      setSecondCurrentMonth(prevMonth => addYears(prevMonth, yearDiff));
    }
  };
  
  // Get days for current month with empty slots for alignment
  const getDaysInMonth = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    
    // Get first day of month (0 = Sunday, 1 = Monday, etc.)
    const startDay = getDay(monthStart);
    
    // Add empty slots for days before the 1st of the month
    const blanks = Array(startDay).fill(null);
    
    return [...blanks, ...daysInMonth];
  };
  
  // Handle day selection (only update internal state)
  const handleDayClick = (day: Date) => {
    if (activeSelection === 'start') {
      // If selecting start date
      setTempStartDate(format(day, 'yyyy-MM-dd'));
      setActiveSelection('end');
      
      // If clicked date is after current temp end date, reset temp end date
      if (parsedTempEndDate && isAfter(day, parsedTempEndDate)) {
        setTempEndDate('');
      }
    } else {
      // If selecting end date
      if (parsedTempStartDate && isBefore(day, parsedTempStartDate)) {
        // If clicked date is before start date, switch them
        setTempStartDate(format(day, 'yyyy-MM-dd'));
        setTempEndDate(format(parsedTempStartDate, 'yyyy-MM-dd'));
      } else {
        // Set as end date
        setTempEndDate(format(day, 'yyyy-MM-dd'));
      }
      
      // Reset to select start date for next selection
      setActiveSelection('start');
    }
  };
  
  // Clear selection (only internal state)
  const clearSelection = () => {
    setTempStartDate('');
    setTempEndDate('');
    setActiveSelection('start');
  };
  
  // Confirm selection - this is where onChange is called
  const handleConfirm = () => {
    onChange(tempStartDate, tempEndDate);
    setIsOpen(false);
  };
  
  // Check if a day should be highlighted in the selection range
  const isDayHighlighted = (day: Date) => {
    if (!parsedTempStartDate) return false;
    
    if (!parsedTempEndDate && hoverDate && activeSelection === 'end') {
      return isAfter(day, parsedTempStartDate) && isBefore(day, hoverDate);
    }
    
    if (parsedTempEndDate) {
      return isAfter(day, parsedTempStartDate) && isBefore(day, parsedTempEndDate);
    }
    
    return false;
  };

  // Generate year options (5 years before and after current year)
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  const yearOptions = generateYearOptions();

  // Render calendar month
  const renderCalendarMonth = (monthDate: Date, monthIndex: number) => {
    const days = getDaysInMonth(monthDate);
    const currentYear = getYear(monthDate);
    
    return (
      <div className="space-y-3">
        <div className="hidden sm:flex items-center justify-between">
          <button 
            type="button"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => navigateMonth('prev', monthIndex)}
          >
            <FaChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          
          <div className="flex items-center gap-2">
            <h2 className="text-base font-medium text-gray-800">
              {format(monthDate, 'MMMM')}
            </h2>
            <select
              className="text-base font-medium text-gray-800 bg-white border border-gray-200 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={currentYear}
              onChange={(e) => handleYearChange(parseInt(e.target.value), monthIndex)}
              aria-label={'Seçilmiş tarixlər'}
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          
          <button 
            type="button"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={() => navigateMonth('next', monthIndex)}
          >
            <FaChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1.5 select-none overflow-visible">
          {/* Day headers */}
          {DAYS_OF_WEEK.map((day, i) => (
            <div key={i} className="text-center text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {days.map((day, index) => {
            if (!day) {
              return <div key={`blank-${monthDate}-${index}`} className="p-1 sm:p-2" />;
            }
            
            const dateKey = format(day, 'yyyy-MM-dd');
            const isStart = parsedTempStartDate && format(parsedTempStartDate, 'yyyy-MM-dd') === dateKey;
            const isEnd = parsedTempEndDate && format(parsedTempEndDate, 'yyyy-MM-dd') === dateKey;
            const isHighlighted = isDayHighlighted(day);
            const isCurrentDay = isToday(day);
            const today = new Date();
            today.setHours(0,0,0,0);
            
            return (
              <button
                key={`${monthDate}-${dateKey}`}
                type="button"
                className={twMerge(
                  "relative text-center aspect-square w-full h-auto rounded-md text-xs sm:text-sm transition-all font-medium border border-transparent text-gray-800 bg-gray-100 flex items-center justify-center p-0 overflow-visible",
                  isStart && `${colorVariants[primaryColor].primary} border-2 border-${primaryColor}-500 z-10 !aspect-square !w-full !h-auto flex items-center justify-center`,
                  isEnd && `${colorVariants[secondaryColor].primary} border-2 border-${secondaryColor}-500 z-10 !aspect-square !w-full !h-auto flex items-center justify-center`,
                  isHighlighted && `${colorVariants[secondaryColor].light} border border-${secondaryColor}-300 !aspect-square !w-full !h-auto flex items-center justify-center`,
                  !isStart && !isEnd && !isHighlighted && colorVariants[primaryColor].hover,
                  isCurrentDay && !isStart && !isEnd && !isHighlighted && "ring-1 ring-blue-400 font-bold",
                  "relative group"
                )}
                onClick={() =>  handleDayClick(day)}
                onMouseEnter={() =>  setHoverDate(day)}
                onMouseLeave={() =>  setHoverDate(null)}
              >
                {/* Date indicator */}
                <div className="relative z-10">
                  {isStart && (
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-500"></span>
                  )}
                  {isEnd && (
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500"></span>
                  )}
                  {format(day, 'd')}
                </div>
                
                {/* Hover effect */}
                {!isStart && !isEnd && !isHighlighted  && (
                  <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 bg-current transition-opacity" />
                )}
                
                {/* Range connector - left side */}
                {(isStart || isHighlighted) &&(
                  <span className="absolute top-0 bottom-0 right-0 w-1/2 bg-opacity-50 z-0" 
                    style={{ backgroundColor: isStart ? `var(--${primaryColor}-200)` : `var(--${secondaryColor}-200)` }} />
                )}
                
                {/* Range connector - right side */}
                {(isEnd || isHighlighted) &&  (
                  <span className="absolute top-0 bottom-0 left-0 w-1/2 bg-opacity-50 z-0" 
                    style={{ backgroundColor: isEnd ? `var(--${secondaryColor}-200)` : `var(--${primaryColor}-200)` }} />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Helper to detect mobile

  return (
    <div className={`relative`}>
      {/* Input field */}
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
          <div ref={inputRef} className="relative h-full w-full">
            <div
              className={twMerge(
                `w-full flex items-center border-2 rounded-lg  pl-12 pr-4 bg-white cursor-pointer transition-all duration-200`,
                hasError ? 'border-red-500' : 'border-gray-200',
                `hover:${colorVariants[primaryColor].border}`,
                isOpen && `ring-2 ${colorVariants[primaryColor].ring} ${colorVariants[primaryColor].border}`,
                `${className}`
              )}
            >
              <div className={`absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none ${colorVariants[primaryColor].text}`}>
                <FaCalendarAlt className="w-4 h-4 text-gray-500" />
              </div>
              <span className={twMerge(
                "block w-full truncate text-sm",
                startDate && endDate ? "text-gray-800 font-medium" : "text-gray-400"
              )}>
                {displayValue}
              </span>
              {(startDate || endDate) && (
                <button
                  type="button"
                  className="absolute right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-full transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange('', '');
                  }}
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-[9998]" />
          <Dialog.Content
            ref={calendarRef}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-0"
            onOpenAutoFocus={e => e.preventDefault()}
          >
            <div className="relative w-full max-w-md sm:max-w-2xl bg-gradient-to-b from-white via-blue-50 to-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-slideUp">
              {/* Drag handle */}
              <div className="flex justify-center py-2">
                <div className="w-12 h-1.5 rounded-full bg-gray-200" />
              </div>
              <Dialog.Title>
                <VisuallyHidden>{label || 'Select date range'}</VisuallyHidden>
              </Dialog.Title>
              {/* Month navigation and calendars */}
              <div className="flex flex-col sm:flex-row w-full">
                {/* Mobile: month/year selector */}
                <div className="sm:hidden flex w-full gap-2 mb-2 px-3">
                  <select
                    className="flex-1 rounded-lg border border-blue-100 bg-white py-2 px-3 text-base font-semibold text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 max-w-full"
                    value={currentMonth.getMonth()}
                    onChange={e => setCurrentMonth(setMonth(currentMonth, parseInt(e.target.value)))}
                  >
                    {Array.from({ length: 12 }).map((_, i) => (
                      <option key={i} value={i}>{format(new Date(2000, i, 1), 'MMMM')}</option>
                    ))}
                  </select>
                  <select
                    className="flex-1 rounded-lg border border-blue-100 bg-white py-2 px-3 text-base font-semibold text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 max-w-full"
                    value={getYear(currentMonth)}
                    onChange={e => setCurrentMonth(setYear(currentMonth, parseInt(e.target.value)))}
                  >
                    {yearOptions.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                {/* Mobile: single month, Desktop: two months */}
                <div className="w-full sm:w-1/2 p-3 sm:p-5 bg-white/80 rounded-2xl shadow-md mx-auto mt-2 mb-3 sm:mt-0 sm:mb-0 sm:rounded-none sm:shadow-none sm:border-r border-gray-100">
                  {renderCalendarMonth(currentMonth, 0)}
                </div>
                <div className="hidden sm:block w-1/2 p-5">
                  {renderCalendarMonth(secondCurrentMonth, 1)}
                </div>
              </div>
              {/* Selection controls */}
              <div className="bg-white/80 p-4 border-t border-gray-100 rounded-b-2xl shadow-md">
                <div className="flex flex-col items-stretch gap-4">
                  <div className="flex flex-row items-center justify-between w-full gap-6">
                    {/* Start date */}
                    <div className="flex items-center gap-2">
                      <div className={twMerge(
                        "h-4 w-4 rounded-full shadow-sm flex-shrink-0",
                        colorVariants[primaryColor].primary
                      )} />
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {parsedTempStartDate 
                          ? format(parsedTempStartDate, 'MMM dd, yyyy')
                          : 'Başlanğıc tairxi'}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-gray-400">→</div>
                    
                    {/* End date */}
                    <div className="flex items-center gap-2">
                      <div className={twMerge(
                        "h-4 w-4 rounded-full shadow-sm flex-shrink-0",
                        colorVariants[secondaryColor].primary
                      )} />
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {parsedTempEndDate 
                          ? format(parsedTempEndDate, 'MMM dd, yyyy')
                          : 'Bitiş tairxi'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex flex-row gap-2 w-full mt-2">
                    <button
                      type="button"
                      className="w-1/2 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 rounded-lg font-semibold text-xs sm:text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm"
                      onClick={() => {
                        clearSelection();
                      }}
                    >
                      {'Təmizlə'}
                    </button>
                    <button
                      type="button"
                      className={twMerge(
                        "w-1/2 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors focus:outline-none focus:ring-2 shadow-md",
                        colorVariants[primaryColor].primary,
                        colorVariants[primaryColor].ring
                      )}
                      onClick={handleConfirm}
                    >
                      {'Yadda saxla'}
                    </button>
                  </div>
                </div>
                
              
              </div>
              {/* Close button for modal */}
              <button
                type="button"
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-white rounded-full p-2 shadow"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}