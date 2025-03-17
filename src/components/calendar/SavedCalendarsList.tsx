'use client';

import { useEffect, useState } from 'react';
import { FadeIn } from '@/components/ui/motion';
import SavedCalendarCard from './SavedCalendarCard';
import useCalendarStore from '@/lib/store/calendar-store';
import Link from 'next/link';

export default function SavedCalendarsList() {
  const { calendarsList, loadCalendarsList, isLoading } = useCalendarStore();
  const [initialized, setInitialized] = useState(false);
  
  useEffect(() => {
    // Charger la liste des calendriers au montage du composant
    const initialize = async () => {
      await loadCalendarsList();
      setInitialized(true);
    };
    
    initialize();
  }, [loadCalendarsList]);
  
  // Ne rien afficher pendant le chargement initial
  if (!initialized) {
    return null;
  }
  
  // Afficher un message si aucun calendrier n'est sauvegardé
  if (calendarsList.length === 0) {
    return (
      <FadeIn>
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600 mb-4">
            Vous n'avez pas encore de calendriers sauvegardés
          </h3>
          <p className="text-gray-500 mb-6">
            Créez votre premier calendrier pour le retrouver ici.
          </p>
          <Link
            href="/create/new"
            className="btn-primary px-6 py-3 rounded-lg text-center font-medium"
          >
            Créer mon premier calendrier
          </Link>
        </div>
      </FadeIn>
    );
  }
  
  return (
    <FadeIn>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {calendarsList.map(calendar => (
          <SavedCalendarCard 
            key={calendar.id} 
            calendar={calendar} 
          />
        ))}
      </div>
    </FadeIn>
  );
}