import { ProjectMember } from "@/types/project.type";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";



interface AssignerSelectProps {
    options: ProjectMember[];
    placeholder?: string;
    onSelect: (selected: ProjectMember | null) => void;
    value?: ProjectMember | null;
    error?: string | boolean;
}

const AssignerSelect: React.FC<AssignerSelectProps> = ({
    options,
    placeholder = "Select an option...",
    onSelect,
    value,
    error
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [selectedOption, setSelectedOption] = useState<ProjectMember | null>(value || null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setFilteredOptions(
            options.filter((option) =>
                option.user?.full_name.toLowerCase().includes(query.toLowerCase())
            )
        );
    };

    const handleSelect = (option: ProjectMember) => {
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

    // Update selectedOption when value prop changes
    useEffect(() => {
        setSelectedOption(value || null);
    }, [value]);

    // Update filteredOptions when options prop changes
    useEffect(() => {
        setFilteredOptions(options);
    }, [options]);

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
                className={`w-full flex items-center gap-[12px] px-4 py-2 text-left bg-white border rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'}`}
                onClick={toggleDropdown}
            >
                {
                    selectedOption && (
                        <Image
                            className="w-[24px] h-[24px] rounded-full object-cover"
                            src={selectedOption?.user?.user_profile?.image || '/grid.png'}
                            width={500}
                            height={500}
                            alt="profile-image"
                        />
                    )
                }
                <span>{selectedOption ? selectedOption.user.full_name : placeholder}</span>
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
                    <ul className="max-h-48 overflow-y-auto p-2 space-y-[8px]">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li
                                    key={option.id}
                                    className={`${(option.id === selectedOption?.id) && "bg-[#f3f1f1]"
                                        } h-[60px] flex items-center justify-between p-[12px] group hover:bg-[#E8EAED] rounded-[8px]`}
                                    onClick={() => handleSelect(option)}
                                >
                                    <div className="flex items-center gap-[12px]">
                                        <Image
                                            className="w-[36px] h-[36px] rounded-full object-cover"
                                            src={option?.user?.user_profile?.image || "/grid.png"}
                                            width={500}
                                            height={500}
                                            alt="profile-image"
                                        />
                                        <div>
                                            <h2 className="text-t-black leading-[20px] text-[14px] font-medium">
                                                {option?.user?.full_name}
                                            </h2>
                                            <p className="text-t-gray text-[12px]">{option?.user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="h-[32px] bg-[#E8EAED] group-hover:bg-[#c3c4c7] px-[12px] rounded-[8px] grid place-items-center text-[14px] leading-[20px]">
                                        {option.role.label}
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500">İstifadəçi tapılmadı</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AssignerSelect;
