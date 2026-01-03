'use client';

import React from 'react';

interface ModalContentProps {
  children: ((onClose: () => void) => React.ReactNode) | React.ReactNode;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const ModalContent: React.FC<ModalContentProps> = ({ children, onClose, className = '', style }) => {
  return (
    <div aria-description='modal-content' aria-describedby='modal-describe' className={`w-full ${className}`} style={style}>
      {typeof children === 'function' ? children(onClose || (() => {})) : children}
    </div>
  );
};

interface ModalSectionProps {
  children: React.ReactNode;
  className?: string;
  bordered?: boolean;
}

export const ModalHeader: React.FC<ModalSectionProps> = ({ 
  children, 
  className = '',
  bordered = true 
}) => {
  return (
    <div id="modal-title" className={`px-4 py-3 md:px-6 md:py-4 ${bordered ? 'border-b border-gray-200' : ''} ${className}`}>
      <h3 className="text-lg font-medium">{children}</h3>
    </div>
  );
};

export const ModalBody: React.FC<ModalSectionProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <div className={`px-4 py-4 md:px-6 md:py-5 overflow-auto max-h-[70vh] ${className}`}>
      {children}
    </div>
  );
};

export const ModalFooter: React.FC<ModalSectionProps> = ({ 
  children, 
  className = '',
  bordered = true 
}) => {
  return (
    <div className={`px-4 space-x-2 py-3 md:px-6 md:py-4 ${bordered ? 'border-t border-gray-200' : ''} ${className}`}>
      {children}
    </div>
  );
}; 