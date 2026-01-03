"use client";

import { formatDate } from "@/utils/formateDateTime";
import React, { useState, useEffect, useCallback, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import { HiOutlineCalendar, HiChevronLeft, HiChevronRight, HiChevronDown, HiX, HiCheck } from "react-icons/hi";
import { cn } from "@/lib/utils";

interface DatePeriod {
  startDate: Date;
  endDate: Date;
}

interface DatePickerProps {
  id: string;
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  disabledDates?: Date[];
  disableDatePrevious?: Date;
  disableDateAfter?: Date;
  activeDatePeriods?: DatePeriod[];
  className?: string;
  triggerClassName?: string;
}

// Constants
const MONTHS = [
  "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
  "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr",
];
const DAYS_OF_WEEK = ["BE", "ÇA", "ÇR", "CA", "CM", "ŞƏ", "BZ"];
const HOURS = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
const YEARS = Array.from({ length: 20 }, (_, i) => new Date().getFullYear() - 10 + i);

// Custom hook for date picker logic
const useDatePicker = (
  initialValue?: string,
  disableDatePrevious?: Date,
  activeDatePeriods?: DatePeriod[]
) => {
  // Parse the initial date from value or use current date
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    try {
      return initialValue ? new Date(initialValue) : new Date();
    } catch (e) {
      return new Date();
    }
  });

  // Time selection state
  const [selectedHour, setSelectedHour] = useState(() => {
    if (initialValue) {
      return initialValue.split("T")[1]?.slice(0, 2);
    }
    const now = new Date();
    return String(now.getHours()).padStart(2, "0");
  });
  
  const [selectedMinute, setSelectedMinute] = useState(() => {
    if (initialValue) {
      return initialValue.split("T")[1]?.slice(3, 5);
    }
    const now = new Date();
    return String(now.getMinutes()).padStart(2, "0");
  });

  const [disabledHours, setDisabledHours] = useState<number[]>([]);
  const [disabledMinutes, setDisabledMinutes] = useState<number[]>([]);

  // Update the selected date if disableDatePrevious changes
  useEffect(() => {
    if (disableDatePrevious && !initialValue) {
      setSelectedDate(new Date(disableDatePrevious));
    }
  }, [disableDatePrevious, initialValue]);

  // Calculate disabled hours and minutes based on activeDatePeriods
  useEffect(() => {
    const isInActivePeriods = (date: Date) => {
      if (!activeDatePeriods) return false;
      
      return activeDatePeriods.some((period) => {
        const startDate = new Date(period.startDate);
        const endDate = new Date(period.endDate);
        return date >= startDate && date <= endDate;
      });
    };

    if (selectedDate) {
      const activeHours: number[] = [];
      const date = new Date(selectedDate);

      // Check each hour for activity periods
      for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute++) {
          date.setHours(hour, minute, 0, 0);
          if (isInActivePeriods(date) && !activeHours.includes(hour)) {
            activeHours.push(hour);
          }
        }
      }

      // If we have active periods, only enable hours in those periods
      if (activeDatePeriods && activeDatePeriods.length > 0) {
        // Enable only hours that are within active periods
        setDisabledHours([...Array(24).keys()].filter(hour => !activeHours.includes(hour)));
      } else {
        // If no active periods defined, all hours are enabled
        setDisabledHours([]);
      }
      
      setDisabledMinutes([]);
    }
  }, [activeDatePeriods, selectedDate]);

  // Date manipulation functions
  const changeMonth = useCallback((month: number) => {
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(month);
      return newDate;
    });
  }, []);

  const changeMonthOffset = useCallback((monthOffset: number) => {
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + monthOffset);
      return newDate;
    });
  }, []);

  const changeYear = useCallback((year: number) => {
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setFullYear(year);
      return newDate;
    });
  }, []);

  const selectDate = useCallback((day: number) => {
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(day);
      return newDate;
    });
  }, []);

  const setToday = useCallback(() => {
    const today = new Date();
    setSelectedDate(today);
    setSelectedHour(today.getHours().toString().padStart(2, "0"));
    setSelectedMinute(today.getMinutes().toString().padStart(2, "0"));
  }, []);

  const getDateTimeISO = useCallback(() => {
    const date = new Date(selectedDate);
    date.setHours(Number(selectedHour), Number(selectedMinute), 0, 0);
    return date.toISOString();
  }, [selectedDate, selectedHour, selectedMinute]);

  return {
    selectedDate,
    selectedHour,
    selectedMinute,
    setSelectedHour,
    setSelectedMinute,
    disabledHours,
    disabledMinutes,
    changeMonth,
    changeMonthOffset,
    changeYear,
    selectDate,
    setToday,
    getDateTimeISO
  };
};

// Calendar Grid Component
const CalendarGrid: React.FC<{
  selectedDate: Date,
  selectDate: (day: number) => void,
  isDateDisabled: (date: Date) => boolean,
  isDateInActivePeriod: (date: Date) => boolean
}> = ({ selectedDate, selectDate, isDateDisabled, isDateInActivePeriod }) => {
  // Get first day of month
  const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  // Get last day of month
  const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);

  // Get day of week for first day (0 = Sunday, 1 = Monday, etc.)
  const startDayOfWeek = startOfMonth.getDay();
  // Adjust for BE (Monday) as first day of week
  const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  // Previous month days
  const prevMonthEnd = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 0);
  const prevMonthDays = [];
  
  for (let i = prevMonthEnd.getDate() - adjustedStartDay + 1; i <= prevMonthEnd.getDate(); i++) {
    prevMonthDays.push(
      <button
        disabled={true}
        key={`prev-${i}`}
        className="w-8 h-8 text-sm font-medium text-center rounded-sm text-gray-400"
      >
        {i}
      </button>
    );
  }

  // Current month days
  const currentMonthDays = [];
  for (let i = 1; i <= endOfMonth.getDate(); i++) {
    const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i);
    const isDisabled = isDateDisabled(currentDate);
    const isActive = isDateInActivePeriod(currentDate);
    const isSelected = i === selectedDate.getDate() && 
      selectedDate.getMonth() === currentDate.getMonth() && 
      selectedDate.getFullYear() === currentDate.getFullYear();

    currentMonthDays.push(
      <button
        type="button"
        key={i}
        onClick={() => !isDisabled && selectDate(i)}
        disabled={isDisabled}
        className={cn(
          "w-8 h-8 text-sm font-medium text-center rounded-sm",
          isSelected && "bg-primary text-white",
          isDisabled && "text-gray-400 cursor-not-allowed",
          isActive && !isSelected && "bg-red-500 text-white",
          !isSelected && !isDisabled && !isActive && "hover:bg-gray-200"
        )}
      >
        {i}
      </button>
    );
  }

  // Next month days to fill grid
  const totalCells = 42; // 6 rows of 7 days
  const remainingCells = totalCells - (prevMonthDays.length + currentMonthDays.length);
  const nextMonthDays = [];
  
  for (let i = 1; i <= remainingCells; i++) {
    nextMonthDays.push(
      <button
        disabled={true}
        key={`next-${i}`}
        className="w-8 h-8 text-sm font-medium text-center rounded-sm text-gray-400"
      >
        {i}
      </button>
    );
  }

  return (
    <div className="grid grid-cols-7 gap-0.5 mb-3">
      {[...prevMonthDays, ...currentMonthDays, ...nextMonthDays]}
    </div>
  );
};

// Month Dropdown Component
const MonthDropdown: React.FC<{
  selectedDate: Date,
  changeMonth: (month: number) => void
}> = ({ selectedDate, changeMonth }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button 
          type="button" 
          className="flex items-center gap-1 px-2 py-1 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          {MONTHS[selectedDate.getMonth()]}
          <HiChevronDown className="w-3 h-3" />
        </button>
      </Popover.Trigger>
      
      <Popover.Portal>
        <Popover.Content 
          className="bg-white border rounded-lg shadow-lg p-2 z-[10000] max-h-64 overflow-y-auto"
          sideOffset={4}
        >
          <div className="grid grid-cols-2 gap-1 w-48">
            {MONTHS.map((month, index) => (
              <button
                key={month}
                type="button"
                onClick={() => {
                  changeMonth(index);
                  setIsOpen(false);
                }}
                className={cn(
                  "py-2 px-2 text-sm font-medium rounded-md text-left",
                  selectedDate.getMonth() === index 
                    ? "bg-primary text-white" 
                    : "hover:bg-gray-100"
                )}
              >
                {month}
              </button>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

// Year Dropdown Component
const YearDropdown: React.FC<{
  selectedDate: Date,
  changeYear: (year: number) => void
}> = ({ selectedDate, changeYear }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button 
          type="button" 
          className="flex items-center gap-1 px-2 py-1 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          {selectedDate.getFullYear()}
          <HiChevronDown className="w-3 h-3" />
        </button>
      </Popover.Trigger>
      
      <Popover.Portal>
        <Popover.Content 
          className="bg-white border rounded-lg shadow-lg p-2 z-[10000] max-h-64 overflow-y-auto"
          sideOffset={4}
        >
          <div className="grid grid-cols-3 gap-1 w-48">
            {YEARS.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => {
                  changeYear(year);
                  setIsOpen(false);
                }}
                className={cn(
                  "py-2 px-2 text-sm font-medium rounded-md text-center",
                  selectedDate.getFullYear() === year 
                    ? "bg-primary text-white" 
                    : "hover:bg-gray-100"
                )}
              >
                {year}
              </button>
            ))}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

// Time Dropdown Component
// Time Dropdown Component
const TimeDropdown: React.FC<{
  selectedHour: string,
  selectedMinute: string,
  setSelectedHour: (hour: string) => void,
  setSelectedMinute: (minute: string) => void,
  disabledHours: number[],
  disabledMinutes: number[]
}> = ({ 
  selectedHour, 
  selectedMinute, 
  setSelectedHour, 
  setSelectedMinute,
  disabledHours,
  disabledMinutes
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempHour, setTempHour] = useState(selectedHour);
  const [tempMinute, setTempMinute] = useState(selectedMinute);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hourListRef = useRef<HTMLDivElement>(null);
  const minuteListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    setTempHour(selectedHour);
    setTempMinute(selectedMinute);
  }, [selectedHour, selectedMinute]);

  useEffect(() => {
    if (isOpen) {
      // Scroll selected hour into view
      const hourElement = hourListRef.current?.querySelector(`[data-hour="${tempHour}"]`);
      if (hourElement) {
        hourElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }

      // Scroll selected minute into view
      const minuteElement = minuteListRef.current?.querySelector(`[data-minute="${tempMinute}"]`);
      if (minuteElement) {
        minuteElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }, [isOpen, tempHour, tempMinute]);

  const handleConfirm = () => {
    // Confirm edildiğinde değerleri pad et
    const finalHour = tempHour.padStart(2, '0');
    const finalMinute = tempMinute.padStart(2, '0');
    
    setSelectedHour(finalHour);
    setSelectedMinute(finalMinute);
    setIsOpen(false);
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Boş değer veya geçerli saat aralığında değer
    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 23)) {
      setTempHour(value);
    }
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Boş değer veya geçerli dakika aralığında değer
    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 59)) {
      setTempMinute(value);
    }
  };

  const handleHourBlur = () => {
    // Input'tan çıkıldığında, boş ise 00 yap
    if (tempHour === '') {
      setTempHour('00');
    } else {
      // Tek haneli sayıyı pad et
      setTempHour(tempHour.padStart(2, '0'));
    }
  };

  const handleMinuteBlur = () => {
    // Input'tan çıkıldığında, boş ise 00 yap
    if (tempMinute === '') {
      setTempMinute('00');
    } else {
      // Tek haneli sayıyı pad et
      setTempMinute(tempMinute.padStart(2, '0'));
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border rounded-lg transition-all duration-200",
          "hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20",
          isOpen ? "border-primary bg-primary/5" : "border-gray-200"
        )}
      >
        <span className="text-gray-700 font-medium">{selectedHour}:{selectedMinute}</span>
        <HiChevronDown className={cn(
          "w-4 h-4 text-gray-500 transition-transform duration-200",
          isOpen ? "transform rotate-180" : ""
        )} />
      </button>
      
      {isOpen && (
        <div 
          className="absolute top-[-340px] left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-5 z-[9999] min-w-[280px]"
          style={{
            animation: "slideDown 0.2s ease-out"
          }}
        >
          {/* Manual Input Section */}
          <div className="mb-5 pb-5 border-b border-gray-100">
            <div className="text-xs font-medium text-center text-gray-500 mb-4">Vaxt daxil edin</div>
            <div className="flex items-center justify-center gap-3">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={tempHour}
                  onChange={handleHourChange}
                  onBlur={handleHourBlur}
                  className="w-16 h-10 text-center text-sm border border-gray-200 rounded-lg px-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  placeholder="00"
                />
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400">Saat</span>
              </div>
              <span className="text-gray-400 font-medium text-lg">:</span>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={tempMinute}
                  onChange={handleMinuteChange}
                  onBlur={handleMinuteBlur}
                  className="w-16 h-10 text-center text-sm border border-gray-200 rounded-lg px-2 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                  placeholder="00"
                />
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] text-gray-400">Dəqiqə</span>
              </div>
            </div>
          </div>

          {/* Time Selection */}
          <div className="flex justify-center gap-6">
            <div>
              <div className="mb-3 text-xs font-medium text-center text-gray-500">Saat</div>
              <div 
                className="h-40 w-16 border border-gray-200 rounded-lg overflow-hidden bg-gray-50/50 relative"
              >
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white via-transparent to-white z-10" />
                <div 
                  ref={hourListRef}
                  className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
                  style={{ 
                    scrollBehavior: 'smooth',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  <div className="py-16">
                    {HOURS.map((hour) => {
                      const isDisabled = disabledHours.includes(parseInt(hour));
                      const isSelected = tempHour.padStart(2, '0') === hour;
                      
                      return (
                        <button
                          key={hour}
                          data-hour={hour}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => setTempHour(hour)}
                          className={cn(
                            "block w-full py-2 px-2 text-sm rounded-lg mb-1 text-center transition-all duration-200",
                            "focus:outline-none focus:ring-2 focus:ring-primary/20",
                            isSelected 
                              ? "bg-primary text-white shadow-sm scale-110" 
                              : "hover:bg-gray-100 text-gray-700",
                            isDisabled ? "opacity-40 cursor-not-allowed" : ""
                          )}
                        >
                          {hour}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="mb-3 text-xs font-medium text-center text-gray-500">Dəqiqə</div>
              <div 
                className="h-40 w-16 border border-gray-200 rounded-lg overflow-hidden bg-gray-50/50 relative"
              >
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white via-transparent to-white z-10" />
                <div 
                  ref={minuteListRef}
                  className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400"
                  style={{ 
                    scrollBehavior: 'smooth',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  <div className="py-16">
                    {MINUTES.map((minute) => {
                      const isDisabled = disabledMinutes.includes(parseInt(minute));
                      const isSelected = tempMinute.padStart(2, '0') === minute;
                      
                      return (
                        <button
                          key={minute}
                          data-minute={minute}
                          type="button"
                          disabled={isDisabled}
                          onClick={() => setTempMinute(minute)}
                          className={cn(
                            "block w-full py-2 px-2 text-sm rounded-lg mb-1 text-center transition-all duration-200",
                            "focus:outline-none focus:ring-2 focus:ring-primary/20",
                            isSelected 
                              ? "bg-primary text-white shadow-sm scale-110" 
                              : "hover:bg-gray-100 text-gray-700",
                            isDisabled ? "opacity-40 cursor-not-allowed" : ""
                          )}
                        >
                          {minute}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-5 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={handleConfirm}
              className="w-full py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary-darker transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              Təsdiqlə
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const DatePicker: React.FC<DatePickerProps> = ({
  id,
  value,
  onChange,
  label,
  error,
  disabledDates,
  disableDatePrevious,
  disableDateAfter,
  activeDatePeriods,
  className,
  triggerClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    selectedDate,
    selectedHour,
    selectedMinute,
    setSelectedHour,
    setSelectedMinute,
    disabledHours,
    disabledMinutes,
    changeMonth,
    changeMonthOffset,
    changeYear,
    selectDate,
    setToday,
    getDateTimeISO
  } = useDatePicker(value, disableDatePrevious, activeDatePeriods);

  const handleConfirm = () => {
    onChange(getDateTimeISO());
    setIsOpen(false);
  };

  // Function to check if a date should be disabled
  const isDateDisabled = (dateToCheck: Date): boolean => {
    // Check if date is in disabled dates
    const isInDisabledDates = disabledDates?.some(
      (disabledDate) =>
        disabledDate.getFullYear() === dateToCheck.getFullYear() &&
        disabledDate.getMonth() === dateToCheck.getMonth() &&
        disabledDate.getDate() === dateToCheck.getDate()
    ) ?? false;

    // Check if date is before allowed date
    const isBeforeDisableDatePrevious =
      disableDatePrevious &&
      dateToCheck < disableDatePrevious &&
      dateToCheck.toDateString() !== disableDatePrevious.toDateString();

    // Check if date is after allowed date
    const isAfterDisableDateAfter =
      disableDateAfter &&
      dateToCheck > disableDateAfter &&
      dateToCheck.toDateString() !== disableDateAfter.toDateString();

    return (
      isInDisabledDates ||
      !!isBeforeDisableDatePrevious ||
      !!isAfterDisableDateAfter
    );
  };

  // Function to check if date is in active periods
  const isDateInActivePeriod = (dateToCheck: Date): boolean => {
    if (!activeDatePeriods) return false;

    const getOnlyDate = (date: Date) => {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };
    
    const normalizedDateToCheck = getOnlyDate(dateToCheck);
    
    return activeDatePeriods.some((period) => {
      const startDate = getOnlyDate(new Date(period.startDate));
      const endDate = getOnlyDate(new Date(period.endDate));
      
      return normalizedDateToCheck >= startDate && normalizedDateToCheck <= endDate;
    });
  };

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label htmlFor={id} className="block mb-2 text-base text-gray-700">
          {label}
        </label>
      )}
      
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Trigger asChild>
          <button
            id={id}
            type="button"
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 bg-white border text-left rounded-sm focus:outline-hidden focus:ring-2 focus:ring-primary/20",
              error ? "border-red-500" : "border-gray-300 hover:border-gray-400",
              triggerClassName
            )}
          >
            <span className={cn("text-sm", value ? "text-gray-900" : "text-gray-500")}>
              {value ? formatDate(value) : "Tarix Seçin"}
            </span>
            <HiOutlineCalendar className="w-5 h-5 text-gray-500" />
          </button>
        </Dialog.Trigger>
        
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/20 z-[9998]" />
          
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-xl shadow-lg z-[9999] w-[320px] max-w-[95vw]">
            <div className="flex justify-between items-center mb-3">
              <Dialog.Title className="text-base font-medium">
                Tarix və Vaxt
              </Dialog.Title>
              
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="p-1 rounded-full hover:bg-gray-100"
                  aria-label="Close"
                >
                  <HiX className="w-4 h-4" />
                </button>
              </Dialog.Close>
            </div>

            {/* Calendar Header with Dropdowns */}
            <div className="flex items-center justify-between mb-3">
              <MonthDropdown selectedDate={selectedDate} changeMonth={changeMonth} />
              
              <div className="flex items-center gap-1">
                <button 
                  type="button" 
                  onClick={() => changeMonthOffset(-1)}
                  className="p-1 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <HiChevronLeft className="w-4 h-4" />
                </button>
                
                <YearDropdown selectedDate={selectedDate} changeYear={changeYear} />
                
                <button 
                  type="button" 
                  onClick={() => changeMonthOffset(1)}
                  className="p-1 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <HiChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-400">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <CalendarGrid
              selectedDate={selectedDate}
              selectDate={selectDate}
              isDateDisabled={isDateDisabled}
              isDateInActivePeriod={isDateInActivePeriod}
            />

            {/* Time Selection */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-medium">Vaxt seçin</div>
              <TimeDropdown
                selectedHour={selectedHour}
                selectedMinute={selectedMinute}
                setSelectedHour={setSelectedHour}
                setSelectedMinute={setSelectedMinute}
                disabledHours={disabledHours}
                disabledMinutes={disabledMinutes}
              />
            </div>

            {error && (
              <p className="mt-1 text-sm text-red-500">{error}</p>
            )}

            {/* Action Buttons */}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={setToday}
                className="flex-1 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium text-sm transition-colors"
              >
                Bugün
              </button>
              
              <button
                type="button"
                onClick={handleConfirm}
                className="flex-1 py-1.5 bg-primary hover:bg-primary-darker text-white rounded-lg font-medium text-sm flex items-center justify-center transition-colors"
              >
                <HiCheck className="w-4 h-4 mr-1" />
                Təsdiqlə
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};

export default DatePicker;