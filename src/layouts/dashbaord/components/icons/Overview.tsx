import React from 'react'


const Overview = ({ className, color  }: { className?: string , color?: string}) => {
  return (
    <svg style={{stroke: color? `var(--${color})`: `auto`}} className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 12L12 16L20 12M4 16L12 20L20 16M12 4L4 8L12 12L20 8L12 4Z"  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default Overview