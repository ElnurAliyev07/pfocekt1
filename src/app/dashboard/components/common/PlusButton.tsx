import React from 'react'
import Plus from '../ui/icons/Plus'

interface PlusButtonProps {
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
}

const PlusButton: React.FC<PlusButtonProps> = ({ 
  onClick, 
  className = '',
  'aria-label': ariaLabel = 'Add new item' 
}) => {
  return (
    <button 
      onClick={onClick}
      aria-label={ariaLabel}
      className={`bg-primary w-6 h-6 sm:w-7 sm:h-7 rounded-full grid place-items-center transition-transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/30 ${className}`}
    >
        <Plus />
    </button>
  )
}

export default PlusButton