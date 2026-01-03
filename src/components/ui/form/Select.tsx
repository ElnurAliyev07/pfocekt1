'use client';

import React, { forwardRef } from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import { HiCheck, HiChevronDown, HiX } from 'react-icons/hi';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectItemProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  value: string;
  children?: React.ReactNode;
}

export const SelectItem = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectItemProps
>(({ children, className, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-default select-none items-center rounded-md py-2.5 pl-8 pr-2 text-base outline-none transition-colors',
      'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      'data-[highlighted]:bg-gray-100 data-[state=checked]:bg-primary/10',
      'active:bg-gray-100',
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <HiCheck className="h-4 w-4 text-primary" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));

SelectItem.displayName = 'SelectItem';

export interface SelectProps extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  isInvalid?: boolean;
  helperText?: string;
  options?: SelectOption[];
  className?: string;
  containerClassName?: string;
  resetable?: boolean;
  defaultValue?: string;
  valueClassName?: string; // Custom class for the value display
}

const Select = forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectProps
>(({ 
  label,
  placeholder = 'Seçin',
  errorMessage,
  isInvalid = false,
  helperText,
  className,
  containerClassName,
  children,
  options = [],
  value,
  defaultValue,
  onValueChange,
  resetable = true,
  valueClassName,
  ...props
}, ref) => {
  return (
    <div className={cn("flex flex-col w-full gap-1", containerClassName)}>
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <SelectPrimitive.Root 
        value={value} 
        defaultValue={defaultValue}
        onValueChange={onValueChange} 
        {...props}
      >
        <SelectPrimitive.Trigger
          ref={ref}
          className={cn(
            'flex h-11 w-full items-center justify-between rounded-md border px-3',
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'hover:border-gray-400 transition-colors',
            isInvalid ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-300',
            className
          )}
        >
          <span className={cn("block max-w-[140px] truncate whitespace-nowrap overflow-hidden text-ellipsis", valueClassName)}>
            <SelectPrimitive.Value placeholder={placeholder} className={valueClassName} />
          </span>
          <div className="flex items-center gap-2">
            <SelectPrimitive.Icon asChild>
              <HiChevronDown className="h-5 w-5 opacity-70 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </SelectPrimitive.Icon>
          </div>
        </SelectPrimitive.Trigger>

        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="relative z-50 min-w-[180px] w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg animate-in fade-in-80 zoom-in-95"
            position="popper"
            sideOffset={5}
            align="center"
          >
            <SelectPrimitive.ScrollUpButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
              <div className="h-0.5 w-5 bg-gray-300 rounded-full" />
            </SelectPrimitive.ScrollUpButton>
            
            <SelectPrimitive.Viewport className="p-1 max-h-60 overflow-y-auto">
              {resetable && (value || defaultValue) && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onValueChange?.('');
                  }}
                  className="w-full flex items-center gap-2 px-2 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <HiX className="h-4 w-4" />
                  <span>Sıfırla</span>
                </button>
              )}
              {options.length > 0 ? (
                options.map((option) => (
                  <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                    {option.label}
                  </SelectItem>
                ))
              ) : (
                children
              )}
            </SelectPrimitive.Viewport>
            
            <SelectPrimitive.ScrollDownButton className="flex items-center justify-center h-6 bg-white text-gray-700 cursor-default">
              <div className="h-0.5 w-5 bg-gray-300 rounded-full" />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      {/* Helper text or error message */}
      {(isInvalid && errorMessage) || helperText ? (
        <p className={`mt-1 text-xs ${isInvalid ? 'text-red-500' : 'text-gray-500'}`}>
          {isInvalid ? errorMessage : helperText}
        </p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';

export default Select; 