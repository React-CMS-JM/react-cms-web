import type { ParamUiString } from '../types/paramUi';
import { UI_STRING_KEYS } from '../types/paramUi';

/**
 * Structural register for static UI copy (`param_ui_strings`).
 * Keys are stable identifiers intended for future backend queries.
 */
export const MOCK_PARAM_UI_STRINGS: ParamUiString[] = [
  // Navbar
  { stringKey: UI_STRING_KEYS.nav_home, uiComponent: 'Navbar', description: 'Home navigation link text' },
  { stringKey: UI_STRING_KEYS.nav_services, uiComponent: 'Navbar', description: 'Services navigation link text' },
  { stringKey: UI_STRING_KEYS.nav_products, uiComponent: 'Navbar', description: 'Products navigation link text' },
  { stringKey: UI_STRING_KEYS.nav_blog, uiComponent: 'Navbar', description: 'Blog navigation link text' },
  { stringKey: UI_STRING_KEYS.nav_courses, uiComponent: 'Navbar', description: 'Courses navigation link text' },
  { stringKey: UI_STRING_KEYS.nav_admin, uiComponent: 'Navbar', description: 'Admin panel entry link for staff roles' },

  // Footer
  { stringKey: UI_STRING_KEYS.footer_tagline, uiComponent: 'Footer', description: 'Footer tagline after the site name' },

  // Hero
  { stringKey: UI_STRING_KEYS.hero_title, uiComponent: 'Hero', description: 'Main title on the landing hero' },
  { stringKey: UI_STRING_KEYS.hero_subtitle, uiComponent: 'Hero', description: 'Supporting subtitle on the landing hero' },
  { stringKey: UI_STRING_KEYS.hero_cta_services, uiComponent: 'Hero', description: 'Primary hero CTA linking to services' },
  { stringKey: UI_STRING_KEYS.hero_cta_products, uiComponent: 'Hero', description: 'Secondary hero CTA linking to products' },

  // Home sections
  { stringKey: UI_STRING_KEYS.section_services_title, uiComponent: 'Home', description: 'Homepage services section heading' },
  { stringKey: UI_STRING_KEYS.section_products_title, uiComponent: 'Home', description: 'Homepage products section heading' },
  { stringKey: UI_STRING_KEYS.section_blog_title, uiComponent: 'Home', description: 'Homepage blog section heading' },
  { stringKey: UI_STRING_KEYS.section_courses_title, uiComponent: 'Home', description: 'Homepage featured courses section heading' },
  { stringKey: UI_STRING_KEYS.section_view_all, uiComponent: 'Home', description: 'View-all link label used under homepage sections' },

  // Listing pages
  { stringKey: UI_STRING_KEYS.listing_blog_title, uiComponent: 'Listing', description: 'Blog index page title' },
  { stringKey: UI_STRING_KEYS.listing_blog_subtitle, uiComponent: 'Listing', description: 'Blog index page subtitle' },
  { stringKey: UI_STRING_KEYS.listing_services_title, uiComponent: 'Listing', description: 'Services index page title' },
  { stringKey: UI_STRING_KEYS.listing_services_subtitle, uiComponent: 'Listing', description: 'Services index page subtitle' },
  { stringKey: UI_STRING_KEYS.listing_products_title, uiComponent: 'Listing', description: 'Products index page title' },
  { stringKey: UI_STRING_KEYS.listing_products_subtitle, uiComponent: 'Listing', description: 'Products index page subtitle' },
  { stringKey: UI_STRING_KEYS.listing_courses_title, uiComponent: 'Listing', description: 'Courses index page title' },
  { stringKey: UI_STRING_KEYS.listing_courses_subtitle, uiComponent: 'Listing', description: 'Courses index page subtitle' },
  { stringKey: UI_STRING_KEYS.listing_empty, uiComponent: 'Listing', description: 'Empty-state message when a listing has no published items' },
  { stringKey: UI_STRING_KEYS.listing_learn_more, uiComponent: 'Listing', description: 'Learn-more link on service cards' },
  { stringKey: UI_STRING_KEYS.listing_website, uiComponent: 'Listing', description: 'Product website link label' },
  { stringKey: UI_STRING_KEYS.listing_live_demo, uiComponent: 'Listing', description: 'Product live-demo link label' },

  // Common
  { stringKey: UI_STRING_KEYS.common_back_home, uiComponent: 'Common', description: 'Back to home link' },
  { stringKey: UI_STRING_KEYS.common_back_blog, uiComponent: 'Common', description: 'Back to blog link' },
  { stringKey: UI_STRING_KEYS.common_back_services, uiComponent: 'Common', description: 'Back to services link' },
  { stringKey: UI_STRING_KEYS.common_back_products, uiComponent: 'Common', description: 'Back to products link' },
  { stringKey: UI_STRING_KEYS.common_back_courses, uiComponent: 'Common', description: 'Back to courses link' },
  { stringKey: UI_STRING_KEYS.common_not_found_title, uiComponent: 'Common', description: 'Generic not-found heading' },
  { stringKey: UI_STRING_KEYS.common_not_found_body, uiComponent: 'Common', description: 'Generic not-found body copy' },

  // Auth
  { stringKey: UI_STRING_KEYS.auth_sign_in_title, uiComponent: 'Auth', description: 'Sign-in page title' },
  { stringKey: UI_STRING_KEYS.auth_sign_in_intro, uiComponent: 'Auth', description: 'Sign-in page intro paragraph' },
  { stringKey: UI_STRING_KEYS.auth_signed_in_as, uiComponent: 'Auth', description: 'Prefix before the current user name' },
  { stringKey: UI_STRING_KEYS.auth_sign_out, uiComponent: 'Auth', description: 'Sign-out button label' },
  { stringKey: UI_STRING_KEYS.auth_guest, uiComponent: 'Auth', description: 'Guest label in the account switcher' },
  { stringKey: UI_STRING_KEYS.auth_guest_hint, uiComponent: 'Auth', description: 'Guest subtitle in the account switcher' },
  { stringKey: UI_STRING_KEYS.auth_demo_heading, uiComponent: 'Auth', description: 'Demo role-picker heading in the account switcher' },
  { stringKey: UI_STRING_KEYS.auth_go_sign_in, uiComponent: 'Auth', description: 'Link to the full sign-in page from the switcher' },

  // PremiumGate
  { stringKey: UI_STRING_KEYS.premium_title, uiComponent: 'PremiumGate', description: 'Premium lock heading' },
  { stringKey: UI_STRING_KEYS.premium_body_guest, uiComponent: 'PremiumGate', description: 'Premium lock body for guests' },
  { stringKey: UI_STRING_KEYS.premium_body_member, uiComponent: 'PremiumGate', description: 'Premium lock body for non-premium members' },
  { stringKey: UI_STRING_KEYS.premium_cta_sign_in, uiComponent: 'PremiumGate', description: 'Premium lock CTA for guests' },
  { stringKey: UI_STRING_KEYS.premium_cta_upgrade, uiComponent: 'PremiumGate', description: 'Premium lock CTA for free members' },

  // Forbidden
  { stringKey: UI_STRING_KEYS.forbidden_title, uiComponent: 'Forbidden', description: 'Access-restricted page title' },
  { stringKey: UI_STRING_KEYS.forbidden_body, uiComponent: 'Forbidden', description: 'Access-restricted page body' },
  { stringKey: UI_STRING_KEYS.forbidden_switch_account, uiComponent: 'Forbidden', description: 'Switch-account button on forbidden page' },
  { stringKey: UI_STRING_KEYS.forbidden_back_home, uiComponent: 'Forbidden', description: 'Back-home button on forbidden page' },

  // AdminSidebar
  { stringKey: UI_STRING_KEYS.admin_panel_subtitle, uiComponent: 'AdminSidebar', description: 'Admin sidebar brand subtitle' },
  { stringKey: UI_STRING_KEYS.admin_nav_dashboard, uiComponent: 'AdminSidebar', description: 'Admin nav: Dashboard' },
  { stringKey: UI_STRING_KEYS.admin_nav_posts, uiComponent: 'AdminSidebar', description: 'Admin nav: Posts' },
  { stringKey: UI_STRING_KEYS.admin_nav_pages, uiComponent: 'AdminSidebar', description: 'Admin nav: Pages' },
  { stringKey: UI_STRING_KEYS.admin_nav_services, uiComponent: 'AdminSidebar', description: 'Admin nav: Services' },
  { stringKey: UI_STRING_KEYS.admin_nav_products, uiComponent: 'AdminSidebar', description: 'Admin nav: Products' },
  { stringKey: UI_STRING_KEYS.admin_nav_courses, uiComponent: 'AdminSidebar', description: 'Admin nav: Courses' },
  { stringKey: UI_STRING_KEYS.admin_nav_categories, uiComponent: 'AdminSidebar', description: 'Admin nav: Categories' },
  { stringKey: UI_STRING_KEYS.admin_nav_tags, uiComponent: 'AdminSidebar', description: 'Admin nav: Tags' },
  { stringKey: UI_STRING_KEYS.admin_nav_comments, uiComponent: 'AdminSidebar', description: 'Admin nav: Comments' },
  { stringKey: UI_STRING_KEYS.admin_nav_users, uiComponent: 'AdminSidebar', description: 'Admin nav: Users' },
  { stringKey: UI_STRING_KEYS.admin_nav_roles, uiComponent: 'AdminSidebar', description: 'Admin nav: Roles & Permissions' },
  { stringKey: UI_STRING_KEYS.admin_nav_settings, uiComponent: 'AdminSidebar', description: 'Admin nav: Settings' },
  { stringKey: UI_STRING_KEYS.admin_back_to_site, uiComponent: 'AdminSidebar', description: 'Link back to the public site from admin' },
];
