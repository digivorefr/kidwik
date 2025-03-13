'use client'

import { ReactNode, useMemo } from 'react'
import { motion, Variants } from 'motion/react'
import { MotionBaseProps } from './types'

type ScaleInProps = MotionBaseProps & {
  children: ReactNode
  className?: string
  from?: number
}

export function ScaleIn({
  children,
  className,
  delay = 0,
  duration = 0.7,
  from = 0.9,
  isOrchestrated = false
}: ScaleInProps) {
  
  const variants = useMemo<Variants>(() => ({
    hidden: { 
      opacity: 0, 
      scale: from,
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration,
        delay,
      }
    }
  }), [delay, duration, from]);
  
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