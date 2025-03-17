'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FadeIn } from '@/components/ui/motion';
import useCalendarStore from '@/lib/store/calendar-store';

export default function NewCalendarPage() {
  const router = useRouter();
  const { createNewCalendar, isLoading } = useCalendarStore();
  const [calendarName, setCalendarName] = useState('Mon calendrier');
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!calendarName.trim()) {
      setError('Veuillez donner un nom à votre calendrier');
      return;
    }
    
    try {
      const meta = await createNewCalendar(calendarName.trim());
      // Redirection vers l'éditeur avec l'ID du nouveau calendrier
      router.push(`/create?id=${meta.id}`);
    } catch (err) {
      setError('Une erreur est survenue lors de la création du calendrier');
      console.error(err);
    }
  };
  
  return (
    <main className="flex-grow container mx-auto p-8">
      <FadeIn>
        <div className="max-w-lg mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--kiwi-darker)] mb-4">
              Créer un nouveau calendrier
            </h1>
            <p className="text-lg">
              Donnez un nom à votre calendrier pour commencer
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label 
                  htmlFor="calendar-name" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nom du calendrier
                </label>
                <input
                  type="text"
                  id="calendar-name"
                  name="calendar-name"
                  value={calendarName}
                  onChange={(e) => setCalendarName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--kiwi-dark)] focus:border-transparent"
                  placeholder="Ex: Calendrier de Paul"
                  disabled={isLoading}
                />
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
                  {error}
                </div>
              )}
              
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary px-6 py-3 rounded-lg text-center font-medium flex-1 flex justify-center items-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Création...
                    </>
                  ) : (
                    'Créer et continuer'
                  )}
                </button>
                
                <Link
                  href="/"
                  className="px-6 py-3 rounded-lg text-center border border-[var(--kiwi-dark)] text-[var(--kiwi-dark)] font-medium"
                >
                  Annuler
                </Link>
              </div>
            </form>
          </div>
        </div>
      </FadeIn>
    </main>
  );
}