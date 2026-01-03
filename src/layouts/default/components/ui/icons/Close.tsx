import React from 'react'

const Close = ({stroke = "black", size = 24}: {stroke?: string, size?: number}) => {
    return (
        <svg width={size} height={size} viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_91_5554)">
                <path d="M18 6.3252L6 18.3252" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 6.3252L18 18.3252" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
                <clipPath id="clip0_91_5554">
                    <rect width="24" height="24" fill="white" transform="translate(0 0.325195)" />
                </clipPath>
            </defs>
        </svg>


    )
}

export default Close