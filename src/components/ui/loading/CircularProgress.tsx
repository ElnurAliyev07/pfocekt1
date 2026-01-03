'use client';

import React from 'react';

interface CircularProgressProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  strokeWidth?: number;
  value?: number;
  showValueLabel?: boolean;
  className?: string;
  label?: string;
  isIndeterminate?: boolean;
  classNames?: {
    svg?: string;
    track?: string;
    indicator?: string;
    label?: string;
    value?: string;
  };
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 'md',
  color = 'primary',
  strokeWidth = 4,
  value = 0,
  showValueLabel = false,
  className = '',
  label,
  isIndeterminate = false,
  classNames = {},
}) => {
  // Normalize value between 0 and 100
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  
  // Calculate sizes based on prop
  const getSvgSize = () => {
    switch (size) {
      case 'xs': return 24;
      case 'sm': return 32;
      case 'md': return 48;
      case 'lg': return 64;
      case 'xl': return 80;
      default: return 48;
    }
  };
  
  const getColorClass = () => {
    switch (color) {
      case 'primary': return 'text-primary';
      case 'secondary': return 'text-secondary';
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-primary';
    }
  };
  
  const svgSize = getSvgSize();
  const radius = (svgSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = ((100 - normalizedValue) / 100) * circumference;
  
  return (
    <div className={`inline-flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        <svg
          className={`transform -rotate-90 ${getColorClass()} ${classNames.svg || ''}`}
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
        >
          {/* Track */}
          <circle
            className={`stroke-current text-gray-200 ${classNames.track || ''}`}
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            strokeWidth={strokeWidth}
            fill="none"
          />
          
          {/* Progress indicator */}
          <circle
            className={`
              stroke-current ${getColorClass()} 
              ${isIndeterminate ? 'animate-[circular-rotate_1.4s_linear_infinite]' : ''} 
              ${classNames.indicator || ''}
            `}
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={isIndeterminate ? circumference * 0.75 : offset}
            strokeLinecap="round"
            fill="none"
            style={isIndeterminate ? {
              animation: "dash 1.4s ease-in-out infinite"
            } : {}}
          />
        </svg>
        
        {/* Value label */}
        {!isIndeterminate && showValueLabel && (
          <div className={`absolute inset-0 flex items-center justify-center text-xs font-medium ${classNames.value || ''}`}>
            {normalizedValue}%
          </div>
        )}
      </div>
      
      {/* Label */}
      {label && (
        <div className={`mt-2 text-center text-sm ${classNames.label || ''}`}>
          {label}
        </div>
      )}
      
      <style jsx global>{`
        @keyframes dash {
          0% {
            stroke-dasharray: ${circumference};
            stroke-dashoffset: ${circumference};
          }
          50% {
            stroke-dasharray: ${circumference};
            stroke-dashoffset: ${circumference * 0.5};
          }
          100% {
            stroke-dasharray: ${circumference};
            stroke-dashoffset: ${circumference};
          }
        }
        
        @keyframes circular-rotate {
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default CircularProgress; 