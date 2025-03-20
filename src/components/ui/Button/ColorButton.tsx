'use client'

import { forwardRef, ForwardedRef } from 'react'
import { cn } from '@/lib/utils/cn'
import styles from './Button.module.css'
import { ColorButtonProps } from './types'

function ColorButtonBase({
  colorClass,
  colorName,
  isSelected = false,
  className,
  disabled = false,
  type = 'button',
  ...props
}: ColorButtonProps, ref: ForwardedRef<HTMLButtonElement>) {
  // Generate class names based on props
  const buttonClasses = cn(
    styles.btn,
    styles.btnColor,
    colorClass,
    {
      [styles.selected]: isSelected,
    },
    className
  )

  return (
    <button
      className={buttonClasses}
      type={type}
      disabled={disabled}
      aria-label={`Thème ${colorName}`}
      ref={ref}
      {...props}
    />
  )
}

export const ColorButton = forwardRef(ColorButtonBase)
ColorButton.displayName = 'ColorButton'