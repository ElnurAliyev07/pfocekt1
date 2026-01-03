import React from 'react'

const Close = ({size, color = '#64717C'}: {size: number, color?: string}) => {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.99805 5.00195L18.9971 19.001" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.99703 19.001L18.9961 5.00195" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    )
}

export default Close