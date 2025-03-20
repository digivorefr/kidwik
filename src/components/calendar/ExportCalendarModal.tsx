'use client';

import { useState, useEffect } from 'react';
import useCalendarStore from '@/lib/store/calendar-store';
import Modal from '../ui/Modal';
import { Button, IconButton } from '@/components/ui/Button';

interface ExportCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  calendarId: string;
}

export default function ExportCalendarModal({ isOpen, onClose, calendarId }: ExportCalendarModalProps) {
  const [exportedData, setExportedData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const { exportCalendar } = useCalendarStore();

  useEffect(() => {
    const fetchExportData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await exportCalendar(calendarId);
        setExportedData(data);
      } catch {
        setError("Erreur lors de l'exportation du calendrier");
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchExportData();
    }
  }, [isOpen, calendarId, exportCalendar]);

  const handleCopyToClipboard = async () => {
    if (!exportedData) return;

    try {
      await navigator.clipboard.writeText(exportedData);
      setCopySuccess(true);

      // Reset le message de succès après 3 secondes
      setTimeout(() => setCopySuccess(false), 3000);
    } catch {
      setError("Impossible de copier dans le presse-papier");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Exporter le calendrier">
      <div className="flex flex-col gap-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[var(--kiwi-dark)]"></div>
          </div>
        ) : (
          <>
            <p className="text-gray-700">
              Voici les données de votre calendrier. Copiez-les et enregistrez-les pour pouvoir les importer ultérieurement.
            </p>

            <div className="relative">
              <textarea
                value={exportedData || ''}
                readOnly
                className="w-full h-40 p-3 border border-gray-300 rounded-md font-mono text-sm bg-gray-50"
              />

              <IconButton
                onClick={handleCopyToClipboard}
                ariaLabel="Copier dans le presse-papier"
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-12a2 2 0 00-2-2h-2M8 5a2 2 0 002-2h4a2 2 0 002 2M8 5a2 2 0 01-2 2h10a2 2 0 01-2-2" />
                  </svg>
                }
                className="absolute top-2 right-2 px-2 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
              />
            </div>

            {copySuccess && (
              <div className="p-2 bg-green-50 text-green-700 rounded-md text-sm">
                Données copiées dans le presse-papier!
              </div>
            )}

            <div className="flex justify-end gap-3 mt-2">
              <Button
                type="button"
                onClick={onClose}
                variant="primary"
              >
                Fermer
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}