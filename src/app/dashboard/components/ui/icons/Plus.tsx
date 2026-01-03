import React from 'react'

const Plus = ({color = "white", className}: {color?:  string, className?: string}) => {
    return (
        <svg className={`fill-${color} ${className}`} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.6673 10.834H10.834V16.6673H9.16732V10.834H3.33398V9.16732H9.16732V3.33398H10.834V9.16732H16.6673V10.834Z" />
        </svg>

    )
}

export default Plus