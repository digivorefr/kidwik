'use client'

import { forwardRef, ForwardedRef } from 'react'
import { cn } from '@/lib/utils/cn'
import styles from './Button.module.css'
import { ButtonProps } from './types'

function ChipButtonBase({
  children,
  isActive = false,
  className,
  disabled = false,
  type = 'button',
  ...props
}: ButtonProps & { isActive?: boolean }, ref: ForwardedRef<HTMLButtonElement>) {
  // Generate class names based on props
  const buttonClasses = cn(
    styles.btn,
    styles.btnChip,
    {
      [styles.active]: isActive,
    },
    className
  )

  return (
    <button
      className={buttonClasses}
      type={type}
      disabled={disabled}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
}

export const ChipButton = forwardRef(ChipButtonBase)
ChipButton.displayName = 'ChipButton'