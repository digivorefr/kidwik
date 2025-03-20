'use client';

import { useState, useEffect } from 'react';
import useCalendarStore from '@/lib/store/calendar-store';
import Modal from '../ui/Modal';
import { Button } from '@/components/ui/Button';

interface ExportCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  calendarId: string;
}

export default function ExportCalendarModal({ isOpen, onClose, calendarId }: ExportCalendarModalProps) {
  const [exportData, setExportData] = useState<string | null>(null);
  const [calendarName, setCalendarName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadReady, setDownloadReady] = useState(false);
  const { exportCalendar } = useCalendarStore();

  useEffect(() => {
    async function fetchExportData() {
      if (isOpen && calendarId) {
        setIsLoading(true);
        setError(null);
        setDownloadReady(false);

        const data = await exportCalendar(calendarId);

        if (data) {
          setExportData(data);
          // Extraire le nom du calendrier à partir des données exportées
          try {
            const parsedData = JSON.parse(data);
            if (parsedData.meta && parsedData.meta.name) {
              setCalendarName(parsedData.meta.name);
            }
          } catch (e) {
            console.error("Erreur lors de l'analyse des données exportées:", e);
          }
          setDownloadReady(true);
        } else {
          setError("Erreur lors de l'exportation du calendrier");
        }

        setIsLoading(false);
      }
    }

    fetchExportData();
  }, [isOpen, calendarId, exportCalendar]);

  const handleDownload = () => {
    if (!exportData) return;

    // Créer un objet Blob à partir des données JSON
    const blob = new Blob([exportData], { type: 'application/json' });

    // Créer un URL pour le Blob
    const url = URL.createObjectURL(blob);

    // Créer un élément a temporaire
    const a = document.createElement('a');
    a.href = url;

    // Formater la date actuelle pour le nom de fichier
    const date = new Date().toISOString().split('T')[0];
    const sanitizedName = calendarName.replace(/[^a-z0-9]/gi, '_').toLowerCase();

    // Définir le nom du fichier
    a.download = `kidwik_${sanitizedName}_${date}.json`;

    // Ajouter l'élément au document
    document.body.appendChild(a);

    // Cliquer sur le lien
    a.click();

    // Nettoyer
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          <div className="flex justify-center my-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--kiwi-dark)]"></div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {downloadReady && (
              <div className="p-4 bg-green-50 text-green-800 rounded-md flex flex-col items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-center font-medium">Votre calendrier est prêt à être téléchargé !</p>
                <p className="text-center text-sm">Cliquez sur le bouton ci-dessous pour télécharger le fichier JSON.</p>
              </div>
            )}

            <div className="flex flex-col gap-3 mt-2">
              <p className="text-gray-700">
                Le fichier téléchargé contient toutes les données de votre calendrier, que vous pourrez importer ultérieurement.
              </p>

              <Button
                onClick={handleDownload}
                variant="primary"
                disabled={!downloadReady}
                className="w-full"
              >
                Télécharger le fichier JSON
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button type="button" onClick={onClose} variant="outline">
            Fermer
          </Button>
        </div>
      </div>
    </Modal>
  );
}