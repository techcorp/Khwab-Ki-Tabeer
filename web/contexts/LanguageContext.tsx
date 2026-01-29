'use client';

import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type Language, t as translate, translations } from '@/config/i18n';
import { getLanguage, setLanguage as saveLanguage } from '@/services/storage';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    const savedLang = await getLanguage();
    setLanguageState(savedLang);
    setIsLoading(false);
  };

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await saveLanguage(lang);
  };

  const t = (key: keyof typeof translations.en): string => {
    return translate(key, language);
  };

  const isRTL = language === 'ur';

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
