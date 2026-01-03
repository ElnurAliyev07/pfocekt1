import { Planning } from "@/types/planning.type";
import React, { useState, useEffect, useRef } from "react";



interface SelectCustomerProps {
    options: Planning[];
    placeholder?: string;
    onSelect: (selected: Planning | null) => void;
}

const SelectCustomer: React.FC<SelectCustomerProps> = ({
    options,
    placeholder = "Seç...",
    onSelect,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [selectedOption, setSelectedOption] = useState<Planning | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setFilteredOptions(
            options.filter((option) =>
                option.project.title.toLowerCase().includes(query.toLowerCase())
            )
        );
    };

    const handleSelect = (option: Planning) => {
        if (selectedOption?.id === option.id) {
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
                className="w-full flex items-center gap-[12px] px-4 py-2 text-left bg-white border rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                onClick={toggleDropdown}
            >
                <span>{selectedOption ? selectedOption.project.title : placeholder}</span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-1000 w-full mt-2 bg-white border rounded-md shadow-lg">
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
                    <ul className="max-h-48 overflow-y-auto p-2 space-y-[8px]">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li
                                    key={option.id}
                                    className={`${(option.id === selectedOption?.id) && "bg-[#f3f1f1]"
                                        } h-[40px] flex items-center justify-between p-[12px] group hover:bg-[#E8EAED] rounded-[8px] cursor-pointer`}
                                    onClick={() => handleSelect(option)}
                                >
                                    <div className="flex items-center gap-[12px]">
                                       
                                        <div>
                                            <h2 className="text-t-black leading-[20px] text-[14px] font-medium">
                                                {option.project.title}
                                            </h2>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500">Planlama tapılmadı</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SelectCustomer;
