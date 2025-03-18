import { create } from 'zustand';
import html2canvas from 'html2canvas-pro';
import { SavedCalendar, SavedCalendarMeta, SavedCalendarsList } from '@/types/saved-calendar';
import CalendarStorage from '@/lib/storage/calendar-storage';
import { CalendarFormData, DEFAULT_FORM_DATA } from '@/app/create/types';

interface CalendarState {
  // État
  calendarsList: SavedCalendarsList;
  currentCalendarId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  initializeStore: () => Promise<void>;
  loadCalendarsList: () => Promise<SavedCalendarsList>;
  createNewCalendar: (name: string) => Promise<SavedCalendarMeta>;
  loadCalendar: (id: string) => Promise<SavedCalendar | null>;
  saveCurrentCalendar: (
    id: string,
    formData: CalendarFormData,
    childPhoto: string | null,
    previewElement?: HTMLElement,
    name?: string
  ) => Promise<SavedCalendarMeta | null>;
  deleteCalendar: (id: string) => Promise<boolean>;
  setCurrentCalendarId: (id: string | null) => void;
  exportCalendar: (id: string) => Promise<string | null>;
  importCalendar: (jsonString: string) => Promise<SavedCalendarMeta | null>;
}

/**
 * Crée une capture d'écran de l'élément de prévisualisation
 */
async function createPreviewImage(element: HTMLElement): Promise<string> {
  try {
    const canvas = await html2canvas(element, {
      scale: 480 / element.clientWidth, // Échelle réduite pour la miniature
      useCORS: true,
      backgroundColor: '#ffffff',
    });
    return canvas.toDataURL('image/jpeg', 0.78);
  } catch (error) {
    console.error("Erreur lors de la création de la prévisualisation:", error);
    return '';
  }
}

/**
 * Store Zustand pour la gestion des calendriers
 */
export const useCalendarStore = create<CalendarState>((set, get) => ({
  calendarsList: [],
  currentCalendarId: null,
  isLoading: false,
  error: null,

  initializeStore: async () => {
    set({ isLoading: true, error: null });
    try {
      await CalendarStorage.init();
      const list = await CalendarStorage.getCalendarsList();
      set({ calendarsList: list, isLoading: false });
    } catch (error) {
      set({ error: "Erreur lors de l'initialisation du stockage", isLoading: false });
      console.error("Erreur lors de l'initialisation du stockage:", error);
    }
  },

  loadCalendarsList: async () => {
    set({ isLoading: true, error: null });
    try {
      const list = await CalendarStorage.getCalendarsList();
      set({ calendarsList: list, isLoading: false });
      return list;
    } catch (error) {
      set({ error: "Erreur lors du chargement des calendriers", isLoading: false });
      console.error("Erreur lors du chargement des calendriers:", error);
      return [];
    }
  },

  createNewCalendar: async (name: string) => {
    set({ isLoading: true, error: null });
    try {
      // Créer avec les valeurs par défaut
      const meta = await CalendarStorage.createCalendar(name, DEFAULT_FORM_DATA, null);

      // Mettre à jour la liste
      const updatedList = [...get().calendarsList, meta];
      set({
        calendarsList: updatedList,
        currentCalendarId: meta.id,
        isLoading: false
      });

      return meta;
    } catch (error) {
      set({ error: "Erreur lors de la création du calendrier", isLoading: false });
      console.error("Erreur lors de la création du calendrier:", error);
      throw error;
    }
  },

  loadCalendar: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const calendar = await CalendarStorage.getCalendar(id);
      if (calendar) {
        set({ currentCalendarId: id, isLoading: false });
        return calendar;
      } else {
        set({ error: "Calendrier non trouvé", isLoading: false });
        return null;
      }
    } catch (error) {
      set({ error: "Erreur lors du chargement du calendrier", isLoading: false });
      console.error("Erreur lors du chargement du calendrier:", error);
      return null;
    }
  },

  saveCurrentCalendar: async (id, formData, childPhoto, previewElement, name) => {
    set({ isLoading: true, error: null });
    try {
      // Générer une prévisualisation si un élément est fourni
      let previewImage: string | undefined;
      if (previewElement) {
        previewImage = await createPreviewImage(previewElement);
      }

      // Mettre à jour le calendrier
      const meta = await CalendarStorage.updateCalendar(id, {
        name,
        formData,
        childPhoto,
        previewImage
      });

      if (meta) {
        // Mettre à jour la liste locale
        const updatedList = get().calendarsList.map(item =>
          item.id === id ? meta : item
        );

        set({ calendarsList: updatedList, isLoading: false });
        return meta;
      } else {
        set({ error: "Calendrier non trouvé lors de la sauvegarde", isLoading: false });
        return null;
      }
    } catch (error) {
      set({ error: "Erreur lors de la sauvegarde du calendrier", isLoading: false });
      console.error("Erreur lors de la sauvegarde du calendrier:", error);
      return null;
    }
  },

  deleteCalendar: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const success = await CalendarStorage.deleteCalendar(id);

      if (success) {
        // Mettre à jour la liste locale
        const updatedList = get().calendarsList.filter(item => item.id !== id);

        // Réinitialiser l'ID courant si c'est celui qui est supprimé
        if (get().currentCalendarId === id) {
          set({ currentCalendarId: null });
        }

        set({ calendarsList: updatedList, isLoading: false });
        return true;
      } else {
        set({ error: "Erreur lors de la suppression du calendrier", isLoading: false });
        return false;
      }
    } catch (error) {
      set({ error: "Erreur lors de la suppression du calendrier", isLoading: false });
      console.error("Erreur lors de la suppression du calendrier:", error);
      return false;
    }
  },

  setCurrentCalendarId: (id: string | null) => {
    set({ currentCalendarId: id });
  },

  exportCalendar: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const exportedData = await CalendarStorage.exportCalendar(id);
      set({ isLoading: false });
      return exportedData;
    } catch (error) {
      set({ error: "Erreur lors de l'exportation du calendrier", isLoading: false });
      console.error("Erreur lors de l'exportation du calendrier:", error);
      return null;
    }
  },

  importCalendar: async (jsonString: string) => {
    set({ isLoading: true, error: null });
    try {
      const importedCalendar = await CalendarStorage.importCalendar(jsonString);
      
      if (importedCalendar) {
        // Mettre à jour la liste locale avec le calendrier importé
        const updatedList = [...get().calendarsList, importedCalendar];
        set({
          calendarsList: updatedList,
          isLoading: false
        });
        return importedCalendar;
      } else {
        set({ error: "Format de calendrier invalide", isLoading: false });
        return null;
      }
    } catch (error) {
      set({ error: "Erreur lors de l'importation du calendrier", isLoading: false });
      console.error("Erreur lors de l'importation du calendrier:", error);
      return null;
    }
  }
}));

export default useCalendarStore;