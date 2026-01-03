'use client';

import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'flat' | 'outline' | 'ghost' | 'link' | 'danger' | 'success' | 'warning' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  radius?: 'xs' | 'sm' | 'md' | 'lg' | 'full';
  fullWidth?: boolean;
  round?: boolean;
  isLoading?: boolean;
  onPress?: () => void;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      radius = 'md', // Default radius
      fullWidth = false,
      round = false,
      children,
      isLoading = false,
      disabled,
      onPress,
      type = 'button',
      leadingIcon,
      trailingIcon,
      ...props
    },
    ref
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Create ripple effect
      const button = e.currentTarget;
      const circle = document.createElement('span');
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      const radius = diameter / 2;

      const rect = button.getBoundingClientRect();
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple');

      const ripple = button.getElementsByClassName('ripple')[0];
      if (ripple) {
        ripple.remove();
      }
      
      button.appendChild(circle);

      // Execute the onPress callback if provided
      if (onPress) {
        e.preventDefault();
        onPress();
      }
    };

    // Base classes
    let classes = `cursor-pointer inline-flex items-center justify-center text-sm font-medium transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden ${className}`;

    // Size classes
    if (size === 'xs') {
      classes += ' h-8 px-2.5 text-xs';
    } else if (size === 'sm') {
      classes += ' h-9 px-3 text-sm';
    } else if (size === 'md') {
      classes += ' h-10 py-2 px-4';
    } else if (size === 'lg') {
      classes += ' h-11 px-5 text-lg';
    } else if (size === 'icon') {
      classes += ' h-9 w-9';
    }

    // Variant classes
    if (variant === 'primary') {
      classes += ' bg-primary text-white hover:bg-primary/90 shadow-xs';
    } else if (variant === 'secondary') {
      classes += ' bg-secondary text-white hover:bg-secondary/90 shadow-xs';
    } else if (variant === 'flat') {
      classes += ' bg-custom-gray text-t-black hover:bg-custom-gray/90';
    } else if (variant === 'outline') {
      classes += ' border border-input bg-transparent hover:bg-accent hover:text-accent-foreground';
    } else if (variant === 'ghost') {
      classes += ' hover:bg-accent hover:text-accent-foreground';
    } else if (variant === 'link') {
      classes += ' text-primary underline-offset-4 hover:underline';
    } else if (variant === 'danger') {
      classes += ' bg-red-500 text-white hover:bg-red-600 shadow-xs';
    } else if (variant === 'success') {
      classes += ' bg-green-500 text-white hover:bg-green-600 shadow-xs';
    } else if (variant === 'warning') {
      classes += ' bg-yellow-500 text-white hover:bg-yellow-600 shadow-xs';
    } else if (variant === 'info') {
      classes += ' bg-blue-500 text-white hover:bg-blue-600 shadow-xs';
    }

    // Width
    if (fullWidth) {
      classes += ' w-full';
    }

    // Radius & Round classes
    if (round) {
      classes += ' rounded-full';
    } else if (radius === 'xs') {
      classes += ' rounded-xs';
    } else if (radius === 'sm') {
      classes += ' rounded-sm';
    } else if (radius === 'md') {
      classes += ' rounded-md';
    } else if (radius === 'lg') {
      classes += ' rounded-lg';
    }


    return (
      <button
        className={classes}
        ref={ref}
        disabled={disabled || isLoading}
        type={type}
        onClick={handleClick}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center bg-inherit">
            <svg
              className="animate-spin h-5 w-5 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}
        <span className={`flex items-center gap-2 ${isLoading ? 'opacity-0' : ''}`}>
          {leadingIcon && <span className="inline-flex">{leadingIcon}</span>}
          {children}
          {trailingIcon && <span className="inline-flex">{trailingIcon}</span>}
        </span>
        <style jsx global>{`
          .ripple {
            position: absolute;
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 600ms linear;
            background-color: rgba(255, 255, 255, 0.2);
          }
          
          @keyframes ripple {
            to {
              transform: scale(4);
              opacity: 0;
            }
          }
        `}</style>
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button; 