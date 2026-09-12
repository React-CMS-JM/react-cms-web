import { Link } from 'react-router-dom';
import { Fragment, type ReactNode } from 'react';
import { PublicLayout } from '../../components/layout/PublicLayout';
import { HeroCtaLink } from '../../components/public/HeroCtaLink';
import { AccessBadge } from '../../components/ui/Badge';
import { useContent } from '../../context/ContentContext';
import { useUiString } from '../../hooks/useUiString';
import { UI_STRING_KEYS } from '../../types/paramUi';
import {
  DEFAULT_HOME_SECTIONS,
  resolveHomeHero,
  type HomeSectionId,
  type VisibilityOrderItem,
} from '../../types/settings';

function resolveHomeSections(
  configured: VisibilityOrderItem<HomeSectionId>[] | undefined,
): VisibilityOrderItem<HomeSectionId>[] {
  if (!configured?.length) return DEFAULT_HOME_SECTIONS;
  const known = new Set(DEFAULT_HOME_SECTIONS.map((s) => s.id));
  return configured.filter((item) => known.has(item.id));
}

export function HomePage() {
  const { settings, getLocalizedPostsByType, getMetadataForPost, language } = useContent();
  const t = useUiString();
  const homeHero = resolveHomeHero(settings.homeHero);

  const welcomePage = getLocalizedPostsByType('page').find(
    (p) => p.id === 'page-home' && p.status === 'published',
  );

  const services = getLocalizedPostsByType('service')
    .filter((p) => p.status === 'published')
    .sort((a, b) => a.title.localeCompare(b.title))
    .slice(0, 5);

  const products = getLocalizedPostsByType('product')
    .filter((p) => p.status === 'published')
    .sort((a, b) => a.title.localeCompare(b.title));

  const latestPosts = getLocalizedPostsByType('post')
    .filter((p) => p.status === 'published')
    .sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime())
    .slice(0, settings.postsPerPage);

  const featuredCourses = getLocalizedPostsByType('course')
    .filter((p) => p.status === 'published')
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 3);

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

  const orderedSections = resolveHomeSections(settings.homeSections).filter(
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
