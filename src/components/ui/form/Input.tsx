'use client';

import React, { forwardRef, useState } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelPlacement?: 'inside' | 'outside' | 'float';
  errorMessage?: string;
  isInvalid?: boolean;
  helperText?: string;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      labelPlacement = 'outside',
      isInvalid = false,
      errorMessage,
      helperText,
      className = '',
      id,
      placeholder,
      startContent,
      endContent,
      onFocus,
      onBlur,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    // Determine if this is a controlled component
    const isControlled = value !== undefined;
    
    // Determine if the input has a value
    const hasValue = isControlled ? Boolean(value) : Boolean(defaultValue);
    
    // For controlled components, ensure value is never undefined
    const inputProps = isControlled 
      ? { value: value || '' }  // Convert undefined/null to empty string
      : { defaultValue };

    const baseInputClasses = `w-full transition-colors ${
      startContent ? 'pl-10' : 'pl-3'
    } ${
      endContent ? 'pr-10' : 'pr-3'
    } py-2 border rounded-md focus:outline-hidden ${
      isInvalid
        ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
        : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
    } ${className}`;

    return (
      <div className="flex flex-col w-full gap-1">
        {label && labelPlacement === 'outside' && (
          <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          {/* Float label */}
          {label && labelPlacement === 'float' && (
            <label
              htmlFor={inputId}
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                isFocused || hasValue
                  ? '-top-2 text-xs bg-white px-1 text-primary'
                  : 'top-2 text-gray-500'
              }`}
            >
              {label}
            </label>
          )}

          {/* Start content (icon, etc) */}
          {startContent && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {startContent}
            </div>
          )}

          <input
            id={inputId}
            ref={ref}
            {...inputProps}
            placeholder={
              labelPlacement === 'float' && (isFocused || hasValue) 
                ? placeholder 
                : labelPlacement === 'inside' ? label : placeholder
            }
            className={baseInputClasses}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />

          {/* Inside label: Only show when input is empty and not focused */}
          {label && labelPlacement === 'inside' && !hasValue && !isFocused && (
            <div className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500 pointer-events-none">
              {label}
            </div>
          )}

          {/* End content (icon, etc) */}
          {endContent && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {endContent}
            </div>
          )}
        </div>

        {/* Helper text or error message */}
        {(isInvalid && errorMessage) || helperText ? (
          <p className={`mt-1 text-xs ${isInvalid ? 'text-red-500' : 'text-gray-500'}`}>
            {isInvalid ? errorMessage : helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;