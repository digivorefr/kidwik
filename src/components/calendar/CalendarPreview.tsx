'use client'

import { cn } from '@/lib/utils/cn';
import { getThemeClasses } from './types'

interface CalendarPreviewProps {
  weekDays: string[];
  themeClasses: ReturnType<typeof getThemeClasses>;
  backgroundImage?: string | null;
}

export default function CalendarPreview({ weekDays, themeClasses, backgroundImage }: CalendarPreviewProps) {
  const className = cn('calendar-preview', themeClasses.calendarBg, 'p-4 min-w-fit print:min-w-full paper-shadow relative overflow-hidden')
  return (
    <div 
      className={className}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="flex flex-col gap-2 w-full h-auto aspect-[297/210] relative z-10">
        {/* Days of week */}
        <div className="flex-none grid grid-cols-7 gap-4">
          {weekDays.map((day, index) => (
            <div 
              key={index} 
              className={`${themeClasses.dayHeaderBg} p-2 text-center text-white font-bold text-[0.9cqw] rounded-md`}
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
  )
}