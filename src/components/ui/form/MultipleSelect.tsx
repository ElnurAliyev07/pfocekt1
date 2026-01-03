'use client';

import React, { forwardRef, useEffect, useRef, useState } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { HiCheck, HiChevronDown, HiX } from 'react-icons/hi';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';

export interface MultipleSelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  value: string;
  children?: React.ReactNode;
  isSelected?: boolean;
}

export const MultipleSelectItem = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  MultipleSelectItemProps
>(({ children, className, isSelected, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex cursor-pointer select-none items-center rounded-md py-2.5 pl-8 pr-2 text-base outline-none transition-colors',
      'hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-100',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      {isSelected && (
        <HiCheck className="h-4 w-4 text-primary" />
      )}
    </span>
    <span>{children}</span>
  </div>
));

MultipleSelectItem.displayName = 'MultipleSelectItem';

// Mobile bottom sheet select item
const MobileMultipleSelectItem = forwardRef<
  HTMLDivElement,
  { value: string; children: React.ReactNode; isSelected: boolean; onSelect: () => void }
>(({ children, value, isSelected, onSelect, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between px-4 py-3.5 cursor-pointer active:bg-gray-50 transition-colors',
      isSelected ? 'bg-primary/5' : ''
    )}
    onClick={onSelect}
    {...props}
  >
    <span className="text-base">{children}</span>
    {isSelected ? (
      <div className="flex items-center justify-center rounded-full w-5 h-5 bg-primary text-white">
        <HiCheck className="h-3 w-3" />
      </div>
    ) : (
      <div className="w-5 h-5 rounded-full border border-gray-300"></div>
    )}
  </div>
));

MobileMultipleSelectItem.displayName = 'MobileMultipleSelectItem';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
}

export interface MultipleSelectProps {
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  helperText?: string;
  className?: string;
  options?: Array<{ value: string; label: string }>;
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  disabled?: boolean;
  maxDisplay?: number;
  children?: React.ReactNode;
}

const MultipleSelect = forwardRef<HTMLDivElement, MultipleSelectProps>(({ 
  label,
  placeholder = 'Select options',
  errorMessage,
  isInvalid = false,
  helperText,
  className,
  options = [],
  defaultValue = [],
  onChange,
  disabled = false,
  maxDisplay = 2,
  children,
  ...props
}, ref) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValue);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Extract options from children if provided
  const itemsFromChildren = React.Children.toArray(children)
    .filter((child) => React.isValidElement(child) && child.type === MultipleSelectItem)
    .map((child) => {
      const item = child as React.ReactElement<MultipleSelectItemProps>;
      return {
        value: item.props.value,
        label: item.props.children?.toString() || item.props.value,
        element: item
      };
    });

  // Combine options from props and children
  const allOptions = options.length > 0 
    ? options 
    : itemsFromChildren.map(({ value, label }) => ({ value, label }));

  const handleSelect = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter(val => val !== value)
      : [...selectedValues, value];
    
    setSelectedValues(newSelectedValues);
    onChange?.(newSelectedValues);
  };

  const handleRemoveValue = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelectedValues = selectedValues.filter(val => val !== value);
    setSelectedValues(newSelectedValues);
    onChange?.(newSelectedValues);
  };

  const getSelectedLabels = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }

    const selectedOptions = allOptions.filter(option => 
      selectedValues.includes(option.value)
    );

    if (selectedValues.length <= maxDisplay) {
      return selectedOptions
        .map(option => option.label)
        .join(', ');
    }

    return `${selectedOptions.slice(0, maxDisplay).map(option => option.label).join(', ')} +${selectedValues.length - maxDisplay} more`;
  };

  // Close dropdown when clicking outside (desktop only)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Mobile bottom sheet component
  const MobileBottomSheet = () => {
    if (!isBottomSheetOpen || typeof window === 'undefined') return null;
    
    const handleDone = () => {
      setIsBottomSheetOpen(false);
    };
    
    return createPortal(
      <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/50 animate-in fade-in duration-200">
        <div 
          className="absolute inset-0" 
          onClick={() => setIsBottomSheetOpen(false)}
        />
        <div className="relative bg-white rounded-t-xl max-h-[80vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <button 
              onClick={() => setIsBottomSheetOpen(false)}
              className="px-2 text-gray-700"
            >
              Cancel
            </button>
            <h3 className="text-base font-medium">{label || placeholder}</h3>
            <button 
              onClick={handleDone}
              className="px-2 font-medium text-primary"
            >
              Done
            </button>
          </div>
          
          {/* Drag handle */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full" />
          
          {/* Content */}
          <div className="overflow-y-auto">
            {allOptions.map((option) => (
              <MobileMultipleSelectItem
                key={option.value}
                value={option.value}
                isSelected={selectedValues.includes(option.value)}
                onSelect={() => handleSelect(option.value)}
              >
                {option.label}
              </MobileMultipleSelectItem>
            ))}
          </div>
        </div>
      </div>,
      document.body
    );
  };

  // Mobile version
  if (isMobile) {
    return (
      <div className="flex flex-col w-full gap-1" {...props}>
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}

        <button
          type="button"
          onClick={() => !disabled && setIsBottomSheetOpen(true)}
          className={cn(
            'flex min-h-12 w-full items-center justify-between rounded-md border px-3 py-2',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-colors',
            isInvalid ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300',
            className
          )}
        >
          <div className="flex-1 text-left">
            <span className={selectedValues.length === 0 ? "text-gray-500" : ""}>
              {getSelectedLabels()}
            </span>
          </div>
          <HiChevronDown className="h-5 w-5 opacity-70" />
        </button>

        <MobileBottomSheet />

        {/* Helper text or error message */}
        {(isInvalid && errorMessage) || helperText ? (
          <p className={`mt-1 text-xs ${isInvalid ? 'text-red-500' : 'text-gray-500'}`}>
            {isInvalid ? errorMessage : helperText}
          </p>
        ) : null}
      </div>
    );
  }

  // Desktop version
  return (
    <div className="flex flex-col w-full gap-1" {...props}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative" ref={dropdownRef}>
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            'flex min-h-11 w-full flex-wrap items-center gap-1 rounded-md border px-3 py-2',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'cursor-pointer',
            'hover:border-gray-400 transition-colors',
            disabled ? 'cursor-not-allowed opacity-50' : '',
            isInvalid ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300',
            className
          )}
        >
          <div className="flex-1">
            <div className="flex flex-wrap gap-1.5">
              {selectedValues.length > 0 && selectedValues.length <= maxDisplay && (
                allOptions
                  .filter(option => selectedValues.includes(option.value))
                  .map(option => (
                    <span
                      key={option.value}
                      className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-sm"
                    >
                      {option.label}
                      {!disabled && (
                        <HiX
                          className="h-3.5 w-3.5 cursor-pointer text-gray-500 hover:text-gray-700"
                          onClick={(e) => handleRemoveValue(option.value, e)}
                        />
                      )}
                    </span>
                  ))
              )}
              {(selectedValues.length === 0 || selectedValues.length > maxDisplay) && (
                <span className={selectedValues.length === 0 ? "text-gray-500" : ""}>
                  {getSelectedLabels()}
                </span>
              )}
            </div>
          </div>
          <HiChevronDown className={`h-5 w-5 opacity-70 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {isOpen && !disabled && (
          <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg animate-in fade-in-80 zoom-in-95">
            <div className="p-1 max-h-60 overflow-y-auto">
              {children ? (
                // Render children with appropriate props
                React.Children.map(children, (child) => {
                  if (React.isValidElement(child) && child.type === MultipleSelectItem) {
                    const value = (child as React.ReactElement<MultipleSelectItemProps>).props.value;
                    return React.cloneElement(child as React.ReactElement<MultipleSelectItemProps>, {
                      isSelected: selectedValues.includes(value),
                      onClick: () => handleSelect(value)
                    });
                  }
                  return child;
                })
              ) : (
                // Render options from props
                allOptions.map((option) => (
                  <MultipleSelectItem
                    key={option.value}
                    value={option.value}
                    isSelected={selectedValues.includes(option.value)}
                    onClick={() => handleSelect(option.value)}
                  >
                    {option.label}
                  </MultipleSelectItem>
                ))
              )}
              {allOptions.length === 0 && !children && (
                <div className="py-2 px-3 text-sm text-gray-500">No options available</div>
              )}
            </div>
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
});

MultipleSelect.displayName = 'MultipleSelect';

export default MultipleSelect; 