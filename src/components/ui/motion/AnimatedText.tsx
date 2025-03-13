'use client'

import { ReactNode, useMemo, useRef } from 'react'
import { MotionBaseProps } from './types'
import { motion, Variants } from 'motion/react'

type AnimatedTextProps = MotionBaseProps & {
  children: ReactNode
  className?: string
  from?: number
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div'
}

export function AnimatedText({
  children,
  className = '',
  delay = 0,
  tag = 'div',
  duration = 0.5,
  from = 0,
  isOrchestrated = false
}: AnimatedTextProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  
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
  
  const content = useMemo(() => {

    const props = {
      className,
      initial: 'hidden',
      animate: isOrchestrated ? undefined : 'visible',
      exit: 'hidden',
      variants,
    }
    switch (tag) {
      case 'h1': return <motion.h1 {...props}>{children}</motion.h1>
      case 'h2': return <motion.h2 {...props}>{children}</motion.h2>
      case 'h3': return <motion.h3 {...props}>{children}</motion.h3>
      case 'h4': return <motion.h4 {...props}>{children}</motion.h4>
      case 'h5': return <motion.h5 {...props}>{children}</motion.h5>
      case 'h6': return <motion.h6 {...props}>{children}</motion.h6>
      case 'p': return <motion.p {...props}>{children}</motion.p>
      case 'span': return <motion.span {...props}>{children}</motion.span>
      default: return <motion.div {...props}>{children}</motion.div>
    }
  }, [children, className, isOrchestrated, tag, variants]);
  
  return (
    <div ref={elementRef} style={{ opacity: 0 }}>
      {content}
    </div>
  )
} 