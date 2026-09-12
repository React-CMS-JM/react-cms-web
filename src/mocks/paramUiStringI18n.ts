import type { ParamUiStringI18n } from '../types/paramUi';
import { UI_STRING_KEYS } from '../types/paramUi';

const iso = () => new Date().toISOString();

type Pair = [key: string, en: string, es: string];

const PAIRS: Pair[] = [
  // Navbar
  [UI_STRING_KEYS.nav_home, 'Home', 'Inicio'],
  [UI_STRING_KEYS.nav_services, 'Services', 'Servicios'],
  [UI_STRING_KEYS.nav_products, 'Products', 'Productos'],
  [UI_STRING_KEYS.nav_blog, 'Blog', 'Blog'],
  [UI_STRING_KEYS.nav_courses, 'Courses', 'Cursos'],
  [UI_STRING_KEYS.nav_admin, 'Admin', 'Admin'],

  // Footer
  [UI_STRING_KEYS.footer_tagline, 'a role-based CMS demo.', 'una demo de CMS basada en roles.'],

  // Hero
  [UI_STRING_KEYS.hero_title, 'React CMS', 'React CMS'],
  [
    UI_STRING_KEYS.hero_subtitle,
    'A role-aware content platform for articles, pages, and courses.',
    'Una plataforma de contenido consciente de roles para artículos, páginas y cursos.',
  ],
  [UI_STRING_KEYS.hero_cta_services, 'Our services', 'Nuestros servicios'],
  [UI_STRING_KEYS.hero_cta_products, 'View products', 'Ver productos'],

  // Home sections
  [UI_STRING_KEYS.section_services_title, 'Services', 'Servicios'],
  [UI_STRING_KEYS.section_products_title, 'Products', 'Productos'],
  [UI_STRING_KEYS.section_blog_title, 'Blog', 'Blog'],
  [UI_STRING_KEYS.section_courses_title, 'Featured Courses', 'Cursos destacados'],
  [UI_STRING_KEYS.section_view_all, 'View all →', 'Ver todo →'],

  // Listing
  [UI_STRING_KEYS.listing_blog_title, 'Blog', 'Blog'],
  [
    UI_STRING_KEYS.listing_blog_subtitle,
    'Articles on engineering, design, and building products.',
    'Artículos sobre ingeniería, diseño y construcción de productos.',
  ],
  [UI_STRING_KEYS.listing_services_title, 'Services', 'Servicios'],
  [
    UI_STRING_KEYS.listing_services_subtitle,
    'Professional services to design, build, and modernize software.',
    'Servicios profesionales para diseñar, construir y modernizar software.',
  ],
  [UI_STRING_KEYS.listing_products_title, 'Products', 'Productos'],
  [
    UI_STRING_KEYS.listing_products_subtitle,
    'Software products built and maintained by our team.',
    'Productos de software construidos y mantenidos por nuestro equipo.',
  ],
  [UI_STRING_KEYS.listing_courses_title, 'Courses', 'Cursos'],
  [
    UI_STRING_KEYS.listing_courses_subtitle,
    'Structured, lesson-by-lesson learning paths.',
    'Rutas de aprendizaje estructuradas, lección a lección.',
  ],
  [UI_STRING_KEYS.listing_empty, 'Nothing published yet.', 'Aún no hay contenido publicado.'],
  [UI_STRING_KEYS.listing_learn_more, 'Learn more →', 'Saber más →'],
  [UI_STRING_KEYS.listing_website, 'Website', 'Sitio web'],
  [UI_STRING_KEYS.listing_live_demo, 'Live demo', 'Demo en vivo'],

  // Common
  [UI_STRING_KEYS.common_back_home, '← Back to Home', '← Volver al inicio'],
  [UI_STRING_KEYS.common_back_blog, '← Back to Blog', '← Volver al blog'],
  [UI_STRING_KEYS.common_back_services, '← Back to Services', '← Volver a servicios'],
  [UI_STRING_KEYS.common_back_products, '← Back to Products', '← Volver a productos'],
  [UI_STRING_KEYS.common_back_courses, '← Back to Courses', '← Volver a cursos'],
  [UI_STRING_KEYS.common_not_found_title, 'Not Found', 'No encontrado'],
  [
    UI_STRING_KEYS.common_not_found_body,
    "The content you're looking for doesn't exist or isn't published.",
    'El contenido que buscas no existe o no está publicado.',
  ],

  // Auth
  [UI_STRING_KEYS.auth_sign_in_title, 'Sign in', 'Iniciar sesión'],
  [
    UI_STRING_KEYS.auth_sign_in_intro,
    'This is a demo CMS — no password required. Pick a sample account to explore the site as that role, or continue as a guest.',
    'Este es un CMS de demostración — no se requiere contraseña. Elige una cuenta de ejemplo para explorar el sitio con ese rol, o continúa como invitado.',
  ],
  [UI_STRING_KEYS.auth_signed_in_as, 'Signed in as', 'Sesión iniciada como'],
  [UI_STRING_KEYS.auth_sign_out, 'Sign out', 'Cerrar sesión'],
  [UI_STRING_KEYS.auth_guest, 'Guest', 'Invitado'],
  [UI_STRING_KEYS.auth_guest_hint, 'Not signed in', 'Sin sesión'],
  [UI_STRING_KEYS.auth_demo_heading, 'Demo sign-in — try a role', 'Inicio de sesión demo — prueba un rol'],
  [UI_STRING_KEYS.auth_go_sign_in, 'Go to sign in page', 'Ir a la página de inicio de sesión'],

  // PremiumGate
  [UI_STRING_KEYS.premium_title, 'Premium content', 'Contenido premium'],
  [
    UI_STRING_KEYS.premium_body_guest,
    'Sign in with a premium account to unlock the rest of this content.',
    'Inicia sesión con una cuenta premium para desbloquear el resto de este contenido.',
  ],
  [
    UI_STRING_KEYS.premium_body_member,
    'Upgrade to a premium membership to unlock the rest of this content.',
    'Mejora a una membresía premium para desbloquear el resto de este contenido.',
  ],
  [UI_STRING_KEYS.premium_cta_sign_in, 'Sign in', 'Iniciar sesión'],
  [UI_STRING_KEYS.premium_cta_upgrade, 'View membership options', 'Ver opciones de membresía'],

  // Forbidden
  [UI_STRING_KEYS.forbidden_title, 'Access restricted', 'Acceso restringido'],
  [
    UI_STRING_KEYS.forbidden_body,
    "Your current role doesn't have permission to view this area.",
    'Tu rol actual no tiene permiso para ver esta área.',
  ],
  [UI_STRING_KEYS.forbidden_switch_account, 'Switch account', 'Cambiar cuenta'],
  [UI_STRING_KEYS.forbidden_back_home, 'Back to home', 'Volver al inicio'],

  // AdminSidebar
  [UI_STRING_KEYS.admin_panel_subtitle, 'Admin Panel', 'Panel de administración'],
  [UI_STRING_KEYS.admin_nav_dashboard, 'Dashboard', 'Panel'],
  [UI_STRING_KEYS.admin_nav_posts, 'Posts', 'Publicaciones'],
  [UI_STRING_KEYS.admin_nav_pages, 'Pages', 'Páginas'],
  [UI_STRING_KEYS.admin_nav_services, 'Services', 'Servicios'],
  [UI_STRING_KEYS.admin_nav_products, 'Products', 'Productos'],
  [UI_STRING_KEYS.admin_nav_courses, 'Courses', 'Cursos'],
  [UI_STRING_KEYS.admin_nav_categories, 'Categories', 'Categorías'],
  [UI_STRING_KEYS.admin_nav_tags, 'Tags', 'Etiquetas'],
  [UI_STRING_KEYS.admin_nav_comments, 'Comments', 'Comentarios'],
  [UI_STRING_KEYS.admin_nav_users, 'Users', 'Usuarios'],
  [UI_STRING_KEYS.admin_nav_roles, 'Roles & Permissions', 'Roles y permisos'],
  [UI_STRING_KEYS.admin_nav_settings, 'Settings', 'Configuración'],
  [UI_STRING_KEYS.admin_back_to_site, '← Back to site', '← Volver al sitio'],
];

/** Translations for static UI copy (`param_ui_string_i18n`). */
export const MOCK_PARAM_UI_STRING_I18N: ParamUiStringI18n[] = PAIRS.flatMap(([stringKey, en, es], index) => {
  const baseId = index * 2 + 1;
  const updatedAt = iso();
  return [
    { id: baseId, stringKey, languageCode: 'en' as const, stringValue: en, updatedAt },
    { id: baseId + 1, stringKey, languageCode: 'es' as const, stringValue: es, updatedAt },
  ];
});
