'use client';

import { SavedCalendarMeta } from '@/types/saved-calendar';
import CalendarCard from './CalendarCard';
import { FadeIn } from '../ui/motion';

interface CalendarsListProps {
  calendars: SavedCalendarMeta[];
}

export default function CalendarsList({ calendars }: CalendarsListProps) {
  if (calendars.length === 0) {
    return (
      <FadeIn>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-600 mb-4">
            Vous n&apos;avez pas encore de calendriers
          </h3>
          <p className="text-gray-500">
            Créez votre premier calendrier ou importez-en un pour commencer.
          </p>
        </div>
      </FadeIn>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {calendars.map(calendar => (
        <CalendarCard
          key={calendar.id}
          calendar={calendar}
          viewMode
        />
      ))}
    </div>
  );
}