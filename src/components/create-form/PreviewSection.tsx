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
  updateFormField, 
  childPhoto, 
  themeClasses, 
  weekDays 
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
  
  // Toggle handler to update both local state and form data
  const handleToggleView = (view: PreviewMode) => {
    setCurrentView(view)
    updateFormField('options', { ...formData.options, previewMode: view })
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Header with title and toggle buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-xl font-semibold mb-4 sm:mb-0">Prévisualisation</h2>
        
        {/* Toggle buttons for preview modes */}
        <div className="flex rounded-full bg-[var(--kiwi-dark)] p-0.5 self-center sm:self-auto">
          <button 
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
              currentView === 'calendar' 
                ? 'bg-white text-[var(--kiwi-darker)]' 
                : 'text-white'
            }`}
            onClick={() => handleToggleView('calendar')}
            data-preview-mode-toggle="calendar"
          >
            Calendrier
          </button>
          <button 
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
              currentView === 'stickers' 
                ? 'bg-white text-[var(--kiwi-darker)]' 
                : 'text-white'
            }`}
            onClick={() => handleToggleView('stickers')}
            data-preview-mode-toggle="stickers"
          >
            Gommettes
          </button>
          <button 
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
              currentView === 'all' 
                ? 'bg-white text-[var(--kiwi-darker)]' 
                : 'text-white'
            }`}
            onClick={() => handleToggleView('all')}
            data-preview-mode-toggle="all"
          >
            Tout
          </button>
        </div>
      </div>
      
      {/* Preview content */}
      <div className="space-y-8">
        <motion.div 
          className="calendar-preview-container"
          variants={containerVariants}
          initial="hidden"
          animate={currentView === 'calendar' || currentView === 'all' ? 'visible' : 'hidden'}
        >
          <CalendarPreview 
            weekDays={weekDays} 
            themeClasses={themeClasses}
            backgroundImage={formData.backgroundImage}
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
      
      <div className="print:hidden mt-4">
        <div className="text-xs text-gray-500 text-center">
          Format A4 paysage
        </div>
      </div>
    </div>
  )
}

export default PreviewSection