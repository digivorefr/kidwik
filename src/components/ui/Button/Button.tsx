'use client'

import { forwardRef, ForwardedRef } from 'react'
import { cn } from '@/lib/utils/cn'
import styles from './Button.module.css'
import { ButtonProps } from './types'

function ButtonBase({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  disabled = false,
  type = 'button',
  ...props
}: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
  // Generate class names based on props
  const buttonClasses = cn(
    styles.btn,
    {
      [styles.btnSm]: size === 'sm',
      [styles.btnMd]: size === 'md',
      [styles.btnLg]: size === 'lg',
      [styles.btnPrimary]: variant === 'primary',
      [styles.btnSecondary]: variant === 'secondary',
      [styles.btnOutline]: variant === 'outline',
      [styles.btnText]: variant === 'text',
      [styles.btnDanger]: variant === 'danger',
      [styles.fullWidth]: fullWidth,
      [styles.isLoading]: isLoading
    },
    className
  )

  return (
    <button
      className={buttonClasses}
      type={type}
      disabled={disabled || isLoading}
      ref={ref}
      {...props}
    >
      {isLoading && (
        <span className={styles.spinner} aria-hidden="true" />
      )}
      {!isLoading && leftIcon && (
        <span className={styles.leftIcon}>{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && (
        <span className={styles.rightIcon}>{rightIcon}</span>
      )}
    </button>
  )
}

// Create the forwarded ref component
export const Button = forwardRef(ButtonBase)
Button.displayName = 'Button'