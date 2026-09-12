import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { LanguageCode } from '../types/content';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../types/content';

const LOCALE_KEY = 'react-cms-locale';

interface LocaleContextValue {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  languages: typeof SUPPORTED_LANGUAGES;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function loadLanguage(): LanguageCode {
  try {
    const stored = localStorage.getItem(LOCALE_KEY);
    if (stored === 'en' || stored === 'es') return stored;
  } catch {
    /* ignore */
  }
  return DEFAULT_LANGUAGE;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => loadLanguage());

  const setLanguage = useCallback((code: LanguageCode) => {
    localStorage.setItem(LOCALE_KEY, code);
    setLanguageState(code);
  }, []);

  const value = useMemo(
    () => ({ language, setLanguage, languages: SUPPORTED_LANGUAGES }),
    [language, setLanguage],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
