import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';
import { SavedCalendar, SavedCalendarMeta, SavedCalendarsList } from '@/types/saved-calendar';
import { CalendarFormData } from '@/app/create/types';

// Clés de stockage
const CALENDARS_META_KEY = 'kidwik_calendars_meta';
const CALENDAR_DATA_PREFIX = 'kidwik_calendar_';

// Configurer localforage
localforage.config({
  name: 'KidWik',
  storeName: 'calendar_storage',
  description: 'Stockage des calendriers KidWik'
});

/**
 * Service pour gérer le stockage des calendriers
 */
export const CalendarStorage = {
  /**
   * Initialise le stockage si nécessaire
   */
  async init(): Promise<void> {
    const exists = await localforage.getItem<SavedCalendarsList>(CALENDARS_META_KEY);
    if (!exists) {
      await localforage.setItem<SavedCalendarsList>(CALENDARS_META_KEY, []);
    }
  },

  /**
   * Récupère la liste des métadonnées de tous les calendriers sauvegardés
   */
  async getCalendarsList(): Promise<SavedCalendarsList> {
    await this.init();
    const list = await localforage.getItem<SavedCalendarsList>(CALENDARS_META_KEY);
    return list || [];
  },

  /**
   * Récupère les données complètes d'un calendrier
   */
  async getCalendar(id: string): Promise<SavedCalendar | null> {
    const key = `${CALENDAR_DATA_PREFIX}${id}`;
    return await localforage.getItem<SavedCalendar>(key);
  },

  /**
   * Crée un nouveau calendrier avec des données initiales
   */
  async createCalendar(
    name: string, 
    formData: CalendarFormData, 
    childPhoto: string | null = null,
    previewImage?: string
  ): Promise<SavedCalendarMeta> {
    await this.init();
    
    const now = new Date().toISOString();
    const id = uuidv4();
    
    const meta: SavedCalendarMeta = {
      id,
      name,
      createdAt: now,
      updatedAt: now,
      previewImage
    };
    
    const calendarData: SavedCalendar = {
      meta,
      formData,
      childPhoto
    };
    
    // Sauvegarder les données du calendrier
    await localforage.setItem(`${CALENDAR_DATA_PREFIX}${id}`, calendarData);
    
    // Mettre à jour la liste des métadonnées
    const list = await this.getCalendarsList();
    list.push(meta);
    await localforage.setItem(CALENDARS_META_KEY, list);
    
    return meta;
  },

  /**
   * Met à jour un calendrier existant
   */
  async updateCalendar(
    id: string, 
    updates: { name?: string; formData?: CalendarFormData; childPhoto?: string | null; previewImage?: string }
  ): Promise<SavedCalendarMeta | null> {
    const calendar = await this.getCalendar(id);
    if (!calendar) return null;
    
    // Mise à jour des données
    const updatedCalendar: SavedCalendar = {
      ...calendar,
      meta: {
        ...calendar.meta,
        name: updates.name ?? calendar.meta.name,
        updatedAt: new Date().toISOString(),
        previewImage: updates.previewImage ?? calendar.meta.previewImage
      },
      formData: updates.formData ?? calendar.formData,
      childPhoto: updates.childPhoto !== undefined ? updates.childPhoto : calendar.childPhoto
    };
    
    // Sauvegarder les données mises à jour
    await localforage.setItem(`${CALENDAR_DATA_PREFIX}${id}`, updatedCalendar);
    
    // Mettre à jour la liste des métadonnées
    const list = await this.getCalendarsList();
    const updatedList = list.map(item => item.id === id ? updatedCalendar.meta : item);
    await localforage.setItem(CALENDARS_META_KEY, updatedList);
    
    return updatedCalendar.meta;
  },

  /**
   * Supprime un calendrier
   */
  async deleteCalendar(id: string): Promise<boolean> {
    // Supprimer les données du calendrier
    await localforage.removeItem(`${CALENDAR_DATA_PREFIX}${id}`);
    
    // Mettre à jour la liste des métadonnées
    const list = await this.getCalendarsList();
    const updatedList = list.filter(item => item.id !== id);
    await localforage.setItem(CALENDARS_META_KEY, updatedList);
    
    return true;
  }
};

export default CalendarStorage;