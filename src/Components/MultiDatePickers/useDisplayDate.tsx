import { format, isValid, parse } from 'date-fns';

import {
  dateFormatsByLangCode,
  dateFormatToSave,
  DatePickerLanguages,
  dateTimeFormatsByLangCode,
  dateTimeFormatToSave,
  timeFormatsByLangCode,
  timeFormatToSave,
} from './date-helpers';

export const useDisplayDate = (langCode: DatePickerLanguages) => {
  const getBasicDateByLanguageCode = (
    dateString: string | null,
    formatToSave: string,
    formatsByLangCode: Record<DatePickerLanguages, string>
  ) => {
    if (!dateString) return '';

    const date = parse(dateString, formatToSave, new Date());

    if (!isValid(date)) return '';

    return format(date, formatsByLangCode[langCode]);
  };

  const getDateTimeValueByLanguageCode = (dateString: string | null) =>
    getBasicDateByLanguageCode(dateString, dateTimeFormatToSave, dateTimeFormatsByLangCode);
  const getDateValueByLanguageCode = (dateString: string | null) =>
    getBasicDateByLanguageCode(dateString, dateFormatToSave, dateFormatsByLangCode);

  const getTimeValueByLanguageCode = (dateString: string | null) =>
    getBasicDateByLanguageCode(dateString, timeFormatToSave, timeFormatsByLangCode);

  const getDateByLanguageCode = (dateString: string | null) => {
    return (
      getDateTimeValueByLanguageCode(dateString) ||
      getDateValueByLanguageCode(dateString) ||
      getTimeValueByLanguageCode(dateString)
    );
  };

  return {
    getDateByLanguageCode,
    getDateTimeValueByLanguageCode,
    getDateValueByLanguageCode,
    getTimeValueByLanguageCode,
  };
};
