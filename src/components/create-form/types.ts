import { CalendarFormData, Activity, PreviewMode } from '@/app/create/types'
import { getThemeClasses } from '@/components/calendar/types'

// Define ThemeClasses type based on the return type of getThemeClasses
export type ThemeClasses = ReturnType<typeof getThemeClasses>

// Type for events with processed images
export interface ProcessedImageEvent {
  target: {
    files: [string] // Array with exactly one string (the processed image URL)
  }
}

export interface FormStepProps {
  formData: CalendarFormData;
  updateFormField: (field: keyof CalendarFormData, value: unknown) => void;
  onNextStep: () => void;
  onPrevStep?: () => void;
  themeClasses: ThemeClasses;
  handleBackgroundImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeBackgroundImage?: () => void;
}

export interface Step2Props extends FormStepProps {
  childPhoto: string | null;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement> | ProcessedImageEvent) => void;
  handleActivityToggle: (activity: Activity) => void;
  updateStickerQuantity: (activityId: string, quantity: number) => void;
  removeCustomActivity: (id: string) => void;
  availableIcons: string[];
}

export interface Step3Props extends FormStepProps {
  handleSave: () => void;
}

export interface PreviewSectionProps {
  formData: CalendarFormData;
  updateFormField: (field: keyof CalendarFormData, value: unknown) => void;
  childPhoto: string | null;
  themeClasses: ThemeClasses;
  weekDays: string[];
  onPreviewModeChange?: (mode: PreviewMode) => void;
}