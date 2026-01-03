import React from 'react'

interface Props {
    cardColor: string
    icon: React.ReactNode
    title: string
    value: string | number
    color: string
    tail?: string // Əlavə metn üçün string default dəyər olacaq, meselen AZN ve ya %
    className?: string
}

const StatsCard: React.FC<Props> = ({
    icon, 
    title, 
    value, 
    color, 
    tail = '', 
    cardColor,
    className = ''
}) => {
    return (
        <div 
            style={{backgroundColor: cardColor}} 
            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 h-full active:scale-95 ${className}`}
        >
            <div className="flex flex-col items-center justify-between h-full">
                <div 
                    className='p-2 sm:p-5  rounded-lg flex items-center justify-center' 
                    style={{ backgroundColor: color }}
                >
                    {icon}
                </div>
                
                <h3 className="font-medium text-gray-500 mt-2 mb-1 sm:my-2 text-center text-xs sm:text-sm tracking-tight">{title}</h3>
                
                <div className="flex items-center justify-center">
                    <span className="text-base sm:text-2xl font-semibold text-gray-900 mt-1">
                        {value}
                        {tail && (
                            <span className="ml-1 text-xs sm:text-xl font-medium text-gray-600">{tail}</span>
                        )}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default StatsCard
