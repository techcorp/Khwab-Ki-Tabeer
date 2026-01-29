import type { Language } from '@/config/i18n';

const STORAGE_KEYS = {
  LANGUAGE: 'khawab_language',
  HISTORY: 'khawab_history',
  INTERPRETATION_COUNT: 'khawab_interpretation_count',
};

export interface DreamInterpretation {
  id: string;
  dream: string;
  interpretation: string;
  timestamp: number;
  language: Language;
}

const isClient = typeof window !== 'undefined';

// Language
export const getLanguage = async (): Promise<Language> => {
  if (!isClient) return 'en';
  try {
    const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return (lang as Language) || 'en';
  } catch {
    return 'en';
  }
};

export const setLanguage = async (lang: Language): Promise<void> => {
  if (!isClient) return;
  try {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  } catch (error) {
    console.error('Failed to save language:', error);
  }
};

// History
export const getHistory = async (): Promise<DreamInterpretation[]> => {
  if (!isClient) return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveInterpretation = async (
  dream: string,
  interpretation: string,
  language: Language
): Promise<DreamInterpretation> => {
  if (!isClient) throw new Error('Cannot save on server');
  try {
    const history = await getHistory();
    const newEntry: DreamInterpretation = {
      id: Date.now().toString(),
      dream,
      interpretation,
      timestamp: Date.now(),
      language,
    };
    const updatedHistory = [newEntry, ...history].slice(0, 100); // Keep max 100 entries
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
    return newEntry;
  } catch (error) {
    console.error('Failed to save interpretation:', error);
    throw error;
  }
};

export const deleteInterpretation = async (id: string): Promise<void> => {
  if (!isClient) return;
  try {
    const history = await getHistory();
    const updatedHistory = history.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Failed to delete interpretation:', error);
  }
};

export const clearHistory = async (): Promise<void> => {
  if (!isClient) return;
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (error) {
    console.error('Failed to clear history:', error);
  }
};

// Interpretation count (for ad frequency)
export const getInterpretationCount = async (): Promise<number> => {
  if (!isClient) return 0;
  try {
    const count = localStorage.getItem(STORAGE_KEYS.INTERPRETATION_COUNT);
    return count ? parseInt(count, 10) : 0;
  } catch {
    return 0;
  }
};

export const incrementInterpretationCount = async (): Promise<number> => {
  if (!isClient) return 0;
  try {
    const count = await getInterpretationCount();
    const newCount = count + 1;
    localStorage.setItem(STORAGE_KEYS.INTERPRETATION_COUNT, newCount.toString());
    return newCount;
  } catch {
    return 0;
  }
};
