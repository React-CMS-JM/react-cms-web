import type { CourseLessonI18n } from '../types/content';

const iso = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

/**
 * course_lesson_i18n seed data — en for all lessons;
 * es for lessons belonging to published courses.
 */
export const MOCK_COURSE_LESSON_I18N: CourseLessonI18n[] = [
  // ── lesson-rf-1 ──────────────────────────────────────────────────────
  {
    id: 1,
    courseLessonId: 'lesson-rf-1',
    languageCode: 'en',
    title: 'Introduction & Setup',
    slug: 'introduction-and-setup',
    content: '<p>Install Node.js and create your first Vite + React project.</p>',
    createdAt: iso(130),
    updatedAt: iso(15),
  },
  {
    id: 2,
    courseLessonId: 'lesson-rf-1',
    languageCode: 'es',
    title: 'Introducción y configuración',
    slug: 'introduccion-y-configuracion',
    content: '<p>Instala Node.js y crea tu primer proyecto Vite + React.</p>',
    createdAt: iso(130),
    updatedAt: iso(15),
  },

  // ── lesson-rf-2 ──────────────────────────────────────────────────────
  {
    id: 3,
    courseLessonId: 'lesson-rf-2',
    languageCode: 'en',
    title: 'Components & Props',
    slug: 'components-and-props',
    content: '<p>Build reusable components and pass data down with props.</p>',
    createdAt: iso(129),
    updatedAt: iso(15),
  },
  {
    id: 4,
    courseLessonId: 'lesson-rf-2',
    languageCode: 'es',
    title: 'Componentes y props',
    slug: 'componentes-y-props',
    content: '<p>Construye componentes reutilizables y pasa datos hacia abajo con props.</p>',
    createdAt: iso(129),
    updatedAt: iso(15),
  },

  // ── lesson-rf-2a ─────────────────────────────────────────────────────
  {
    id: 5,
    courseLessonId: 'lesson-rf-2a',
    languageCode: 'en',
    title: 'Practice: Build a Card List',
    slug: 'practice-build-a-card-list',
    content: '<p>Apply what you learned by building a list of product cards.</p>',
    createdAt: iso(128),
    updatedAt: iso(15),
  },
  {
    id: 6,
    courseLessonId: 'lesson-rf-2a',
    languageCode: 'es',
    title: 'Práctica: Construir una lista de tarjetas',
    slug: 'practica-construir-una-lista-de-tarjetas',
    content: '<p>Aplica lo aprendido construyendo una lista de tarjetas de productos.</p>',
    createdAt: iso(128),
    updatedAt: iso(15),
  },

  // ── lesson-rf-3 ──────────────────────────────────────────────────────
  {
    id: 7,
    courseLessonId: 'lesson-rf-3',
    languageCode: 'en',
    title: 'State & Hooks',
    slug: 'state-and-hooks',
    content: '<p>Manage component state with useState and side effects with useEffect.</p>',
    createdAt: iso(127),
    updatedAt: iso(15),
  },
  {
    id: 8,
    courseLessonId: 'lesson-rf-3',
    languageCode: 'es',
    title: 'Estado y hooks',
    slug: 'estado-y-hooks',
    content: '<p>Gestiona el estado del componente con useState y los efectos secundarios con useEffect.</p>',
    createdAt: iso(127),
    updatedAt: iso(15),
  },

  // ── lesson-ts-1 ──────────────────────────────────────────────────────
  {
    id: 9,
    courseLessonId: 'lesson-ts-1',
    languageCode: 'en',
    title: 'Generics in Practice',
    slug: 'generics-in-practice',
    content: '<p>Write reusable, type-safe utilities using generics.</p>',
    createdAt: iso(40),
    updatedAt: iso(12),
  },
  {
    id: 10,
    courseLessonId: 'lesson-ts-1',
    languageCode: 'es',
    title: 'Genéricos en la práctica',
    slug: 'genericos-en-la-practica',
    content: '<p>Escribe utilidades reutilizables y tipadas de forma segura usando genéricos.</p>',
    createdAt: iso(40),
    updatedAt: iso(12),
  },

  // ── lesson-ts-2 ──────────────────────────────────────────────────────
  {
    id: 11,
    courseLessonId: 'lesson-ts-2',
    languageCode: 'en',
    title: 'Conditional & Mapped Types',
    slug: 'conditional-and-mapped-types',
    content: '<p>Transform types programmatically to model complex domains.</p>',
    createdAt: iso(39),
    updatedAt: iso(12),
  },
  {
    id: 12,
    courseLessonId: 'lesson-ts-2',
    languageCode: 'es',
    title: 'Tipos condicionales y mapeados',
    slug: 'tipos-condicionales-y-mapeados',
    content: '<p>Transforma tipos de forma programática para modelar dominios complejos.</p>',
    createdAt: iso(39),
    updatedAt: iso(12),
  },

  // ── lesson-ts-3 ──────────────────────────────────────────────────────
  {
    id: 13,
    courseLessonId: 'lesson-ts-3',
    languageCode: 'en',
    title: 'Type-Level Programming',
    slug: 'type-level-programming',
    content: '<p>Push TypeScript to its limits with recursive conditional types.</p>',
    createdAt: iso(38),
    updatedAt: iso(12),
  },
  {
    id: 14,
    courseLessonId: 'lesson-ts-3',
    languageCode: 'es',
    title: 'Programación a nivel de tipos',
    slug: 'programacion-a-nivel-de-tipos',
    content: '<p>Lleva TypeScript al límite con tipos condicionales recursivos.</p>',
    createdAt: iso(38),
    updatedAt: iso(12),
  },

  // ── lesson-ui-1 (draft course — en only) ─────────────────────────────
  {
    id: 15,
    courseLessonId: 'lesson-ui-1',
    languageCode: 'en',
    title: 'Layout & Spacing',
    slug: 'layout-and-spacing',
    content: '<p>Understand grids, spacing scales, and visual rhythm.</p>',
    createdAt: iso(6),
    updatedAt: iso(2),
  },
];
