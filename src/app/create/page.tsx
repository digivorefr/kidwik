'use client'

import { useState, ChangeEvent, useCallback, useEffect, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FadeIn } from '@/components/ui/motion'
import {
  CalendarFormData,
  DEFAULT_FORM_DATA,
  Activity,
  PreviewMode
} from './types'
import { ProcessedImageEvent } from '@/components/create-form/types'

// Import the extracted components
import { getThemeClasses } from '@/components/calendar/types'
import PreviewSection from '@/components/create-form/PreviewSection'
import useCalendarStore from '@/lib/store/calendar-store'
import { ChipButton } from '@/components/ui/Button'
import { AnimatePresence } from 'motion/react'
import CalendarToolbar from '@/components/ui/toolbar/CalendarToolbar'
import StickerToolbar from '@/components/ui/toolbar/StickerToolbar'
import FinalToolbar from '@/components/ui/toolbar/FinalToolbar'

// Loading component to show while suspended
function CalendarEditorLoading() {
  return (
    <main className="flex-grow container mx-auto p-8 flex items-center justify-center">
      <div className="text-center">
        <svg className="animate-spin h-12 w-12 text-[var(--kiwi-dark)] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg">Loading calendar editor...</p>
      </div>
    </main>
  );
}

function CreateCalendarContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const calendarId = searchParams.get('id')

  const [formData, setFormData] = useState<CalendarFormData>(DEFAULT_FORM_DATA)
  const [childPhoto, setChildPhoto] = useState<string | null>(null)
  const [calendarName, setCalendarName] = useState<string>('Mon calendrier')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const { loadCalendar, saveCurrentCalendar, setCurrentCalendarId } = useCalendarStore()

  // Helper functions for form updates
  const updateFormField = useCallback((field: keyof CalendarFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

  // État pour suivre si l'utilisateur a modifié manuellement le mode de prévisualisation
  const userModifiedPreviewMode = useRef(false)

  // Charge le calendrier existant ou redirige vers la page de création
  useEffect(() => {
    const loadExistingCalendar = async () => {
      if (!calendarId) {
        // Rediriger vers la page de création d'un nouveau calendrier
        router.replace('/create/new')
        return
      }

      try {
        // Charger le calendrier existant avec l'ID fourni
        const calendar = await loadCalendar(calendarId)
        if (calendar) {
          setFormData(calendar.formData)
          setChildPhoto(calendar.childPhoto)
          setCalendarName(calendar.meta.name)
          setCurrentCalendarId(calendarId)
        } else {
          console.error(`Calendrier non trouvé: ${calendarId}`)
          router.replace('/create/new')
          return
        }
      } catch (error) {
        console.error('Erreur lors du chargement du calendrier:', error)
        router.replace('/create/new')
        return
      } finally {
        setIsLoading(false)
      }
    }

    loadExistingCalendar()
  }, [calendarId, loadCalendar, router, setCurrentCalendarId, searchParams])

  // Sauvegarde automatique lors des modifications
  useEffect(() => {
    // Ne pas sauvegarder si nous sommes toujours en chargement initial
    if (isLoading || !calendarId) return;

    // Sauvegarde avec debounce pour éviter trop d'écritures
    const saveCalendarDebounced = setTimeout(async () => {
      try {
        // Référence à l'élément de prévisualisation pour générer une miniature
        const previewElement = document.querySelector('.calendar-preview-container') as HTMLElement

        const result = await saveCurrentCalendar(calendarId, formData, childPhoto, previewElement, calendarName);

        if (!result) {
          console.error(`Échec de la sauvegarde automatique pour le calendrier: ${calendarId}`);
        }
      } catch (err) {
        console.error('Erreur lors de la sauvegarde automatique:', err);
      }
    }, 1000); // Délai réduit à 1 seconde pour une réactivité accrue

    return () => clearTimeout(saveCalendarDebounced);
  }, [formData, childPhoto, calendarId, calendarName, isLoading, saveCurrentCalendar]);


  // Available icons for custom activities
  const availableIcons = [
    '🏫', '🍽️', '🛁','🛏️','🪥','👕','⚽','📚','📖','📺','🎮','👩','👨','👴','👵',
    '📌', '⭐', '🌟', '🎯', '🎨', '🎭', '🎬', '🎷', '🎸', '🎹', '🎺',
    '🎻', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '⛳', '🏓', '🏸',
    '🚲', '🛹', '🛼', '⛸️', '🥏', '🎣', '🎲', '🧩', '🧸', '🪁', '🎈', '🎁'
  ]

  const handleActivityToggle = (activity: Activity) => {
    const isSelected = formData.selectedActivities.some(a => a.id === activity.id)

    if (isSelected) {
      // Remove the activity from selected activities
      updateFormField('selectedActivities',
        formData.selectedActivities.filter(a => a.id !== activity.id)
      )

      // Remove the activity from quantities
      const updatedQuantities = { ...formData.stickerQuantities }
      delete updatedQuantities[activity.id]
      updateFormField('stickerQuantities', updatedQuantities)
    } else {
      // Add the activity to selected activities
      updateFormField('selectedActivities',
        [...formData.selectedActivities, activity]
      )

      // Set default quantity to 1
      updateFormField('stickerQuantities', {
        ...formData.stickerQuantities,
        [activity.id]: 1
      })
    }
  }

  const updateStickerQuantity = (activityId: string, quantity: number) => {
    if (quantity < 1) return // Don't allow quantities less than 1

    updateFormField('stickerQuantities', {
      ...formData.stickerQuantities,
      [activityId]: quantity
    })
  }

  const removeCustomActivity = (id: string) => {
    updateFormField('customActivities',
      formData.customActivities.filter(a => a.id !== id)
    )

    // Also remove from selected activities
    updateFormField('selectedActivities',
      formData.selectedActivities.filter(a => a.id !== id)
    )

    // Remove the quantity
    const updatedQuantities = { ...formData.stickerQuantities }
    delete updatedQuantities[id]
    updateFormField('stickerQuantities', updatedQuantities)
  }

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement> | ProcessedImageEvent) => {
    // If we received a processed image event
    if ('files' in e.target && Array.isArray(e.target.files) && e.target.files.length > 0) {
      const processedImageUrl = e.target.files[0]
      if (typeof processedImageUrl === 'string') {
        setChildPhoto(processedImageUrl)

        // Set default quantity for child photo
        updateFormField('stickerQuantities', {
          ...formData.stickerQuantities,
          childPhoto: 1
        })
        return
      }
    }

    // Handle standard file upload case - we know it's a ChangeEvent<HTMLInputElement> at this point
    const fileInput = e as ChangeEvent<HTMLInputElement>
    const file = fileInput.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setChildPhoto(event.target.result as string)

        // Set default quantity for child photo
        updateFormField('stickerQuantities', {
          ...formData.stickerQuantities,
          childPhoto: 1
        })
      }
    }
    reader.readAsDataURL(file)
  }


  const removeBackgroundImage = () => {
    updateFormField('backgroundImage', null)
  }


  // Fonction pour changer manuellement le mode de prévisualisation
  const handlePreviewModeChange = (mode: PreviewMode) => {
    userModifiedPreviewMode.current = true;
    updateFormField('options', { ...formData.options, previewMode: mode });

    // Réinitialiser après un certain délai pour permettre la synchronisation automatique
    // lors du prochain changement d'étape
    setTimeout(() => {
      userModifiedPreviewMode.current = false;
    }, 3000); // Réinitialise après 3 secondes d'inactivité
  }

  // Handler for changing objectFit property on an activity
  const handleObjectFitToggle = (activityId: string, objectFit: 'cover' | 'contain') => {
    // Update the customActivities array with the new objectFit value
    const updatedCustomActivities = formData.customActivities.map(activity => 
      activity.id === activityId 
        ? { ...activity, objectFit } 
        : activity
    );
    
    // Update the selectedActivities array as well to keep them in sync
    const updatedSelectedActivities = formData.selectedActivities.map(activity => 
      activity.id === activityId 
        ? { ...activity, objectFit } 
        : activity
    );
    
    // Update both arrays in the form state
    updateFormField('customActivities', updatedCustomActivities);
    updateFormField('selectedActivities', updatedSelectedActivities);
  };


  // Toggle handler to update both local state and form data
  const handleToggleView = (view: PreviewMode) => {
    // Notifier le composant parent si onPreviewModeChange est fourni
    if (handlePreviewModeChange) {
      handlePreviewModeChange(view);
    } else {
      // Comportement par défaut si onPreviewModeChange n'est pas fourni
      updateFormField('options', {
        ...formData.options,
        previewMode: view
      })
    }
  }

  // Days of the week in French
  const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

  // Get theme classes based on the selected theme
  const themeClasses = getThemeClasses(formData.theme)

  // Afficher un écran de chargement
  if (isLoading) {
    return (
      <main className="flex-grow container mx-auto py-8 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-[var(--kiwi-dark)] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg">Chargement du calendrier...</p>
        </div>
      </main>
    )
  }

  return (
    <>
      {/* Main content */}
      <main className="relative flex-auto self-stretch flex flex-col">
        <FadeIn className='flex-none container py-4 mx-auto text-center'>
          <h1 className="text-2xl text-[var(--kiwi-darker)]">
            {calendarName}
          </h1>
        </FadeIn>

        <div className='relative flex-auto flex flex-col bg-zinc-200'>
          {/* Header with title and toggle buttons */}
          <div className="flex justify-center mt-6 sticky top-[4.5rem] z-30">
            {/* Toggle buttons for preview modes */}
            <div className="flex sm:gap-1 rounded-full bg-zinc-200 self-center sm:self-auto shadow-md">
              <ChipButton
                isActive={formData.options.previewMode === 'calendar'}
                onClick={() => handleToggleView('calendar')}
                className={`!px-2 !py-1 sm:!px-3 rounded-full font-medium transition-colors duration-200 ${
                  formData.options.previewMode === 'calendar'
                    ? 'bg-white text-[var(--kiwi-darker)]'
                    : 'text-white'
                }`}
                data-preview-mode-toggle="calendar"
              >
                <span className="!text-[18px] sm:!text-[24px] material-symbols-rounded">palette</span>
                <span className="text-[0.75em] sm:text-xs ml-1 font-medium">Apparence</span>
              </ChipButton>
              <ChipButton
                isActive={formData.options.previewMode === 'stickers'}
                onClick={() => handleToggleView('stickers')}
                className={`!px-2 !py-1 sm:!px-3 rounded-full text-xs font-medium transition-colors duration-200 ${
                  formData.options.previewMode === 'stickers'
                    ? 'bg-white text-[var(--kiwi-darker)]'
                    : 'text-white'
                }`}
                data-preview-mode-toggle="stickers"
              >
                <span className="!text-[18px] sm:!text-[24px] material-symbols-rounded">apps</span>
                <span className="text-[0.75em] sm:text-xs ml-1 font-medium">Gommettes</span>
              </ChipButton>
              <ChipButton
                isActive={formData.options.previewMode === 'all'}
                onClick={() => handleToggleView('all')}
                className={`!px-2 !py-1 sm:!px-3 rounded-full text-xs font-medium transition-colors duration-200 ${
                  formData.options.previewMode === 'all'
                    ? 'bg-white text-[var(--kiwi-darker)]'
                    : 'text-white'
                }`}
                data-preview-mode-toggle="all"
              >
                <span className="!text-[18px] sm:!text-[24px] material-symbols-rounded">export_notes</span>
                <span className="text-[0.75em] sm:text-xs ml-1 font-medium">Exportation</span>
              </ChipButton>
            </div>
          </div>
          <PreviewSection
            formData={formData}
            childPhoto={childPhoto}
            themeClasses={themeClasses}
            weekDays={weekDays}
          />
          <div className="flex-none sticky bottom-4 mb-4 flex justify-center z-30">
            <AnimatePresence mode="wait">
              {formData.options.previewMode === 'calendar' && (
                <CalendarToolbar
                  key="calendar"
                  formData={formData}
                  updateFormField={updateFormField}
                  removeBackgroundImage={removeBackgroundImage}
                />
              )}
              {formData.options.previewMode === 'stickers' && (
                <StickerToolbar
                  key="stickers"
                  formData={formData}
                  updateFormField={updateFormField}
                  childPhoto={childPhoto}
                  handlePhotoUpload={handlePhotoUpload}
                  updateStickerQuantity={updateStickerQuantity}
                  themeClasses={themeClasses}
                  handleObjectFitToggle={handleObjectFitToggle}
                  availableIcons={availableIcons}
                  handleActivityToggle={handleActivityToggle}
                  removeCustomActivity={removeCustomActivity}
                />
              )}
              {formData.options.previewMode === 'all' && (
                <FinalToolbar
                  key="final"
                  calendarId={calendarId ?? undefined}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </>
  )
}

export default function CreateCalendarPage() {
  return (
    <Suspense fallback={<CalendarEditorLoading />}>
      <CreateCalendarContent />
    </Suspense>
  );
}