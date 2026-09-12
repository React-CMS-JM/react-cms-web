import type { PostI18n } from '../types/content';

const iso = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

/** post_i18n seed data — en for all posts; es for published posts. */
export const MOCK_POST_I18N: PostI18n[] = [
  // ── page-home ────────────────────────────────────────────────────────
  {
    id: 1,
    postId: 'page-home',
    languageCode: 'en',
    title: 'Welcome',
    slug: 'welcome',
    content:
      '<h2>Welcome to React CMS</h2><p>This platform brings together articles, courses, and a role-aware admin panel. Browse the blog, enroll in a course, or sign in to explore the admin experience.</p>',
    excerpt: 'A role-aware content platform for articles, pages, and courses.',
    metaTitle: 'React CMS — Welcome',
    metaDescription: 'A role-aware content platform for articles, pages, and courses.',
    createdAt: iso(300),
    updatedAt: iso(10),
  },
  {
    id: 2,
    postId: 'page-home',
    languageCode: 'es',
    title: 'Bienvenida',
    slug: 'bienvenida',
    content:
      '<h2>Bienvenido a React CMS</h2><p>Esta plataforma reúne artículos, cursos y un panel de administración consciente de roles. Explora el blog, inscríbete en un curso o inicia sesión para conocer la experiencia de administración.</p>',
    excerpt: 'Una plataforma de contenido consciente de roles para artículos, páginas y cursos.',
    metaTitle: 'React CMS — Bienvenida',
    metaDescription: 'Una plataforma de contenido consciente de roles para artículos, páginas y cursos.',
    createdAt: iso(300),
    updatedAt: iso(10),
  },

  // ── page-about ───────────────────────────────────────────────────────
  {
    id: 3,
    postId: 'page-about',
    languageCode: 'en',
    title: 'About',
    slug: 'about',
    content:
      '<h2>About React CMS</h2><p>React CMS is a demo content platform showcasing role-based access control: administrators, editors, contributors, premium and free members each see a tailored experience.</p><p>All data on this site is mocked for demonstration purposes.</p>',
    excerpt: 'Learn about the mission behind React CMS.',
    metaTitle: 'About — React CMS',
    metaDescription: 'Learn about the mission behind React CMS.',
    createdAt: iso(280),
    updatedAt: iso(40),
  },
  {
    id: 4,
    postId: 'page-about',
    languageCode: 'es',
    title: 'Acerca de',
    slug: 'acerca-de',
    content:
      '<h2>Acerca de React CMS</h2><p>React CMS es una plataforma de contenido de demostración que muestra el control de acceso basado en roles: administradores, editores, colaboradores, miembros premium y gratuitos ven cada uno una experiencia adaptada.</p><p>Todos los datos de este sitio están simulados con fines de demostración.</p>',
    excerpt: 'Conoce la misión detrás de React CMS.',
    metaTitle: 'Acerca de — React CMS',
    metaDescription: 'Conoce la misión detrás de React CMS.',
    createdAt: iso(280),
    updatedAt: iso(40),
  },

  // ── page-contact ─────────────────────────────────────────────────────
  {
    id: 5,
    postId: 'page-contact',
    languageCode: 'en',
    title: 'Contact',
    slug: 'contact',
    content:
      '<h2>Get in touch</h2><p>Have a question or feedback? Reach out at <strong>hello@reactcms.dev</strong>.</p>',
    excerpt: 'Ways to reach the React CMS team.',
    metaTitle: 'Contact — React CMS',
    metaDescription: 'Ways to reach the React CMS team.',
    createdAt: iso(260),
    updatedAt: iso(60),
  },
  {
    id: 6,
    postId: 'page-contact',
    languageCode: 'es',
    title: 'Contacto',
    slug: 'contacto',
    content:
      '<h2>Ponte en contacto</h2><p>¿Tienes una pregunta o comentario? Escríbenos a <strong>hello@reactcms.dev</strong>.</p>',
    excerpt: 'Formas de contactar al equipo de React CMS.',
    metaTitle: 'Contacto — React CMS',
    metaDescription: 'Formas de contactar al equipo de React CMS.',
    createdAt: iso(260),
    updatedAt: iso(60),
  },

  // ── post-getting-started ─────────────────────────────────────────────
  {
    id: 7,
    postId: 'post-getting-started',
    languageCode: 'en',
    title: 'Getting Started with React CMS',
    slug: 'getting-started-with-react-cms',
    content:
      '<p>React CMS gives every role a tailored experience out of the box. This walkthrough covers the public site, the admin panel, and how permissions shape what you can do.</p><h3>Roles at a glance</h3><ul><li>Administrators manage everything, including users and roles.</li><li>Content editors publish posts and pages.</li><li>Course contributors build course content.</li><li>Members read premium content or just the free articles.</li></ul><p>Sign in from the top bar to try a different role.</p>',
    excerpt: 'A quick tour of roles, permissions, and the admin panel.',
    metaTitle: 'Getting Started with React CMS',
    metaDescription: 'A quick tour of roles, permissions, and the admin panel.',
    createdAt: iso(46),
    updatedAt: iso(30),
  },
  {
    id: 8,
    postId: 'post-getting-started',
    languageCode: 'es',
    title: 'Primeros pasos con React CMS',
    slug: 'primeros-pasos-con-react-cms',
    content:
      '<p>React CMS ofrece a cada rol una experiencia adaptada desde el primer momento. Este recorrido cubre el sitio público, el panel de administración y cómo los permisos definen lo que puedes hacer.</p><h3>Roles de un vistazo</h3><ul><li>Los administradores gestionan todo, incluidos usuarios y roles.</li><li>Los editores de contenido publican entradas y páginas.</li><li>Los colaboradores de cursos crean el contenido de los cursos.</li><li>Los miembros leen contenido premium o solo los artículos gratuitos.</li></ul><p>Inicia sesión desde la barra superior para probar un rol diferente.</p>',
    excerpt: 'Un recorrido rápido por roles, permisos y el panel de administración.',
    metaTitle: 'Primeros pasos con React CMS',
    metaDescription: 'Un recorrido rápido por roles, permisos y el panel de administración.',
    createdAt: iso(46),
    updatedAt: iso(30),
  },

  // ── post-typescript-tips ─────────────────────────────────────────────
  {
    id: 9,
    postId: 'post-typescript-tips',
    languageCode: 'en',
    title: '10 TypeScript Tips for Cleaner React Code',
    slug: 'typescript-tips-for-cleaner-react-code',
    content:
      '<p>TypeScript pays off the most when types describe intent, not just shape. Here are ten habits that keep React components maintainable.</p><ol><li>Prefer discriminated unions over boolean flags.</li><li>Derive types from data, not the other way around.</li><li>Use <code>satisfies</code> for literal objects.</li></ol>',
    excerpt: 'Practical patterns for typing React components without fighting the compiler.',
    metaTitle: '10 TypeScript Tips for Cleaner React Code',
    metaDescription: 'Practical patterns for typing React components without fighting the compiler.',
    createdAt: iso(22),
    updatedAt: iso(20),
  },
  {
    id: 10,
    postId: 'post-typescript-tips',
    languageCode: 'es',
    title: '10 consejos de TypeScript para código React más limpio',
    slug: 'consejos-typescript-para-codigo-react-mas-limpio',
    content:
      '<p>TypeScript rinde más cuando los tipos describen la intención, no solo la forma. Aquí hay diez hábitos que mantienen los componentes React mantenibles.</p><ol><li>Prefiere uniones discriminadas sobre banderas booleanas.</li><li>Deriva los tipos a partir de los datos, no al revés.</li><li>Usa <code>satisfies</code> para objetos literales.</li></ol>',
    excerpt: 'Patrones prácticos para tipar componentes React sin pelear con el compilador.',
    metaTitle: '10 consejos de TypeScript para código React más limpio',
    metaDescription: 'Patrones prácticos para tipar componentes React sin pelear con el compilador.',
    createdAt: iso(22),
    updatedAt: iso(20),
  },

  // ── post-premium-scaling ─────────────────────────────────────────────
  {
    id: 11,
    postId: 'post-premium-scaling',
    languageCode: 'en',
    title: 'Scaling a Content Platform to 1M Requests a Day',
    slug: 'scaling-a-content-platform',
    content:
      '<p>This deep dive covers caching strategy, database indexing (see the <code>idx_posts_access_status</code> index), and how we structured content types for flexibility.</p><p>Premium subscribers get the full architecture diagrams and postmortem notes below.</p><h3>Caching layers</h3><p>We cache published, public posts at the edge and bypass the cache entirely for premium content until entitlement is confirmed server-side.</p>',
    excerpt: 'An architecture deep dive into caching, indexing, and access control at scale.',
    metaTitle: 'Scaling a Content Platform to 1M Requests a Day',
    metaDescription: 'An architecture deep dive into caching, indexing, and access control at scale.',
    createdAt: iso(11),
    updatedAt: iso(9),
  },
  {
    id: 12,
    postId: 'post-premium-scaling',
    languageCode: 'es',
    title: 'Escalar una plataforma de contenido a 1M de solicitudes al día',
    slug: 'escalar-una-plataforma-de-contenido',
    content:
      '<p>Este análisis profundo cubre la estrategia de caché, la indexación de la base de datos (ver el índice <code>idx_posts_access_status</code>) y cómo estructuramos los tipos de contenido para mayor flexibilidad.</p><p>Los suscriptores premium obtienen los diagramas de arquitectura completos y las notas de postmortem a continuación.</p><h3>Capas de caché</h3><p>Almacenamos en caché las entradas públicas publicadas en el edge y omitimos la caché por completo para el contenido premium hasta confirmar el derecho de acceso en el servidor.</p>',
    excerpt: 'Un análisis de arquitectura sobre caché, indexación y control de acceso a escala.',
    metaTitle: 'Escalar una plataforma de contenido a 1M de solicitudes al día',
    metaDescription: 'Un análisis de arquitectura sobre caché, indexación y control de acceso a escala.',
    createdAt: iso(11),
    updatedAt: iso(9),
  },

  // ── post-career-switch (draft — en only) ─────────────────────────────
  {
    id: 13,
    postId: 'post-career-switch',
    languageCode: 'en',
    title: 'How I Switched Careers into Frontend Engineering',
    slug: 'how-i-switched-careers-into-frontend-engineering',
    content:
      '<p>A personal story about switching careers, the courses that helped, and the projects that got me hired.</p>',
    excerpt: 'A personal story about switching careers into frontend engineering.',
    metaTitle: 'How I Switched Careers into Frontend Engineering',
    metaDescription: 'A personal story about switching careers into frontend engineering.',
    createdAt: iso(3),
    updatedAt: iso(1),
  },

  // ── service-software-engineering-consultancy ─────────────────────────
  {
    id: 14,
    postId: 'service-software-engineering-consultancy',
    languageCode: 'en',
    title: 'Software Engineering Consultancy',
    slug: 'software-engineering-consultancy',
    content:
      '<p>Partner with senior engineers to design architecture, review codebases, and unblock delivery. We help teams choose the right stack, establish engineering practices, and ship with confidence.</p>',
    excerpt: 'Architecture, code reviews, and delivery coaching from senior engineers.',
    metaTitle: 'Software Engineering Consultancy',
    metaDescription: 'Architecture, code reviews, and delivery coaching from senior engineers.',
    createdAt: iso(95),
    updatedAt: iso(20),
  },
  {
    id: 15,
    postId: 'service-software-engineering-consultancy',
    languageCode: 'es',
    title: 'Consultoría de Ingeniería de Software',
    slug: 'consultoria-de-ingenieria-de-software',
    content:
      '<p>Colabora con ingenieros senior para diseñar arquitectura, revisar bases de código y desbloquear la entrega. Ayudamos a los equipos a elegir el stack adecuado, establecer prácticas de ingeniería y publicar con confianza.</p>',
    excerpt: 'Arquitectura, revisiones de código y coaching de entrega de ingenieros senior.',
    metaTitle: 'Consultoría de Ingeniería de Software',
    metaDescription: 'Arquitectura, revisiones de código y coaching de entrega de ingenieros senior.',
    createdAt: iso(95),
    updatedAt: iso(20),
  },

  // ── service-digital-transformation ───────────────────────────────────
  {
    id: 16,
    postId: 'service-digital-transformation',
    languageCode: 'en',
    title: 'Digital Transformation',
    slug: 'digital-transformation',
    content:
      '<p>Modernize legacy processes with cloud-native platforms, automation, and data-driven workflows. We map your current state, define a roadmap, and guide the rollout.</p>',
    excerpt: 'Cloud-native platforms, automation, and data-driven workflows for modern teams.',
    metaTitle: 'Digital Transformation',
    metaDescription: 'Cloud-native platforms, automation, and data-driven workflows for modern teams.',
    createdAt: iso(88),
    updatedAt: iso(18),
  },
  {
    id: 17,
    postId: 'service-digital-transformation',
    languageCode: 'es',
    title: 'Transformación Digital',
    slug: 'transformacion-digital',
    content:
      '<p>Moderniza procesos heredados con plataformas nativas en la nube, automatización y flujos de trabajo basados en datos. Mapeamos tu estado actual, definimos una hoja de ruta y guiamos el despliegue.</p>',
    excerpt: 'Plataformas nativas en la nube, automatización y flujos basados en datos para equipos modernos.',
    metaTitle: 'Transformación Digital',
    metaDescription: 'Plataformas nativas en la nube, automatización y flujos basados en datos para equipos modernos.',
    createdAt: iso(88),
    updatedAt: iso(18),
  },

  // ── service-software-migration ───────────────────────────────────────
  {
    id: 18,
    postId: 'service-software-migration',
    languageCode: 'en',
    title: 'Software Migration',
    slug: 'software-migration',
    content:
      '<p>Move applications, databases, and infrastructure with minimal downtime. From monolith-to-microservices to cloud lift-and-shift, we plan, execute, and validate every cutover.</p>',
    excerpt: 'Low-risk migrations for apps, databases, and infrastructure.',
    metaTitle: 'Software Migration',
    metaDescription: 'Low-risk migrations for apps, databases, and infrastructure.',
    createdAt: iso(75),
    updatedAt: iso(16),
  },
  {
    id: 19,
    postId: 'service-software-migration',
    languageCode: 'es',
    title: 'Migración de Software',
    slug: 'migracion-de-software',
    content:
      '<p>Mueve aplicaciones, bases de datos e infraestructura con un tiempo de inactividad mínimo. Desde monolito a microservicios hasta lift-and-shift a la nube, planificamos, ejecutamos y validamos cada corte.</p>',
    excerpt: 'Migraciones de bajo riesgo para apps, bases de datos e infraestructura.',
    metaTitle: 'Migración de Software',
    metaDescription: 'Migraciones de bajo riesgo para apps, bases de datos e infraestructura.',
    createdAt: iso(75),
    updatedAt: iso(16),
  },

  // ── service-web-development ──────────────────────────────────────────
  {
    id: 20,
    postId: 'service-web-development',
    languageCode: 'en',
    title: 'Web Development',
    slug: 'web-development',
    content:
      '<p>Build fast, accessible web applications with React, TypeScript, and modern tooling. From marketing sites to complex dashboards, we deliver production-ready frontends and APIs.</p>',
    excerpt: 'Production-ready web apps with React, TypeScript, and modern tooling.',
    metaTitle: 'Web Development',
    metaDescription: 'Production-ready web apps with React, TypeScript, and modern tooling.',
    createdAt: iso(65),
    updatedAt: iso(14),
  },
  {
    id: 21,
    postId: 'service-web-development',
    languageCode: 'es',
    title: 'Desarrollo Web',
    slug: 'desarrollo-web',
    content:
      '<p>Construye aplicaciones web rápidas y accesibles con React, TypeScript y herramientas modernas. Desde sitios de marketing hasta paneles complejos, entregamos frontends y APIs listos para producción.</p>',
    excerpt: 'Apps web listas para producción con React, TypeScript y herramientas modernas.',
    metaTitle: 'Desarrollo Web',
    metaDescription: 'Apps web listas para producción con React, TypeScript y herramientas modernas.',
    createdAt: iso(65),
    updatedAt: iso(14),
  },

  // ── service-mobile-development ───────────────────────────────────────
  {
    id: 22,
    postId: 'service-mobile-development',
    languageCode: 'en',
    title: 'Mobile Development',
    slug: 'mobile-development',
    content:
      '<p>Ship native-quality mobile experiences with React Native or platform-specific stacks. We cover UX, offline sync, push notifications, and store releases.</p>',
    excerpt: 'Native-quality mobile apps with React Native and platform-specific stacks.',
    metaTitle: 'Mobile Development',
    metaDescription: 'Native-quality mobile apps with React Native and platform-specific stacks.',
    createdAt: iso(55),
    updatedAt: iso(12),
  },
  {
    id: 23,
    postId: 'service-mobile-development',
    languageCode: 'es',
    title: 'Desarrollo Móvil',
    slug: 'desarrollo-movil',
    content:
      '<p>Lanza experiencias móviles de calidad nativa con React Native o stacks específicos de plataforma. Cubrimos UX, sincronización offline, notificaciones push y publicaciones en las tiendas.</p>',
    excerpt: 'Apps móviles de calidad nativa con React Native y stacks específicos de plataforma.',
    metaTitle: 'Desarrollo Móvil',
    metaDescription: 'Apps móviles de calidad nativa con React Native y stacks específicos de plataforma.',
    createdAt: iso(55),
    updatedAt: iso(12),
  },

  // ── product-youtube-stats-app ────────────────────────────────────────
  {
    id: 24,
    postId: 'product-youtube-stats-app',
    languageCode: 'en',
    title: 'YouTube Stats App',
    slug: 'youtube-stats-app',
    content:
      '<p>Track channel growth, video performance, and audience insights in one dashboard. Built for creators who want clear metrics without spreadsheet chaos.</p>',
    excerpt: 'Channel growth, video performance, and audience insights in one dashboard.',
    metaTitle: 'YouTube Stats App',
    metaDescription: 'Channel growth, video performance, and audience insights in one dashboard.',
    createdAt: iso(45),
    updatedAt: iso(8),
  },
  {
    id: 25,
    postId: 'product-youtube-stats-app',
    languageCode: 'es',
    title: 'App de Estadísticas de YouTube',
    slug: 'app-estadisticas-youtube',
    content:
      '<p>Sigue el crecimiento del canal, el rendimiento de los videos y los insights de audiencia en un solo panel. Creada para creadores que quieren métricas claras sin el caos de las hojas de cálculo.</p>',
    excerpt: 'Crecimiento del canal, rendimiento de videos e insights de audiencia en un solo panel.',
    metaTitle: 'App de Estadísticas de YouTube',
    metaDescription: 'Crecimiento del canal, rendimiento de videos e insights de audiencia en un solo panel.',
    createdAt: iso(45),
    updatedAt: iso(8),
  },

  // ── product-my-resume-manager ────────────────────────────────────────
  {
    id: 26,
    postId: 'product-my-resume-manager',
    languageCode: 'en',
    title: 'My Resume Manager',
    slug: 'my-resume-manager',
    content:
      '<p>Create, version, and tailor resumes for every role. Export polished PDFs, track applications, and keep your career story organized.</p>',
    excerpt: 'Create, version, and tailor resumes — then export polished PDFs.',
    metaTitle: 'My Resume Manager',
    metaDescription: 'Create, version, and tailor resumes — then export polished PDFs.',
    createdAt: iso(30),
    updatedAt: iso(5),
  },
  {
    id: 27,
    postId: 'product-my-resume-manager',
    languageCode: 'es',
    title: 'Mi Gestor de Currículums',
    slug: 'mi-gestor-de-curriculums',
    content:
      '<p>Crea, versiona y adapta currículums para cada puesto. Exporta PDFs pulidos, rastrea postulaciones y mantén organizada la historia de tu carrera.</p>',
    excerpt: 'Crea, versiona y adapta currículums — luego exporta PDFs pulidos.',
    metaTitle: 'Mi Gestor de Currículums',
    metaDescription: 'Crea, versiona y adapta currículums — luego exporta PDFs pulidos.',
    createdAt: iso(30),
    updatedAt: iso(5),
  },

  // ── course-react-fundamentals ────────────────────────────────────────
  {
    id: 28,
    postId: 'course-react-fundamentals',
    languageCode: 'en',
    title: 'React Fundamentals',
    slug: 'react-fundamentals',
    content:
      '<p>Learn the building blocks of React: components, props, state, and hooks. No prior React experience required.</p>',
    excerpt: 'Learn the building blocks of React from the ground up.',
    metaTitle: 'React Fundamentals Course',
    metaDescription: 'Learn the building blocks of React from the ground up.',
    createdAt: iso(130),
    updatedAt: iso(15),
  },
  {
    id: 29,
    postId: 'course-react-fundamentals',
    languageCode: 'es',
    title: 'Fundamentos de React',
    slug: 'fundamentos-de-react',
    content:
      '<p>Aprende los bloques fundamentales de React: componentes, props, estado y hooks. No se requiere experiencia previa en React.</p>',
    excerpt: 'Aprende los bloques fundamentales de React desde cero.',
    metaTitle: 'Curso de Fundamentos de React',
    metaDescription: 'Aprende los bloques fundamentales de React desde cero.',
    createdAt: iso(130),
    updatedAt: iso(15),
  },

  // ── course-advanced-typescript ───────────────────────────────────────
  {
    id: 30,
    postId: 'course-advanced-typescript',
    languageCode: 'en',
    title: 'Advanced TypeScript Patterns',
    slug: 'advanced-typescript-patterns',
    content:
      '<p>Go beyond the basics with generics, conditional types, and type-level programming for real-world apps.</p><p>This is a premium course — enroll with a premium membership to unlock every lesson.</p>',
    excerpt: 'Generics, conditional types, and type-level programming for real apps.',
    metaTitle: 'Advanced TypeScript Patterns Course',
    metaDescription: 'Generics, conditional types, and type-level programming for real apps.',
    createdAt: iso(40),
    updatedAt: iso(12),
  },
  {
    id: 31,
    postId: 'course-advanced-typescript',
    languageCode: 'es',
    title: 'Patrones Avanzados de TypeScript',
    slug: 'patrones-avanzados-de-typescript',
    content:
      '<p>Ve más allá de lo básico con genéricos, tipos condicionales y programación a nivel de tipos para aplicaciones del mundo real.</p><p>Este es un curso premium — inscríbete con una membresía premium para desbloquear todas las lecciones.</p>',
    excerpt: 'Genéricos, tipos condicionales y programación a nivel de tipos para apps reales.',
    metaTitle: 'Curso de Patrones Avanzados de TypeScript',
    metaDescription: 'Genéricos, tipos condicionales y programación a nivel de tipos para apps reales.',
    createdAt: iso(40),
    updatedAt: iso(12),
  },

  // ── course-ui-design-basics (draft — en only) ────────────────────────
  {
    id: 32,
    postId: 'course-ui-design-basics',
    languageCode: 'en',
    title: 'UI Design Basics for Developers',
    slug: 'ui-design-basics-for-developers',
    content:
      '<p>A practical introduction to layout, color, and typography for engineers who want their interfaces to look intentional.</p>',
    excerpt: 'A practical design primer built for developers, not designers.',
    metaTitle: 'UI Design Basics for Developers',
    metaDescription: 'A practical design primer built for developers, not designers.',
    createdAt: iso(6),
    updatedAt: iso(2),
  },
];
