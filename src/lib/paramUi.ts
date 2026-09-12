import type { LanguageCode } from '../types/content';
import { DEFAULT_LANGUAGE } from '../types/content';
import type { ParamUiStringI18n, UiStringKey } from '../types/paramUi';

/** Resolve a UI string from the param_ui_string_i18n sidecar with language fallback. */
export function resolveUiString(
  rows: ParamUiStringI18n[],
  stringKey: string,
  languageCode: LanguageCode,
  fallback?: string,
): string {
  const matches = rows.filter((r) => r.stringKey === stringKey);
  const hit =
    matches.find((r) => r.languageCode === languageCode) ??
    matches.find((r) => r.languageCode === DEFAULT_LANGUAGE) ??
    matches[0];
  return hit?.stringValue ?? fallback ?? stringKey;
}

export type UiStringTranslator = (key: UiStringKey | string, fallback?: string) => string;
