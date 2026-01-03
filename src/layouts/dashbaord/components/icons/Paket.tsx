import React from 'react'

const Paket = ({ className, color }: { className?: string, color?: string }) => {
    return (
        <svg style={{ stroke: color ? `var(--${color})` : `auto` }} className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21L20.131 16.792C20.447 16.628 20.605 16.547 20.72 16.426C20.8219 16.3198 20.899 16.1925 20.946 16.053C21 15.894 21 15.717 21 15.361V7.53302M12 21L3.869 16.792C3.553 16.628 3.395 16.547 3.28 16.426C3.17814 16.3198 3.10097 16.1925 3.054 16.053C3 15.894 3 15.716 3 15.359V7.53302M12 21V11.937M21 7.53302L12 11.937M21 7.53302L12.73 3.25302C12.463 3.11502 12.33 3.04502 12.189 3.01802C12.0641 2.99399 11.9359 2.99399 11.811 3.01802C11.671 3.04502 11.537 3.11502 11.269 3.25302L3 7.53302M3 7.53302L12 11.937"  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default Paket