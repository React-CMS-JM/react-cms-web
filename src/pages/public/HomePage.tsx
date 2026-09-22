import { Link } from 'react-router-dom';
import { Fragment, useEffect, useMemo, useState, type ReactNode } from 'react';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { HeroCtaLink } from '../../components/public/HeroCtaLink';
import { AccessBadge } from '../../components/ui/Badge';
import { useContent } from '../../context/ContentContext';
import { useUiString } from '../../hooks/useUiString';
import type { LocalizedPost } from '../../types/content';
import { UI_STRING_KEYS } from '../../types/paramUi';
import {
  DEFAULT_HOME_SECTIONS,
  resolveHomeHero,
  resolveHomeSectionLimit,
  type HomeSectionId,
  type VisibilityOrderItem,
} from '../../types/settings';

function resolveHomeSections(
  configured: VisibilityOrderItem<HomeSectionId>[] | undefined,
): VisibilityOrderItem<HomeSectionId>[] {
  if (!configured?.length) return DEFAULT_HOME_SECTIONS.map((s) => ({ ...s }));
  const known = new Set(DEFAULT_HOME_SECTIONS.map((s) => s.id));
  return configured.filter((item) => known.has(item.id));
}

const SECTION_TYPE: Record<Exclude<HomeSectionId, 'courses'>, 'post' | 'product' | 'service'> = {
  blog: 'post',
  products: 'product',
  services: 'service',
};

export function HomePage() {
  const {
    settings,
    getLocalizedPostsByType,
    getMetadataForPost,
    language,
    fetchPostsPage,
    fetchCoursesPage,
    isInitialLoading,
  } = useContent();
  const t = useUiString();
  const homeHero = resolveHomeHero(settings.homeHero);
  const configuredSections = useMemo(
    () => resolveHomeSections(settings.homeSections),
    [settings.homeSections],
  );

  /**
   * Stable signature of section config (id / visibility / limit).
   * Avoids re-fetching when settings hydrate to a new array with the same values
   * after ContentContext bootstrap.
   */
  const sectionsFetchKey = useMemo(
    () =>
      configuredSections
        .map((s) => `${s.id}:${s.visible ? 1 : 0}:${resolveHomeSectionLimit(s, s.id)}`)
        .join('|'),
    [configuredSections],
  );

  const [services, setServices] = useState<LocalizedPost[]>([]);
  const [products, setProducts] = useState<LocalizedPost[]>([]);
  const [latestPosts, setLatestPosts] = useState<LocalizedPost[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<LocalizedPost[]>([]);

  const welcomePage = getLocalizedPostsByType('page').find(
    (p) => p.id === 'page-home' && p.status === 'published',
  );

  useEffect(() => {
    // Wait for bootstrap so we use API settings (not DEFAULT_SETTINGS) for limits.
    if (isInitialLoading) return;

    let cancelled = false;

    void (async () => {
      const visible = configuredSections.filter((s) => s.visible);
      await Promise.all(
        visible.map(async (section) => {
          const limit = resolveHomeSectionLimit(section, section.id);
          try {
            if (section.id === 'courses') {
              const result = await fetchCoursesPage(0, limit, 'published');
              if (!cancelled) setFeaturedCourses(result.items);
              return;
            }
            const result = await fetchPostsPage(SECTION_TYPE[section.id], 0, limit, 'published');
            if (cancelled) return;
            if (section.id === 'services') setServices(result.items);
            else if (section.id === 'products') setProducts(result.items);
            else setLatestPosts(result.items);
          } catch {
            if (cancelled) return;
            if (section.id === 'courses') setFeaturedCourses([]);
            else if (section.id === 'services') setServices([]);
            else if (section.id === 'products') setProducts([]);
            else setLatestPosts([]);
          }
        }),
      );
    })();

    return () => {
      cancelled = true;
    };
    // configuredSections is read from the render that produced sectionsFetchKey;
    // depending on the array identity would re-fetch after settings hydration.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sectionsFetchKey encodes section config
  }, [isInitialLoading, sectionsFetchKey, language, fetchPostsPage, fetchCoursesPage]);

  const sectionContent: Record<HomeSectionId, ReactNode> = {
    services:
      services.length > 0 ? (
        <section className="posts-section">
          <div className="section-heading">
            <h2>{t(UI_STRING_KEYS.section_services_title)}</h2>
            <Link to="/services" className="section-link">
              {t(UI_STRING_KEYS.section_view_all)}
            </Link>
          </div>
          <div className="posts-grid">
            {services.map((service) => (
              <article key={service.id} className="post-card">
                <div className="post-card-top">
                  <h3>
                    <Link to={`/services/${service.slug}`}>{service.title}</Link>
                  </h3>
                </div>
                <p className="post-excerpt">{service.excerpt}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null,
    products:
      products.length > 0 ? (
        <section className="posts-section">
          <div className="section-heading">
            <h2>{t(UI_STRING_KEYS.section_products_title)}</h2>
            <Link to="/products" className="section-link">
              {t(UI_STRING_KEYS.section_view_all)}
            </Link>
          </div>
          <div className="posts-grid">
            {products.map((product) => {
              const meta = getMetadataForPost(product.id);
              const websiteUrl = meta.find((m) => m.metaKey === 'website-url')?.metaValue;
              const liveDemoUrl = meta.find((m) => m.metaKey === 'live-demo-url')?.metaValue;

              return (
                <article key={product.id} className="post-card">
                  <div className="post-card-top">
                    <h3>
                      <Link to={`/products/${product.slug}`}>{product.title}</Link>
                    </h3>
                  </div>
                  <p className="post-excerpt">{product.excerpt}</p>
                  <div className="post-meta">
                    {websiteUrl && (
                      <a href={websiteUrl} target="_blank" rel="noreferrer">
                        {t(UI_STRING_KEYS.listing_website)}
                      </a>
                    )}
                    {liveDemoUrl && (
                      <a href={liveDemoUrl} target="_blank" rel="noreferrer">
                        {t(UI_STRING_KEYS.listing_live_demo)}
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null,
    blog:
      latestPosts.length > 0 ? (
        <section className="posts-section">
          <div className="section-heading">
            <h2>{t(UI_STRING_KEYS.section_blog_title)}</h2>
            <Link to="/blog" className="section-link">
              {t(UI_STRING_KEYS.section_view_all)}
            </Link>
          </div>
          <div className="posts-grid">
            {latestPosts.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-card-top">
                  <h3>
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <AccessBadge level={post.accessLevel} />
                </div>
                <p className="post-excerpt">{post.excerpt}</p>
                <div className="post-meta">
                  <time dateTime={post.publishedAt ?? undefined}>
                    {post.publishedAt && new Date(post.publishedAt).toLocaleDateString()}
                  </time>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null,
    courses:
      featuredCourses.length > 0 ? (
        <section className="posts-section">
          <div className="section-heading">
            <h2>{t(UI_STRING_KEYS.section_courses_title)}</h2>
            <Link to="/courses" className="section-link">
              {t(UI_STRING_KEYS.section_view_all)}
            </Link>
          </div>
          <div className="posts-grid">
            {featuredCourses.map((course) => (
              <article key={course.id} className="post-card">
                <div className="post-card-top">
                  <h3>
                    <Link to={`/courses/${course.slug}`}>{course.title}</Link>
                  </h3>
                  <AccessBadge level={course.accessLevel} />
                </div>
                <p className="post-excerpt">{course.excerpt}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null,
  };

  const orderedSections = configuredSections.filter(
    (item) => item.visible && sectionContent[item.id],
  );

  const visibleCtas = homeHero.ctas.filter((cta) => cta.visible);
  const heroTitle = t(UI_STRING_KEYS.hero_title);
  const heroSubtitleHtml = t(UI_STRING_KEYS.hero_subtitle);
  const showHero =
    (homeHero.titleVisible && !!heroTitle) ||
    (homeHero.subtitleVisible && !!heroSubtitleHtml) ||
    visibleCtas.length > 0;

  return (
    <PublicLayout>
      {showHero && (
        <section className="hero">
          {homeHero.titleVisible && heroTitle && <h1>{heroTitle}</h1>}
          {homeHero.subtitleVisible && heroSubtitleHtml && (
            <div
              className="hero-subtitle prose"
              dangerouslySetInnerHTML={{ __html: heroSubtitleHtml }}
            />
          )}
          {visibleCtas.length > 0 && (
            <div className="hero-actions">
              {visibleCtas.map((cta) => (
                <HeroCtaLink key={cta.id} cta={cta} language={language} />
              ))}
            </div>
          )}
        </section>
      )}

      {welcomePage && (
        <section className="public-content">
          <div className="prose" dangerouslySetInnerHTML={{ __html: welcomePage.content }} />
        </section>
      )}

      {orderedSections.map((item) => (
        <Fragment key={item.id}>{sectionContent[item.id]}</Fragment>
      ))}
    </PublicLayout>
  );
}
