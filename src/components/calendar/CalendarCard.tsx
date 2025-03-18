'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SavedCalendarMeta } from '@/types/saved-calendar';
import useCalendarStore from '@/lib/store/calendar-store';
import Image from 'next/image';

interface CalendarCardProps {
  calendar: SavedCalendarMeta;
  viewMode?: boolean;
}

export default function CalendarCard({ calendar, viewMode = false }: CalendarCardProps) {
  const { deleteCalendar } = useCalendarStore();
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm(`Êtes-vous sûr de vouloir supprimer le calendrier "${calendar.name}" ?`)) {
      setIsDeleting(true);
      await deleteCalendar(calendar.id);
      setIsDeleting(false);
    }
  };

  const cardLink = viewMode
    ? `/view?id=${calendar.id}`
    : `/create?id=${calendar.id}`;

  return (
    <div className="relative group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link
        href={cardLink}
        className="block h-full"
      >
        <div className="aspect-[297/210] bg-gray-100 relative">
          {calendar.previewImage ? (
            <Image
              src={calendar.previewImage}
              alt={calendar.name}
              className="object-cover"
              fill
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[var(--kiwi-light)]">
              <span className="text-[var(--kiwi-dark)] font-medium">Calendrier</span>
            </div>
          )}

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute top-2 right-2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            aria-label="Supprimer le calendrier"
          >
            {isDeleting ? (
              <svg className="w-5 h-5 animate-spin text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            )}
          </button>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-[var(--kiwi-darker)] mb-1 truncate">
            {calendar.name}
          </h3>
          <p className="text-sm text-gray-600">
            Modifié le {formatDate(calendar.updatedAt)}
          </p>
        </div>
      </Link>
    </div>
  );
}