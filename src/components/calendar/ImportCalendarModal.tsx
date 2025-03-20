'use client';

import { useState, useRef } from 'react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { importCalendar } = useCalendarStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);

    // Réinitialiser les erreurs lorsqu'un nouveau fichier est sélectionné
    if (file) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Veuillez sélectionner un fichier JSON");
      return;
    }

    // Vérifier l'extension du fichier
    if (!selectedFile.name.toLowerCase().endsWith('.json')) {
      setError("Le fichier doit être au format JSON (.json)");
      return;
    }

    // Vérifier la taille du fichier (max 10MB pour éviter les problèmes de performance)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`Le fichier est trop volumineux (${(selectedFile.size / (1024 * 1024)).toFixed(2)}MB). La taille maximale est de 10MB.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Lire le contenu du fichier
      const fileReader = new FileReader();

      // Créer une promesse pour la lecture du fichier
      const readFilePromise = new Promise<string>((resolve, reject) => {
        fileReader.onload = (event) => {
          if (event.target?.result) {
            resolve(event.target.result as string);
          } else {
            reject(new Error("Erreur lors de la lecture du fichier"));
          }
        };

        fileReader.onerror = () => {
          reject(new Error("Erreur lors de la lecture du fichier"));
        };
      });

      // Lancer la lecture du fichier
      fileReader.readAsText(selectedFile);

      // Attendre que la lecture soit terminée
      const jsonData = await readFilePromise;

      // Validation basique du format JSON avant de tenter l'importation
      try {
        const parsed = JSON.parse(jsonData);
        // Vérifier si le JSON contient les structures attendues
        if (!parsed.meta || !parsed.formData) {
          setError("Le fichier JSON ne contient pas les données requises (meta et formData).");
          setIsSubmitting(false);
          return;
        }
      } catch (_) {
        setError("Le fichier ne contient pas de JSON valide. Vérifiez le format du fichier.");
        setIsSubmitting(false);
        return;
      }

      // Importer le calendrier avec les données JSON
      const importedCalendar = await importCalendar(jsonData);

      if (importedCalendar) {
        onClose();
        // Rediriger vers la vue détaillée du calendrier importé
        router.push(`/view?id=${importedCalendar.id}`);
      } else {
        setError("Format de données invalide. Assurez-vous que le fichier JSON est au format correct.");
      }
    } catch (error: unknown) {
      console.error("Erreur lors de l'importation:", error);

      // Vérifier si c'est une erreur de quota
      if (error instanceof DOMException &&
          (error.name === 'QuotaExceededError' || error.code === 22)) {
        setError(
          "Espace de stockage insuffisant. L&apos;application essaie de libérer de l&apos;espace et de compresser les données. " +
          "Si le problème persiste, essayez de supprimer d&apos;anciens calendriers."
        );
      } else if (error instanceof Error && error.message.includes('quota')) {
        setError(
          "Espace de stockage insuffisant. L&apos;application essaie de libérer de l&apos;espace et de compresser les données. " +
          "Si le problème persiste, essayez de supprimer d&apos;anciens calendriers."
        );
      } else if (error instanceof Error && error.message.includes('JSON')) {
        setError("Le fichier ne contient pas de données JSON valides. Vérifiez le format du fichier.");
      } else if (error instanceof Error && error.message.includes('Unicode') ||
                error instanceof Error && error.message.includes('encoding') ||
                error instanceof Error && error.message.includes('Latin1')) {
        setError("Problème d&apos;encodage des caractères dans le fichier. Essayez d&apos;utiliser un éditeur de texte pour vérifier l&apos;encodage UTF-8.");
      } else if (error instanceof Error && error.message.includes('Maximum call stack')) {
        setError("Le fichier est trop complexe pour être traité. Essayez un fichier plus petit ou contactez le support.");
      } else {
        setError(`Erreur lors de l${String.fromCharCode(39)}importation: ${error instanceof Error ? error.message : "Vérifiez que le fichier est un JSON valide."}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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
          Sélectionnez un fichier JSON contenant les données {"d'un"} calendrier exporté.
        </p>

        <div className="flex flex-col items-center gap-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            className="hidden"
          />

          <div
            onClick={triggerFileInput}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 w-full flex flex-col items-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>

            {selectedFile ? (
              <div className="text-center">
                <p className="font-medium text-[var(--kiwi-dark)]">{selectedFile.name}</p>
                <p className="text-gray-500 text-sm mt-1">
                  {(selectedFile.size / 1024).toFixed(1)} Ko
                </p>
              </div>
            ) : (
              <div className="text-center">
                <p className="font-medium text-gray-700">Cliquez pour sélectionner un fichier</p>
                <p className="text-gray-500 text-sm mt-1">
                  ou glissez et déposez ici
                </p>
              </div>
            )}
          </div>

          {selectedFile && (
            <Button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              variant="text"
              size="sm"
            >
              Supprimer le fichier
            </Button>
          )}
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
            disabled={isSubmitting || !selectedFile}
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