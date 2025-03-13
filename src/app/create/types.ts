export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

export interface Activity {
  id: string
  name: string
  icon?: string
  isPreset?: boolean
}

export interface CalendarDay {
  day: DayOfWeek
  activities: {
    [timeSlot: string]: Activity[]
  }
}

export type TailwindColor = 
  'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 
  'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 
  'fuchsia' | 'pink' | 'rose' | 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'

export interface CalendarFormData {
  days: DayOfWeek[]
  selectedActivities: Activity[]
  customActivities: Activity[]
  theme: TailwindColor
  backgroundImage: string | null
  stickerQuantities: Record<string, number>
  options: {
    includeStickers: boolean
    includeIllustrations: boolean
    previewMode?: 'calendar' | 'stickers'
  }
}

export const DEFAULT_FORM_DATA: CalendarFormData = {
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  selectedActivities: [],
  customActivities: [],
  theme: 'green',
  backgroundImage: null,
  stickerQuantities: {},
  options: {
    includeStickers: true,
    includeIllustrations: true,
    previewMode: 'calendar'
  }
}

export const PRESET_ACTIVITIES: Activity[] = [
  { id: 'school', name: 'École', icon: '🏫', isPreset: true },
  { id: 'breakfast', name: 'Petit-déjeuner', icon: '🥐', isPreset: true },
  { id: 'lunch', name: 'Déjeuner', icon: '🍽️', isPreset: true },
  { id: 'dinner', name: 'Dîner', icon: '🍲', isPreset: true },
  { id: 'bath', name: 'Bain/Douche', icon: '🛁', isPreset: true },
  { id: 'teeth', name: 'Brossage de dents', icon: '🪥', isPreset: true },
  { id: 'dressing', name: 'Habillage', icon: '👕', isPreset: true },
  { id: 'sports', name: 'Sport', icon: '⚽', isPreset: true },
  { id: 'homework', name: 'Devoirs', icon: '📚', isPreset: true },
  { id: 'reading', name: 'Lecture', icon: '📖', isPreset: true },
  { id: 'tv', name: 'Télévision', icon: '📺', isPreset: true }
]