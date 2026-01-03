import React from 'react'

const IncreanceBalance = ({Icon, text, backgroundColor}: {Icon: React.ReactNode; text: string; backgroundColor: string}) => {
  return (
    <div className='flex gap-1 py-3 px-6 rounded-full text-white cursor-pointer' style={{backgroundColor: backgroundColor}}>
      {Icon}
      {text}
    </div>
  )
}

export default IncreanceBalance