'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useCalendarStore from '@/lib/store/calendar-store';
import { SavedCalendar } from '@/types/saved-calendar';
import CalendarPreview from './CalendarPreview';
import RenameCalendarModal from './RenameCalendarModal';
import ExportCalendarModal from './ExportCalendarModal';
import StickerSheet from './StickerSheet';
import { getThemeClasses } from './types';
import { DayOfWeek } from '@/app/create/types';
import { Button, ButtonLink } from '@/components/ui/Button'

// Mapping des jours anglais vers français
const dayTranslations: Record<DayOfWeek, string> = {
  'Monday': 'Lundi',
  'Tuesday': 'Mardi',
  'Wednesday': 'Mercredi',
  'Thursday': 'Jeudi',
  'Friday': 'Vendredi',
  'Saturday': 'Samedi',
  'Sunday': 'Dimanche'
};

interface CalendarDetailProps {
  calendarId: string;
}

export default function CalendarDetail({ calendarId }: CalendarDetailProps) {
  const router = useRouter();
  const { loadCalendar, deleteCalendar } = useCalendarStore();
  const [calendar, setCalendar] = useState<SavedCalendar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCalendar = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await loadCalendar(calendarId);
      if (data) {
        setCalendar(data);
      } else {
        setError("Calendrier non trouvé");
      }
    } catch {
      setError("Erreur lors du chargement du calendrier");
    } finally {
      setIsLoading(false);
    }
  }, [calendarId, loadCalendar]);

  useEffect(() => {
    fetchCalendar();
  }, [fetchCalendar]);

  const handleDelete = async () => {
    if (!calendar) return;

    if (confirm(`Êtes-vous sûr de vouloir supprimer le calendrier "${calendar.meta.name}" ?`)) {
      try {
        await deleteCalendar(calendarId);
        router.push('/view');
      } catch {
        setError("Erreur lors de la suppression du calendrier");
      }
    }
  };

  const handleRenameModalClose = () => {
    setIsRenameModalOpen(false);
    // Recharger les données du calendrier pour afficher le nouveau nom
    fetchCalendar();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[var(--kiwi-dark)]"></div>
      </div>
    );
  }

  if (error || !calendar) {
    return (
      <div className="p-6 bg-red-50 rounded-lg">
        <h2 className="text-xl font-medium text-red-700 mb-2">Erreur</h2>
        <p className="text-red-600 mb-4">{error || "Calendrier non trouvé"}</p>
        <Link
          href="/view"
          className="px-4 py-2 bg-[var(--kiwi-dark)] text-white rounded-lg"
        >
          Retour à la liste
        </Link>
      </div>
    );
  }

  const themeClasses = getThemeClasses(calendar.formData.theme);

  // Traduire les jours de l'anglais vers le français
  const weekDays = calendar.formData.days?.map(day => {
    // Si le jour est déjà en français, le retourner tel quel
    if (Object.values(dayTranslations).includes(day)) {
      return day;
    }
    // Sinon, traduire de l'anglais vers le français
    return dayTranslations[day as DayOfWeek] || day;
  }) || ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  // Formatage de la date en français
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="flex flex-col gap-8 items-center max-w-3xl mx-auto">
      {/* Header avec navigation et informations */}
      <div className="flex flex-col items-center text-center w-full">
        <Link
          href="/view"
          className="mb-4 inline-flex items-center text-[var(--kiwi-dark)] hover:text-[var(--kiwi-medium)] transition-colors"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Retour aux calendriers
        </Link>

        <h1 className="text-3xl font-bold text-[var(--kiwi-darker)] mb-2">
          {calendar.meta.name}
        </h1>

        <p className="text-gray-600 mb-6">
          Modifié le {formatDate(calendar.meta.updatedAt)}
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-2">
          <Button
            onClick={() => setIsRenameModalOpen(true)}
            variant="text"
            size="sm"
          >
            Renommer
          </Button>
          <Button
            onClick={() => setIsExportModalOpen(true)}
            variant="outline"
            size="sm"
          >
            Exporter
          </Button>
          <ButtonLink
            href={`/create?id=${calendarId}`}
            variant="secondary"
            size="sm"
          >
            Modifier
          </ButtonLink>
          <Button
            onClick={handleDelete}
            variant="danger"
            size="sm"
          >
            Supprimer
          </Button>
        </div>
      </div>

      {/* Sections de prévisualisation */}
      <div className="flex flex-col gap-12 w-full my-4">
        {/* Prévisualisation du calendrier */}
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-[var(--kiwi-darker)] mb-4 text-center">
            Calendrier
          </h2>
          <CalendarPreview
            weekDays={weekDays}
            themeClasses={themeClasses}
            backgroundImage={calendar.formData.backgroundImage || null}
          />
        </div>

        {/* Prévisualisation des stickers */}
        {calendar.formData.selectedActivities && calendar.formData.selectedActivities.length > 0 && (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold text-[var(--kiwi-darker)] mb-4 text-center">
              Gommettes
            </h2>
            <StickerSheet
              childPhoto={calendar.childPhoto}
              selectedActivities={calendar.formData.selectedActivities}
              themeClasses={themeClasses}
              stickerQuantities={calendar.formData.stickerQuantities || {}}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {isRenameModalOpen && (
        <RenameCalendarModal
          isOpen={isRenameModalOpen}
          onClose={handleRenameModalClose}
          calendar={calendar}
        />
      )}

      {isExportModalOpen && (
        <ExportCalendarModal
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
          calendarId={calendarId}
        />
      )}
    </div>
  );
}