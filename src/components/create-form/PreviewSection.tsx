'use client';

import CalendarPreview from '@/components/calendar/CalendarPreview'
import StickerSheet from '@/components/calendar/StickerSheet'
import CoverPage from '@/components/calendar/CoverPage'
import { PreviewSectionProps } from './types'
import { useState, useEffect } from 'react'
import {motion, Variants} from 'motion/react';
import { PreviewMode } from '@/app/create/types'

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    overflow: 'hidden',
  },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
    transitionEnd: {
      overflow: 'visible',
    },
  },
}

function PreviewSection({
  formData,
  childPhoto,
  themeClasses,
  weekDays,
}: PreviewSectionProps) {
  // Track current display state locally, initialized from formData
  const [currentView, setCurrentView] = useState<PreviewMode>(
    formData.options.previewMode || 'calendar'
  )

  // Sync with formData when it changes from outside
  useEffect(() => {
    if (formData.options.previewMode !== currentView) {
      setCurrentView(formData.options.previewMode || 'calendar')
    }
  }, [formData.options.previewMode, currentView])


  return (
    <div className="flex-auto flex flex-col p-3 md:p-6 gap-6 z-10">
      {/* Preview content */}
      <div className="space-y-8">
        <motion.div
          className="calendar-preview-container @container"
          variants={containerVariants}
          initial="hidden"
          animate={currentView === 'calendar' || currentView === 'all' ? 'visible' : 'hidden'}
        >
          <CalendarPreview
            weekDays={weekDays}
            themeClasses={themeClasses}
            backgroundImage={formData.backgroundImage}
            uppercaseWeekdays={formData.options.uppercaseWeekdays}
            dayMoments={formData.dayMoments}
          />
        </motion.div>
        <motion.div
          className="stickers-preview-container"
          variants={containerVariants}
          initial="hidden"
          animate={currentView === 'stickers' || currentView === 'all' ? 'visible' : 'hidden'}
        >
          <StickerSheet
            childPhoto={childPhoto}
            selectedActivities={formData.selectedActivities}
            themeClasses={themeClasses}
            stickerQuantities={formData.stickerQuantities}
          />
        </motion.div>

        {/* Cover page - hidden from UI but available for PDF */}
        <div className="hidden">
          <CoverPage themeClasses={themeClasses} />
        </div>
      </div>
    </div>
  )
}

export default PreviewSection