'use client';

import React, { forwardRef, useState } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  labelPlacement?: 'inside' | 'outside' | 'float';
  errorMessage?: string;
  isInvalid?: boolean;
  helperText?: string;
  maxLength?: number;
  showCount?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      labelPlacement = 'outside',
      isInvalid = false,
      errorMessage,
      helperText,
      className = '',
      rows = 4,
      id,
      maxLength,
      showCount = false,
      placeholder,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [valueLength, setValueLength] = useState(props.value?.toString().length || 0);
    const textareaId = id || `textarea-${Math.random().toString(36).substring(2, 9)}`;

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValueLength(e.target.value.length);
      if (props.onChange) props.onChange(e);
    };

    return (
      <div className="flex flex-col w-full gap-1">
        {label && labelPlacement === 'outside' && (
          <label htmlFor={textareaId} className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          {/* Float label */}
          {label && labelPlacement === 'float' && (
            <label
              htmlFor={textareaId}
              className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                isFocused || props.value
                  ? '-top-2 text-xs bg-white px-1 text-primary'
                  : 'top-2 text-gray-500'
              }`}
            >
              {label}
            </label>
          )}

          <textarea
            id={textareaId}
            ref={ref}
            rows={rows}
            placeholder={
              labelPlacement === 'float' && (isFocused || props.value) 
                ? placeholder 
                : labelPlacement === 'inside' ? label : placeholder
            }
            className={`w-full px-3 py-2 border rounded-md focus:outline-hidden transition-colors ${
              isInvalid
                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
            } ${className}`}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            maxLength={maxLength}
            {...props}
          />

          {/* Inside label: Only show when textarea is empty and not focused */}
          {label && labelPlacement === 'inside' && !props.value && !isFocused && placeholder! && (
            <div className="absolute top-3 left-3 text-gray-500 pointer-events-none">
              {label}
            </div>
          )}
          
          {/* Character counter */}
          {showCount && maxLength && (
            <div className="absolute bottom-2 right-3 text-xs text-gray-500">
              {valueLength}/{maxLength}
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

Textarea.displayName = 'Textarea';

export default Textarea; 