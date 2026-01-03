import React from 'react'

const Image = ({ className, color  }: { className?: string , color?: string}) => {
    return (
      <svg style={{stroke: color? `var(--${color})`: `auto`}} className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.2222 4H5.77778C4.79594 4 4 4.79594 4 5.77778V18.2222C4 19.2041 4.79594 20 5.77778 20H18.2222C19.2041 20 20 19.2041 20 18.2222V5.77778C20 4.79594 19.2041 4 18.2222 4Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9.33247 11.1102C10.3143 11.1102 11.1102 10.3143 11.1102 9.33247C11.1102 8.35063 10.3143 7.55469 9.33247 7.55469C8.35063 7.55469 7.55469 8.35063 7.55469 9.33247C7.55469 10.3143 8.35063 11.1102 9.33247 11.1102Z" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19.9974 14.666L17.2543 11.9229C16.9209 11.5896 16.4688 11.4023 15.9974 11.4023C15.526 11.4023 15.0739 11.5896 14.7405 11.9229L6.66406 19.9993" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    )
}

export default Image