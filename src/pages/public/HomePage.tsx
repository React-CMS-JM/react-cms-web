import { Link } from 'react-router-dom';
import { Fragment, useMemo, type ReactNode } from 'react';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { HeroCtaLink } from '../../components/public/HeroCtaLink';
import { AccessBadge } from '../../components/ui/Badge';
import { useLocale } from '../../context/LocaleContext';
import { useHomeSectionFeeds, useNavPages, useSiteSettings } from '../../hooks/usePublicContent';
import { useUiString } from '../../hooks/useUiString';
import type { PostMetadata } from '../../types/content';
import { UI_STRING_KEYS } from '../../types/paramUi';
import {
  DEFAULT_HOME_SECTIONS,
  DEFAULT_SETTINGS,
  resolveHomeHero,
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

function metaValue(metadata: PostMetadata[], postId: string, key: string): string | undefined {
  return metadata.find((row) => row.postId === postId && row.metaKey === key)?.metaValue;
}

export function HomePage() {
  const { language } = useLocale();
  const settingsQuery = useSiteSettings();
  const settings = settingsQuery.data ?? DEFAULT_SETTINGS;
  const navPages = useNavPages();
  const t = useUiString();
  const homeHero = resolveHomeHero(settings.homeHero);
  const configuredSections = useMemo(
    () => resolveHomeSections(settings.homeSections),
    [settings.homeSections],
  );
  const feeds = useHomeSectionFeeds(configuredSections, settingsQuery.isSuccess);

  const services = feeds.services?.items ?? [];
  const products = feeds.products?.items ?? [];
  const latestPosts = feeds.blog?.items ?? [];
  const featuredCourses = feeds.courses?.items ?? [];
  const productMetadata = feeds.products?.metadata ?? [];

  const welcomePage = (navPages.data?.items ?? []).find(
    (page) => page.id === 'page-home' && page.status === 'published',
  );

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
              const websiteUrl = metaValue(productMetadata, product.id, 'website-url');
              const liveDemoUrl = metaValue(productMetadata, product.id, 'live-demo-url');

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
