'use client';

import React, { useState, useEffect } from 'react';

// Define the interface for props
interface CustomCheckboxProps {
    size?: number; // Size of the checkbox in pixels
    color?: string; // Background color class
    isChecked?: boolean; // Initial state of the checkbox
    onChange?: (checked: boolean) => void; // Callback function for state changes
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
    size = 24,
    color = 'primary',
    isChecked = false,
    onChange,
}) => {
    const [checked, setChecked] = useState(isChecked);

    // Sync local state with isChecked prop
    useEffect(() => {
        setChecked(isChecked);
    }, [isChecked]);

    // Handle checkbox click
    const handleClick = () => {
        const newChecked = !checked;
        setChecked(newChecked);
        if (onChange) {
            onChange(newChecked); // Call the callback function
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`${ checked ? `bg-${color} border-${color}` : ' bg-white border-[#B8BABD]'} border inline-flex items-center justify-center cursor-pointer`}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: '4px',
            }}
        >
            {checked && (
                <svg
                    width={size - 4}
                    height={size - 3}
                    viewBox="0 0 20 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g clipPath="url(#clip0_481_967)">
                        <path
                            d="M4.16666 10.5L8.33332 14.6666L16.6667 6.33331"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </g>
                    <defs>
                        <clipPath id="clip0_481_967">
                            <rect
                                width="20"
                                height="20"
                                fill="white"
                                transform="translate(0 0.5)"
                            />
                        </clipPath>
                    </defs>
                </svg>
            )}
        </div>
    );
};

export default CustomCheckbox;
