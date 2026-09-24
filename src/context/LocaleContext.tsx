import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { LanguageCode } from '../types/content';
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../types/content';

const LOCALE_KEY = 'react-cms-locale';

const SUPPORTED_CODES = new Set<string>(SUPPORTED_LANGUAGES.map((lang) => lang.code));

interface LocaleContextValue {
  language: LanguageCode;
  setLanguage: (code: LanguageCode) => void;
  languages: typeof SUPPORTED_LANGUAGES;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

/** Map a BCP 47 tag to a supported code. `es-MX` and `es` both become `es`. */
export function matchSupportedLanguage(tag: string | null | undefined): LanguageCode | null {
  if (!tag) return null;
  const primary = tag.trim().toLowerCase().split('-')[0];
  if (!primary || !SUPPORTED_CODES.has(primary)) return null;
  return primary as LanguageCode;
}

function readStoredLanguage(): LanguageCode | null {
  try {
    const stored = localStorage.getItem(LOCALE_KEY);
    if (stored === 'en' || stored === 'es') return stored;
  } catch {
    /* private mode or blocked storage */
  }
  return null;
}

function readBrowserLanguageTags(): readonly string[] {
  if (typeof navigator === 'undefined') return [];
  const listed = navigator.languages;
  if (listed && listed.length > 0) return listed;
  return navigator.language ? [navigator.language] : [];
}

/**
 * Explicit client choice wins. Otherwise the first supported browser language.
 * An unsupported browser language falls back to English. Auto-detect is not stored.
 */
export function resolveInitialLanguage(
  stored: LanguageCode | null,
  browserTags: readonly string[],
): LanguageCode {
  if (stored) return stored;
  for (const tag of browserTags) {
    const match = matchSupportedLanguage(tag);
    if (match) return match;
  }
  return DEFAULT_LANGUAGE;
}

function loadLanguage(): LanguageCode {
  return resolveInitialLanguage(readStoredLanguage(), readBrowserLanguageTags());
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(() => loadLanguage());

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((code: LanguageCode) => {
    try {
      localStorage.setItem(LOCALE_KEY, code);
    } catch {
      /* keep the in-memory choice if storage is unavailable */
    }
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
