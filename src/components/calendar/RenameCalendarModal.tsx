'use client';

import { useState } from 'react';
import { SavedCalendar } from '@/types/saved-calendar';
import useCalendarStore from '@/lib/store/calendar-store';
import Modal from '../ui/Modal';
import { Button } from '@/components/ui/Button';

interface RenameCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  calendar: SavedCalendar;
}

export default function RenameCalendarModal({ isOpen, onClose, calendar }: RenameCalendarModalProps) {
  const [newName, setNewName] = useState(calendar.meta.name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loadCalendar, saveCurrentCalendar } = useCalendarStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newName.trim()) {
      setError("Le nom ne peut pas être vide");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Charger les données actuelles du calendrier
      const currentCalendar = await loadCalendar(calendar.meta.id);

      if (!currentCalendar) {
        throw new Error("Calendrier non trouvé");
      }

      // Mettre à jour les données avec le nouveau nom
      const updatedFormData = {
        ...currentCalendar.formData,
        calendarName: newName
      };

      // Sauvegarder le calendrier avec le nouveau nom
      await saveCurrentCalendar(
        calendar.meta.id,
        updatedFormData,
        currentCalendar.childPhoto,
        undefined,
        newName
      );

      onClose();
    } catch {
      setError("Erreur lors du renommage du calendrier");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Renommer le calendrier">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="calendar-name" className="block mb-1 font-medium">
            Nouveau nom
          </label>
          <input
            type="text"
            id="calendar-name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--kiwi)]"
            placeholder="Nom du calendrier"
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
            {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}