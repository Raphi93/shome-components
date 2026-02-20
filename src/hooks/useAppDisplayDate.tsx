import { DatePickerLanguages } from "../components/MultiDatePickers/date-helpers";
import { useDisplayDate } from "../components/MultiDatePickers/useDisplayDate";



export const useAppDisplayDate = ({useCulture}: {useCulture: () => { langKey: string | undefined | null }}) => {
    const { langKey } = useCulture();
  const { getDateValueByLanguageCode, ...others } = useDisplayDate(langKey as DatePickerLanguages);


  const appGetDateByLanguageCode = (date?: string) => {
    const formattedDate = date ? date.slice(0, 10) : '';

    if (date === '0001-01-01T00:00:00' || date === '' || date === null) {
      return null;
    } else if (date) {
      return getDateValueByLanguageCode(formattedDate);
    }
  };

  const shortDate = (date?: string) => {
    const aDate = new Date(date!);
    var cultFromPdc = getCultureNameFromPdcKey(langKey);
    var culture = getCultureFromName(cultFromPdc?? 'D');
    const options : Intl.DateTimeFormatOptions = {year: '2-digit', month: '2-digit', day: '2-digit'};
    const bDate = aDate.toLocaleDateString(culture.culture, options);
    return bDate;
  }
  
  return {
    getDateValueByLanguageCode: appGetDateByLanguageCode, shortDate,
    ...others,
  };
};

export function getCultureNameFromPdcKey(
  langKey: string | undefined | null,
  defaultCultureName?: string
): string | undefined {
  switch (langKey) {
    case 'D':
      return 'de';
    case 'F':
      return 'fr';
    case 'I':
      return 'it';
    case 'E':
      return 'en';
    default:
      return defaultCultureName;
  }
}

export function getCultureFromName(cultureName: string): {
  culture: string;
  uiCulture: string;
  languageName: string;
  langKey: string;
} {
  switch (cultureName) {
    case 'de':
      return {
        culture: 'de-CH',
        uiCulture: 'de',
        languageName: 'DE',
        langKey: 'D',
      };
    case 'fr':
      return {
        culture: 'fr-CH',
        uiCulture: 'fr',
        languageName: 'FR',
        langKey: 'F',
      };
    case 'it':
      return {
        culture: 'it-CH',
        uiCulture: 'it',
        languageName: 'IT',
        langKey: 'I',
      };
    default:
      return {
        culture: 'en-US',
        uiCulture: 'en',
        languageName: 'EN',
        langKey: 'E',
      };
  }
}

