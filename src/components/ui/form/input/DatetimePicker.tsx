import React, { useState, useEffect } from "react";
import './DatetimePicker.module.css';

interface DateTimeFieldProps {
  id: string;
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
}

const DateTimeField: React.FC<DateTimeFieldProps> = ({
  value,
  onChange,
  label = "Tarix və Saat",
  error,
  id,
}) => {
  const [date, setDate] = useState<string>(value ? value.split("T")[0] : "");
  const [time, setTime] = useState<string>(
    value ? value.split("T")[1]?.slice(0, 5) : ""
  );

  useEffect(() => {
    if (value) {
      setDate(value.split("T")[0]);
      setTime(value.split("T")[1]?.slice(0, 5) || "");
    }
  }, [value]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
  };

  const handleBlur = () => {
    if (date && time) {
      const isoString = new Date(`${date}T${time}:00`).toISOString();
      onChange(isoString);
    } else {
      // Eğer tarih veya saat eksikse boş bir string gönder
      onChange("");
    }
  };
  

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-base text-gray-700">
          {label}
        </label>
      )}
      <div className="input-container flex items-center gap-4">
        <div className="relative w-full">
          <input
            id={`date-${id}`}
            type="date"
            value={date}
            onChange={handleDateChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2 border rounded-lg shadow-sm bg-white text-gray-700 focus:outline-hidden focus:ring-2 ${
              error
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-500"
            } transition-all ease-in-out duration-200`}
          />
        </div>
        <div className="relative w-full">
          <input
            id={`time-${id}`}
            type="time"
            value={time}
            onChange={handleTimeChange}
            onBlur={handleBlur}
            className={`w-full px-4 py-2 border rounded-lg shadow-sm bg-white text-gray-700 focus:outline-hidden focus:ring-2 ${
              error
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-blue-500"
            } transition-all ease-in-out duration-200`}
          />
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default DateTimeField;