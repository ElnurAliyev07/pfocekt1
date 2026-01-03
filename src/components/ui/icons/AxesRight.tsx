import React from 'react'

interface AxesRightProps {
    className?: string;
}

const AxesRight: React.FC<AxesRightProps> = ({ className }) => {
    return (
        <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2712_8617)">
                <path d="M6 4L10 8L6 12" stroke="#64717C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
                <clipPath id="clip0_2712_8617">
                    <rect width="16" height="16" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default AxesRight