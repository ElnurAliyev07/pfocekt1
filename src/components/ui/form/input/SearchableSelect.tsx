import React, { useState, useEffect, useRef } from "react";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  placeholder?: string;
  onSelect: (selected: Option | null) => void;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  placeholder = "Select an option...",
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const handleSelect = (option: Option) => {
    if (selectedOption?.value === option.value) {
      setSelectedOption(null);
      onSelect(null);
    } else {
      setSelectedOption(option);
      onSelect(option);
    }
    setIsOpen(false);
    setSearchQuery("");
    setFilteredOptions(options); // Reset options
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Dropdown Button */}
      <button
        type="button"
        className="w-full px-4 py-2 text-left bg-white border rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
        onClick={toggleDropdown}
      >
        {selectedOption ? selectedOption.label : placeholder}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border rounded-md shadow-lg">
          {/* Search Bar */}
          <div className="p-2">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-2 text-sm border rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Options List */}
          <ul className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className={`px-4 py-2 cursor-pointer ${
                    selectedOption?.value === option.value
                      ? "bg-blue-100 font-bold"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No options found</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
