import React from 'react'

const Job = ({ className, color  }: { className?: string , color?: string}) => {
  return (
    <svg style={{stroke: color? `var(--${color})`: `auto`}} className={className} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.4167 6.41666H4.58333C3.57081 6.41666 2.75 7.23747 2.75 8.24999V16.5C2.75 17.5125 3.57081 18.3333 4.58333 18.3333H17.4167C18.4292 18.3333 19.25 17.5125 19.25 16.5V8.24999C19.25 7.23747 18.4292 6.41666 17.4167 6.41666Z"  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7.33301 6.41667V4.58333C7.33301 4.0971 7.52616 3.63079 7.86998 3.28697C8.2138 2.94315 8.68011 2.75 9.16634 2.75H12.833C13.3192 2.75 13.7856 2.94315 14.1294 3.28697C14.4732 3.63079 14.6663 4.0971 14.6663 4.58333V6.41667"  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M11 11V11.0092"  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2.75 11.9167C5.30895 13.2061 8.13453 13.8778 11 13.8778C13.8655 13.8778 16.6911 13.2061 19.25 11.9167"  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>

  )
}

export default Job