import { CalendarFormData } from '@/app/create/types';

export interface SavedCalendarMeta {
  id: string;
  name: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  previewImage?: string; // Base64 du calendrier en miniature
}

export interface SavedCalendar {
  meta: SavedCalendarMeta;
  formData: CalendarFormData;
  childPhoto: string | null;
}

export type SavedCalendarsList = SavedCalendarMeta[];