'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  children: React.ReactNode;
  placement?: 'center' | 'top-center' | 'bottom-center';
  className?: string;
  isDismissable?: boolean;
  hideCloseButton?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  title?: string;
}

export const useDisclosure = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const onOpen = React.useCallback(() => setIsOpen(true), []);
  const onOpenChange = React.useCallback(() => setIsOpen((prev) => !prev), []);
  const onClose = React.useCallback(() => setIsOpen(false), []);
  
  return { isOpen, onOpen, onOpenChange, onClose };
};

const Modal = React.forwardRef<HTMLDivElement, ModalProps>(({
  isOpen,
  onOpenChange,
  children,
  placement = 'center',
  className = '',
  isDismissable = true,
  hideCloseButton = false,
  size = 'md',
  title = 'Modal',
}, ref) => {
  const [mounted, setMounted] = React.useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getModalSizeClasses = React.useCallback(() => {
    const sizeClasses = {
      xs: 'max-w-xs',
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl',
      '5xl': 'max-w-5xl',
      '6xl': 'max-w-6xl',
      full: 'max-w-full m-4',
    };
    return sizeClasses[size] || sizeClasses.md;
  }, [size]);

  const getPlacementClasses = React.useCallback(() => {
    const placementClasses = {
      'top-center': 'items-start justify-center pt-16',
      'bottom-center': 'items-end justify-center pb-16',
      center: 'items-center justify-center',
    };
    return placementClasses[placement] || placementClasses.center;
  }, [placement]);

  if (!mounted) return null;

  return (
    <Dialog.Root 
      open={isOpen} 
      onOpenChange={isDismissable ? onOpenChange : undefined}
    >
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className={cn(
                  'fixed inset-0 z-50 flex',
                  getPlacementClasses()
                )}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  ref={modalRef}
                  data-modal-content
                  className={cn(
                    'relative mx-auto bg-white rounded-lg shadow-xl',
                    getModalSizeClasses(),
                    'w-full',
                    className
                  )}
                >
                  <Dialog.Title className="sr-only">
                    {title}
                  </Dialog.Title>
                  {!hideCloseButton && isDismissable && (
                    <Dialog.Close asChild>
                      <button
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 z-10"
                        aria-label="Close modal"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </Dialog.Close>
                  )}
                  {children}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
});

Modal.displayName = 'Modal';

export default Modal; 