'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { FadeIn } from '@/components/ui/motion';
import useCalendarStore from '@/lib/store/calendar-store';
import CalendarsList from '@/components/calendar/CalendarsList';
import CalendarDetail from '@/components/calendar/CalendarDetail';
import ImportCalendarModal from '@/components/calendar/ImportCalendarModal';
import { Button, ButtonLink } from '@/components/ui/Button'

function CalendarsViewContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const calendarId = searchParams.get('id');
  const { loadCalendarsList, calendarsList, initializeStore } = useCalendarStore();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Cette fonction va charger complètement la liste des calendriers
  // à chaque fois que l'utilisateur visite la page
  useEffect(() => {
    const initialize = async () => {
      try {
        // Réinitialiser le stockage
        await initializeStore();

        // Forcer un rechargement complet de la liste des calendriers
        await loadCalendarsList();

        setInitialized(true);
      } catch (error) {
        console.error("Erreur lors du chargement des calendriers:", error);
        setInitialized(true); // On met quand même à true pour ne pas bloquer l'interface
      }
    };

    // Lancer l'initialisation
    initialize();

    // Le pathname est utilisé comme dépendance pour s'assurer que
    // l'effet s'exécute à chaque fois que l'utilisateur navigue vers cette page
  }, [loadCalendarsList, initializeStore, pathname]);

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
                <Button
                  onClick={() => setIsImportModalOpen(true)}
                  variant="outline"
                  size="md"
                >
                  Importer un calendrier
                </Button>
                <ButtonLink
                  href="/create/new"
                  variant="primary"
                  size="md"
                >
                  Créer un calendrier
                </ButtonLink>
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