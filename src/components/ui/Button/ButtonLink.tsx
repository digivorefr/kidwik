'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils/cn'
import styles from './Button.module.css'
import { ButtonLinkProps } from './types'

export function ButtonLink({
  children,
  href,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  disabled = false,
  ...props
}: ButtonLinkProps) {
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

  // If disabled, render a button element instead of a link
  if (disabled || isLoading) {
    return (
      <button
        className={buttonClasses}
        disabled
        aria-disabled="true"
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

  return (
    <Link
      href={href}
      className={buttonClasses}
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
    </Link>
  )
}