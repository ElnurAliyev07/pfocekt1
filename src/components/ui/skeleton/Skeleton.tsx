'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Variant of the skeleton
   * @default 'default'
   */
  variant?: 'default' | 'circular' | 'rounded' | 'text'
  
  /**
   * Width of the skeleton
   */
  width?: string | number
  
  /**
   * Height of the skeleton
   */
  height?: string | number
  
  /**
   * Optional CSS class name
   */
  className?: string
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'default',
  width,
  height,
  className,
  ...props
}) => {
  // Set base styles based on variant
  const baseStyles = {
    default: 'rounded-md',
    circular: 'rounded-full',
    rounded: 'rounded-lg',
    text: 'rounded h-4',
  }

  const style: React.CSSProperties = {}
  
  // Add width and height if provided
  if (width) {
    style.width = typeof width === 'number' ? `${width}px` : width
  }
  
  if (height) {
    style.height = typeof height === 'number' ? `${height}px` : height
  }
  
  return (
    <div
      className={cn(
        'animate-pulse bg-gray-200 dark:bg-gray-700',
        baseStyles[variant],
        className
      )}
      style={style}
      {...props}
    />
  )
}

// Export variants for easier composition
const SkeletonCircle: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
  <Skeleton variant="circular" {...props} />
)

const SkeletonText: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
  <Skeleton variant="text" {...props} />
)

const SkeletonButton: React.FC<Omit<SkeletonProps, 'variant'>> = (props) => (
  <Skeleton 
    variant="rounded" 
    height={props.height || 36} 
    {...props} 
    className={cn('rounded-md', props.className)}
  />
)

// Export components
export { Skeleton, SkeletonCircle, SkeletonText, SkeletonButton }
