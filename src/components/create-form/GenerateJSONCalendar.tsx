import { useState } from "react";
import { useEffect } from "react";
import { Button } from "../ui/Button";
import useCalendarStore from "@/lib/store/calendar-store";

export default function GeneratePdfCalendar({ calendarId }: { calendarId: string }) {
  const [exportData, setExportData] = useState<string | null>(null);
  const [calendarName, setCalendarName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadReady, setDownloadReady] = useState(false);
  const { exportCalendar } = useCalendarStore();
  
  useEffect(() => {
    async function fetchExportData() {
      if (calendarId) {
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
  }, [calendarId, exportCalendar]);

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
    <div className="flex flex-col gap-4">
      {error && (
        <div className="p-3 bg-red-700 text-red-300 rounded-md">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center my-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--kiwi-dark)]"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">

          <div className="flex flex-col gap-3 mt-2">
            <p>
              Vous pouvez aussi exporter votre calendrier en format JSON.
            </p>

            <Button
              onClick={handleDownload}
              variant="primary"
              disabled={!downloadReady}
              className="w-full flex items-center justify-center gap-1"
              size="sm"
            >
              <span className="material-symbols-rounded">share_windows</span>
              <span>Exporter</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
};