'use client'

import { cn } from '@/lib/utils/cn';
import { getThemeClasses } from './types'
import { DayMoment, SINGLE_DAY_MOMENT } from '@/app/create/types'

interface CalendarPreviewProps {
  weekDays: string[];
  themeClasses: ReturnType<typeof getThemeClasses>;
  backgroundImage?: string | null;
  uppercaseWeekdays?: boolean;
  dayMoments?: DayMoment[];
}

// Fonction pour obtenir la classe de couleur avec une intensité spécifique
function getColorClassWithIntensity(baseClass: string, intensity: number): string {
  // Le format de baseClass est "bg-color-500" ou similaire
  // On extrait la couleur et on ajuste l'intensité
  const parts = baseClass.split('-');
  if (parts.length < 3) return baseClass;

  const color = parts[1];
  let level = parseInt(parts[2]);

  // Ajuster le niveau en fonction de l'intensité
  // Plus l'intensité est élevée, plus la couleur sera foncée (niveau bas)
  // Plus l'intensité est basse, plus la couleur sera claire (niveau haut)
  // Niveau de base est 500 (dans themeClasses.dayHeaderBg), on ajuste de façon relative
  // Une intensité de 1 = même niveau, 0.8 = plus clair, etc.
  const newLevel = Math.round(600 - (intensity * 100));

  // Assurer que le niveau reste dans les limites de Tailwind (100-900)
  const safeLevel = Math.max(100, Math.min(900, newLevel));

  return `bg-${color}-${safeLevel}`;
}

export default function CalendarPreview({
  weekDays,
  themeClasses,
  backgroundImage,
  uppercaseWeekdays = false,
  dayMoments = SINGLE_DAY_MOMENT
}: CalendarPreviewProps) {
  // Assurer la compatibilité avec les anciennes données
  const moments = dayMoments || SINGLE_DAY_MOMENT;

  return (
    <div
    className="relative w-full h-auto aspect-[297/210] paper-shadow border-[2cqw] border-white @container"
    >
      <div
        id="calendar-preview"
        className={cn(
          'calendar-preview',
          themeClasses.calendarBg,
          '@container px-[3cqi] py-[6cqi] w-full h-full bg-cover bg-center flex rounded-[2cqi] m-0'
        )}
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        }}
      >
        <div className="flex-auto flex flex-col gap-[0.1cqi] relative z-10">
          {/* Days of week */}
          <div className="flex-none grid grid-cols-7 gap-[3cqi]">
            {weekDays.map((day, index) => (
              <div
                key={index}
                className={cn(
                  themeClasses.dayHeaderBg,
                  'py-[1.5cqi] px-[1cqi] text-center text-white text-[1.45cqi] rounded-t-[1cqi]',
                  uppercaseWeekdays && 'uppercase'
                )}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Moments de la journée pour chaque jour */}
          <div className="flex-auto grid grid-cols-7 gap-[3cqi]">
            {weekDays.map((_, dayIndex) => (
              <div key={`day-${dayIndex}`} className="flex flex-col gap-[0.1cqi]">
                {moments.map((moment, momentIndex) => (
                  <div
                    key={`moment-${dayIndex}-${momentIndex}`}
                    className={cn(
                      `flex-1 py-[1.5cqi] bg-white/80`,
                      momentIndex === moments.length - 1 && 'rounded-b-[1cqi]'
                    )}
                  >
                    {moments.length > 1 && (
                      <div className={cn(
                        'text-black align-text-top text-center bg-white rounded-full w-[3cqw] h-[3cqw] mx-auto flex items-center justify-center',
                      )}>
                        <span className="leading-none text-[1.2cqw]">
                          {moment.label}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}