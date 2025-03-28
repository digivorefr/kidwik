import localforage from 'localforage';
import { v4 as uuidv4 } from 'uuid';
import { SavedCalendar, SavedCalendarMeta, SavedCalendarsList } from '@/types/saved-calendar';
import { CalendarFormData } from '@/app/create/types';
import { SINGLE_DAY_MOMENT } from '@/app/create/types';

// Clés de stockage
const CALENDARS_META_KEY = 'kidwik_calendars_meta';
const CALENDAR_DATA_PREFIX = 'kidwik_calendar_';

// Configurer localforage
export const initializeStorage = async () => {
  return localforage.config({
    driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
    name: 'kidwik',
    version: 1.0,
    description: 'Stockage des calendriers kidwik'
  });
};

/**
 * Service pour gérer le stockage des calendriers
 */
export const CalendarStorage = {
  /**
   * Initialise le stockage si nécessaire
   */
  async init(): Promise<void> {
    try {
      // Vérifier si le stockage est déjà initialisé
      const exists = await localforage.getItem<SavedCalendarsList>(CALENDARS_META_KEY);
      if (!exists) {
        // Créer une liste vide
        await localforage.setItem<SavedCalendarsList>(CALENDARS_META_KEY, []);
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation du stockage:", error);
      // En cas d'erreur, essayer de réinitialiser le stockage
      await localforage.setItem<SavedCalendarsList>(CALENDARS_META_KEY, []);
    }
  },

  /**
   * Récupère la liste des métadonnées de tous les calendriers sauvegardés
   */
  async getCalendarsList(): Promise<SavedCalendarsList> {
    try {
      // S'assurer que le stockage est initialisé
      await this.init();

      // Récupérer la liste
      const list = await localforage.getItem<SavedCalendarsList>(CALENDARS_META_KEY);

      if (!list) {
        return [];
      }

      return list;
    } catch (error) {
      console.error("Erreur lors de la récupération de la liste des calendriers:", error);
      return [];
    }
  },

  /**
   * Récupère un calendrier par son ID
   */
  async getCalendar(id: string): Promise<SavedCalendar | null> {
    await this.init();

    try {
      const key = `${CALENDAR_DATA_PREFIX}${id}`;
      const data = await localforage.getItem(key);

      if (!data) {
        return null;
      }

      let calendar: SavedCalendar;

      // Vérifier le type de données récupérées
      if (typeof data === 'object' && data !== null) {
        // Les données sont déjà un objet (non compressé)
        calendar = data as SavedCalendar;
      } else if (typeof data === 'string') {
        // Les données sont une chaîne - soit JSON brut, soit compressé
        try {
          if (data.startsWith('{')) {
            // C'est déjà du JSON
            calendar = JSON.parse(data) as SavedCalendar;
          } else {
            // C'est probablement compressé
            const decompressedData = await this.decompressString(data);
            calendar = JSON.parse(decompressedData) as SavedCalendar;
          }
        } catch (parseError) {
          console.error(`Erreur lors du parsing des données pour ${id}:`, parseError);
          return null;
        }
      } else {
        console.error(`Format de données non reconnu pour ${id}:`, data);
        return null;
      }

      // Migrer les données vers le nouveau format si nécessaire
      return this.migrateCalendarData(calendar);
    } catch (error) {
      console.error(`Erreur lors de la récupération du calendrier ${id}:`, error);
      return null;
    }
  },

  /**
   * Crée un nouveau calendrier avec des données initiales
   */
  async createCalendar(
    name: string,
    formData: CalendarFormData,
    childPhoto: string | null = null,
    previewImage?: string,
    specificId?: string
  ): Promise<SavedCalendarMeta> {
    await this.init();

    const now = new Date().toISOString();
    const id = specificId || uuidv4();

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

    try {
      // Sauvegarder les données du calendrier au format JSON
      const jsonString = JSON.stringify(calendarData);
      await localforage.setItem(`${CALENDAR_DATA_PREFIX}${id}`, jsonString);

      // Mettre à jour la liste des métadonnées
      const list = await this.getCalendarsList();
      list.push(meta);
      await localforage.setItem(CALENDARS_META_KEY, list);

      return meta;
    } catch (error) {
      console.error("Erreur lors de la création du calendrier:", error);
      throw error;
    }
  },

  /**
   * Met à jour un calendrier existant
   */
  async updateCalendar(
    id: string,
    updates: { name?: string; formData?: CalendarFormData; childPhoto?: string | null; previewImage?: string }
  ): Promise<SavedCalendarMeta | null> {
    try {
      // Vérifier que le calendrier existe
      const calendar = await this.getCalendar(id);
      if (!calendar) {
        return null;
      }

      // Préparer les données mises à jour
      const now = new Date().toISOString();
      const updatedMeta: SavedCalendarMeta = {
        ...calendar.meta,
        name: updates.name !== undefined ? updates.name : calendar.meta.name,
        updatedAt: now,
        previewImage: updates.previewImage !== undefined ? updates.previewImage : calendar.meta.previewImage
      };

      const updatedData: SavedCalendar = {
        meta: updatedMeta,
        formData: updates.formData !== undefined ? updates.formData : calendar.formData,
        childPhoto: updates.childPhoto !== undefined ? updates.childPhoto : calendar.childPhoto
      };

      const regularKey = `${CALENDAR_DATA_PREFIX}${id}`;

      try {
        // Toujours essayer de sauvegarder sans compression d'abord
        const jsonString = JSON.stringify(updatedData);
        await localforage.setItem(regularKey, jsonString);

        // Mise à jour réussie sans compression
        // Mettre à jour la liste des métadonnées
        const list = await this.getCalendarsList();
        const updatedList = list.map(item =>
          item.id === id ? updatedMeta : item
        );
        await localforage.setItem(CALENDARS_META_KEY, updatedList);

        return updatedMeta;
      } catch (error) {
        console.error("Erreur lors de la mise à jour du calendrier:", error);
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du calendrier:", error);
      return null;
    }
  },

  /**
   * Supprime un calendrier par son ID
   */
  async deleteCalendar(id: string): Promise<boolean> {
    await this.init();

    try {
      // Supprimer les deux versions potentielles (compressée et non compressée)
      await localforage.removeItem(`${CALENDAR_DATA_PREFIX}${id}`);
      await localforage.removeItem(`${CALENDAR_DATA_PREFIX}${id}_compressed`);

      // Mettre à jour la liste des métadonnées
      const list = await this.getCalendarsList();
      const updatedList = list.filter(item => item.id !== id);
      await localforage.setItem(CALENDARS_META_KEY, updatedList);

      return true;
    } catch (error) {
      console.error(`Erreur lors de la suppression du calendrier ${id}:`, error);
      return false;
    }
  },

  /**
   * Exporte un calendrier sous forme de chaîne JSON
   */
  async exportCalendar(id: string): Promise<string | null> {
    const calendar = await this.getCalendar(id);
    if (!calendar) return null;

    // Convertir en JSON pour l'export
    return JSON.stringify(calendar);
  },

  /**
   * Compresse une chaîne de caractères
   */
  async compressString(string: string): Promise<string> {
    try {
      // Utiliser TextEncoder pour convertir la chaîne en Uint8Array
      const textEncoder = new TextEncoder();
      const uint8Array = textEncoder.encode(string);

      // Compresser avec compression stream API si disponible
      if (typeof CompressionStream !== 'undefined') {
        try {
          const cs = new CompressionStream('gzip');
          const writer = cs.writable.getWriter();
          writer.write(uint8Array);
          writer.close();

          const reader = cs.readable.getReader();
          const chunks: Uint8Array[] = [];

          let result;
          while (!(result = await reader.read()).done) {
            chunks.push(result.value);
          }

          // Concaténer tous les morceaux
          let totalLength = 0;
          for (const chunk of chunks) {
            totalLength += chunk.length;
          }

          const compressedArray = new Uint8Array(totalLength);
          let offset = 0;
          for (const chunk of chunks) {
            compressedArray.set(chunk, offset);
            offset += chunk.length;
          }

          // Convertir en base64 sûr pour tous les caractères
          // Utiliser une fonction utilitaire qui gère correctement l'encodage Unicode
          return this.arrayBufferToBase64(compressedArray);
        } catch (compressionError) {
          console.error('Erreur spécifique à la compression:', compressionError);
          // Fallback en cas d'erreur de compression
          return this.safeStringToBase64(string);
        }
      } else {
        // Fallback si CompressionStream n'est pas disponible
        return this.safeStringToBase64(string);
      }
    } catch (error) {
      console.error('Erreur lors de la compression:', error);
      // Dernier recours: stocker en texte brut encodé
      return this.safeStringToBase64(string);
    }
  },

  /**
   * Décompresse une chaîne compressée
   */
  async decompressString(compressedString: string): Promise<string> {
    try {
      // Vérifier si la donnée est déjà un objet JSON (non compressé)
      if (typeof compressedString === 'string' &&
          (compressedString.startsWith('{') || compressedString.startsWith('['))) {
        return compressedString;
      }

      // S'assurer que nous avons une chaîne
      if (typeof compressedString !== 'string') {
        console.error('La donnée n\'est pas une chaîne:', compressedString);
        // Si c'est un objet, essayer de le stringifier directement
        if (typeof compressedString === 'object') {
          return JSON.stringify(compressedString);
        }
        return String(compressedString);
      }

      // Convertir la chaîne base64 en tableau d'octets
      const uint8Array = this.base64ToArrayBuffer(compressedString);

      // Décompresser avec DecompressionStream API si disponible
      if (typeof DecompressionStream !== 'undefined') {
        try {
          const ds = new DecompressionStream('gzip');
          const writer = ds.writable.getWriter();
          writer.write(uint8Array);
          writer.close();

          const reader = ds.readable.getReader();
          const chunks: Uint8Array[] = [];

          let result;
          while (!(result = await reader.read()).done) {
            chunks.push(result.value);
          }

          // Concaténer tous les morceaux
          let totalLength = 0;
          for (const chunk of chunks) {
            totalLength += chunk.length;
          }

          const decompressedArray = new Uint8Array(totalLength);
          let offset = 0;
          for (const chunk of chunks) {
            decompressedArray.set(chunk, offset);
            offset += chunk.length;
          }

          // Convertir en chaîne
          const textDecoder = new TextDecoder();
          return textDecoder.decode(decompressedArray);
        } catch (decompressionError) {
          console.error('Erreur spécifique à la décompression:', decompressionError);
          // Essayer l'approche fallback
          return this.base64ToString(compressedString);
        }
      } else {
        // Fallback si DecompressionStream n'est pas disponible
        return this.base64ToString(compressedString);
      }
    } catch (error) {
      console.error('Erreur lors de la décompression:', error);
      // Tenter avec l'encodage de base
      try {
        return this.base64ToString(compressedString);
      } catch {
        // Renvoyer une chaîne vide en cas d'échec total
        return '';
      }
    }
  },

  /**
   * Utilitaire pour convertir un ArrayBuffer en Base64 sans utiliser btoa
   */
  arrayBufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    // Utiliser des encodeurs/décodeurs d'URL pour éviter les problèmes avec btoa
    return window.btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  },

  /**
   * Utilitaire pour convertir une chaîne Base64 en ArrayBuffer sans utiliser atob
   */
  base64ToArrayBuffer(base64: string): Uint8Array {
    // S'assurer que nous avons une chaîne
    if (typeof base64 !== 'string') {
      console.error('L\'entrée base64 n\'est pas une chaîne:', base64);
      return new Uint8Array(0);
    }

    try {
      // Normaliser le base64 URL-safe
      const normalizedBase64 = base64
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      // Ajouter le padding si nécessaire
      const padding = normalizedBase64.length % 4;
      const paddedBase64 = padding ?
        normalizedBase64 + '='.repeat(4 - padding) :
        normalizedBase64;

      const binary = window.atob(paddedBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    } catch (error) {
      console.error('Erreur lors de la conversion base64 en ArrayBuffer:', error);
      return new Uint8Array(0);
    }
  },

  /**
   * Encodage sécurisé d'une chaîne Unicode en base64
   */
  safeStringToBase64(str: string): string {
    try {
      // Utiliser l'encodage URL pour convertir la chaîne en base64 compatible avec tous les caractères
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      }))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    } catch (error) {
      console.error('Erreur lors de l\'encodage en base64:', error);

      // Méthode alternative utilisant TextEncoder si btoa échoue
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      let base64 = '';
      const len = data.length;
      for (let i = 0; i < len; i++) {
        base64 += String.fromCharCode(data[i]);
      }
      return btoa(base64)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }
  },

  /**
   * Décodage sécurisé d'une chaîne base64 en Unicode
   */
  base64ToString(base64: string): string {
    // S'assurer que nous avons une chaîne
    if (typeof base64 !== 'string') {
      console.error('L\'entrée base64 n\'est pas une chaîne:', base64);
      return '';
    }

    try {
      // Si c'est déjà un objet JSON, le renvoyer tel quel
      if (base64.startsWith('{') || base64.startsWith('[')) {
        return base64;
      }

      // Normaliser le base64 URL-safe
      const normalizedBase64 = base64
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      // Ajouter le padding si nécessaire
      const padding = normalizedBase64.length % 4;
      const paddedBase64 = padding ?
        normalizedBase64 + '='.repeat(4 - padding) :
        normalizedBase64;

      // Décoder la chaîne en gérant correctement l'Unicode
      return decodeURIComponent(Array.prototype.map.call(atob(paddedBase64), (c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } catch (error) {
      console.error('Erreur lors du décodage base64:', error);

      // Méthode alternative si le décodage échoue
      try {
        const binaryString = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const decoder = new TextDecoder();
        return decoder.decode(bytes);
      } catch {
        return '';
      }
    }
  },

  /**
   * Nettoie le localStorage pour libérer de l'espace avant une opération
   */
  async cleanupStorage(): Promise<boolean> {
    try {
      // Récupérer la liste des métadonnées
      const metaList = await this.getCalendarsList();

      // Si nous avons plus de 5 calendriers, supprimer les plus anciens
      if (metaList.length > 5) {
        // Trier par date de mise à jour (du plus ancien au plus récent)
        const sortedList = [...metaList].sort((a, b) =>
          new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        );

        // Prendre les X premiers (les plus anciens) à supprimer
        const toDelete = sortedList.slice(0, sortedList.length - 5);

        // Supprimer ces calendriers
        for (const calendar of toDelete) {
          await localforage.removeItem(`${CALENDAR_DATA_PREFIX}${calendar.id}`);
        }

        // Mettre à jour la liste des métadonnées
        const newMetaList = metaList.filter(meta =>
          !toDelete.some(del => del.id === meta.id)
        );
        await localforage.setItem(CALENDARS_META_KEY, newMetaList);

        return true;
      }

      return false;
    } catch (error) {
      console.error('Erreur lors du nettoyage du stockage:', error);
      return false;
    }
  },

  /**
   * Importe un calendrier à partir d'une chaîne JSON
   */
  async importCalendar(jsonString: string): Promise<SavedCalendarMeta | null> {
    try {
      // Parser les données JSON
      const importedData = JSON.parse(jsonString) as SavedCalendar;

      // Valider les données importées
      if (!importedData.meta || !importedData.formData) {
        throw new Error("Format de données invalide");
      }

      // Générer un nouvel ID pour éviter les conflits
      const now = new Date().toISOString();
      const id = uuidv4();

      const meta: SavedCalendarMeta = {
        ...importedData.meta,
        id, // Nouvel ID
        name: `${importedData.meta.name} (Importé)`,
        createdAt: now,
        updatedAt: now
      };

      const calendarData: SavedCalendar = {
        meta,
        formData: importedData.formData,
        childPhoto: importedData.childPhoto
      };

      try {
        // Sauvegarder les données du calendrier
        await localforage.setItem(`${CALENDAR_DATA_PREFIX}${id}`, calendarData);

        // Mettre à jour la liste des métadonnées
        const list = await this.getCalendarsList();
        list.push(meta);
        await localforage.setItem(CALENDARS_META_KEY, list);

        return meta;
      } catch (error) {
        // Vérifier si c'est une erreur de quota
        const isQuotaError =
          error instanceof DOMException &&
          (error.name === 'QuotaExceededError' || error.code === 22);

        if (isQuotaError) {
          console.warn('Quota dépassé. Tentative de nettoyage et compression...');

          // Nettoyer le stockage
          await this.cleanupStorage();

          // Compresser les données
          const jsonData = JSON.stringify(calendarData);
          const compressedData = await this.compressString(jsonData);

          // Essayer de sauvegarder avec les données compressées
          await localforage.setItem(`${CALENDAR_DATA_PREFIX}${id}_compressed`, compressedData);

          // Mettre à jour la liste des métadonnées avec un marqueur de compression
          const listCompressed = await this.getCalendarsList();
          const metaCompressed = {
            ...meta,
            isCompressed: true // Ajouter un marqueur pour savoir que ce calendrier est compressé
          };
          listCompressed.push(metaCompressed);
          await localforage.setItem(CALENDARS_META_KEY, listCompressed);

          return metaCompressed;
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'importation du calendrier:", error);
      return null;
    }
  },

  // Fonction pour migrer les anciennes données vers le nouveau format
  migrateCalendarData(calendar: SavedCalendar): SavedCalendar {
    // Créer une copie pour éviter de modifier directement l'objet
    const migratedCalendar = { ...calendar }

    // Ajouter dayMoments si non présent
    if (!migratedCalendar.formData.dayMoments) {
      migratedCalendar.formData.dayMoments = SINGLE_DAY_MOMENT
    }

    // Ajouter showDayMoments si non présent
    if (migratedCalendar.formData.options && migratedCalendar.formData.options.showDayMoments === undefined) {
      migratedCalendar.formData.options.showDayMoments = false
    }

    return migratedCalendar
  }
};

export default CalendarStorage;