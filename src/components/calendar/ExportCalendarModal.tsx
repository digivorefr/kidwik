'use client';

import { useState, useEffect } from 'react';
import useCalendarStore from '@/lib/store/calendar-store';
import Modal from '../ui/Modal';

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
              
              <button
                onClick={handleCopyToClipboard}
                className="absolute top-2 right-2 px-2 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 cursor-pointer"
              >
                Copier
              </button>
            </div>
            
            {copySuccess && (
              <div className="p-2 bg-green-50 text-green-700 rounded-md text-sm">
                Données copiées dans le presse-papier!
              </div>
            )}
            
            <div className="flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-[var(--kiwi)] text-white rounded-md hover:bg-[var(--kiwi-dark)] cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}