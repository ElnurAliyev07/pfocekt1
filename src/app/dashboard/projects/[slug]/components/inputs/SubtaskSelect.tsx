import { TaskUser } from "@/store/taskUserStore";
import React, { useState, useEffect, useRef } from "react";
import SelectUserTaskModal from "../modals/SelectUserTask";



interface SubtaskSelectProps {
    options: TaskUser[];
    placeholder?: string;
    onSelect: (selected: TaskUser | null) => void;
    value?: number | null
}

const SubtaskSelect: React.FC<SubtaskSelectProps> = ({
    options,
    placeholder = "Select an option...",
    onSelect,
    value
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredOptions, setFilteredOptions] = useState<TaskUser []>([]);
    const [selectedOption, setSelectedOption] = useState<TaskUser | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setFilteredOptions(
            options.filter((option) =>
                option.projectMember.user.full_name.toLowerCase().includes(query.toLowerCase())
            )
        );
    };

    useEffect(() => {
        setFilteredOptions(options)

    }, [options])

    useEffect(() => {
        if (value) {
            const selectedOption = options.find((option) => option.order-1 === value);
            if (selectedOption) {
                setSelectedOption(selectedOption);
            }
        }
    }, [options, value]);
    

    const handleSelect = (option: TaskUser) => {
        if (selectedOption?.order === option.order) {
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
            const targetElement = event.target as HTMLElement;
    
            if (
                dropdownRef.current && 
                !dropdownRef.current.contains(targetElement) && 
                !targetElement.closest(".select-user-task-modal") // Modal sınıfını kontrol et
            ) {
                setIsOpen(false);
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    
    const showPlaceholder = () => {
        if (!selectedOption) {
            return placeholder;
        }
        let title = selectedOption.order + ". " + selectedOption.projectMember.user.full_name;
        if (selectedOption.job) {
            title += " - " + selectedOption.job;
        }
        return title; 
    }
    return (
        <div ref={dropdownRef} onMouseDown={(e) => e.stopPropagation()}  className="relative w-full">
            {/* Dropdown Button */}
            <button
                type="button"
                className="w-full flex items-center gap-[12px] px-4 py-2 text-left bg-white border rounded-md shadow-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                onClick={toggleDropdown}
            >
                <span>{showPlaceholder()}</span>
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
                                    key={option.order}
                                    className={`${(option.order === selectedOption?.order) && "bg-[#f3f1f1]"
                                        } h-[40px] flex items-center justify-between px-[12px] group hover:bg-[#E8EAED] rounded-[8px]`}
                                    onClick={() => handleSelect(option)}
                                >
                                    <div className="flex items-center gap-[12px]">
                                        { option.order + ". " + option.projectMember.user.full_name } {option.job && " - " + option.job}
                                    </div>
                                    
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 flex items-center text-gray-500">
                                <span>Növbəti tapşırıq tapılmadı</span>
                                <SelectUserTaskModal />
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SubtaskSelect;