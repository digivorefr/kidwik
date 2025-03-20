import { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { LinkProps } from 'next/link'

export type ButtonVariant =
  | 'primary'    // Main call-to-action buttons
  | 'secondary'  // Alternative actions
  | 'outline'    // Less prominent actions
  | 'text'       // Minimal visual impact
  | 'danger'     // Destructive actions
  | 'icon'       // Icon-only buttons
  | 'chip'       // Small pill-shaped filter buttons
  | 'color'      // Color selection buttons

export type ButtonSize =
  | 'sm'    // Small
  | 'md'    // Medium (default)
  | 'lg'    // Large

// Base button props
export interface ButtonBaseProps {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
  className?: string
  isActive?: boolean     // For toggle buttons, chips, etc.
}

// Regular button props
export type ButtonProps = ButtonBaseProps & ComponentPropsWithoutRef<'button'>

// Link button props
export type ButtonLinkProps = ButtonBaseProps &
  LinkProps & {
    className?: string
    children: ReactNode
    // HTML attributes for anchor element that aren't covered by LinkProps
    [key: string]: unknown
  }

// Icon button props
export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon'> {
  icon: ReactNode
  ariaLabel: string
}

// Color button props
export interface ColorButtonProps extends Omit<ButtonProps, 'variant'> {
  colorClass: string
  colorName: string
  isSelected?: boolean
}

// Polymorphic button props for more advanced use cases
export type PolymorphicButtonProps<C extends ElementType> = ButtonBaseProps &
  ComponentPropsWithoutRef<C> & {
    as?: C
  }