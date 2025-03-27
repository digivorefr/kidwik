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
    <div className="flex-auto flex flex-col p-6 gap-6 z-10">
      {currentView === 'calendar' && (
        <div 
          className="flex"
        >
          <div className="flex flex-col gap-3 px-6 py-4 bg-neutral-100 border border-neutral-50 rounded-lg mx-auto max-w-sm">
            <div className="flex items-center gap-1">
              <span className="material-symbols-rounded">palette</span>
              <span className="text-sm ml-1 font-medium">Apparence</span>
            </div>
            <p className="text-sm text-zinc-500">
              Choisissez une photo de fond et personnalisez l&apos;apparence de votre calendrier.
            </p>
          </div>
        </div>
      )}
      {currentView === 'stickers' && (
        <div className="flex">
          <div className="flex flex-col gap-3 px-6 py-4 bg-neutral-100 border border-neutral-50 rounded-lg mx-auto max-w-sm">
            <div className="flex items-center gap-1">
              <span className="material-symbols-rounded">apps</span>
              <span className="text-sm ml-1 font-medium">Gommettes</span>
            </div>
            <p className="text-sm text-zinc-500">
              Ajoutez une image au héros du calendrier puis créez les activités qu&apos;il devra affronter dans sa semaine.
            </p>
            <p className="text-zinc-500 flex items-start gap-1">
              <span className="flex-none material-symbols-rounded !text-[18px]/[18px]">info</span>
              <span className="text-xs">
                Concentrez-vous sur les moments importants et/ou qui vous semblent bloquants pour votre enfant.
              </span>
            </p>
            <p className="text-zinc-500 flex items-start gap-1">
              <span className="flex-none material-symbols-rounded !text-[18px]/[18px]">content_cut</span>
              <span className="text-xs">
                Une fois imprimées et découpées, les gommettes vous serviront à planifier avec votre enfant sa semaine.
              </span>
            </p>
            <p className="text-zinc-500 flex items-start gap-1">
              <span className="flex-none material-symbols-rounded !text-[18px]/[18px]">pan_tool_alt</span>
              <span className="text-xs">
                Chaque jour, votre enfant pourra déplacer sa gommette sur la bonne colonne pour visualiser les étapes de sa journée.
              </span>
            </p>
          </div>
        </div>
      )}
      {currentView === 'all' && (
        <div 
          className="flex"
        >
          <div className="flex flex-col gap-3 px-6 py-4 bg-neutral-100 border border-neutral-50 rounded-lg mx-auto max-w-sm">
            <div className="flex items-center gap-1">
              <span className="material-symbols-rounded">export_notes</span>
              <span className="text-sm ml-1 font-medium">Exportation</span>
            </div>
            <p className="text-sm text-zinc-500">
              Téléchargez votre calendrier en PDF pour l&apos;imprimer et l&apos;utiliser.
            </p>
            <p className="text-xs text-zinc-500 flex items-start gap-1">
              <span className="flex-none material-symbols-rounded !text-[18px]/[18px]">save</span>
              <span className="text-xs">
                Vous pouvez aussi l&apos;exporter pour pouvoir l&apos;utiliser sur un autre appareil.
              </span>
            </p>
          </div>
        </div>
      )}
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