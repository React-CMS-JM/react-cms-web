/** Application-level configuration; not part of the SQL schema. */

import type { LanguageCode } from './content';
import { generateId } from './content';

/** Homepage body sections that can be shown, hidden, and reordered. */
export type HomeSectionId = 'services' | 'products' | 'blog' | 'courses';

/**
 * Public main-menu entries.
 * Fixed routes use UI strings for labels; `page-*` ids use the page title.
 */
export type MainMenuItemId =
  | 'home'
  | 'services'
  | 'products'
  | 'blog'
  | 'courses'
  | 'page-about'
  | 'page-contact';

export interface VisibilityOrderItem<T extends string = string> {
  id: T;
  visible: boolean;
  /** Homepage sections only — max cards shown for that block. */
  itemLimit?: number;
}

/** Dynamic homepage hero CTA button. */
export interface HeroCtaButton {
  id: string;
  visible: boolean;
  /** Internal path (`/services`) or absolute URL (`https://…`). */
  href: string;
  textColor: string;
  backgroundColor: string;
  /** Label per UI language. */
  labels: Partial<Record<LanguageCode, string>>;
}

/** Homepage hero chrome: visibility + CTA buttons (copy stays in param_ui). */
export interface HomeHeroSettings {
  titleVisible: boolean;
  subtitleVisible: boolean;
  ctas: HeroCtaButton[];
}

export interface SiteSettings {
  siteName: string;
  /** Favicon + brand mark next to the site name. Empty = default diamond. */
  siteIconUrl: string;
  siteDescription: string;
  postsPerPage: number;
  homeHero: HomeHeroSettings;
  /** Homepage listing sections — array order is display order. */
  homeSections: VisibilityOrderItem<HomeSectionId>[];
  /** Public header nav — array order is display order. */
  mainMenu: VisibilityOrderItem<MainMenuItemId>[];
}

export const DEFAULT_HOME_SECTIONS: VisibilityOrderItem<HomeSectionId>[] = [
  { id: 'services', visible: true, itemLimit: 5 },
  { id: 'products', visible: true, itemLimit: 6 },
  { id: 'blog', visible: true, itemLimit: 9 },
  { id: 'courses', visible: true, itemLimit: 3 },
];

export const DEFAULT_HOME_SECTION_LIMITS: Record<HomeSectionId, number> = {
  services: 5,
  products: 6,
  blog: 9,
  courses: 3,
};

export function resolveHomeSectionLimit(
  section: VisibilityOrderItem<HomeSectionId> | undefined,
  sectionId: HomeSectionId,
): number {
  const raw = section?.itemLimit ?? DEFAULT_HOME_SECTION_LIMITS[sectionId];
  if (!Number.isFinite(raw) || raw < 1) return 1;
  if (raw > 50) return 50;
  return Math.floor(raw);
}

export const DEFAULT_MAIN_MENU: VisibilityOrderItem<MainMenuItemId>[] = [
  { id: 'home', visible: true },
  { id: 'services', visible: true },
  { id: 'products', visible: true },
  { id: 'blog', visible: true },
  { id: 'courses', visible: true },
  { id: 'page-about', visible: true },
  { id: 'page-contact', visible: true },
];

export const DEFAULT_HOME_HERO: HomeHeroSettings = {
  titleVisible: true,
  subtitleVisible: true,
  ctas: [
    {
      id: 'cta-services',
      visible: true,
      href: '/services',
      textColor: '#ffffff',
      backgroundColor: '#6366f1',
      labels: { en: 'Our services', es: 'Nuestros servicios' },
    },
    {
      id: 'cta-products',
      visible: true,
      href: '/products',
      textColor: '#04222b',
      backgroundColor: '#06b6d4',
      labels: { en: 'View products', es: 'Ver productos' },
    },
  ],
};

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'React CMS',
  siteIconUrl: '',
  siteDescription: 'A role-aware content platform for articles, pages, and courses.',
  postsPerPage: 9,
  homeHero: DEFAULT_HOME_HERO,
  homeSections: DEFAULT_HOME_SECTIONS,
  mainMenu: DEFAULT_MAIN_MENU,
};

export const HOME_SECTION_LABELS: Record<HomeSectionId, string> = {
  services: 'Services',
  products: 'Products',
  blog: 'Blog',
  courses: 'Featured Courses',
};

export const MAIN_MENU_LABELS: Record<MainMenuItemId, string> = {
  home: 'Home',
  services: 'Services',
  products: 'Products',
  blog: 'Blog',
  courses: 'Courses',
  'page-about': 'About (page)',
  'page-contact': 'Contact (page)',
};

export function createHeroCta(language: LanguageCode = 'en'): HeroCtaButton {
  return {
    id: generateId(),
    visible: true,
    href: '/',
    textColor: '#ffffff',
    backgroundColor: '#6366f1',
    labels: { [language]: 'New button' },
  };
}

export function resolveHomeHero(configured?: HomeHeroSettings | null): HomeHeroSettings {
  if (!configured) {
    return {
      titleVisible: DEFAULT_HOME_HERO.titleVisible,
      subtitleVisible: DEFAULT_HOME_HERO.subtitleVisible,
      ctas: DEFAULT_HOME_HERO.ctas.map((cta) => ({
        ...cta,
        labels: { ...cta.labels },
      })),
    };
  }
  return {
    titleVisible: configured.titleVisible ?? true,
    subtitleVisible: configured.subtitleVisible ?? true,
    ctas: Array.isArray(configured.ctas)
      ? configured.ctas.map((cta) => ({
          ...cta,
          labels: { ...(cta.labels ?? {}) },
        }))
      : DEFAULT_HOME_HERO.ctas.map((cta) => ({ ...cta, labels: { ...cta.labels } })),
  };
}

/** True when the href should open as an external absolute URL. */
export function isExternalHref(href: string): boolean {
  const value = href.trim();
  return /^(https?:)?\/\//i.test(value) || /^(mailto:|tel:)/i.test(value);
}

export function resolveHeroCtaLabel(
  cta: HeroCtaButton,
  language: LanguageCode,
  fallbackLanguage: LanguageCode = 'en',
): string {
  return (
    cta.labels[language]?.trim() ||
    cta.labels[fallbackLanguage]?.trim() ||
    Object.values(cta.labels).find((v) => v?.trim()) ||
    'Button'
  );
}
