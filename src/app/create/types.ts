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

// Interface générique pour un moment de la journée
export interface DayMoment {
  id: string
  label: string
  dayPercentage: number
}

// Moments de la journée prédéfinis
export const DEFAULT_DAY_MOMENTS: DayMoment[] = [
  { id: 'morning', label: '🐓', dayPercentage: 30 },
  { id: 'afternoon', label: '🌞', dayPercentage: 40 },
  { id: 'evening', label: '🌙', dayPercentage: 30 }
]

// Moment unique pour le mode simple
export const SINGLE_DAY_MOMENT: DayMoment[] = [
  { id: 'day', label: 'Journée', dayPercentage: 100 }
]

export type TailwindColor =
  'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' |
  'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' |
  'fuchsia' | 'pink' | 'rose' | 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone'

// Define the PreviewMode type for consistent use across the application
export type PreviewMode = 'calendar' | 'stickers' | 'all'

export interface CalendarFormData {
  days: DayOfWeek[]
  selectedActivities: Activity[]
  customActivities: Activity[]
  theme: TailwindColor
  backgroundImage: string | null
  stickerQuantities: Record<string, number>
  dayMoments: DayMoment[]
  options: {
    includeStickers: boolean
    includeIllustrations: boolean
    uppercaseWeekdays: boolean
    showDayMoments: boolean
    previewMode?: PreviewMode
  }
}

export const DEFAULT_FORM_DATA: CalendarFormData = {
  days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  selectedActivities: [],
  customActivities: [],
  theme: 'green',
  backgroundImage: null,
  stickerQuantities: {},
  dayMoments: SINGLE_DAY_MOMENT,
  options: {
    includeStickers: true,
    includeIllustrations: true,
    uppercaseWeekdays: false,
    showDayMoments: false,
    previewMode: 'calendar'
  }
}

export const PRESET_ACTIVITIES: Activity[] = [
  { id: 'school', name: 'École', icon: '🏫', isPreset: true },
  { id: 'lunch', name: 'Repas', icon: '🍽️', isPreset: true },
  { id: 'bath', name: 'Bain/Douche', icon: '🛁', isPreset: true },
  { id: 'sleep', name: 'Repos', icon: '🛏️', isPreset: true },
  { id: 'teeth', name: 'Brossage de dents', icon: '🪥', isPreset: true },
  { id: 'dressing', name: 'Habillage', icon: '👕', isPreset: true },
  { id: 'sports', name: 'Sport', icon: '⚽', isPreset: true },
  { id: 'homework', name: 'Devoirs', icon: '📚', isPreset: true },
  { id: 'reading', name: 'Lecture', icon: '📖', isPreset: true },
  { id: 'tv', name: 'Télévision', icon: '📺', isPreset: true },
  { id: 'video-game', name: 'Jeux vidéo', icon: '🎮', isPreset: true },
  { id: 'mom', name: 'Maman', icon: '👩', isPreset: true },
  { id: 'dad', name: 'Papa', icon: '👨', isPreset: true },
  { id: 'grandpa', name: 'Grand-père', icon: '👴', isPreset: true },
  { id: 'grandma', name: 'Grand-mère', icon: '👵', isPreset: true },
]