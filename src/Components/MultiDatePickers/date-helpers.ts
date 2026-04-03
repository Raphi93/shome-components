import { de, enUS, fr, it } from 'date-fns/locale';

export type DatePickerLanguages = 'E' | 'D' | 'I' | 'F';
export const dateFormatToSave = 'yyyy-MM-dd';
export const dateTimeFormatToSave = 'yyyy-MM-dd HH:mm';
export const timeFormatToSave = 'HH:mm';

export const dateTimePickerLanguageByCode: Record<DatePickerLanguages, any> = { E: enUS, F: fr, D: de, I: it };

export const dateFormatsByLangCode: Record<DatePickerLanguages, string> = {
  E: 'MM/dd/yyyy',
  D: 'dd.MM.yyyy',
  I: 'dd/MM/yyyy',
  F: 'dd/MM/yyyy',
};

export const dateTimeFormatsByLangCode: Record<DatePickerLanguages, string> = {
  E: 'MM/dd/yyyy h:mm aa',
  D: 'dd.MM.yyyy HH:mm',
  I: 'dd/MM/yyyy HH:mm',
  F: 'dd/MM/yyyy HH:mm',
};

export const timeFormatsByLangCode: Record<DatePickerLanguages, string> = {
  E: 'h:mm aa',
  D: 'HH:mm',
  I: 'HH:mm',
  F: 'HH:mm',
};