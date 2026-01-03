import React, { useState, useRef, useEffect } from "react";

interface CustomColorProps {
  onChange?: (color: string) => void;
}

const CustomColor: React.FC<CustomColorProps> = ({ onChange }) => {
  const defaultColor = "#000000";
  const [selectedColor, setSelectedColor] = useState<string>(defaultColor);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const colors: string[] = [
    "#FF5733", "#33FF57", "#3357FF", "#F1C40F", "#8E44AD", "#ECF0F1", "#2C3E50",
    "#E74C3C", "#1ABC9C", "#9B59B6", "#34495E", "#D35400", "#16A085", "#2ECC71",
    "#3498DB", "#FFC300", "#C70039", "#900C3F", "#581845", "#AED6F1", "#F1948A",
    "#F5B7B1", "#7FB3D5", "#85C1E9", "#F7DC6F", "#48C9B0", "#F8C471", "#F4D03F",
    "#AAB7B8", "#566573", "#6C3483", "#1F618D", "#F39C12", "#7D3C98", "#BDC3C7",
    "#27AE60", "#2E4053", "#641E16",
  ];

  const handleColorSelect = (color: string): void => {
    setSelectedColor(color);
    setDropdownOpen(false);
    onChange?.(color); // Trigger onChange when a color is selected
  };

  const handleCustomColorSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const color = e.target.value;
    setSelectedColor(color);
    onChange?.(color); // Trigger onChange when a custom color is selected
  };

  const resetToDefault = (): void => {
    setSelectedColor(defaultColor);
    setDropdownOpen(false);
    onChange?.(defaultColor); // Trigger onChange when resetting to default
  };

  const closeDropdownOnOutsideClick = (e: MouseEvent): void => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", closeDropdownOnOutsideClick);
    } else {
      document.removeEventListener("mousedown", closeDropdownOnOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", closeDropdownOnOutsideClick);
    };
  }, [dropdownOpen]);

  return (
    <div className="relative mx-auto max-w-xs sm:max-w-md md:max-w-lg">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-label="Select color"
        aria-expanded={dropdownOpen}
        className={`w-10 h-10 border rounded-md cursor-pointer font-bold`}
        style={{
          backgroundColor: selectedColor,
          color: selectedColor === "#ECF0F1" ? "#000" : "#FFF",
        }}
      ></button>

      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-14 left-0 w-[300px] sm:w-[400px] bg-white border rounded-md shadow-md z-10 p-3"
        >
          <h4 className="mb-2 text-sm font-semibold">Theme Colors</h4>
          <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
            {colors.map((color) => (
              <div
                key={color}
                onClick={() => handleColorSelect(color)}
                className={`w-8 h-8 cursor-pointer rounded-sm border ${
                  color === selectedColor ? "border-black" : "border-gray-300"
                }`}
                style={{ backgroundColor: color }}
                title={color}
              ></div>
            ))}
          </div>

          <h4 className="mt-4 mb-2 text-sm font-semibold">Custom Color</h4>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={selectedColor}
              onChange={handleCustomColorSelect}
              className="w-full h-10 border rounded-md cursor-pointer"
            />

            <button
              onClick={resetToDefault}
              className="px-4 py-2 bg-gray-200 text-gray-800 border border-gray-300 rounded-md cursor-pointer font-bold text-sm"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomColor;
