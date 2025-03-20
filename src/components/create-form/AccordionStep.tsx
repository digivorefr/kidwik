'use client'

import { ReactNode, useRef } from 'react'
import { motion, Variants } from 'motion/react'
import { Button } from '@/components/ui/Button'

interface AccordionStepProps {
  step: number
  currentStep: number
  title: string
  onStepChange: (step: number) => void
  children: ReactNode
  scrollOnChange?: boolean
}

// Animation variants for the step container
const stepVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: (isSelected: boolean) => ({
    opacity: 1,
    backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0)',
  }),
}

// Animation variants for the content
const stepContentVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    overflow: 'hidden',
  },
  visible: {
    opacity: 1,
    height: 'auto',
    transitionEnd: {
      overflow: 'visible',
    }
  }
}

export default function AccordionStep({
  step,
  currentStep,
  title,
  onStepChange,
  children,
  scrollOnChange = true
}: AccordionStepProps) {
  const isActive = currentStep === step
  const stepRef = useRef<HTMLDivElement>(null)

  const handleStepChange = () => {
    // Ne fait rien si l'étape est déjà active
    if (isActive) return

    // Scroll vers le haut si l'option est activée
    if (scrollOnChange) {
      // Faire défiler vers le haut de la page avec une animation fluide
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })

      // Attendre que le défilement soit terminé avant de changer d'étape
      // En général, une animation de défilement dure environ 500-1000ms
      setTimeout(() => {
        // Appelle le changement d'étape après le défilement
        onStepChange(step)
      }, 600)
    } else {
      // Changement d'étape immédiat si scrollOnChange est désactivé
      onStepChange(step)
    }
  }

  return (
    <motion.div
      ref={stepRef}
      key={`step-${step}`}
      data-step={step}
      className='rounded-2xl mb-4'
      variants={stepVariants}
      initial="initial"
      animate="animate"
      custom={isActive}
    >
      <Button
        onClick={handleStepChange}
        variant="text"
        className="w-full text-left border border-transparent flex space-between items-center"
      >
        <span className='flex-auto text-left px-4'>{title}</span>
        <motion.span
          className='flex-none'
          key={`step-${step}-arrow`}
          animate={{
            rotate: isActive ? 90 : 0,
          }}
        >
          &rarr;
        </motion.span>
      </Button>
      <motion.div
        variants={stepContentVariants}
        key={`step-${step}-content`}
        initial="hidden"
        animate={isActive ? 'visible' : 'hidden'}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}