import React from 'react'


const CurrentSituation = ({ className, color }: { className?: string, color?: string }) => {
  return (
    <svg style={{ stroke: color ? `var(--${color})` : `auto` }} className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 6H20M6 12H18M4 18H16"  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default CurrentSituation