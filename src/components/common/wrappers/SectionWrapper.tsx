import React, { ReactNode } from 'react';
import {
  AiOutlineClockCircle,
  AiOutlineLock,
  AiOutlineExclamationCircle,
  AiOutlineLoading3Quarters,
  AiOutlineRocket,
  AiOutlineEye,
  AiOutlineTool,
  AiOutlineCrown,
  AiOutlineHeart,
  AiOutlineFire,
} from 'react-icons/ai';

interface SectionWrapperProps {
  children: ReactNode;
  disabled?: boolean;
  message?: string;
  className?: string;
  containerClassName?: string;
  overlayClassName?: string;
  messageClassName?: string;
  overlayOpacity?: number;
  blurBackground?: boolean;
  showSpinner?: boolean;
  spinnerSize?: 'sm' | 'md' | 'lg';
  position?: 'center' | 'top' | 'bottom';
  animationType?: 'fade' | 'slide' | 'scale' | 'none';
  customIcon?: ReactNode;
  onOverlayClick?: () => void;
  variant?:
    | 'coming-soon'
    | 'loading'
    | 'locked'
    | 'maintenance'
    | 'premium'
    | 'error'
    | 'preview'
    | 'development'
    | 'vip'
    | 'beta';
  showDefaultIcon?: boolean;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  children,
  disabled = false,
  message,
  className = '',
  containerClassName = '',
  overlayClassName = '',
  messageClassName = '',
  overlayOpacity = 85,
  blurBackground = true,
  showSpinner = false,
  spinnerSize = 'md',
  position = 'center',
  animationType = 'fade',
  customIcon,
  onOverlayClick,
  variant = 'coming-soon',
  showDefaultIcon = true,
}) => {
  const variantConfig = {
    'coming-soon': {
      icon: AiOutlineClockCircle,
      message: 'Tezliklə...',
      iconColor: 'text-blue-600',
      bgGradient: 'bg-white/40',
      borderColor: 'border-blue-100',
      textColor: 'text-blue-700',
      glowColor: 'shadow-blue-100',
      spin: false,
    },
    loading: {
      icon: AiOutlineLoading3Quarters,
      message: 'Yükleniyor...',
      iconColor: 'text-purple-500',
      bgGradient: 'from-purple-50 via-purple-100 to-pink-100',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-800',
      glowColor: 'shadow-purple-200',
      spin: true,
    },
    locked: {
      icon: AiOutlineLock,
      message: 'Erişim Kısıtlı',
      iconColor: 'text-orange-500',
      bgGradient: 'from-orange-50 via-orange-100 to-yellow-100',
      borderColor: 'border-orange-200',
      textColor: 'text-orange-800',
      glowColor: 'shadow-orange-200',
      spin: false,
    },
    maintenance: {
      icon: AiOutlineTool,
      message: 'Bakım Modunda',
      iconColor: 'text-gray-500',
      bgGradient: 'from-gray-50 via-gray-100 to-slate-100',
      borderColor: 'border-gray-200',
      textColor: 'text-gray-800',
      glowColor: 'shadow-gray-200',
      spin: false,
    },
    premium: {
      icon: AiOutlineCrown,
      message: 'Premium Özellik',
      iconColor: 'text-yellow-500',
      bgGradient: 'from-yellow-50 via-yellow-100 to-amber-100',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      glowColor: 'shadow-yellow-200',
      spin: false,
    },
    error: {
      icon: AiOutlineExclamationCircle,
      message: 'Geçici Olarak Kullanılamıyor',
      iconColor: 'text-red-500',
      bgGradient: 'from-red-50 via-red-100 to-rose-100',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      glowColor: 'shadow-red-200',
      spin: false,
    },
    preview: {
      icon: AiOutlineEye,
      message: 'Önizleme Modu',
      iconColor: 'text-teal-500',
      bgGradient: 'from-teal-50 via-teal-100 to-cyan-100',
      borderColor: 'border-teal-200',
      textColor: 'text-teal-800',
      glowColor: 'shadow-teal-200',
      spin: false,
    },
    development: {
      icon: AiOutlineRocket,
      message: 'Geliştirme Aşamasında',
      iconColor: 'text-indigo-500',
      bgGradient: 'from-indigo-50 via-indigo-100 to-blue-100',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-800',
      glowColor: 'shadow-indigo-200',
      spin: false,
    },
    vip: {
      icon: AiOutlineHeart,
      message: 'VIP Üyeler İçin',
      iconColor: 'text-pink-500',
      bgGradient: 'from-pink-50 via-pink-100 to-rose-100',
      borderColor: 'border-pink-200',
      textColor: 'text-pink-800',
      glowColor: 'shadow-pink-200',
      spin: false,
    },
    beta: {
      icon: AiOutlineFire,
      message: 'Beta Sürümü',
      iconColor: 'text-emerald-500',
      bgGradient: 'from-emerald-50 via-emerald-100 to-green-100',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-800',
      glowColor: 'shadow-emerald-200',
      spin: false,
    },
  };

  const config = variantConfig[variant];
  const IconComponent = config.icon;
  const displayMessage = message || config.message;

  const iconSizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const positionClasses = {
    center: 'items-center justify-center',
    top: 'items-start justify-center pt-12',
    bottom: 'items-end justify-center pb-12',
  };

  const animationClasses = {
    fade: 'transition-all duration-500 ease-in-out opacity-100',
    slide: 'transition-all duration-500 ease-in-out transform translate-y-0',
    scale: 'transition-all duration-500 ease-in-out transform scale-100',
    none: '',
  };

  const overlayBgClasses = cn(
    'absolute inset-0 z-10 flex rounded-lg',
    blurBackground ? 'backdrop-blur-[1px]' : '',
    'bg-white/30 dark:bg-gray-900/30',
    'shadow-lg',
    positionClasses[position],
    animationClasses[animationType],
    overlayClassName
  );

  // Always keep content more visible, minimum opacity of 0.9 regardless of variant
  const contentOpacity = disabled ? Math.max(0.9, (100 - overlayOpacity) / 100) : 1;

  return (
    <div className={cn('relative', containerClassName)}>
      <div
        className={cn(disabled ? 'pointer-events-none' : '', className)}
        style={{
          opacity: contentOpacity,
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        {children}
      </div>

      {disabled && (
        <div className={overlayBgClasses} onClick={onOverlayClick}>
          <div className="flex items-center justify-center h-full w-full">
            <div className="flex items-center space-x-3 px-4 py-2 bg-white/40 backdrop-blur-sm rounded-full">
              {showDefaultIcon && !customIcon && (
                <IconComponent
                  className={cn(
                    variant === 'coming-soon' ? 'w-8 h-8' : iconSizeClasses[spinnerSize],
                    'text-blue-600',
                    config.spin ? 'animate-spin' : ''
                  )}
                />
              )}
              
              {customIcon && customIcon}
              
              {showSpinner && !customIcon && !showDefaultIcon && (
                <div
                  className={cn(
                    'animate-spin rounded-full border-3 border-blue-600 border-t-transparent',
                    iconSizeClasses[spinnerSize]
                  )}
                />
              )}
              
              <span className={cn(
                'font-medium text-lg text-blue-700',
                messageClassName
              )}>
                {displayMessage}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionWrapper;


// Utility function for combining class names (if not available)
// You can replace this with your preferred class name utility
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}