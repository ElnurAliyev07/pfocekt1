import { User } from "@/types/auth.type";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import * as Select from '@radix-ui/react-select';
import { IoCheckmark, IoChevronDown, IoChevronUp } from "react-icons/io5";
import { cn } from '@/lib/utils';

interface SelectControllerProps {
    options: User[];
    placeholder?: string;
    onSelect: (selected: User | null) => void;
    defaultValue?: User | null;
}

const SelectController: React.FC<SelectControllerProps> = ({
    options,
    placeholder = "Seç...",
    onSelect,
    defaultValue = null,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [selectedOption, setSelectedOption] = useState<User | null>(defaultValue);

    useEffect(() => {
        if (defaultValue) {
            setSelectedOption(defaultValue);
        }
    }, [defaultValue]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setFilteredOptions(
            options.filter((option) =>
                option.full_name.toLowerCase().includes(query.toLowerCase())
            )
        );
    };

    const handleSelect = (value: string) => {
        const option = options.find(opt => String(opt.id) === value);
        if (selectedOption && String(selectedOption.id) === value) {
            setSelectedOption(null);
            onSelect(null);
        } else if (option) {
            setSelectedOption(option);
            onSelect(option);
        }
        setSearchQuery("");
        setFilteredOptions(options);
    };

    return (
        <Select.Root
            value={selectedOption ? String(selectedOption.id) : undefined}
            onValueChange={handleSelect}
        >
            <Select.Trigger
                className="w-full flex items-center gap-3 px-4 py-2 text-left bg-white border rounded-md shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {selectedOption && (
                    <Image
                        className="w-6 h-6 rounded-full object-cover"
                        src={selectedOption?.user_profile.image || "/grid.png"}
                        width={24}
                        height={24}
                        alt="profile-image"
                    />
                )}
                <div className="flex-1 min-w-0">
                    {selectedOption ? (
                        <div className="truncate">
                            <div className="text-sm font-medium text-gray-900 truncate">
                                {selectedOption.full_name}
                            </div>
                       
                        </div>
                    ) : (
                        <span className="text-gray-500">{placeholder}</span>
                    )}
                </div>
                <Select.Icon className="ml-auto flex-shrink-0">
                    <IoChevronDown className="w-4 h-4 text-gray-500" />
                </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
                <Select.Content
                    className="z-[9999] min-w-[var(--radix-select-trigger-width)] bg-white rounded-md shadow-lg border"
                    position="popper"
                    sideOffset={4}
                >
                    <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                        <IoChevronUp className="w-4 h-4" />
                    </Select.ScrollUpButton>

                    <div className="p-2">
                        <input
                            type="text"
                            placeholder="Axtar..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <Select.Viewport className="p-2">
                        <Select.Group>
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option) => (
                                    <Select.Item
                                        key={option.id}
                                        value={String(option.id)}
                                        className={cn(
                                            "relative flex items-center px-3 py-2 text-sm rounded-md cursor-pointer select-none",
                                            "focus:bg-blue-50 focus:outline-none",
                                            "data-[state=checked]:bg-blue-50",
                                            "hover:bg-gray-50"
                                        )}
                                    >
                                        <div className="flex items-center gap-3 w-full">
                                            <Image
                                                className="w-9 h-9 rounded-full object-cover"
                                                src={option.user_profile.image || "/grid.png"}
                                                width={36}
                                                height={36}
                                                alt="profile-image"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h2 className="text-t-black leading-5 text-sm font-medium truncate">
                                                    {option.full_name}
                                                </h2>
                                                <p className="text-t-gray text-xs truncate">{option.email}</p>
                                            </div>
                                            <Select.ItemIndicator className="absolute right-2 flex-shrink-0">
                                                <IoCheckmark className="w-4 h-4 text-blue-500" />
                                            </Select.ItemIndicator>
                                        </div>
                                    </Select.Item>
                                ))
                            ) : (
                                <div className="px-4 py-2 text-gray-500 text-sm">
                                    İstifadəçi tapılmadı
                                </div>
                            )}
                        </Select.Group>
                    </Select.Viewport>

                    <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                        <IoChevronDown className="w-4 h-4" />
                    </Select.ScrollDownButton>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
};

export default SelectController;
