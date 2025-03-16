'use client'

import { useState, ChangeEvent, useCallback } from 'react'
import { FadeIn } from '@/components/ui/motion'
import {
  CalendarFormData,
  DEFAULT_FORM_DATA,
  Activity
} from './types'

// Import the extracted components
import { getThemeClasses } from '@/components/calendar/types'
import { Step1, Step2, Step3, PreviewSection, ProgressIndicator } from '@/components/create-form'

export default function CreateCalendarPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<CalendarFormData>(DEFAULT_FORM_DATA)
  const [childPhoto, setChildPhoto] = useState<string | null>(null)

  const totalSteps = 3

  // Available icons for custom activities
  const availableIcons = [
    '📌', '⭐', '🌟', '🎯', '🎨', '🎭', '🎬', '🎮', '🎷', '🎸', '🎹', '🎺',
    '🎻', '🏀', '⚽', '🏈', '⚾', '🎾', '🏐', '🏉', '🎱', '⛳', '🏓', '🏸',
    '🚲', '🛹', '🛼', '⛸️', '🥏', '🎣', '🎲', '🧩', '🧸', '🪁', '🎈', '🎁'
  ]

  // Helper functions for form updates
  const updateFormField = useCallback((field: keyof CalendarFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }, [])

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

  const handleSave = () => {
    // In a real app, this would save to a database or localStorage
    console.log('Saving calendar:', formData)
    alert('Calendrier sauvegardé avec succès!')
  }

  // Navigation handlers
  const goToNextStep = () => {
    const nextStep = Math.min(currentStep + 1, totalSteps)
    setCurrentStep(nextStep)
    const newPreviewMode = nextStep === 2 ? 'stickers' : 'calendar'

    if (formData.options.previewMode !== newPreviewMode) {
      updateFormField('options', { ...formData.options, previewMode: newPreviewMode })
    }
  }

  const goToPrevStep = () => {
    const prevStep = Math.max(currentStep - 1, 1)
    setCurrentStep(prevStep)
    const newPreviewMode = prevStep === 2 ? 'stickers' : 'calendar'

    if (formData.options.previewMode !== newPreviewMode) {
      updateFormField('options', { ...formData.options, previewMode: newPreviewMode })
    }
  }

  // Days of the week in French
  const weekDays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

  // Get theme classes based on the selected theme
  const themeClasses = getThemeClasses(formData.theme)

  return (
    <>
      {/* Main content */}
      <main className="flex-grow container mx-auto p-8">
        <FadeIn>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--kiwi-darker)] mb-4">
              Créer mon calendrier
            </h1>
            <p className="text-lg">
              Personnalisez votre calendrier hebdomadaire pour enfants en quelques étapes simples.
            </p>
          </div>
        </FadeIn>

        {/* Progress indicator */}
        <ProgressIndicator currentStep={currentStep} totalSteps={totalSteps} />

        <div className="grid xl:flex gap-8">
          {/* Left side: Form Steps */}
          <div className='flex-none xl:w-md'>
            {/* Step 1: Calendar Customization */}
            {currentStep === 1 && (
              <Step1
                formData={formData}
                updateFormField={updateFormField}
                onNextStep={goToNextStep}
                themeClasses={themeClasses}
                handleBackgroundImageUpload={handleBackgroundImageUpload}
                removeBackgroundImage={removeBackgroundImage}
              />
            )}

            {/* Step 2: Stickers Customization */}
            {currentStep === 2 && (
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
            )}

            {/* Step 3: Final Preview and Download */}
            {currentStep === 3 && (
              <Step3
                formData={formData}
                updateFormField={updateFormField}
                handleSave={handleSave}
                themeClasses={themeClasses}
                onNextStep={goToNextStep}
                onPrevStep={goToPrevStep}
              />
            )}
          </div>

          {/* Right side: Preview */}
          <div className="relative flex-auto xl:sticky xl:top-8 xl:self-start">
            <PreviewSection
              formData={formData}
              updateFormField={updateFormField}
              childPhoto={childPhoto}
              themeClasses={themeClasses}
              weekDays={weekDays}
            />
          </div>
        </div>
      </main>
    </>
  )
}