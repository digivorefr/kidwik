import { TailwindColor } from '@/app/create/types'

export type ThemeClasses = {
  calendarBg: string
  headerBg: string
  dayHeaderBg: string
  stickerBg: string
  stickerBorder: string
}

// Define theme classes based on the selected theme
export function getThemeClasses(theme: string): ThemeClasses {
  // Liste des couleurs supportées
  const supportedColors: TailwindColor[] = [
    'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald',
    'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple',
    'fuchsia', 'pink', 'rose', 'slate', 'gray', 'zinc', 'neutral', 'stone'
  ]

  // Map of color-specific classes for Tailwind v4
  const classMap: Record<TailwindColor, ThemeClasses> = {
    'red': {
      calendarBg: 'bg-red-200',
      headerBg: 'bg-red-600',
      dayHeaderBg: 'bg-red-500',
      stickerBg: 'bg-red-100',
      stickerBorder: 'border-red-600'
    },
    'orange': {
      calendarBg: 'bg-orange-200',
      headerBg: 'bg-orange-600',
      dayHeaderBg: 'bg-orange-500',
      stickerBg: 'bg-orange-100',
      stickerBorder: 'border-orange-600'
    },
    'amber': {
      calendarBg: 'bg-amber-200',
      headerBg: 'bg-amber-600',
      dayHeaderBg: 'bg-amber-500',
      stickerBg: 'bg-amber-100',
      stickerBorder: 'border-amber-600'
    },
    'yellow': {
      calendarBg: 'bg-yellow-200',
      headerBg: 'bg-yellow-600',
      dayHeaderBg: 'bg-yellow-500',
      stickerBg: 'bg-yellow-100',
      stickerBorder: 'border-yellow-600'
    },
    'lime': {
      calendarBg: 'bg-lime-200',
      headerBg: 'bg-lime-600',
      dayHeaderBg: 'bg-lime-500',
      stickerBg: 'bg-lime-100',
      stickerBorder: 'border-lime-600'
    },
    'green': {
      calendarBg: 'bg-green-200',
      headerBg: 'bg-green-600',
      dayHeaderBg: 'bg-green-500',
      stickerBg: 'bg-green-100',
      stickerBorder: 'border-green-600'
    },
    'emerald': {
      calendarBg: 'bg-emerald-200',
      headerBg: 'bg-emerald-600',
      dayHeaderBg: 'bg-emerald-500',
      stickerBg: 'bg-emerald-100',
      stickerBorder: 'border-emerald-600'
    },
    'teal': {
      calendarBg: 'bg-teal-200',
      headerBg: 'bg-teal-600',
      dayHeaderBg: 'bg-teal-500',
      stickerBg: 'bg-teal-100',
      stickerBorder: 'border-teal-600'
    },
    'cyan': {
      calendarBg: 'bg-cyan-200',
      headerBg: 'bg-cyan-600',
      dayHeaderBg: 'bg-cyan-500',
      stickerBg: 'bg-cyan-100',
      stickerBorder: 'border-cyan-600'
    },
    'sky': {
      calendarBg: 'bg-sky-200',
      headerBg: 'bg-sky-600',
      dayHeaderBg: 'bg-sky-500',
      stickerBg: 'bg-sky-100',
      stickerBorder: 'border-sky-600'
    },
    'blue': {
      calendarBg: 'bg-blue-200',
      headerBg: 'bg-blue-600',
      dayHeaderBg: 'bg-blue-500',
      stickerBg: 'bg-blue-100',
      stickerBorder: 'border-blue-600'
    },
    'indigo': {
      calendarBg: 'bg-indigo-200',
      headerBg: 'bg-indigo-600',
      dayHeaderBg: 'bg-indigo-500',
      stickerBg: 'bg-indigo-100',
      stickerBorder: 'border-indigo-600'
    },
    'violet': {
      calendarBg: 'bg-violet-200',
      headerBg: 'bg-violet-600',
      dayHeaderBg: 'bg-violet-500',
      stickerBg: 'bg-violet-100',
      stickerBorder: 'border-violet-600'
    },
    'purple': {
      calendarBg: 'bg-purple-200',
      headerBg: 'bg-purple-600',
      dayHeaderBg: 'bg-purple-500',
      stickerBg: 'bg-purple-100',
      stickerBorder: 'border-purple-600'
    },
    'fuchsia': {
      calendarBg: 'bg-fuchsia-200',
      headerBg: 'bg-fuchsia-600',
      dayHeaderBg: 'bg-fuchsia-500',
      stickerBg: 'bg-fuchsia-100',
      stickerBorder: 'border-fuchsia-600'
    },
    'pink': {
      calendarBg: 'bg-pink-200',
      headerBg: 'bg-pink-600',
      dayHeaderBg: 'bg-pink-500',
      stickerBg: 'bg-pink-100',
      stickerBorder: 'border-pink-600'
    },
    'rose': {
      calendarBg: 'bg-rose-200',
      headerBg: 'bg-rose-600',
      dayHeaderBg: 'bg-rose-500',
      stickerBg: 'bg-rose-100',
      stickerBorder: 'border-rose-600'
    },
    'slate': {
      calendarBg: 'bg-slate-200',
      headerBg: 'bg-slate-600',
      dayHeaderBg: 'bg-slate-500',
      stickerBg: 'bg-slate-100',
      stickerBorder: 'border-slate-600'
    },
    'gray': {
      calendarBg: 'bg-gray-200',
      headerBg: 'bg-gray-600',
      dayHeaderBg: 'bg-gray-500',
      stickerBg: 'bg-gray-100',
      stickerBorder: 'border-gray-600'
    },
    'zinc': {
      calendarBg: 'bg-zinc-200',
      headerBg: 'bg-zinc-600',
      dayHeaderBg: 'bg-zinc-500',
      stickerBg: 'bg-zinc-100',
      stickerBorder: 'border-zinc-600'
    },
    'neutral': {
      calendarBg: 'bg-neutral-200',
      headerBg: 'bg-neutral-600',
      dayHeaderBg: 'bg-neutral-500',
      stickerBg: 'bg-neutral-100',
      stickerBorder: 'border-neutral-600'
    },
    'stone': {
      calendarBg: 'bg-stone-200',
      headerBg: 'bg-stone-600',
      dayHeaderBg: 'bg-stone-500',
      stickerBg: 'bg-stone-100',
      stickerBorder: 'border-stone-600'
    }
  }

  // Vérifier si la couleur est supportée
  if (supportedColors.includes(theme as TailwindColor)) {
    return classMap[theme as TailwindColor]
  }

  // Couleur par défaut (green)
  return classMap.green
}