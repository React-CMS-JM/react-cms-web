import { useCallback, useMemo } from 'react';
import { useContent } from '../context/ContentContext';
import { usePublicUiStrings } from './usePublicContent';
import { resolveUiString, type UiStringTranslator } from '../lib/paramUi';
import { useLocale } from '../context/LocaleContext';

/**
 * Returns a translator `t(stringKey)` for static UI chrome backed by
 * `param_ui_strings` / `param_ui_string_i18n` from the content service.
 * Public strings come from React Query. Admin sidebar strings stay in ContentContext.
 */
export function useUiString(): UiStringTranslator {
  const { language } = useLocale();
  const publicStrings = usePublicUiStrings();
  const { data } = useContent();

  const rows = useMemo(() => {
    const merged = new Map<string, (typeof data.paramUiStringI18n)[number]>();
    for (const row of data.paramUiStringI18n) {
      merged.set(`${row.stringKey}:${row.languageCode}`, row);
    }
    for (const row of publicStrings.data ?? []) {
      merged.set(`${row.stringKey}:${row.languageCode}`, row);
    }
    return [...merged.values()];
  }, [data.paramUiStringI18n, publicStrings.data]);

  return useCallback(
    (key, fallback) => resolveUiString(rows, key, language, fallback),
    [rows, language],
  );
}
