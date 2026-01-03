import Plus from "@/app/dashboard/components/ui/icons/Plus";
import { Project } from "@/types/project.type";
import React, { useState } from "react";
import * as Select from '@radix-ui/react-select';
import { HiChevronDown, HiChevronUp, HiCheck, HiPlus } from 'react-icons/hi';
import { cn } from "@/lib/utils";
import CreateProjectModal from "../modals/CreateProject";

interface SelectProjectProps {
    options: Project[];
    defaultValue?: Project | null;
    placeholder?: string;
    onSelect: (selected: Project | null) => void;
    ariaLabel?: string;
}

const SelectProject: React.FC<SelectProjectProps> = ({
    options,
    defaultValue = null,
    placeholder = "Seç...",
    onSelect,
    ariaLabel
}) => {
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalOpen = () => {
        setIsSelectOpen(false);
        setIsModalOpen(true);
    };

    return (
        <>
            <Select.Root
                defaultValue={defaultValue?.id.toString()}
                onValueChange={(value) => {
                    const selected = options.find(opt => opt.id.toString() === value);
                    onSelect(selected || null);
                }}
                open={isSelectOpen}
                onOpenChange={setIsSelectOpen}
            >
                <Select.Trigger
                    className="w-full h-10 flex items-center justify-between gap-2 px-3 bg-white border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    aria-label={ariaLabel}
                >
                    <Select.Value placeholder={placeholder} />
                    <Select.Icon>
                        <HiChevronDown className="w-4 h-4 text-gray-500" />
                    </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                    <Select.Content
                        className="z-[100] min-w-[var(--radix-select-trigger-width)] overflow-hidden bg-white rounded-lg shadow-lg border border-gray-200 animate-in fade-in-80"
                        position="popper"
                        sideOffset={4}
                        align="start"
                        side="bottom"
                    >
                        <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                            <HiChevronUp className="w-4 h-4" />
                        </Select.ScrollUpButton>

                        <Select.Viewport className="p-2 max-h-[300px]">
                            <Select.Group>
                                {options.length > 0 ? (
                                    options.map((option) => (
                                        <Select.Item
                                            key={option.id}
                                            value={option.id.toString()}
                                            className={cn(
                                                "relative flex items-center px-3 py-2 text-sm text-gray-700 rounded-md cursor-pointer select-none",
                                                "focus:outline-none focus:bg-indigo-50 focus:text-indigo-700",
                                                "data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-700",
                                                "data-[state=checked]:bg-indigo-50 data-[state=checked]:text-indigo-700"
                                            )}
                                        >
                                            <Select.ItemText>{option.title}</Select.ItemText>
                                            <Select.ItemIndicator className="absolute right-2 flex items-center justify-center">
                                                <HiCheck className="w-4 h-4" />
                                            </Select.ItemIndicator>
                                        </Select.Item>
                                    ))
                                ) : (
                                    <div className="px-3 py-4">
                                        <div className="text-center mb-3">
                                            <p className="text-sm text-gray-600 mb-1">
                                                Planlama üçün proyekt tapılmadı
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Yeni proyekt yaradaraq planlamaya başlayın
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleModalOpen}
                                            className="flex items-center justify-center gap-2 w-full px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                                        >
                                            <HiPlus className="w-4 h-4" />
                                            <span>Yeni Proyekt Yarat</span>
                                        </button>
                                    </div>
                                )}
                            </Select.Group>
                        </Select.Viewport>

                        <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
                            <HiChevronDown className="w-4 h-4" />
                        </Select.ScrollDownButton>
                    </Select.Content>
                </Select.Portal>
            </Select.Root>

            <CreateProjectModal
                isOpen={isModalOpen}
                hiddenButton
                onOpenChange={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default SelectProject;
