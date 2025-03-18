'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FadeIn } from '@/components/ui/motion';
import useCalendarStore from '@/lib/store/calendar-store';
import CalendarsList from '@/components/calendar/CalendarsList';
import CalendarDetail from '@/components/calendar/CalendarDetail';
import ImportCalendarModal from '@/components/calendar/ImportCalendarModal';

function CalendarsViewContent() {
  const searchParams = useSearchParams();
  const calendarId = searchParams.get('id');
  const { loadCalendarsList, calendarsList } = useCalendarStore();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await loadCalendarsList();
      setInitialized(true);
    };
    
    initialize();
  }, [loadCalendarsList]);

  if (!initialized) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[var(--kiwi-dark)]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 md:py-8">
      <FadeIn>
        {calendarId ? (
          // Vue détaillée d'un calendrier
          <CalendarDetail calendarId={calendarId} />
        ) : (
          // Vue liste des calendriers
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <h1 className="text-3xl font-bold text-[var(--kiwi-darker)]">
                Mes calendriers
              </h1>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="px-4 py-2 rounded-lg border border-[var(--kiwi-dark)] text-[var(--kiwi-dark)] font-medium hover:bg-[var(--kiwi-lightest)] transition-colors"
                >
                  Importer un calendrier
                </button>
                <Link
                  href="/create/new"
                  className="btn-primary px-4 py-2 rounded-lg text-center font-medium"
                >
                  Créer un calendrier
                </Link>
              </div>
            </div>

            <CalendarsList calendars={calendarsList} />

            {isImportModalOpen && (
              <ImportCalendarModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
              />
            )}
          </>
        )}
      </FadeIn>
    </div>
  );
}

export default function CalendarsView() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[var(--kiwi-dark)]"></div>
      </div>
    }>
      <CalendarsViewContent />
    </Suspense>
  );
}