'use client'

import { ReactNode, useMemo } from 'react'
import { MotionBaseProps } from './types'
import { motion, Variants } from 'motion/react'

type FadeInProps = MotionBaseProps & {
  children: ReactNode
  className?: string
  from?: number
}

export function FadeIn({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  from = 0,
  isOrchestrated = false
}: FadeInProps) {

  const variants = useMemo<Variants>(() => ({
    hidden: { opacity: from },
    visible: { 
      opacity: 1,
      transition: {
        duration,
        delay,
      }
    }
  }), [delay, duration, from])

  
  return (
    <motion.div 
      className={className}
      initial="hidden"
      animate={!isOrchestrated ? "visible" : undefined}
      exit="hidden"
      variants={variants}
    >
      {children}
    </motion.div>
  )
} 