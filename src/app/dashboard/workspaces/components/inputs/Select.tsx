import AxesBottom from "@/components/ui/icons/AxesBottom";
import React, { useState, useRef, useEffect } from "react";

interface Option {
  key: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  defaultValue?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  onChange,
  placeholder = "Select an option",
  defaultValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // defaultValue değiştiğinde selectedOption'u güncelle
  useEffect(() => {
    if (defaultValue) {
      const defaultOption =
        options.find((option) => option.key === defaultValue) || null;
      setSelectedOption(defaultOption);
    }
  }, [defaultValue, options]);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    onChange(option.key);
    setIsOpen(false);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    onChange(""); // Değeri sıfırla
    setIsOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        className="w-full px-[20px] py-[8px] md:py-[14px] md:h-[48px] bg-white border border-gray-300 rounded-[12px] shadow-xs flex items-center justify-center text-center md:text-left focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption ? selectedOption.label : placeholder}
        <span className="ml-[4px] md:ml-0 md:float-right"><AxesBottom /></span>
      </button>
      {isOpen && (
        <ul className="absolute  w-full md:w-auto mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-2000">
          <li
            className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
            onClick={handleReset}
          >
            Sıfırla
          </li>
          {options.map((option) => (
            <li
              key={option.key}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
          {/* Reset Seçeneği */}
          
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
