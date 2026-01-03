import React, { useState, useRef } from "react";
import ReactDOM from "react-dom";

interface Option {
  key: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  onChange: (key: string) => void;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (option: Option, event: React.MouseEvent) => {
    event.stopPropagation(); // Modalın kapanmasını engelle
    setSelectedOption(option);
    onChange(option.key);
    setIsOpen(false);
  };

  return (
    <div
      className="relative"
      onClick={(e) => e.stopPropagation()} // Olayın yukarı taşınmasını engelle
    >
      {/* Select Button */}
      <button
        type="button"
        ref={buttonRef}
        onClick={toggleDropdown}
        className="px-4 py-2 border border-gray-300 rounded-md shadow-xs bg-white text-sm font-medium hover:bg-gray-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        {selectedOption ? selectedOption.label : "Select an option"}
      </button>

      {/* Dropdown (Rendered via Portal) */}
      {isOpen &&
        dropdownPosition &&
        ReactDOM.createPortal(
          <div
            className="absolute bg-white shadow-lg rounded-md border border-gray-300 z-9999"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
          >
            <ul className="py-2">
              {options.map((option) => (
                <li
                  key={option.key}
                  className="px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer"
                  onClick={(event) => handleSelect(option, event)} // Event parametresi eklendi
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>,
          document.body // Render dropdown to the body
        )}
    </div>
  );
};

export default CustomSelect;
