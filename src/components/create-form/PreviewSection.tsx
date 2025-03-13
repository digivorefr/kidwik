import CalendarPreview from '@/components/calendar/CalendarPreview'
import StickerSheet from '@/components/calendar/StickerSheet'
import { PreviewSectionProps } from './types'
import { useState, useEffect } from 'react'

function PreviewSection({ 
  formData, 
  updateFormField, 
  childPhoto, 
  themeClasses, 
  weekDays 
}: PreviewSectionProps) {
  // Track current display state locally, initialized from formData
  const [currentView, setCurrentView] = useState<'calendar' | 'stickers'>(
    formData.options.previewMode || 'calendar'
  )
  
  // Sync with formData when it changes from outside
  useEffect(() => {
    if (formData.options.previewMode !== currentView) {
      setCurrentView(formData.options.previewMode || 'calendar')
    }
  }, [formData.options.previewMode, currentView])
  
  // Toggle handler to update both local state and form data
  const handleToggleView = (view: 'calendar' | 'stickers') => {
    setCurrentView(view)
    updateFormField('options', { ...formData.options, previewMode: view })
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Prévisualisation</h2>
      
      {/* Toggle between calendar and sticker sheet preview */}
      <div className="mb-6 flex border rounded overflow-hidden">
        <button 
          className={`flex-1 py-2 px-4 cursor-pointer ${currentView === 'calendar' ? 'bg-gray-800 text-white font-medium' : ''}`}
          onClick={() => handleToggleView('calendar')}
          data-preview-mode-toggle="calendar"
        >
          Calendrier
        </button>
        <button 
          className={`flex-1 py-2 px-4 cursor-pointer ${currentView === 'stickers' ? 'bg-gray-800 text-white font-medium' : ''}`}
          onClick={() => handleToggleView('stickers')}
          data-preview-mode-toggle="stickers"
        >
          Gommettes
        </button>
      </div>
      
      {/* Preview content */}
      <div>
        {currentView === 'calendar' ? (
          <div className="calendar-preview-container">
            <CalendarPreview 
              weekDays={weekDays} 
              themeClasses={themeClasses}
              backgroundImage={formData.backgroundImage}
            />
          </div>
        ) : (
          <div className="stickers-preview-container">
            <StickerSheet 
              childPhoto={childPhoto} 
              selectedActivities={formData.selectedActivities}
              themeClasses={themeClasses}
              stickerQuantities={formData.stickerQuantities}
            />
          </div>
        )}
      </div>
      
      <div className="print:hidden mt-4">
        <div className="text-xs text-gray-500 text-center">
          Format A4 paysage
        </div>
      </div>
      
      {/* Print-only section that includes both calendar and stickers */}
      <div className="hidden print:block mt-12 page-break-after-always">
        <CalendarPreview 
          weekDays={weekDays}
          themeClasses={themeClasses}
          backgroundImage={formData.backgroundImage}
        />
      </div>
      <div className="hidden print:block mt-12">
        <StickerSheet 
          childPhoto={childPhoto}
          selectedActivities={formData.selectedActivities}
          themeClasses={themeClasses}
          stickerQuantities={formData.stickerQuantities}
        />
      </div>
    </div>
  )
}

export default PreviewSection