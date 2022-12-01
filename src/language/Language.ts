import { useCallback } from 'react';
import LocalizedStrings, { GlobalStrings } from 'react-native-localization';
import Localize from 'react-native-localize';
import Database, { useDatabase } from 'src/database/Database';
import { en } from './en';
import { th } from './th';

export type LanguageType = 'en' | 'th';
export type ILanguages = GlobalStrings<typeof en>

export const DefaultLanguage: LanguageType = ((Localize?.getLocales()?.[0].languageCode as LanguageType) || "")?.includes('th') ? 'th' : 'en' || 'en' // 'en';


Object.keys(en).forEach((k) => {
  if (!(th as any)?.[k]?.trim()) {
    (th as any)[k] = (en as any)[k]
  }
})

export const DefaultLanguages: ILanguages = {
  en,
  th
}
const allLanguages = Database?.getStoredValue<ILanguages>("allLanguages") ?? DefaultLanguages
const Language = new LocalizedStrings(allLanguages);
Language.setLanguage(
  Database.getStoredValue('selectedLanguage')?.toString() || DefaultLanguage,
);

export const useLanguage = () => {
  return useDatabase<LanguageType>('selectedLanguage', DefaultLanguage)[0];
};

export const updateLanguageDirect = (language: LanguageType) => {
  Language.setLanguage(language ?? DefaultLanguage);
  Database.setSelectedLanguage(language);
}

export const useUpdateLanguage = () => {
  const [language] = useDatabase<LanguageType>('selectedLanguage');
  const updateLanguage = useCallback(updateLanguageDirect, [])

  return (updateLanguage);
};

export default Language;
