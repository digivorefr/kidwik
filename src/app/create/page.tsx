'use client'

import { useState, ChangeEvent, useCallback, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { FadeIn } from '@/components/ui/motion'
import {
  CalendarFormData,
  DEFAULT_FORM_DATA,
  Activity,
  PreviewMode
} from './types'

// Import the extracted components
import { getThemeClasses } from '@/components/calendar/types'
import {
  Step1,
  Step2,
  Step3,
  PreviewSection,
  AccordionStep
} from '@/components/create-form'
import useCalendarStore from '@/lib/store/calendar-store'

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

  const [currentStep, setCurrentStep] = useState(1)
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
  const [userModifiedPreviewMode, setUserModifiedPreviewMode] = useState(false)

  // Charge le calendrier existant ou redirige vers la page de création
  useEffect(() => {
    const loadExistingCalendar = async () => {
      if (!calendarId) {
        // Rediriger vers la page de création d'un nouveau calendrier
        router.replace('/create/new')
        return
      }

      try {
        const calendar = await loadCalendar(calendarId)
        if (calendar) {
          setFormData(calendar.formData)
          setChildPhoto(calendar.childPhoto)
          setCalendarName(calendar.meta.name)
          setCurrentCalendarId(calendarId)
        } else {
          // Calendrier non trouvé, rediriger
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
  }, [calendarId, loadCalendar, router, setCurrentCalendarId])

  // Sauvegarde automatique lors des modifications
  useEffect(() => {
    // Sauvegarde avec debounce pour éviter trop d'écritures
    const saveCalendarDebounced = setTimeout(() => {
      if (calendarId && !isLoading) {
        // Référence à l'élément de prévisualisation pour générer une miniature
        const previewElement = document.querySelector('.calendar-preview-container') as HTMLElement

        saveCurrentCalendar(calendarId, formData, childPhoto, previewElement)
          .catch(err => console.error('Erreur lors de la sauvegarde automatique:', err))
      }
    }, 2000) // Délai de 2 secondes

    return () => clearTimeout(saveCalendarDebounced)
  }, [formData, childPhoto, calendarId, isLoading, saveCurrentCalendar])

  // Synchroniser le mode de prévisualisation avec l'étape actuelle
  // mais seulement si le mode n'a pas été manuellement changé par l'utilisateur
  useEffect(() => {
    // Ne pas synchroniser si l'utilisateur a modifié manuellement le mode de prévisualisation
    if (userModifiedPreviewMode) return;

    // Déterminer le mode de prévisualisation en fonction de l'étape actuelle
    let newPreviewMode: PreviewMode;
    if (currentStep === 2) {
      newPreviewMode = 'stickers';
    } else if (currentStep === 3) {
      newPreviewMode = 'all';
    } else {
      newPreviewMode = 'calendar';
    }

    // Mettre à jour le mode de prévisualisation si nécessaire
    if (formData.options.previewMode !== newPreviewMode) {
      updateFormField('options', { ...formData.options, previewMode: newPreviewMode });
    }
  }, [currentStep, formData.options, updateFormField, userModifiedPreviewMode]);

  const totalSteps = 3

  // Available icons for custom activities
  const availableIcons = [
    '📌', '⭐', '🌟', '🎯', '🎨', '🎭', '🎬', '🎮', '🎷', '🎸', '🎹', '🎺',
    '🎻', '🏀', '⚽', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '⛳', '🏓', '🏸',
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

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
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

  const handleBackgroundImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        updateFormField('backgroundImage', event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const removeBackgroundImage = () => {
    updateFormField('backgroundImage', null)
  }

  const handleSave = async () => {
    if (calendarId) {
      try {
        await saveCurrentCalendar(calendarId, formData, childPhoto)
        alert('Calendrier sauvegardé avec succès!')
      } catch (error) {
        console.error('Erreur lors de la sauvegarde:', error)
        alert('Une erreur est survenue lors de la sauvegarde du calendrier')
      }
    }
  }

  // Navigation handlers
  const goToNextStep = () => {
    const nextStep = Math.min(currentStep + 1, totalSteps)

    // Si l'étape ne change pas, ne rien faire
    if (nextStep === currentStep) return

    // Défiler vers le haut avant de changer d'étape
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Attendre que le défilement soit terminé avant de mettre à jour l'étape
    setTimeout(() => {
      setCurrentStep(nextStep)

      // Define preview mode based on step
      let newPreviewMode: PreviewMode;

      if (nextStep === 2) {
        newPreviewMode = 'stickers';
      } else if (nextStep === 3) {
        newPreviewMode = 'all';
      } else {
        newPreviewMode = 'calendar';
      }

      if (formData.options.previewMode !== newPreviewMode) {
        updateFormField('options', { ...formData.options, previewMode: newPreviewMode });
      }
    }, 600); // Délai similaire à celui dans AccordionStep
  }

  const goToPrevStep = () => {
    const prevStep = Math.max(currentStep - 1, 1)

    // Si l'étape ne change pas, ne rien faire
    if (prevStep === currentStep) return

    // Défiler vers le haut avant de changer d'étape
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Attendre que le défilement soit terminé avant de mettre à jour l'étape
    setTimeout(() => {
      setCurrentStep(prevStep)

      // Define preview mode based on step
      let newPreviewMode: PreviewMode;

      if (prevStep === 2) {
        newPreviewMode = 'stickers';
      } else if (prevStep === 3) {
        newPreviewMode = 'all';
      } else {
        newPreviewMode = 'calendar';
      }

      if (formData.options.previewMode !== newPreviewMode) {
        updateFormField('options', { ...formData.options, previewMode: newPreviewMode });
      }
    }, 600); // Délai similaire à celui dans AccordionStep
  }

  // Fonction pour changer manuellement le mode de prévisualisation
  const handlePreviewModeChange = (mode: PreviewMode) => {
    setUserModifiedPreviewMode(true);
    updateFormField('options', { ...formData.options, previewMode: mode });

    // Réinitialiser après un certain délai pour permettre la synchronisation automatique
    // lors du prochain changement d'étape
    setTimeout(() => {
      setUserModifiedPreviewMode(false);
    }, 3000); // Réinitialise après 3 secondes d'inactivité
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
      <main className="flex-grow container mx-auto py-8">
        <FadeIn>
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-[var(--kiwi-darker)] mb-2">
                {calendarName}
              </h1>
              <p className="text-lg">
                Personnalisez votre calendrier hebdomadaire pour enfants en quelques étapes simples.
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-full text-sm border border-[var(--kiwi-dark)] text-[var(--kiwi-dark)] font-medium hover:bg-[var(--kiwi-light)] transition-colors cursor-pointer"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </FadeIn>


        <div className="grid xl:flex gap-8">
          {/* Left side: Form Steps */}
          <div className='flex-none xl:w-md'>
            {/* Step 1: Calendar Customization */}
            <AccordionStep
              step={1}
              currentStep={currentStep}
              title="1. Personnalisation du calendrier"
              onStepChange={setCurrentStep}
            >
              <Step1
                formData={formData}
                updateFormField={updateFormField}
                onNextStep={goToNextStep}
                themeClasses={themeClasses}
                handleBackgroundImageUpload={handleBackgroundImageUpload}
                removeBackgroundImage={removeBackgroundImage}
              />
            </AccordionStep>

            {/* Step 2: Photo and Activities */}
            <AccordionStep
              step={2}
              currentStep={currentStep}
              title="2. Photo et activités"
              onStepChange={setCurrentStep}
            >
              <Step2
                formData={formData}
                updateFormField={updateFormField}
                childPhoto={childPhoto}
                handlePhotoUpload={handlePhotoUpload}
                handleActivityToggle={handleActivityToggle}
                updateStickerQuantity={updateStickerQuantity}
                removeCustomActivity={removeCustomActivity}
                availableIcons={availableIcons}
                themeClasses={themeClasses}
                onNextStep={goToNextStep}
                onPrevStep={goToPrevStep}
              />
            </AccordionStep>

            {/* Step 3: Final Preview and Download */}
            <AccordionStep
              step={3}
              currentStep={currentStep}
              title="3. Aperçu final et téléchargement"
              onStepChange={setCurrentStep}
            >
              <Step3
                formData={formData}
                updateFormField={updateFormField}
                handleSave={handleSave}
                themeClasses={themeClasses}
                onNextStep={goToNextStep}
                onPrevStep={goToPrevStep}
              />
            </AccordionStep>
          </div>

          {/* Right side: Preview */}
          <div className="relative flex-auto xl:sticky xl:top-8 xl:self-start">
            <PreviewSection
              formData={formData}
              updateFormField={updateFormField}
              childPhoto={childPhoto}
              themeClasses={themeClasses}
              weekDays={weekDays}
              onPreviewModeChange={handlePreviewModeChange}
            />
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