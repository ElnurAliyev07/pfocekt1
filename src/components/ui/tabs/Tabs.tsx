'use client';

import React, { createContext, useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Context to manage selected tab
interface TabsContextProps {
  selectedKey: string;
  setSelectedKey: (key: string) => void;
  variant: 'underline' | 'solid' | 'bordered';
}

const TabsContext = createContext<TabsContextProps | undefined>(undefined);

// Tabs Component
interface TabsProps {
  children: React.ReactNode;
  selectedKey?: string;
  defaultSelectedKey?: string;
  onSelectionChange?: (key: string) => void;
  variant?: 'underline' | 'solid' | 'bordered';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  children,
  selectedKey: controlledSelectedKey,
  defaultSelectedKey = '',
  onSelectionChange,
  variant = 'underline',
  className = '',
}) => {
  // Support both controlled and uncontrolled modes
  const [internalSelectedKey, setInternalSelectedKey] = useState(defaultSelectedKey);
  const selectedKey = controlledSelectedKey !== undefined ? controlledSelectedKey : internalSelectedKey;

  const setSelectedKey = (key: string) => {
    if (controlledSelectedKey === undefined) {
      setInternalSelectedKey(key);
    }
    onSelectionChange?.(key);
  };

  return (
    <TabsContext.Provider value={{ selectedKey, setSelectedKey, variant }}>
      <div className={`w-full ${className}`}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// TabList Component
interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export const TabList: React.FC<TabListProps> = ({ children, className = '' }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabList must be used within a Tabs component');

  const { variant } = context;

  // Apply different styles based on variant
  const variantClasses = {
    underline: 'border-b border-gray-200',
    solid: 'bg-gray-100 p-1 rounded-lg',
    bordered: 'border border-gray-200 rounded-lg p-1',
  };

  return (
    <div className={cn('flex', variantClasses[variant], className)}>
      {children}
    </div>
  );
};

// Tab Component
interface TabProps {
  children: React.ReactNode;
  key?: string;
  id: string;
  disabled?: boolean;
  className?: string;
}

export const Tab: React.FC<TabProps> = ({ children, id, disabled = false, className = '' }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tab must be used within a Tabs component');

  const { selectedKey, setSelectedKey, variant } = context;
  const isSelected = selectedKey === id;

  const handleClick = () => {
    if (!disabled) {
      setSelectedKey(id);
    }
  };

  // Styles for different variants
  const getTabStyles = () => {
    const baseStyles = 'px-4 py-2 text-sm font-medium transition-colors relative cursor-pointer';
    
    if (disabled) {
      return `${baseStyles} text-gray-400 cursor-not-allowed`;
    }

    switch (variant) {
      case 'underline':
        return cn(
          baseStyles,
          isSelected 
            ? 'text-primary' 
            : 'text-gray-600 hover:text-gray-900'
        );
      case 'solid':
        return cn(
          baseStyles,
          'rounded-md',
          isSelected 
            ? 'bg-white text-primary shadow-xs' 
            : 'text-gray-600 hover:text-gray-900'
        );
      case 'bordered':
        return cn(
          baseStyles,
          'rounded-md',
          isSelected 
            ? 'bg-primary/10 text-primary' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        );
      default:
        return baseStyles;
    }
  };

  return (
    <div
      role="tab"
      aria-selected={isSelected}
      aria-disabled={disabled}
      onClick={handleClick}
      className={cn(getTabStyles(), className)}
    >
      {children}
      
      {/* Animated underline for underline variant */}
      {variant === 'underline' && isSelected && (
        <motion.div
          className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"
          layoutId="tab-underline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </div>
  );
};

// TabPanels Container
interface TabPanelsProps {
  children: React.ReactNode;
  className?: string;
}

export const TabPanels: React.FC<TabPanelsProps> = ({ children, className = '' }) => {
  return (
    <div className={cn('mt-4', className)}>
      {children}
    </div>
  );
};

// TabPanel Component
interface TabPanelProps {
  children: React.ReactNode;
  id: string;
  className?: string;
}

export const TabPanel: React.FC<TabPanelProps> = ({ children, id, className = '' }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabPanel must be used within a Tabs component');

  const { selectedKey } = context;
  const isSelected = selectedKey === id;

  if (!isSelected) return null;

  return (
    <div
      role="tabpanel"
      className={cn('focus:outline-hidden', className)}
    >
      {children}
    </div>
  );
}; 