'use client';

import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { AnimatePresence, motion, Variants } from "motion/react";
import { useOnClickOutside } from "usehooks-ts";
import { Tool } from "./types";

type Props = PropsWithChildren<{
  activeTool?: Tool | null
  tools: Tool[]
  onToolChange?: (toolId: string | null) => void
  titleClassName?: string
  contentClassName?: string
}>

const toolsVariants: Variants = {
  hidden: { y: 'calc(100% + 0.5rem)' },
  visible: { y: 0 }
}

const toolVariants: Variants = {
  hidden: {
    filter: 'blur(16px) opacity(0)',
    scaleX: 0.42,
    scaleY: 0.62,
    transition: {
      duration: 0.15,
      type: 'tween',
      ease: 'easeIn',
    },
  },
  visible: {
    filter: 'blur(0px) opacity(1)',
    scaleX: 1,
    scaleY: 1,
    transition: {
      when: 'beforeChildren',
      duration: 0.25,
    },
    transitionEnd: {
      scaleX: 1,
      scaleY: 1,
    }
  }
}

const contentVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.15,
    }
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.15,
      delay: 0.3,
    }
  }
}

export default function Toolbar({activeTool, tools, children, onToolChange, titleClassName, contentClassName}: Props) {
  const [currentActiveTool, setCurrentActiveTool] = useState<Tool | null>(activeTool ?? null);
  const ref = useRef<HTMLDivElement>(null as unknown as HTMLDivElement);

  const handleClickOutside = () => {
    setCurrentActiveTool(null);
  }

  const handleToolChange = (tool: Tool) => {
    const nextTool = tool.id === currentActiveTool?.id ? null : tool;
    setCurrentActiveTool(nextTool);
    onToolChange?.(nextTool?.id || null);
  }

  useOnClickOutside(ref, handleClickOutside);

  useEffect(() => {
    setCurrentActiveTool(activeTool ?? null);
  }, [activeTool]);

  return (
    <motion.div
      ref={ref}
      // className='fixed bottom-2 left-1/2 -translate-x-1/2 z-20'
      variants={toolsVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <div className='relative'>
        <div className='absolute bottom-1 left-1/2 -translate-x-1/2'>
          <AnimatePresence mode="wait">
            {currentActiveTool !== null && (
              <motion.div
                // key={activeTool.id}
                key='toolbar-content'
                className='flex flex-col gap-3 min-w-68 rounded-md bg-zinc-900/95 backdrop-blur-md text-zinc-100 shadow-xl origin-bottom'
                layoutId={`${currentActiveTool.id}-layout`} 
                variants={toolVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {currentActiveTool.label && (
                  <motion.h3 
                    className={cn("mb-2 px-6 py-3 text-lg text-[var(--kiwi-light)] border-b-1 border-zinc-700", titleClassName)}
                    key={`${currentActiveTool.id}-title`} 
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {currentActiveTool.label}
                  </motion.h3>
                )}
                <motion.div
                  key={`${currentActiveTool.id}-content`} 
                  className={cn("toolbar-height-container p-6 pt-0", contentClassName)}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  {children}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className='relative p-2 rounded-md bg-zinc-800 text-zinc-100 flex gap-2 items-center shadow-xl'>
        {tools.map((tool) => (
          <button
            key={tool.id}
            className={cn(
              'rounded-md py-2 px-2 flex items-center justify-center gap-1 cursor-pointer hover:bg-zinc-900 transition-colors',
              currentActiveTool?.id === tool.id && 'bg-zinc-900 text-[var(--kiwi-light)]'
            )}
            onClick={() => handleToolChange(tool)}
          >
            <div className="material-symbols-rounded">{tool.icon}</div>
            {tool.label && (
              <span className='text-xs hidden md:block'>{tool.label}</span>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  )
}