'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'solid' | 'outline' | 'flat' | 'dot';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'default';
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
  isDeletable?: boolean;
  onDelete?: () => void;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'solid',
  color = 'primary',
  size = 'md',
  isDisabled = false,
  isDeletable = false,
  onDelete,
  className,
}) => {
  // Color classes
  const getColorClasses = () => {
    switch (variant) {
      case 'solid':
        switch (color) {
          case 'primary': return 'bg-primary text-white';
          case 'secondary': return 'bg-secondary text-white';
          case 'success': return 'bg-green-500 text-white';
          case 'warning': return 'bg-yellow-500 text-white';
          case 'error': return 'bg-red-500 text-white';
          case 'default': return 'bg-gray-500 text-white';
          default: return 'bg-primary text-white';
        }
      case 'outline':
        switch (color) {
          case 'primary': return 'border border-primary text-primary';
          case 'secondary': return 'border border-secondary text-secondary';
          case 'success': return 'border border-green-500 text-green-500';
          case 'warning': return 'border border-yellow-500 text-yellow-500';
          case 'error': return 'border border-red-500 text-red-500';
          case 'default': return 'border border-gray-400 text-gray-600';
          default: return 'border border-primary text-primary';
        }
      case 'flat':
        switch (color) {
          case 'primary': return 'bg-primary/10 text-primary';
          case 'secondary': return 'bg-secondary/10 text-secondary';
          case 'success': return 'bg-green-100 text-green-600';
          case 'warning': return 'bg-yellow-100 text-yellow-600';
          case 'error': return 'bg-red-100 text-red-600';
          case 'default': return 'bg-gray-100 text-gray-600';
          default: return 'bg-primary/10 text-primary';
        }
      case 'dot':
        switch (color) {
          case 'primary': return 'text-gray-600 before:bg-primary';
          case 'secondary': return 'text-gray-600 before:bg-secondary';
          case 'success': return 'text-gray-600 before:bg-green-500';
          case 'warning': return 'text-gray-600 before:bg-yellow-500';
          case 'error': return 'text-gray-600 before:bg-red-500';
          case 'default': return 'text-gray-600 before:bg-gray-500';
          default: return 'text-gray-600 before:bg-primary';
        }
      default:
        return 'bg-primary text-white';
    }
  };

  // Size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'text-xs px-2 py-0.5';
      case 'md': return 'text-sm px-2.5 py-1';
      case 'lg': return 'text-base px-3 py-1.5';
      default: return 'text-sm px-2.5 py-1';
    }
  };

  // Disabled classes
  const disabledClasses = isDisabled ? 'opacity-50 cursor-not-allowed' : '';

  // Dot variant specific classes
  const dotClasses = variant === 'dot' 
    ? 'pl-4 before:content-[""] before:absolute before:left-1.5 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full'
    : '';

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isDisabled && onDelete) {
      onDelete();
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full relative',
        getColorClasses(),
        getSizeClasses(),
        disabledClasses,
        dotClasses,
        className
      )}
    >
      {children}
      
      {isDeletable && (
        <button
          onClick={handleDelete}
          className={`ml-1.5 rounded-full transition-colors ${
            isDisabled ? 'cursor-not-allowed' : 'hover:bg-black/10'
          }`}
          disabled={isDisabled}
          aria-label="Remove"
          type="button"
        >
          <svg 
            className="w-3 h-3" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M18 6L6 18M6 6l12 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

export default Badge; 