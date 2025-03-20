'use client'

import { forwardRef, ForwardedRef } from 'react'
import { cn } from '@/lib/utils/cn'
import styles from './Button.module.css'
import { IconButtonProps } from './types'

function IconButtonBase({
  icon,
  ariaLabel,
  size = 'md',
  className,
  disabled = false,
  type = 'button',
  ...props
}: IconButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
  // Generate class names based on props
  const buttonClasses = cn(
    styles.btn,
    styles.btnIcon,
    {
      [styles.btnIconSm]: size === 'sm',
      [styles.btnIconMd]: size === 'md',
      [styles.btnIconLg]: size === 'lg',
    },
    className
  )

  return (
    <button
      className={buttonClasses}
      type={type}
      disabled={disabled}
      aria-label={ariaLabel}
      ref={ref}
      {...props}
    >
      {icon}
    </button>
  )
}

export const IconButton = forwardRef(IconButtonBase)
IconButton.displayName = 'IconButton'