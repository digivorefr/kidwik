'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import useCalendarStore from '@/lib/store/calendar-store';
import CalendarDetail from '@/components/calendar/CalendarDetail';
import { FadeIn } from '@/components/ui/motion';

export default function CalendarDetailPage() {
  const { id } = useParams();
  const { loadCalendar } = useCalendarStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkCalendarExists = async () => {
      setIsLoading(true);
      try {
        const calendar = await loadCalendar(id as string);
        if (!calendar) {
          notFound();
        }
      } catch {
        setError("Erreur lors du chargement du calendrier");
      } finally {
        setIsLoading(false);
      }
    };

    checkCalendarExists();
  }, [id, loadCalendar]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[var(--kiwi-dark)]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-4 md:py-8 text-center">
        <h1 className="text-2xl text-red-500">{error}</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 md:py-8">
      <FadeIn>
        <CalendarDetail calendarId={id as string} />
      </FadeIn>
    </div>
  );
}