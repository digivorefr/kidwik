export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

export interface Activity {
  id: string
  name: string
  icon?: string
  isPreset?: boolean
  isArasaac?: boolean
  originalId?: number
  attribution?: string
  objectFit?: 'cover' | 'contain'
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

// Définir le type pour les groupes de couleurs
export type ColorGroupName = 'Rouge/Orange/Jaune' | 'Vert' | 'Bleu' | 'Violet/Rose' | 'Gris';

// Regrouper les couleurs
export const colorGroups: Record<ColorGroupName, TailwindColor[]> = {
  'Rouge/Orange/Jaune': ['red', 'orange', 'amber', 'yellow'],
  'Vert': ['lime', 'green', 'emerald', 'teal'],
  'Bleu': ['cyan', 'sky', 'blue', 'indigo'],
  'Violet/Rose': ['violet', 'purple', 'fuchsia', 'pink', 'rose'],
  'Gris': ['slate', 'gray', 'zinc', 'neutral', 'stone'],
};

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