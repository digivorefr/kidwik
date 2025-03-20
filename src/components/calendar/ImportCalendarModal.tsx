'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useCalendarStore from '@/lib/store/calendar-store';
import Modal from '../ui/Modal';
import { Button } from '@/components/ui/Button';

interface ImportCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportCalendarModal({ isOpen, onClose }: ImportCalendarModalProps) {
  const router = useRouter();
  const [jsonData, setJsonData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { importCalendar } = useCalendarStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jsonData.trim()) {
      setError("Veuillez entrer des données JSON valides");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const importedCalendar = await importCalendar(jsonData);

      if (importedCalendar) {
        onClose();

        // Rediriger vers la vue détaillée du calendrier importé
        router.push(`/view?id=${importedCalendar.id}`);
      } else {
        setError("Format de données invalide. Assurez-vous d'avoir copié l'intégralité des données exportées.");
      }
    } catch {
      setError("Erreur lors de l'importation. Vérifiez que les données sont au bon format.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Importer un calendrier">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <p className="text-gray-700">
          Collez les données JSON du calendrier que vous souhaitez importer.
        </p>

        <div>
          <textarea
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            className="w-full h-40 p-3 border border-gray-300 rounded-md font-mono text-sm"
            placeholder='{"meta": {"id": "..."},"formData": {...},...}'
            required
          />
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="primary"
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'Importation...' : 'Importer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}