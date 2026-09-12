import { useCallback } from 'react';
import { useContent } from '../context/ContentContext';
import { resolveUiString, type UiStringTranslator } from '../lib/paramUi';

/**
 * Returns a translator `t(stringKey)` for static UI chrome backed by
 * `param_ui_strings` / `param_ui_string_i18n` from the content service.
 */
export function useUiString(): UiStringTranslator {
  const { data, language } = useContent();

  return useCallback(
    (key, fallback) => resolveUiString(data.paramUiStringI18n, key, language, fallback),
    [data.paramUiStringI18n, language],
  );
}
