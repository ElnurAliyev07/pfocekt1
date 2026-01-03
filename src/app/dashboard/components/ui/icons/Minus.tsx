import React from 'react';

const Minus = ({ color = "white" }: { color?: string }) => {
    return (
        <svg className={`fill-${color}`} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3.33398 10.834H16.6673V9.16732H3.33398V10.834Z" />
        </svg>
    );
};

export default Minus;
