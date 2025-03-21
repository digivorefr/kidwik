'use client'

import { cn } from '@/lib/utils/cn';
import { getThemeClasses } from './types'

interface CalendarPreviewProps {
  weekDays: string[];
  themeClasses: ReturnType<typeof getThemeClasses>;
  backgroundImage?: string | null;
  uppercaseWeekdays?: boolean;
}

export default function CalendarPreview({ weekDays, themeClasses, backgroundImage, uppercaseWeekdays = false }: CalendarPreviewProps) {
  return (
    <div
    className="relative w-full h-auto aspect-[297/210] paper-shadow border-[6mm] border-white"
    >
      <div
        id="calendar-preview"
        className={cn(
          'calendar-preview',
          themeClasses.calendarBg,
          'p-4 w-full h-full bg-cover bg-center flex rounded-xl m-0'
        )}
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        }}
      >
        <div className="flex-auto flex flex-col gap-2 relative z-10">
          {/* Days of week */}
          <div className="flex-none grid grid-cols-7 gap-4 @container">
            {weekDays.map((day, index) => (
              <div
                key={index}
                className={cn(
                  themeClasses.dayHeaderBg,
                  'p-2 text-center text-white text-[1.8cqw] rounded-md',
                  uppercaseWeekdays && 'uppercase'
                )}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="flex-auto grid grid-cols-7 gap-4">
            {weekDays.map((_, index) => (
              <div
                key={`cell-${index}`}
                className="bg-white/80 rounded-md"
                />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}