'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Locale, TranslationKey } from './translations';

interface I18nContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const savedLocale = localStorage.getItem('fixmate_locale') as Locale;
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'hi' || savedLocale === 'mr')) {
      setLocaleState(savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('fixmate_locale', newLocale);
  };

  const t = (key: TranslationKey): string => {
    return translations[locale][key] || translations['en'][key] || String(key);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
