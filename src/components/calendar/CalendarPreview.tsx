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
    className="a4 paper-shadow border-[2cqw] border-white @container"
    >
      <div
        id="calendar-preview"
        className={cn(
          'calendar-preview',
          themeClasses.calendarBg,
          '@container px-[3cqi] py-[4.5cqi] w-full h-full bg-cover bg-center flex rounded-[2cqi] m-0'
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
                      `bg-white/80`,
                      momentIndex === moments.length - 1 && 'rounded-b-[1cqi]'
                    )}
                    style={{
                      // Use the dayPercentage to set the height (with fallback to equal distribution)
                      height: moment.dayPercentage ? `${moment.dayPercentage}%` : `${100 / moments.length}%`
                    }}
                  >
                    {moments.length > 1 && (
                      <div className={cn(
                        'text-black align-text-top text-center bg-white rounded-full w-[3cqw] h-[3cqw] mx-auto flex items-center justify-center mt-[1cqi]',
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