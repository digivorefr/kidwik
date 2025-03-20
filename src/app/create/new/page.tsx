'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FadeIn } from '@/components/ui/motion';
import { Button, ButtonLink } from '@/components/ui/Button';
import useCalendarStore from '@/lib/store/calendar-store';

export default function NewCalendarPage() {
  const router = useRouter();
  const [calendarName, setCalendarName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer la fonction de création de calendrier du store
  const { createNewCalendar } = useCalendarStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!calendarName.trim()) {
      setError('Veuillez entrer un nom pour votre calendrier');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Créer un nouveau calendrier et obtenir les métadonnées
      const newCalendarMeta = await createNewCalendar(calendarName);

      console.log("Nouveau calendrier créé:", newCalendarMeta.id, newCalendarMeta.name);

      // Rediriger vers la page de création avec l'ID du calendrier nouvellement créé
      router.push(`/create?id=${newCalendarMeta.id}`);
    } catch (err) {
      console.error('Error creating calendar:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto py-8">
      <FadeIn>
        <div className="max-w-lg mx-auto">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-[var(--kiwi-darker)] mb-6">
              Créer un nouveau calendrier
            </h1>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="calendarName"
                  className="block text-gray-700 font-medium mb-2"
                >
                  Nom du calendrier
                </label>
                <input
                  type="text"
                  id="calendarName"
                  value={calendarName}
                  onChange={(e) => setCalendarName(e.target.value)}
                  placeholder="Ex: Calendrier de Lucas"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--kiwi-medium)]"
                  disabled={isLoading}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Vous pourrez modifier le nom plus tard si besoin.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isLoading}
                  fullWidth
                >
                  {isLoading ? 'Création...' : 'Créer et continuer'}
                </Button>

                <ButtonLink
                  href="/"
                  variant="outline"
                  size="lg"
                >
                  Annuler
                </ButtonLink>
              </div>
            </form>
          </div>
        </div>
      </FadeIn>
    </main>
  );
}