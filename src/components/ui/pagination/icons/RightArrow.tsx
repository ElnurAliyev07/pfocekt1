import React from 'react'

interface Props{
    className?: string;
}

const RightArrow: React.FC<Props> = ({className}) => {
  return (
    <svg className={`stroke-[#14171A] ${className}`} width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_4207_1418)">
<path d="M9.5 6L15.5 12L9.5 18" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</g>
<defs>
<clipPath id="clip0_4207_1418">
<rect width="24" height="24" fill="white" transform="translate(0.5)"/>
</clipPath>
</defs>
</svg>

  )
}

export default RightArrow
