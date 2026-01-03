import React from 'react'

const Calendar = ({className ="w-[16px] h-[16px]"} : {className?: string}) => {
  return (
    <svg className={`${className}`} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M2.061 6.27h11.883" stroke="#444BD3" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M10.961 8.873h.006" stroke="#444BD3" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M8.003 8.873h.006" stroke="#444BD3" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M5.038 8.873h.006" stroke="#444BD3" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M10.961 11.464h.006" stroke="#444BD3" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M8.003 11.464h.006" stroke="#444BD3" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M5.038 11.464h.006" stroke="#444BD3" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M10.696 1.333v2.194" stroke="#444BD3" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M5.311 1.333v2.194" stroke="#444BD3" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M3.667 2.66c-1.054.44-1.667 1.4-1.667 2.82v6.033c0 2.036 1.223 3.152 3.181 3.152H8" stroke="#444BD3" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M10.825 2.386c1.964 0 3.181 1.091 3.174 3.096v6.084c0 2.004-1.217 3.101-3.181 3.101h-.486" stroke="#444BD3" strokeLinecap="round" strokeLinejoin="round"/>
  <path d="M5.333 2.386H8.003h.997" stroke="#444BD3" strokeLinecap="round" strokeLinejoin="round"/>
</svg>

  )
}

export default Calendar
