import { useEffect } from 'react';
import { useSiteSettings } from '../../hooks/usePublicContent';
import { DEFAULT_SETTINGS } from '../../types/settings';

/** Keeps document head SEO + favicon in sync with site settings. */
export function SiteSeo() {
  const settingsQuery = useSiteSettings();
  const settings = settingsQuery.data ?? DEFAULT_SETTINGS;
  const siteIconUrl = settings.siteIconUrl ?? '';

  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = settings.siteDescription;
  }, [settings.siteDescription]);

  useEffect(() => {
    const existing = document.querySelectorAll<HTMLLinkElement>('link[rel="icon"]');
    existing.forEach((el) => el.remove());

    if (!siteIconUrl) return;

    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = siteIconUrl;
    document.head.appendChild(link);
  }, [siteIconUrl]);

  return null;
}
