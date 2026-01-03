import React from 'react'

const Audio = ({ className, color  }: { className?: string , color?: string}) => {
    return (
      <svg style={{stroke: color? `var(--${color})`: `auto`}} className={className}  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 21C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19V3H14L19 8V19C19 19.5304 18.7893 20.0391 18.4142 20.4142C18.0391 20.7893 17.5304 21 17 21H7Z"  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 3V9H19"  strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M11 18C11.5523 18 12 17.5523 12 17C12 16.4477 11.5523 16 11 16C10.4477 16 10 16.4477 10 17C10 17.5523 10.4477 18 11 18Z"  strokeWidth="1.5" />
            <path d="M12 17V12L14 14"  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    )
}

export default Audio