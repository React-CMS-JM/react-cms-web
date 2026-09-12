/**
 * Mirrors `param_ui_strings` and `param_ui_string_i18n`
 * from react-cms-create-tables-param_ui.sql.
 *
 * string_key convention (stable for future backend queries):
 *   {area}_{element}[_{qualifier}]  — snake_case, English tokens
 * ui_component convention:
 *   PascalCase scope matching the UI surface (Navbar, Hero, Home, …)
 */

export type UiComponentScope =
  | 'Navbar'
  | 'Footer'
  | 'Hero'
  | 'Home'
  | 'Listing'
  | 'Auth'
  | 'PremiumGate'
  | 'Forbidden'
  | 'AdminSidebar'
  | 'Common';

/** Structural register row (`param_ui_strings`). */
export interface ParamUiString {
  stringKey: string;
  uiComponent: UiComponentScope;
  description: string;
}

/** Translation sidecar (`param_ui_string_i18n`). */
export interface ParamUiStringI18n {
  id: number;
  stringKey: string;
  languageCode: 'en' | 'es';
  stringValue: string;
  updatedAt: string;
}

/**
 * Canonical keys used by the frontend.
 * Keep in sync with mocks — these are the contract for future SQL inserts.
 */
export const UI_STRING_KEYS = {
  // Navbar
  nav_home: 'nav_home',
  nav_services: 'nav_services',
  nav_products: 'nav_products',
  nav_blog: 'nav_blog',
  nav_courses: 'nav_courses',
  nav_admin: 'nav_admin',

  // Footer
  footer_tagline: 'footer_tagline',

  // Hero (landing)
  hero_title: 'hero_title',
  hero_subtitle: 'hero_subtitle',
  hero_cta_services: 'hero_cta_services',
  hero_cta_products: 'hero_cta_products',

  // Home sections
  section_services_title: 'section_services_title',
  section_products_title: 'section_products_title',
  section_blog_title: 'section_blog_title',
  section_courses_title: 'section_courses_title',
  section_view_all: 'section_view_all',

  // Public listing pages
  listing_blog_title: 'listing_blog_title',
  listing_blog_subtitle: 'listing_blog_subtitle',
  listing_services_title: 'listing_services_title',
  listing_services_subtitle: 'listing_services_subtitle',
  listing_products_title: 'listing_products_title',
  listing_products_subtitle: 'listing_products_subtitle',
  listing_courses_title: 'listing_courses_title',
  listing_courses_subtitle: 'listing_courses_subtitle',
  listing_empty: 'listing_empty',
  listing_learn_more: 'listing_learn_more',
  listing_website: 'listing_website',
  listing_live_demo: 'listing_live_demo',

  // Common chrome
  common_back_home: 'common_back_home',
  common_back_blog: 'common_back_blog',
  common_back_services: 'common_back_services',
  common_back_products: 'common_back_products',
  common_back_courses: 'common_back_courses',
  common_not_found_title: 'common_not_found_title',
  common_not_found_body: 'common_not_found_body',

  // Auth
  auth_sign_in_title: 'auth_sign_in_title',
  auth_sign_in_intro: 'auth_sign_in_intro',
  auth_signed_in_as: 'auth_signed_in_as',
  auth_sign_out: 'auth_sign_out',
  auth_guest: 'auth_guest',
  auth_guest_hint: 'auth_guest_hint',
  auth_demo_heading: 'auth_demo_heading',
  auth_go_sign_in: 'auth_go_sign_in',

  // Premium gate
  premium_title: 'premium_title',
  premium_body_guest: 'premium_body_guest',
  premium_body_member: 'premium_body_member',
  premium_cta_sign_in: 'premium_cta_sign_in',
  premium_cta_upgrade: 'premium_cta_upgrade',

  // Forbidden
  forbidden_title: 'forbidden_title',
  forbidden_body: 'forbidden_body',
  forbidden_switch_account: 'forbidden_switch_account',
  forbidden_back_home: 'forbidden_back_home',

  // Admin sidebar
  admin_panel_subtitle: 'admin_panel_subtitle',
  admin_nav_dashboard: 'admin_nav_dashboard',
  admin_nav_posts: 'admin_nav_posts',
  admin_nav_pages: 'admin_nav_pages',
  admin_nav_services: 'admin_nav_services',
  admin_nav_products: 'admin_nav_products',
  admin_nav_courses: 'admin_nav_courses',
  admin_nav_categories: 'admin_nav_categories',
  admin_nav_tags: 'admin_nav_tags',
  admin_nav_comments: 'admin_nav_comments',
  admin_nav_users: 'admin_nav_users',
  admin_nav_roles: 'admin_nav_roles',
  admin_nav_settings: 'admin_nav_settings',
  admin_back_to_site: 'admin_back_to_site',
} as const;

export type UiStringKey = (typeof UI_STRING_KEYS)[keyof typeof UI_STRING_KEYS];
